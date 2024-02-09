import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './CreatePollModal.module.css';
import QuizCreationSuccess from '../QuizCreationSuccess/QuizSuccesspage';

const CreatePollModal = ({ quizData, userId }) => {
  const [questions, setQuestions] = useState([
    {
      questionNumber: 1,
      text: 'Sample Question',
      optionType: 'Text',
      options: [{ text: '' }],
      display: 'block',
    },
  ]);

  const [isQuizCreated, setIsQuizCreated] = useState(false);
  const [createdQuizId, setCreatedQuizId] = useState(null);

  const navigate = useNavigate();

  const validatePoll = () => {
    
    if (questions.some((question) => question.options.length < 2)) {
      alert('Each question must have at least 2 options.');
      return false;
    }

    
    if (questions.some((question) => question.text.trim() === '' || question.options.some((opt) => opt.text.trim() === ''))) {
      alert('Question text and option text cannot be empty.');
      return false;
    }

    return true;
  };

  const handleCreatePoll = async () => {
    try {
      if (!validatePoll()) {
        return;
      }

      const authToken = localStorage.getItem('authToken');

      const response = await axios.post(
        'https://apiquiz.vercel.app/quiz/create',
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
      console.error('Error creating poll:', error);
      console.log('Error details:', error.response.data);
    }
  };

  const addQuestion = () => {
    if (questions.length < 5) {
      setQuestions((prevQuestions) =>
        prevQuestions.map((question, index) =>
          index === questions.length - 1 ? { ...question, display: 'none' } : question
        )
      );

      setQuestions((prevQuestions) => [
        ...prevQuestions,
        {
          questionNumber: prevQuestions.length + 1,
          text: '',
          optionType: 'Text',
          options: [{ text: '' }],
          display: 'block',
        },
      ]);
    }
  };

  const addOption = (questionNumber) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) => {
        if (question.questionNumber === questionNumber && question.options.length < 4) {
          const updatedOptions = [...question.options, { text: '' }];
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

  const handleOptionChange = (questionNumber, index, value, isImageURL) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) => {
        if (question.questionNumber === questionNumber) {
          const updatedOptions = [...question.options];
          updatedOptions[index].text = value;
          if (isImageURL) {
            updatedOptions[index].imageURL = value;
          }
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
              options: type !== 'Text and Image URL' ? [{ text: '' }] : [{ text: '' }],
            }
          : question
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
        }))
    );
  };

  const handleQuestionClick = (questionNumber) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.questionNumber === questionNumber ? { ...question, display: 'block' } : { ...question, display: 'none' }
      )
    );
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className={styles.pollModalOverlay}>
      <div className={styles.poll_modalContent}>
        {isQuizCreated ? (
          <QuizCreationSuccess quizId={createdQuizId} />
        ) : (
          <>
            <div className={styles.poll_modalHeader}>
              <div className={styles.poll_questionNumbers}>
                {questions.map((question) => (
                  <div
                    key={question.questionNumber}
                    className={styles.poll_questionNumber}
                    onClick={() => handleQuestionClick(question.questionNumber)}
                    style={{ fontWeight: question.display === 'block' ? 'bold' : 'normal' }}
                  >
                    {question.questionNumber}
                  </div>
                ))}
                <div className={styles.poll_addButton} onClick={addQuestion}>
                  +
                </div>
              </div>
              <p>Max 5 Questions</p>
            </div>

            {questions.map((question, index) => (
              <div key={question.questionNumber} className={styles.poll_questionContentContainer}>
                <div className={styles.poll_questionContent} style={{ display: question.display }}>
                  <div className={styles.poll_modalHeader}>
                    {index > 0 && (
                      <div className={styles.poll_removeButton} onClick={() => removeQuestion(question.questionNumber)}>
                        x
                      </div>
                    )}
                  </div>

                  <input
                    type="text"
                    placeholder={`Question ${question.questionNumber}`}
                    className={styles.poll_questionInput}
                    value={question.text}
                    onChange={(e) => handleQuestionTextChange(question.questionNumber, e.target.value)}
                  />

                  <div className={styles.poll_optionType}>
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

                  <div className={styles.poll_options}>
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex}>
                        <input
                          type="text"
                          placeholder={`Option ${optionIndex + 1}`}
                          className={styles.poll_optionInput}
                          value={option.text}
                          onChange={(e) => handleOptionChange(question.questionNumber, optionIndex, e.target.value, false)}
                        />
                        {question.optionType === 'Image URL' && (
                          <input
                            type="url"
                            placeholder={`Option ${optionIndex + 1} Image URL`}
                            className={styles.poll_optionInput}
                            value={option.imageURL || ''}
                            onChange={(e) => handleOptionChange(question.questionNumber, optionIndex, e.target.value, true)}
                          />
                        )}
                        {question.optionType === 'Text and Image URL' && (
                          <input
                            type="text"
                            placeholder={`Option ${optionIndex + 1}`}
                            className={styles.poll_optionInput}
                            value={option.text}
                            onChange={(e) => handleOptionChange(question.questionNumber, optionIndex, e.target.value, false)}
                          />
                        )}
                        {optionIndex > 1 && (
                          <button
                            onClick={() => deleteOption(question.questionNumber, optionIndex)}
                            className={styles.poll_removeButton}
                          >
                            x
                          </button>
                        )}
                      </div>
                    ))}
                    {question.options.length < 4 && (
                      <button onClick={() => addOption(question.questionNumber)} className={styles.poll_addOption}>
                        Add Option
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div className={styles.poll_buttonContainer}>
              <button className={styles.poll_cancelButton} onClick={handleCancel}>
                Cancel
              </button>
              <button className={styles.poll_confirmCreateButton} onClick={() => handleCreatePoll(userId)}>
                Create Poll
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CreatePollModal;
