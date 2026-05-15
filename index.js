require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const Groq = require("groq-sdk");

// ======================
// TOKEN
// ======================

const bot = new TelegramBot(
  process.env.BOT_TOKEN,
  {
    polling: true,
  }
);

// ======================
// GROQ AI
// ======================

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ======================
// BOT START
// ======================

console.log("BOT NYALA 🚀");

// ======================
// CHAT HANDLER
// ======================

bot.on("message", async (msg) => {

  const chatId = msg.chat.id;
  const userMessage = msg.text;

  if (!userMessage) return;

  bot.sendChatAction(chatId, "typing");

  try {

    // kirim ke AI
    const chatCompletion =
      await groq.chat.completions.create({

        messages: [
          {
            role: "user",
            content: userMessage,
          },
        ],

        model: "meta-llama/llama-4-scout-17b-16e-instruct",

      });
console.log("MODEL AKTIF: meta-llama/llama-4-scout-17b-16e-instruct");
    // ambil jawaban AI
    const aiResponse =
      chatCompletion.choices[0]
      .message.content;

    // kirim ke telegram
    await bot.sendMessage(
      chatId,
      aiResponse
    );

  } catch (error) {

    console.log("ERROR:", error);

    await bot.sendMessage(
      chatId,
      "AI lagi pusing bos 😭"
    );
  }
});