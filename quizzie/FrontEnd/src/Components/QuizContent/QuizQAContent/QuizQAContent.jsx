import React, { useState, useEffect, useCallback } from 'react';
import congrats from '../../../images/congrats.png';
import styles from './QuizQAContent.module.css';
import axios from 'axios';

const QAQuizContentPage = ({ quiz }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timer, setTimer] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    setTimer(getCurrentQuestionTimer());
  }, [currentQuestionIndex, quiz]);

  useEffect(() => {
    const timerValue = getCurrentQuestionTimer();
    if (timerValue !== null && timerValue > 0) {
      const timerInterval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(timerInterval);
    } else if (timerValue === 0 && isLastQuestion()) {
      handleSubmitQuiz();
    }
  }, [getCurrentQuestionTimer, currentQuestionIndex, quiz]);

  const getCurrentQuestionTimer = useCallback(() => {
    const currentQuestion = quiz.questions[currentQuestionIndex];
    return currentQuestion ? getTimerValue(currentQuestion.timerType) : null;
  }, [currentQuestionIndex, quiz]);

  const getTimerValue = (timerType) => {
    switch (timerType) {
      case '5 Sec':
        return 5;
      case '10 Sec':
        return 10;
      case 'OFF':
        return null;
      default:
        return null;
    }
  };

  const handleNextQuestion = useCallback(() => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    setSelectedOption(null);
    setTimer(getCurrentQuestionTimer());
  }, [getCurrentQuestionTimer]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);

    const currentQuestion = quiz.questions[currentQuestionIndex];

    if (option.isCorrect) {
      setCorrectAnswers((prevCorrectAnswers) => prevCorrectAnswers + 1);
    }

    if (!isLastQuestion()) {
      handleNextQuestion();
    }
  };

  const isLastQuestion = () => {
    return currentQuestionIndex === quiz.questions.length - 1;
  };

  const handleSubmitQuiz = async () => {
    if (!quizSubmitted) {
      setQuizSubmitted(true);

      const userResponses = quiz.questions.map((question, index) => ({
        questionId: question._id,
        isCorrect: selectedOption === question.options[index] && question.options[index].isCorrect,
      }));

      try {
        await axios.post('https://quizapi-f5wf.onrender.com/quiz/submit-responses', {
          quizId: quiz._id,
          userResponses,
        });

        console.log('User responses submitted successfully.');
      } catch (error) {
        console.error('Error submitting user responses:', error);
      }
    }
  };

  if (quiz.questions.length === 0) {
    return <div className={styles.noQuestions}>No questions available</div>;
  }

  if (quizSubmitted) {
    const resultMessage = `Your Score: ${correctAnswers}/${quiz.questions.length}`;

    return (
      <div className={styles.quizCompleted}>
        <h2 className={styles.congrats}>Congrats Quiz is completed</h2>
        <img className={styles.congratsImage} src={congrats} alt='' />
        <h3 className={styles.resultMessage}>{resultMessage}</h3>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className={styles.mainContainer}>
      <div className={styles.quizContainer}>
        <div className={styles.questionInfo}>
          <div>Question {currentQuestionIndex + 1}/{quiz.questions.length}</div>
        </div>
        <div className={styles.timer}>
          {currentQuestion.timerType !== 'OFF' && `Timer: ${timer}`}
        </div>
        <div className={styles.questions}>
          <div>{currentQuestion?.text}</div>
          <div className={styles.optionsContainer}>
            {currentQuestion?.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(option)}
                className={`${styles.optionButton} ${selectedOption === option ? styles.selectedOption : ''}`}
                style={{ border: selectedOption === option ? '2px solid blue' : '2px solid #ddd' }}
              >
                {option?.text}
              </button>
            ))}
          </div>
        </div>
        {isLastQuestion() ? (
          <button className={styles.submitButton} onClick={handleSubmitQuiz}>Submit</button>
        ) : (
          <button className={styles.nextButton} onClick={handleNextQuestion}>Next</button>
        )}
      </div>
    </div>
  );
};

export default QAQuizContentPage;
