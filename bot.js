const { Telegraf } = require('telegraf');
const covidApi = require('covid19-api');
const COUNTRIES_LIST = require('./const');
const fs = require('fs');
const request = require('request');
require('dotenv').config();
const path = require('path');
const fetch = require('node-fetch');
const BOT_TOKEN = '1517858617:AAEaXOhHLrSzXI2oFAaRqBh24a4i1IgtaEI'


const imageDb = [];

const bot = new Telegraf(BOT_TOKEN)

bot.start(ctx => ctx.reply(`
    Привет ${ctx.from.first_name}! 
    Узнай статистику по Коронавирусу. 
    Введи страну на английском языке и получи статистику.
    Получить весь список стран можно по команде /help."
`))
bot.help(ctx => ctx.reply(COUNTRIES_LIST)) // список всех стран на английском языке можно взять в документации covid19-api
bot.on('photo', async (doc) => {
    try {
        // const userText = ctx.message.text
        // const covidData = await covidApi.getReportsByCountries(userText)
        // const countryData = covidData[0][0]
        // const formatData = `
        //     Страна: ${countryData.country},
        //     Случаи: ${countryData.cases},
        //     Смерти: ${countryData.deaths},
        //     Выздоровело: ${countryData.recovered}`
        // ctx.reply(formatData)

        // console.log(msg.photo[0]);

        // if (msg.photo && msg.photo[0]) {
        //     const image = await bot.getFile({ file_id: msg.photo[0].file_id });
        //     console.log(image);
        // }

        const fileId = doc.update.message.photo[0].file_id;

        const res = await fetch(
            `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`
        );

        const res2 = await res.json();
        const filePath = res2.result.file_path;


        const downloadURL =
            `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;


        imageDb.push({
            'url': downloadURL
        })

        console.log(imageDb);

        // download(downloadURL, path.join(__dirname, `${fileId}.jpg`), () =>
        //     console.log('Done!')
        // );
    } catch (e) {
        doc.reply('Ошибка')
    }
})
bot.launch()
