const { Composer } = require('telegraf');
const composer = new Composer();
const kb = require('../keyboars.json');
const utils = require('../utils');

const rewards = {
    1: 1,
    2: 5,
    3: 10,
    4: 15,
    5: 20,
    6: 25
};

composer.action("drop_all_dice", async (ctx) => {
    try {
        let user = await utils.getUserData(ctx.from.id);
        let stat = await utils.getUserStats(ctx.from.id);

        if (!stat) {
            await utils.createUserStats(ctx.from.id);
            stat = await utils.getUserStats(ctx.from.id);
        }
        if (!user) {
            await utils.createUser(ctx.from.id, ctx.from.first_name);
            user = await utils.getUserData(ctx.from.id);
        }

        if(user.vip_status <= 0) {
            return;
        }

        if (user.rolls <= 0) {
            ctx.reply('У вас недостаточно бросков', kb.drop_dice_menu);
            return;
        }

        let userRolls = user.rolls;
        let userCoins = user.coins;
        let allResult = 0;
        let rollCount = 0

        while (userRolls > 0 && rollCount < 5) {
            const diceResult = await ctx.replyWithDice();
            userRolls -= 1;
            const selectedResult = diceResult?.dice.value;
            const reward = rewards[selectedResult];
        
            if (reward === undefined) {
                ctx.reply('Произошла ошибка при определении награды');
                return;
            }
        
            allResult += reward;
            userCoins += reward;
            rollCount += 1;

            utils.increaseUserRolls(ctx.from.id);
        }
        utils.increaseUserEarned(ctx.from.id, allResult);
        await utils.updateUserData(ctx.from.id, 'coins', userCoins);
        await utils.updateUserData(ctx.from.id, 'rolls', userRolls);
        await ctx.answerCbQuery();

        setTimeout(async () => {
            let resultMessage = `Ты бросил ${rollCount} кубиков 🎲\n\n`;
            resultMessage += `Твоя награда составила: ${allResult} 💰\n`
            resultMessage += `Твой баланс: ${userCoins} 💰\n`
            ctx.reply(resultMessage, kb.drop_dice_menu);
        }, 5000);
    } catch (e) {
        console.log(e);
    }
});

module.exports = composer;
