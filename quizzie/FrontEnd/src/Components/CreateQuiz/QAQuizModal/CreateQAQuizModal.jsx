import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './CreateQAQuizModal.module.css';
import QuizCreationSuccess from '../QuizCreationSuccess/QuizSuccesspage';
import deleteImg from '../../../images/delete.png';

const CreateQAQuizModal = ({ quizData, userId }) => {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([
    {
      questionNumber: 1,
      text: 'Sample Question',
      optionType: 'Text',
      options: [{ text: '', isCorrect: false }],
      timerType: 'OFF',
      display: 'block',
    },
  ]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isQuizCreated, setIsQuizCreated] = useState(false);
  const [createdQuizId, setCreatedQuizId] = useState(null);

  const validateQuiz = () => {
    
    if (questions.some((question) => question.options.length < 2)) {
      alert('Each question must have at least 2 options.');
      return false;
    }

    
    if (questions.some((question) => !question.options.some((opt) => opt.isCorrect))) {
      alert('Each question must have at least one correct option selected.');
      return false;
    }

    
    if (questions.some((question) => question.text.trim() === '' || question.options.some((opt) => opt.text.trim() === ''))) {
      alert('Question text and option text cannot be empty.');
      return false;
    }

    return true;
  };

  const handleCreateQuiz = async () => {
    try {
      if (!validateQuiz()) {
        return;
      }

      const authToken = localStorage.getItem('authToken');

      const response = await axios.post(
        'https://quizapi-nine.vercel.app/quiz/create',
        {
          userId: userId,
          quizName: quizData.quizName,
          quizType: quizData.quizType,
          questions,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      console.log('Response:', response.data);

      const { quizId } = response.data;

      setCreatedQuizId(quizId);
      setIsQuizCreated(true);
    } catch (error) {
      console.error('Error creating quiz:', error);
      console.log('Error details:', error.response.data);
    }
  };

  const addQuestion = () => {
    if (questions.length < 5) {
      setQuestions((prevQuestions) =>
        prevQuestions.map((question, index) =>
          index === currentQuestionIndex ? { ...question, display: 'none' } : question
        )
      );

      setQuestions((prevQuestions) => [
        ...prevQuestions,
        {
          questionNumber: prevQuestions.length + 1,
          text: '',
          optionType: 'Text',
          options: [{ text: '', isCorrect: false }],
          timerType: 'OFF',
          display: 'block',
        },
      ]);
      setCurrentQuestionIndex(questions.length);
    }
  };

  const addOption = (questionNumber) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) => {
        if (question.questionNumber === questionNumber && question.options.length < 4) {
          const updatedOptions = [...question.options, { text: '', isCorrect: false }];
          return { ...question, options: updatedOptions };
        }
        return question;
      })
    );
  };

  const deleteOption = (questionNumber, index) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) => {
        if (question.questionNumber === questionNumber && question.options.length > 2) {
          const updatedOptions = question.options.filter((opt, i) => i !== index);
          return { ...question, options: updatedOptions };
        }
        return question;
      })
    );
  };

  const handleQuestionTextChange = (questionNumber, text) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) => (question.questionNumber === questionNumber ? { ...question, text } : question))
    );
  };

  const handleOptionChange = (questionNumber, index, value) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) => {
        if (question.questionNumber === questionNumber) {
          const updatedOptions = question.options.map((opt, i) => ({
            ...opt,
            isCorrect: i === index ? !opt.isCorrect : opt.isCorrect,
            text: i === index ? value : opt.text,
          }));
          return { ...question, options: updatedOptions };
        }
        return question;
      })
    );
  };
  

  const handleOptionTypeChange = (questionNumber, type) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.questionNumber === questionNumber
          ? {
              ...question,
              optionType: type,
              options: type !== 'Text and Image URL' ? [{ text: '', isCorrect: false }] : [{ text: '', isCorrect: false }],
            }
          : question
      )
    );
  };

  const handleTimerTypeChange = (questionNumber, timerType) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.questionNumber === questionNumber ? { ...question, timerType } : question
      )
    );
  };

  const removeQuestion = (questionNumber) => {
    setQuestions((prevQuestions) =>
      prevQuestions
        .filter((question) => question.questionNumber !== questionNumber)
        .map((question, index) => ({
          ...question,
          questionNumber: index + 1,
          display: 'block',
        }))
    );
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const handleQuestionClick = (questionNumber) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.questionNumber === questionNumber ? { ...question, display: 'block' } : { ...question, display: 'none' }
      )
    );
    setCurrentQuestionIndex(questionNumber - 1);
  };

  const renderOptions = (question) => {
    return (
      <div>
        {question.options.map((option, index) => (
          <div key={index}>
            <input
              type="radio"
              name={`options_${question.questionNumber}`}
              onChange={() => handleOptionChange(question.questionNumber, index, option.text)}
              checked={option.isCorrect}
            />
            {question.optionType === 'Text' && (
              <input
                type="text"
                placeholder={`Option ${index + 1}`}
                className={styles.QA_optionInput}
                value={option.text}
                onChange={(e) => handleOptionChange(question.questionNumber, index, e.target.value)}
              />
            )}
            {question.optionType === 'Image URL' && (
              <input
                type="url"
                placeholder={`Option ${index + 1} Image URL`}
                className={styles.QA_optionInput}
                value={option.text}
                onChange={(e) => handleOptionChange(question.questionNumber, index, e.target.value)}
              />
            )}
            {question.optionType === 'Text and Image URL' && (
              <>
                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  className={styles.QA_optionInput}
                  value={option.text}
                  onChange={(e) => handleOptionChange(question.questionNumber, index, e.target.value)}
                />
                <input
                  type="url"
                  placeholder={`Option ${index + 1} Image URL`}
                  className={styles.QA_optionInput}
                  value={option.imageURL}
                  onChange={(e) => handleOptionChange(question.questionNumber, index, e.target.value)}
                />
              </>
            )}
            {index > 1 && (
              <button
                onClick={() => deleteOption(question.questionNumber, index)}
                className={styles.QA_removeButton}
              >
                <img src={deleteImg} alt="" />
              </button>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  
  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className={styles.questionModalOverlay}>
      <div className={styles.QA_modalContent}>
        {isQuizCreated ? (
          <QuizCreationSuccess quizId={createdQuizId} />
        ) : (
          <>
            <div className={styles.QA_modalHeader}>
              <div className={styles.QA_questionNumbers}>
                {questions.map((question) => (
                  <div
                    key={question.questionNumber}
                    className={styles.QA_questionNumber}
                    onClick={() => handleQuestionClick(question.questionNumber)}
                    style={{ fontWeight: currentQuestionIndex === question.questionNumber - 1 ? 'bold' : 'normal' }}
                  >
                    {question.questionNumber}
                  </div>
                ))}
                <div className={styles.QA_addButton} onClick={addQuestion}>
                  +
                </div>
              </div>
              <p>Max 5 Questions</p>
            </div>

            {questions.map((question, index) => (
              <div key={question.questionNumber} className={styles.QA_questionContentContainer}>
                <div className={styles.QA_questionContent} style={{ display: currentQuestionIndex === index ? 'block' : 'none' }}>
                  <div className={styles.QA_modalHeader}>
                    {index > 0 && (
                      <div className={styles.QA_removeButton} onClick={() => removeQuestion(question.questionNumber)}>
                        x
                      </div>
                    )}
                  </div>

                  <input
                    type="text"
                    placeholder={`Question ${question.questionNumber}`}
                    className={styles.QA_questionInput}
                    value={question.text}
                    onChange={(e) => handleQuestionTextChange(question.questionNumber, e.target.value)}
                  />

                  <div className={styles.QA_optionType}>
                    <div>Option Type:</div>
                    {['Text', 'Image URL', 'Text and Image URL'].map((type) => (
                      <label key={type}>
                        <input
                          type="radio"
                          name={`optionType_${question.questionNumber}`}
                          checked={question.optionType === type}
                          onChange={() => handleOptionTypeChange(question.questionNumber, type)}
                        />
                        {type}
                      </label>
                    ))}
                  </div>

                  <div className={styles.QA_options}>
                    {renderOptions(question)}
                    {question.options.length < 4 && (
                      <button onClick={() => addOption(question.questionNumber)} className={styles.QA_addOption}>
                        Add Option
                      </button>
                    )}
                  </div>

                  <div className={styles.QA_timerType}>
                    <div>Timer Type:</div>
                    {['5 Sec', '10 Sec', 'OFF'].map((timer) => (
                      <button
                        key={timer}
                        className={`${styles.QA_timerButton} ${question.timerType === timer ? styles.QA_selectedTimer : ''}`}
                        onClick={() => handleTimerTypeChange(question.questionNumber, timer)}
                      >
                        {timer}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <div className={styles.QA_buttonContainer}>
              <button className={styles.QA_cancelButton} onClick={handleCancel}>
                Cancel
              </button>
              <button className={styles.QA_confirmCreateButton} onClick={() => handleCreateQuiz(userId)}>
                Create Quiz
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateQAQuizModal;
