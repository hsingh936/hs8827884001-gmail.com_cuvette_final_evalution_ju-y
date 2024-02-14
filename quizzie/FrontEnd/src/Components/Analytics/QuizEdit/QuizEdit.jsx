import React, { useState } from 'react';
import axios from 'axios';
import styles from './QuizEdit.module.css'; 

const Quizedit = ({ quiz, onClose }) => {
  const [updatedQuiz, setUpdatedQuiz] = useState({
    quizName: quiz.quizName,
    quizType: quiz.quizType,
    questions: quiz.questions.map((question) => ({
      ...question,
      options: question.options.map((option) => ({ ...option })),
      correctOption: null,
    })),
  });

  const handleQuestionChange = (questionIndex, updatedQuestion) => {
    setUpdatedQuiz((prevQuiz) => {
      const updatedQuestions = [...prevQuiz.questions];
      updatedQuestions[questionIndex] = updatedQuestion;
      return { ...prevQuiz, questions: updatedQuestions };
    });
  };

  const handleOptionChange = (questionIndex, optionIndex, updatedOption) => {
    setUpdatedQuiz((prevQuiz) => {
      const updatedQuestions = [...prevQuiz.questions];
      const updatedOptions = [...updatedQuestions[questionIndex].options];
      updatedOptions[optionIndex] = updatedOption;
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        options: updatedOptions,
      };
      return { ...prevQuiz, questions: updatedQuestions };
    });
  };

  const handleMarkAsCorrect = (questionIndex, optionIndex) => {
    setUpdatedQuiz((prevQuiz) => {
      const updatedQuestions = prevQuiz.questions.map((question, index) => {
        if (index === questionIndex) {
          return {
            ...question,
            options: question.options.map((option, idx) => ({
              ...option, 
              correct: idx === optionIndex,
            })),
          };
        }
        return question;
      });
      return { ...prevQuiz, questions: updatedQuestions };
    });
  };

  const handleUpdateQuiz = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      await axios.put(`https://quizapi-f5wf.onrender.com/quiz/${quiz.quizId}`, updatedQuiz, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log('Quiz updated successfully');
      onClose();
    } catch (error) {
      console.error('Error updating quiz:', error);
    }
  };

  return (
    <div className={styles.quizeditContainer}>
      <h2 className={styles.quizEditHeading}>Edit {quiz.quizName} Quiz</h2>
      {updatedQuiz.questions.map((question, questionIndex) => (
        <div key={question._id} className={styles.questionContainer}>
          <h3 className={styles.questionHeading}>Question {questionIndex + 1}</h3>
          <input
            type="text"
            value={question.text}
            onChange={(e) =>
              handleQuestionChange(questionIndex, { ...question, text: e.target.value })
            }
            className={styles.questionInput}
          />
          {question.options.map((option, optionIndex) => (
            <div key={option._id} className={styles.optionContainer}>
              <h4 className={styles.optionHeading}>Option {optionIndex + 1}</h4>
              <label className={styles.textLabel}>Text:</label>
              <input
                type="text"
                value={option.text}
                onChange={(e) =>
                  handleOptionChange(
                    questionIndex,
                    optionIndex,
                    { ...option, text: e.target.value }
                  )
                }
                className={styles.textInput}
              />
              {option.type === 'Image URL' && (
                <>
                  <label className={styles.imageUrlLabel}>Image URL:</label>
                  <input
                    type="url"
                    value={option.imageUrl}
                    onChange={(e) =>
                      handleOptionChange(
                        questionIndex,
                        optionIndex,
                        { ...option, imageUrl: e.target.value }
                      )
                    }
                    className={styles.imageUrlInput}
                  />
                </>
              )}
              {option.type === 'Text and Image URL' && (
                <>
                  <label className={styles.imageUrlLabel}>Image URL:</label>
                  <input
                    type="url"
                    value={option.imageUrl}
                    onChange={(e) =>
                      handleOptionChange(
                        questionIndex,
                        optionIndex,
                        { ...option, imageUrl: e.target.value }
                      )
                    }
                    className={styles.imageUrlInput}
                  />
                  <label className={styles.textLabel}>Text:</label>
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) =>
                      handleOptionChange(
                        questionIndex,
                        optionIndex,
                        { ...option, text: e.target.value }
                      )
                    }
                    className={styles.textInput}
                  />
                </>
              )}
              <button
                onClick={() => handleMarkAsCorrect(questionIndex, optionIndex)}
                className={styles.markCorrectButton}
              >
                Mark as Correct
              </button>
            </div>
          ))}
        </div>
      ))}
      <button onClick={handleUpdateQuiz} className={styles.updateQuizButton}>
        Update Quiz
      </button>
      <button onClick={onClose} className={styles.cancelButton}>
        Cancel
      </button>
    </div>
  );
};

export default Quizedit;
