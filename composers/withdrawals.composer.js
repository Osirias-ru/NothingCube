const { Composer, Telegraf } = require('telegraf')
const composer = new Composer()
const kb = require('../keyboars.json')
const utils = require('../utils')
const token = process.env.TOKEN_BOT
const bot = new Telegraf(token)

composer.hears("🚀 Вывод предмето в", async (ctx) => {
    try {
        const user = await utils.getUserData(ctx.from.id)

        if (!user.items || user.items === 0) {
            await ctx.sendMessage('У вас нет предметов для вывода.', kb.withdraw_back);
            return;
        }

        let txt = '⚠️Внимание:\n'
        txt += 'Вывод предметов осуществляется тогда, когда есть доступный остаток лун/пропусков у владельца бота.\n\n'
        txt += 'Обновляем запасы раз в неделю.\n'
        txt += 'Предметы выводятся сразу все, кроме 60 💎 / 💠 . Их вывести нельзя.\n'
        txt += 'Нажимая подтвердить вывод, вы подтверждаете согласие с полученной информацией.\n\n'
        txt += '⚠️ВНИМАНИЕ:\n'
        txt += 'Вывод происходит посредством зачисления луны/пропуска по UID. МЫ НЕ ПРОСИМ ВАШИХ ЛОГИНОВ И ПАРОЛЕЙ, БУДЬТЕ ВНИМАТЕЛЬНЫ!\n'

        let txtNow = '⚠️ВНИМАНИЕ!\n'
        txtNow += 'Вывод предметов временно остановлен! Полностью меняем систему выдачи.\n'
        txtNow += 'Теперь вы сможете получить бонус-код для сайта GENSHINDROP, бот пришлет его сам.\n'
        txtNow += 'Обновление запланировано на 20-е числа января.\n' 
        txtNow += 'Более подробную информацию вы можете получить в канале кубика: @cube_updates.\n\n'
        txtNow += 'ВАШИ ЛУНЫ И ПРОПУСКА НИКУДА НЕ ПРОПАДУТ, НЕ ПЕРЕЖИВАЙТЕ!'

        await ctx.sendMessage(txtNow, kb.not_confirm_withdraw);

    } catch (e) {
        console.log(e)
    }
})

composer.action("confirm_withdrawal", async (ctx) => {
    try {
        const user = await utils.getUserData(ctx.from.id)
      
        await utils.updateUserData(ctx.from.id, 'items', 0);
      
        const withdrawalRequest = `Запрос вывода от пользователя ${user.nickname}: ${user.items} лун (уточните в какую именно игру он хочет получить вывод)`;
      
        await bot.telegram.sendMessage(process.env.WITHDRAWAL_ACCOUNT, withdrawalRequest)
        let txt = 'Запрос на вывод предметов успешно отправлен. Пожалуйста, напишите @kitikzinger_x , чтобы узнать о том, когда сможете получить свою награду.\n'
        txt += 'Пожалуйста, не пишите ночью, я не отвечу, я спать буду😴\n\n'
        txt += 'Выводы могут занять до 14-ти дней, в зависимости от наличия лун/пропусков!\n'

        await ctx.editMessageText(txt, kb.withdraw_back);
        
    } catch (e) {
        console.log(e)
    }
})

module.exports = composer