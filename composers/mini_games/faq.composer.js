const { Composer} = require('telegraf')
const composer = new Composer()
const kb = require('../../keyboars.json')

composer.action("mini_games_faq", async (ctx) => {
    try {
        let txt = '<b>Общие правила и условия:</b>\n'
        txt += 'Все ставки делаются в бесплатной валюте - монетки. 💰\n\n'
        txt += 'Из игр - 🧨 Кейсы\n'
        await ctx.editMessageText(txt, kb.mini_games_faq_menu);
    } catch (e) {
        console.log(e)
    }
})

composer.action("cases_faq", async (ctx) => {
    try {
        let txt = '1. 🪙 Крафт.\nПравила очень просты, отдаёшь 5 раз по 60 гемов, а получаешь луну \n\n'
        txt += '2. 🍀 Счастливый дроп.\nКлассический ивент нашего канала по воскресеньям. Внутри лежит: 1 - 60 гемов, 2 - 120 гемов, 3 - 180 гемов, 4 - 240 гемов, 5 - луна, 6 - луна и 60 гемов. Все просто - кидай кубик и смотри, что тебе выпало. 😉\nСтоимость: 1999 💰.\n\n'
        txt += '3. 💥 High Risk.\nЛюбишь рисковать? Тогда это твой кейс. Здесь лежит луна, но шанс выпадения - 1%.\nСтоимость: 99 💰. \n\n'
        txt += '4. 🔝 Возвышение.\nУ тебя в инвентаре появились 60 💎? Отлично, можно попробовать их возвысить до луны. Шансы на возвышение - 20%\nСтоимость: 49 💰. \n\n'
        txt += '5. 💰 Монеточный\nВнутри лежит от 5 до 100 💰 .\nСтоимость: 19 💰\n\n'
        await ctx.editMessageText(txt, kb.mini_games_faq_back);
    } catch (e) {
        console.log(e)
    }
})

module.exports = composer