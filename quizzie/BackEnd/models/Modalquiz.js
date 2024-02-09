const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
  },
  selectedOption: String,
});

const quizAttemptSchema = new mongoose.Schema({
  
  userId: {
    type: String,
    default: 'anonymous', 
  },
  answers: [answerSchema],
});

const questionSchema = new mongoose.Schema({
  questionNumber: {
    type: Number,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  optionType: {
    type: String,
    enum: ['Text', 'Image URL', 'Text and Image URL'],
    required: true,
  },
  options: [
    {
      text: {
        type: String,
        required: true,
      },
      isCorrect: {
        type: Boolean,
        default: false,
      },
      imageURL: {
        type: String,
      },
    },
  ],
  timerType: {
    type: String,
    enum: ['5 Sec', '10 Sec', 'OFF'],
    required: false,
  },
  
  totalAttempts: {
    type: Number,
    default: 0,
  },
  correctAttempts: {
    type: Number,
    default: 0,
  },
  incorrectAttempts: {
    type: Number,
    default: 0,
  },
});

const quizSchema = new mongoose.Schema({
  quizName: {
    type: String,
    required: true,
  },
  quizType: {
    type: String,
    enum: ['Q&A', 'Poll Type'],
    required: true,
  },
  questions: [questionSchema],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  attempts: [quizAttemptSchema],
  views: {
    type: Number,
    default: 0,
  },
});

quizSchema.statics.deleteQuiz = async function (quizId) {
 
  return this.deleteOne({ _id: quizId });
};

module.exports = mongoose.model('Quiz', quizSchema);
