const { Telegraf } = require('telegraf')
const {message} = require("telegraf/filters");

const bot = new Telegraf("8079418069:AAGQ_CVxzDWMXW8Y3nE875NvEHbwxi57-NI")

let onStartMsg = "Salom! Men sizga qo'shiq topib berishim mumkin, Qo'shiq nomini yozing..."

bot.start((ctx) => ctx.reply(onStartMsg))

let term = "";

// Har qanday matnli xabarni tutib olish
bot.on('text', async (ctx) => {
    term = ctx.message.text; // Foydalanuvchi yuborgan matnni olish

    let endpoint = "https://www.shazam.com/services/amapi/v1/catalog/UZ/search?"
    endpoint = endpoint + "term="+ term +"&limit=1&types=songs,artists"

    try {
        const response = await fetch(endpoint);
        const data = await response.json(); // JSON formatdagi ma'lumotlarni oling


        // Shazam API natijalarini tekshirish
        if (data.results && data.results.songs && data.results.songs.data.length > 0) {
            const song = data.results.songs.data[0]; // Birinchi natijani olamiz

            // Qo'shiq haqida ma'lumotni formatlash
            const songInfo =
                `
                Qo'shiq nomi: ${song.attributes.name}\n
                Ijrochi: ${song.attributes.artistName}\n
                Url: ${song.attributes.previews[0].url}\n

                `;

            ctx.reply(songInfo);
        } else {
            ctx.reply("Afsuski, siz kiritgan qo'shiq topilmadi.");
        }

    } catch (error) {
        console.error('Xatolik yuz berdi:', error);
        ctx.reply('Ma’lumot olishda xatolik yuz berdi.');
    }

});


bot.launch()
