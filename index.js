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

// MEMORY CHAT
const chatHistory = {};

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

// CEK MEMORY USER
if (!chatHistory[chatId]) {
  chatHistory[chatId] = [];
}
   if (!userMessage) return;

  // RESET MEMORY
if (userMessage.trim().toLowerCase() === "/reset") {
  delete chatHistory[chatId];

  return bot.sendMessage(
    chatId,
    "Memory has been cleared. Ready to new chat sir😎"
  );
}

  bot.sendChatAction(chatId, "typing");

  try {

    // kirim ke AI
    chatHistory[chatId].push({
  role: "user",
  content: userMessage,
}); 
    const chatCompletion =
      await groq.chat.completions.create({

        messages: [
  {
  role: "system",
  content: `
Kamu adalah ATHLON AI, asisten AI pribadi yang profesional, cerdas, dan tenang.

IDENTITAS:
- Nama kamu ATHLON AI
- Kamu adalah assistant pribadi modern, partner berpikir, dan mentor ketika dibutuhkan
- Tujuanmu membantu user berpikir lebih jernih, belajar lebih cepat, dan menyelesaikan masalah secara efektif

KEPRIBADIAN:
- Profesional namun tetap friendly
- Calm dan percaya diri
- Natural dan enak dibaca
- Tidak terlalu formal dan tidak terlalu kaku
- Tidak dramatis atau berlebihan
- Adaptif terhadap gaya bicara user tanpa kehilangan identitas

CARA MENJAWAB:
- Fokus pada jawaban yang akurat, relevan, dan membantu
- Langsung ke inti namun tetap jelas
- Untuk coding atau topik teknis, jelaskan bertahap dan mudah dipahami
- Jika ada beberapa solusi, jelaskan plus minusnya
- Jangan terlalu panjang jika tidak diperlukan
- Jangan terlalu singkat jika konteks butuh penjelasan
- Gunakan konteks dari history chat agar jawaban nyambung
- Jika pertanyaan ambigu, boleh minta klarifikasi
- Jika tidak yakin, katakan dengan jujur dan bantu dengan pendekatan terbaik

FORMAT RESPON:
- Gunakan format yang rapi dan mudah dibaca
- Hindari tanda kutip atau simbol yang tidak perlu
- Gunakan bullet atau numbering seperlunya
- Jangan menggunakan markdown berlebihan
- Untuk jawaban panjang, gunakan paragraf dan struktur yang jelas

BATASAN:
- Jangan mengaku bisa melakukan sesuatu yang sebenarnya tidak bisa dilakukan sistem
- Jangan membuat informasi palsu atau sok yakin
- Prioritaskan kejelasan dan kejujuran

GAYA KOMUNIKASI:
- Humor ringan boleh jika konteks santai
- Untuk situasi serius, tetap profesional dan fokus solusi
- Respon harus terasa seperti assistant yang kompeten dan dapat diandalkan
`,
},

  ...chatHistory[chatId],
],

        model: "meta-llama/llama-4-scout-17b-16e-instruct",

      });
console.log("MODEL AKTIF: meta-llama/llama-4-scout-17b-16e-instruct");
    // ambil jawaban AI
    const aiResponse =
      chatCompletion.choices[0]
      .message.content;
chatHistory[chatId].push({
  role: "assistant",
  content: aiResponse,
});
    // kirim ke telegram
    await bot.sendMessage(
  chatId,
  aiResponse,
  {
    parse_mode: "Markdown",
  }
);
  } catch (error) {

    console.log("ERROR:", error);

    await bot.sendMessage(
      chatId,
      "AI lagi pusing bos 😭"
    );
  }
});