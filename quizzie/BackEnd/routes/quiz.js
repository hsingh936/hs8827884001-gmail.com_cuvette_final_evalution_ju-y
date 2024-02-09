const express = require('express');
const router = express.Router();
const Quiz = require('../models/Modalquiz');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const { quizName, quizType, questions } = req.body;

        console.log('Questions array:', questions);
        const questionDocuments = questions.map((question) => {
            if (question && question.questionNumber) {
                return {
                    questionNumber: question.questionNumber,
                    text: question.text,
                    optionType: question.optionType,
                    options: question.options,
                    timerType: question.timerType,
                };
            } else {
                console.error('Invalid question:', question);
                return null;
            }
        });
        
        const quiz = new Quiz({
            userId,
            quizName,
            quizType,
            questions: questionDocuments,
            createdAt: new Date(),
        });
        
        const savedQuiz = await quiz.save();

        res.status(201).json({ message: 'Quiz created successfully',  quizId: quiz._id });
    } catch (error) {
        console.error('Error in quiz.js:', error);
        res.status(500).json({ error: `Internal server error quiz.js: ${error.message}` });
    }
});

router.get('/user/:userId', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId; 
        const quizzes = await Quiz.find({ userId }).sort({createdAt:-1});

        res.status(200).json({ quizzes: quizzes.map((quiz) => ({ ...quiz.toObject(), quizId: quiz._id })) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:quizId', async (req, res) => {
    try {
        const quizId = req.params.quizId; 
        const quiz = await Quiz.findById(quizId );

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        quiz.views += 1;
        await quiz.save();

        res.status(200).json({ quiz: { ...quiz.toObject(), quizId: quiz._id } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/submit-responses', async (req, res) => {
    try {
      const { quizId, userResponses } = req.body;
  
      const quiz = await Quiz.findOne({ _id: quizId });
  
      if (!quiz) {
        return res.status(404).json({ error: 'Quiz not found' });
      }

      const quizAttempt = {
        userId: 'anonymous', 
        answers: userResponses.map(response => ({
          questionId: response.questionId,
          selectedOption: response.selectedOption,
        })),
      };

      quiz.attempts.push(quizAttempt);
  
      
      userResponses.forEach((response) => {
        const question = quiz.questions.find(q => q._id.equals(response.questionId));
  
        if (question) {
          question.totalAttempts += 1; 
  
          if (response.isCorrect) {
            question.correctAttempts += 1; 
          } else {
            question.incorrectAttempts += 1; 
          }
        }
      });
  
      await quiz.save(); 
  
      res.status(200).json({ message: 'User responses submitted successfully' });
    } catch (error) {
      console.error('Error handling user responses:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


router.delete('/:quizId', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const quizId = req.params.quizId;

       
        const quiz = await Quiz.findOne({ _id: quizId, userId });

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        
        await Quiz.deleteOne({ _id: quizId });

        res.status(200).json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        console.error('Error in delete route:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/:quizId', authMiddleware, async (req, res) => {
  try {
      const userId = req.userId;
      const quizId = req.params.quizId;
      const { questions } = req.body;

      
      const quiz = await Quiz.findOne({ _id: quizId, userId });

      if (!quiz) {
          return res.status(404).json({ error: 'Quiz not found or unauthorized access' });
      }

      
      quiz.questions = questions.map((updatedQuestion) => {
          const existingQuestion = quiz.questions.find(q => q._id.equals(updatedQuestion._id));

          if (existingQuestion) {
              
              existingQuestion.text = updatedQuestion.text;
              existingQuestion.options = updatedQuestion.options;
          }

          return existingQuestion;
      });

      
      await quiz.save();

      res.status(200).json({ message: 'Quiz questions and options updated successfully' });
  } catch (error) {
      console.error('Error in update route:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});




module.exports = router;
