const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '7466357320:AAGwB98TJRQvSk-I6EaL6phZdo1i4k0uE3s'

const bot = new TelegramApi(token, { polling: true })

const chats = {}



const startGame = async chatId => {
	await bot.sendMessage(
		chatId,
		'Сейчас я заадываю цыфру от 0 до 9, а ты отгадуеш'
	)
	const randomNumber = Math.floor(Math.random() * 10)
	chats[chatId] = randomNumber
	await bot.sendMessage(chatId, 'Отгадай', gameOptions)
}

const start = () => {
	bot.setMyCommands([
		{ command: '/start', description: 'Начальное приветсвие' },
		{ command: '/info', description: 'Получить инфу' },
		{ command: '/game', description: 'Играть' },
	])

	bot.on('message', async msg => {
		const text = msg.text
		const chatId = msg.chat.id

		if (text === '/start') {
			await bot.sendSticker(
				chatId,
				'https://sl.combot.org/hhwripe_by_sticbot/webp/15xe2ad90efb88f.webp'
			)
			return bot.sendMessage(chatId, `Привет ты в боте :)`)
		}
		if (text === '/info') {
			return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`)
		}

		if (text === '/game') {
			return startGame(chatId)
		}

		return bot.sendMessage(chatId, 'Я тебя не понимаю')
	})

	bot.on('callback_query', async msg => {
		const data = msg.data
		const chatId = msg.message.chat.id

		if (data === '/again') {
			return startGame(chatId)
		}

		if (data === chats[chatId]) {
			return bot.sendMessage(
				chatId,
				`Ты отгадал ${chats[chatId]}`,
				againOptions
			)
		} else {
			return bot.sendMessage(
				chatId,
				`Не отгадал ${chats[chatId]}`,
				againOptions
			)
		}
	})
}

start()
