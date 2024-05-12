const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

const token = '7184151585:AAE0RMyGxPOH_vG3Lc79Db0kzqleS6WC6CY'
const webAppUrl = 'https://cozy-sopapillas-4040fb.netlify.app';

const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json());
app.use(cors());

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === '/start') {
    await bot.sendMessage(chatId, 'Ниже появится кнопка, Fill in the form', {
        reply_markup: {
            keyboard: [
                [{text: 'Fill in the form', web_app: {url: webAppUrl + '/form'}}]
            ]
        }
    });

    await bot.sendMessage(chatId, 'Заходи в наш интернет магазин по кнопке ниже', {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Сreate an order', web_app: {url: webAppUrl}}]
            ]
        }
    });

  }

  if (msg?.web_app_data?.data) {
    try {
        const data = JSON.parse(msg?.web_app_data?.data)
        console.log(data)
        await bot.sendMessage(chatId, 'Thanks for the feedback!')
        await bot.sendMessage(chatId, 'Your county: ' + data?.country);
        await bot.sendMessage(chatId, 'Your street: ' + data?.street);

        setTimeout(async () => {
            await bot.sendMessage(chatId, 'You will get all the information in this chat');
        }, 3000)

    } catch (e) {
        console.log(e);
    }
  }
});

app.post('/web-data', async (req, res) => {
    const {queryId, products = [], totalPrice} = req.body;
    try {    
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Thank you for your order',
            input_message_content: {
                message_text: `Поздравляю с покупкой, вы преобрели товар на сумму ${totalPrice}, ${products.map(item => item.title).join(', ')}`
            }
        });
        return res.status(200).json({});

    } catch (e) {
        return res.status(500).json({});
    }
})

const PORT = 8000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));