const { Composer } = require("telegraf");
const composer = new Composer();
const utils = require("../../../utils");
const kb = require("../../../keyboars.json");

composer.action("inventory", async (ctx) => {
  try {
    const user = await utils.getUserData(ctx.from.id);
    if (!user) {
      await ctx.editMessageText(
        "Произошла ошибка при получении данных о вашем инвентаре. Пожалуйста, перезапустите бота и попробуйте снова.",
        kb.back_call_menu
      );
      return;
    }

    let inventoryMessage = `🎒 В Вашем инвентаре:\n\n`;
    inventoryMessage += `Монетки 💰: ${user.coins ? user.coins : 0}\n`;
    inventoryMessage += `60 гемов 💎: ${user.gems ? user.gems : 0}\n`;
    inventoryMessage += `Благословений полной луны 🌙: ${user.items ? user.items : 0}\n`;
    inventoryMessage += `\n🔄 Обменник - внутренний магазин бота для местной валюты`;

    await ctx.editMessageText(inventoryMessage, kb.inventory_menu);
  } catch (e) {
    console.log(e);
  }
});

composer.use(require("./withdrawals.composer"));
composer.use(require("../../mini_games/cases/craft.composer"));

module.exports = composer;
