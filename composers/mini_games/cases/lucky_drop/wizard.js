const { Scenes } = require("telegraf");
const kb = require("../../../../keyboars.json");
const utils = require("../../../../utils");

const back = async (ctx, edit = true) => {
  try {
    const userStartCoins = ctx.wizard.state.start_coins;
    ctx.wizard.state.start_coins = null;

    await ctx.scene.leave();

    let user = await utils.getUserData(ctx.chat.id);
    if(!user) {
        await utils.createUser(ctx.from.id, ctx.from.first_name);
        user = await utils.getUserData(ctx.from.id);
    }
    let stat = await utils.getUserStats(ctx.chat.id);
    if(!stat) {
        await utils.createUserStats(ctx.from.id);
        stat = await utils.getUserStats(ctx.chat.id);
    }
    let txt = "🤫Перед использованием - внимательно прочтите F.A.Q.\n\n";
    txt += "Здесь кейсы на любой вкус и выбор\n\n";
    txt += "Стоимость кейсов 💰:\n";
    txt += "▫️ NT (Nothing Team) Кейс: 10 💰\n";
    txt += "▫️ Кейс за друзей: 10 💰\n";
    txt += "▫️ Рулетка: 100 💰\n";
    txt += "▫️ Кейс Пепсы: 300 💰\n";
    txt += "▫️ HIGH RISK: 100 💰\n";
    txt += "▫️ HIGH RISK Premium: 1000 💰\n";
    txt += "▫️ СД (счастливый дроп): 6000 💰\n";
    txt += "▫️ СД премиум: 20000 💰\n";
    txt += "▫️ Возвышение: 0 💰\n\n";
    txt += `Всего кейсов открыто: ${
      stat?.cases_opened ? stat.cases_opened : 0
    }🧨\n`;
    txt += `Твой баланс: ${user.coins} 💰(${
      userStartCoins > user.coins ? "-" : "+"
    }${
      userStartCoins > user.coins
        ? userStartCoins - user.coins
        : user.coins - userStartCoins
    })\n`;

    if (edit) {
      try {
        await ctx.editMessageText(txt, kb.cases_menu);
      } catch (e) {}
    } else {
      await ctx.reply(txt, kb.cases_menu);
    }
  } catch (e) {
    console.log(e);
    await ctx.reply(
      "Произошла ошибка, пожалуйста сделайте скрин ваших действий и перешлите его @GameNothingsupport_bot"
    );
  }
};

const wizard_scenes = new Scenes.WizardScene(
  "lucky_drop",
  async (ctx) => {
    try {
      const user = await utils.getUserData(ctx.chat.id);

      let txt = "Всегда хотел увидеть эту фразу?😉\n\n";
      txt += `${ctx.chat.username}, кидай кубик - этот раздел для тебя! ⚡️\n\n`;
      txt += `Твой баланс: ${user.coins} 💰`;

      const mes = await ctx.reply(txt, kb.lucky_drop_start);
      await ctx.answerCbQuery();

      ctx.wizard.state.start_coins = user.coins;
      ctx.wizard.state.mid = mes.message_id;

      return ctx.wizard.next();
    } catch (e) {
      console.log(e);
      await ctx.reply(
        "Произошла ошибка, пожалуйста сделайте скрин ваших действий и перешлите его @GameNothingsupport_bot"
      );
      await back(ctx, false);
    }
  },

  async (ctx) => {
    try {
      cb_data = ctx.callbackQuery?.data;

      if (cb_data && cb_data === "drop_lucky") {
        const dropping = await dropCase(ctx);
        if (dropping) return ctx.wizard.next();
      } else {
        await back(ctx);
      }
    } catch (e) {
      console.log(e);
      await ctx.reply(
        "Произошла ошибка, пожалуйста сделайте скрин ваших действий и перешлите его @GameNothingsupport_bot"
      );
      await back(ctx, false);
    }
  },

  async (ctx) => {
    try {
      const cb_data = ctx.callbackQuery?.data;

      if (cb_data === "try_again") {
        await dropCase(ctx);
      } else {
        await back(ctx);
      }
    } catch (e) {
      console.log(e);
      await ctx.reply(
        "Произошла ошибка, пожалуйста сделайте скрин ваших действий и перешлите его @GameNothingsupport_bot"
      );
      await back(ctx, false);
    }
  }
);

async function dropCase(ctx) {
  const user = await utils.getUserData(ctx.from.id);
  const cost = user.vip_status > 0 ? 3000 : 6000;
  if (user.coins < cost) {
    await ctx.answerCbQuery("Недостаточно монет");
    await back(ctx, true);
    return false;
  }
  const diceResult = await ctx.replyWithDice();
  const selectedResult = diceResult.dice.value;
  const rewards = {
    1: { name: "60 гемов 💎", type: "gems", amount: 1 },
    2: { name: "60 гемов 💎 2 раза", type: "gems", amount: 2 },
    3: { name: "60 гемов 💎 3 раза", type: "gems", amount: 3 },
    4: { name: "60 гемов 💎 4 раза", type: "gems", amount: 4 },
    5: { name: "Благословение полой луны 🌙", type: "items", amount: 1 },
    6: {
      name: "Благословение полой луны 🌙 и 60 гемов 💎",
      type: "combined",
      items: ["Благословение полой луны 🌙", "60 гемов"],
      amount: 1,
    },
  };

  await ctx.answerCbQuery();
  await new Promise((resolve) => setTimeout(resolve, 5000)); // Задержка в 5 секунд

  await ctx.deleteMessage(ctx.wizard.state.mid);
  await utils.increaseUserCaseOpened(ctx.chat.id);

  const rewardInfo = rewards[selectedResult];

  if (rewardInfo.type === "gems") {
    await utils.updateUserData(
      ctx.chat.id,
      "gems",
      user["gems"] ? user["gems"] + rewardInfo.amount : rewardInfo.amount
    );
  } else if (rewardInfo.type === "items") {
    await utils.updateUserData(
      ctx.chat.id,
      "items",
      user["items"] ? user["items"] + rewardInfo.amount : rewardInfo.amount
    );
  } else if (rewardInfo.type === "combined") {
    for (const item of rewardInfo.items) {
      if (item.includes("Благословение полой луны 🌙")) {
        await utils.updateUserData(
          ctx.chat.id,
          "items",
          user["items"] ? user["items"] + rewardInfo.amount : rewardInfo.amount
        );
      } else if (item.includes("60 гемов")) {
        await utils.updateUserData(
          ctx.chat.id,
          "gems",
          user["gems"] ? user["gems"] + rewardInfo.amount : rewardInfo.amount
        );
      }
    }
  }

  await utils.updateUserData(ctx.chat.id, "coins", user["coins"] - cost);

  let txt = `Поздравляем! Тебе выпало: ${rewardInfo.name}\n`;
  txt += "Предмет находится у тебя в инвентаре.\n\n";
  txt +=
    "Если у тебя есть 60 гемов - можешь попробовать возвышение до луны!\n\n";
  txt += `Твой баланс: ${user.coins - cost} 💰`;

  await ctx.reply(txt, kb.back_try_again_cases_menu);
  return true;
}

module.exports = wizard_scenes;
