// functions/index.js
const functions = require("firebase-functions");
const axios = require("axios");

// Định nghĩa một "Callable Function" có tên là askAITutor
exports.askAITutor = functions.https.onCall(async (data, context) => {
  // Xác thực người dùng đã đăng nhập (tăng cường bảo mật)
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Bạn phải đăng nhập để sử dụng tính năng này."
    );
  }

  const userPrompt = data.prompt || "";
  const initialContext = data.context || "";

  // Lấy API Key đã được lưu trữ an toàn trên Firebase
  const apiKey = functions.config().gemini.key;

  if (!apiKey) {
       throw new functions.https.HttpsError(
        "internal",
        "API Key chưa được cấu hình."
       );
  }

  const fullPrompt = `Dựa trên ngữ cảnh bài học "${initialContext}", hãy trả lời câu hỏi sau: ${userPrompt}`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: fullPrompt }] }],
      }
    );

    const botResponse = response.data.candidates[0].content.parts[0].text;
    return { response: botResponse };

  } catch (error) {
    console.error("Lỗi khi gọi API của Google AI:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Không thể nhận phản hồi từ AI, vui lòng thử lại."
    );
  }
});