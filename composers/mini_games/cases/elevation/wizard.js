const { Scenes } = require('telegraf')
const kb = require('../../../../keyboars.json')
const utils = require('../../../../utils')

const back = async (ctx, edit = true) => {
    try {
        await ctx.scene.leave()
        const stat = await utils.getUserStats(ctx.from.id)

        let txt = '🤫Перед использованием - внимательно прочтите F.A.Q.\n\n'
        txt += 'Здесь кейсы на любой вкус и выбор\n\n'
        txt += 'Стоимость кейсов 💰:\n'
        txt += '▫️ NT (Nothing Team) Кейс: 10 💰\n'
        txt += '▫️ Кейс за друзей: 10 💰\n'
        txt += '▫️ Кейс Пепсы: 300 💰\n'
        txt += '▫️ HIGH RISK: 100 💰\n'
        txt += '▫️ HIGH RISK Premium: 1000 💰\n'
        txt += '▫️ СД (счастливый дроп): 6000💰\n'
        txt += '▫️ СД премиум: 20000💰\n\n'
        txt += `Всего кейсов открыто: ${stat?.cases_opened ? stat.cases_opened : 0}`
        
        if (edit) {
            try {
                await ctx.editMessageText(txt, kb.cases_menu);
            }catch (e) {

            }
        } else {
            await ctx.reply(txt, kb.cases_menu);
        }
    } catch (e) {
        console.log(e)
        await ctx.reply('Произошла ошибка, пожалуйста сделайте скрин ваших действий и перешлите его @GameNothingsupport_bot')
        
    }
}

const wizard_scenes = new Scenes.WizardScene(
    "elevation",
    async (ctx) => {
        try {
            let txt = '60 гемов - тоже гемы...\n'
            txt += 'Но видимо ты другого мнения'
            txt += 'Испытаешь удачу?😉'
            
            const mes = await ctx.reply(txt, kb.elevation_start)
            ctx.wizard.state.mid = mes.message_id
            return ctx.wizard.next()
        }catch (e) {
            console.log(e)
            await ctx.reply('Произошла ошибка, пожалуйста сделайте скрин ваших действий и перешлите его @GameNothingsupport_bot')
            await back(ctx, false)
        }
    },

    async (ctx) => {
        try {
            const user = await utils.getUserData(ctx.from.id)
            const cb_data = ctx.callbackQuery?.data;

            if (cb_data === 'start_case') {

                if (user.gems >= 1) {
                    const updatedGems = user.gems - 1;
                    await utils.updateUserData(ctx.from.id, 'gems', updatedGems);

                    const possRes = [
                        { result: 'Благословение полой луны 🌙', chance: 10 },
                        { result: 'lose', chance: 90 },
                    ]
                    await utils.increaseUserCaseOpened(ctx.from.id)
                    const result = await utils.getRandomResult(possRes);
                    if (result.result == 'lose') {
                        let txt = 'Увы, эти гемы Nothing съел на обед..\n'
                        txt += 'Попробуем ещё раз?😉'
                        try {
                            await ctx.editMessageText(txt, kb.back_try_again_cases_menu)
                        }catch (e) {

                        }
                        return ctx.wizard.next()
                    } else {
                        await utils.updateUserData(ctx.chat.id, 'items', user.items + 1); // Обновляем предметы в базе данных

                        let txt = 'Вы только посмотрите на этого счастливчика!\n'
                        txt += 'Невероятно, 🌙 твоя! 🍾'
                        try {
                            await ctx.editMessageText(txt, kb.back_try_again_cases_menu);
                        }catch (e) {

                        }
                        return ctx.wizard.next()
                    }

                } else {
                    let txt = 'К сожалению, у тебя не хватает гемов для открытия..\n\n'
                    txt += 'Ты можешь продолжить копить, либо попробовать другие мини-игры.\n\n'
                    txt += 'P.S. Если же не хочешь ждать - можешь заглянуть в "❤️ Поддержать"'
                    try {
                        await ctx.editMessageText(txt, kb.back_cases_menu);
                    }catch (e) {

                    }
                    return ctx.wizard.next()
                }
            } else {
                await back(ctx)
            }
        }catch (e) {
            console.log(e)
            await ctx.reply('Произошла ошибка, пожалуйста сделайте скрин ваших действий и перешлите его @GameNothingsupport_bot')
            await back(ctx, false)
        }
    },

    async (ctx) => {
        try {
            cb_data = ctx.callbackQuery?.data

            if ( (cb_data === 'try_again')) {
                ctx.scene.reenter()
            } else {
                await back(ctx)
            }
        }catch (e) {
            console.log(e)
            await ctx.reply('Произошла ошибка, пожалуйста сделайте скрин ваших действий и перешлите его @GameNothingsupport_bot')
            await back(ctx, false)
        }
    }

) 

module.exports = wizard_scenes