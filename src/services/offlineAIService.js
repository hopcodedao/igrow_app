import { pipeline } from '@xenova/transformers';

class AnswerPipeline {
  static task = 'question-answering';
  static model = 'Xenova/distilbert-base-multilingual-cased-squad-v2';
  static instance = null;

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      this.instance = await pipeline(this.task, this.model, { progress_callback });
    }
    return this.instance;
  }
}

export const answerQuestionOffline = async (question, context) => {
  try {
    const answerer = await AnswerPipeline.getInstance();
    if (!answerer) {
      throw new Error("Không thể khởi tạo pipeline của AI.");
    }
    const result = await answerer(question, context);
    return result;
  } catch (error) {
    console.error("Lỗi AI Offline:", error);
    return { score: 0, answer: "Đã có lỗi xảy ra với AI offline." };
  }
};