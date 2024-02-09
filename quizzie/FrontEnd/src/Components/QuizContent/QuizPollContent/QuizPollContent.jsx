import React, { useState } from 'react';
import axios from 'axios';
import styles from './QuizPollContent.module.css';

const PollQuizContentPage = ({ quiz }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [pollSubmitted, setPollSubmitted] = useState(false);
  const [selectedOptionCounts, setSelectedOptionCounts] = useState(Array(quiz.questions[currentQuestionIndex].options.length).fill(0));

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    setSelectedOption(null);
  };

  const handleOptionSelect = (optionIndex) => {
    const newSelectedOptionCounts = [...selectedOptionCounts];
    newSelectedOptionCounts[optionIndex] += 1;
    setSelectedOptionCounts(newSelectedOptionCounts);
    setSelectedOption(optionIndex);

    if (currentQuestionIndex < quiz.questions.length - 1) {
      handleNextQuestion();
    }
  };

  const handleSubmitPoll = async () => {
    try {
      const currentQuestion = quiz.questions[currentQuestionIndex];

      if (!currentQuestion || !currentQuestion._id) {
        console.error('Invalid question or question ID');
        return;
      }

      const userResponses = currentQuestion.options.map((option, index) => ({
        questionId: currentQuestion._id,
        selectedOption: index,
        count: selectedOptionCounts[index],
      }));

      const response = await axios.post('https://quizapi-f5wf.onrender.com/quiz/submit-responses', {
        quizId: quiz._id,
        userResponses,
      });

      console.log(response.data.message);
      setPollSubmitted(true);
    } catch (error) {
      console.error('Error submitting poll response:', error);
    }
  };

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  if (pollSubmitted) {
    return (
      <div className={styles.pollCompleted}>
        <h2>Thank you for participating in the poll!</h2>
      </div>
    );
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.pollContainer}>
        <div className={styles.questionInfo}>
          <div>Question {currentQuestionIndex + 1}/{quiz.questions.length}</div>
        </div>
        <div className={styles.questions}>
          <div>{currentQuestion?.text}</div>
          <div className={styles.optionsContainer}>
            {currentQuestion?.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(index)}
                className={`${styles.optionButton} ${selectedOption === index ? styles.selectedOption : ''}`}
                style={{ border: selectedOption === index ? '2px solid blue' : '2px solid #ddd' }}
              >
                {option?.text}
              </button>
            ))}
          </div>
        </div>
        {isLastQuestion ? (
          <button className={styles.submitButton} onClick={handleSubmitPoll}>
            Submit
          </button>
        ) : (
          <button className={styles.nextButton} onClick={handleNextQuestion}>
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default PollQuizContentPage;
