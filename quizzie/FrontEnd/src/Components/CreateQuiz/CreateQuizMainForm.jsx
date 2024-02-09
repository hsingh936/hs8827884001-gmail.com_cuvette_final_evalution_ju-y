import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import styles from './CreateQuizMainForm.module.css';
import CreateQAQuizModal from './QAQuizModal/CreateQAQuizModal';  
import CreatePollModal from './PollQuizModal/CreatePollModal';

const CreateQuizMainForm = ({ userId }) => {
  const [quizName, setQuizName] = useState('');
  const [selectedQuizType, setSelectedQuizType] = useState('');
  const [error, setError] = useState('');
  const [isModalVisible, setModalVisibility] = useState(false);

  const navigate = useNavigate();

  const handleContinue = async () => { 
    if (quizName.trim() === '') {
      setError('Please enter a quiz name.');
    } else if (selectedQuizType.trim() === '') {
      setError('Please select a quiz type.');
    } else {
      setError('');
      
      setModalVisibility(true);

      
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className={styles.mainContainer}>
      <Sidebar />
      <div className={styles.quizform_modalOverlay}>
        <div className={styles.quizform_modal}>
          {!isModalVisible && (
            <>
              <div className={styles.quizName}>
                <div>
                  <input
                    type="text"
                    placeholder="Quiz Name"
                    className={styles.quizNameInput}
                    value={quizName}
                    onChange={(e) => setQuizName(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.quizType}>
                <div>Quiz Type</div>
                <button
                  className={selectedQuizType === 'Q&A' ? styles.selectedButton : styles.quizTypeButton}
                  onClick={() => setSelectedQuizType('Q&A')}
                >
                  Q&A
                </button>
                <button
                  className={selectedQuizType === 'Poll Type' ? styles.selectedButton : styles.quizTypeButton}
                  onClick={() => setSelectedQuizType('Poll Type')}
                >
                  Poll Type
                </button>
              </div>

              {error && <div className={`${styles.error} ${styles.errorMessage}`}>{error}</div>}

              <div className={styles.buttonContainer}>
                <button className={styles.cancelModalButton} onClick={handleCancel}>Cancel</button>
                <button
                  className={styles.continueButton}
                  onClick={handleContinue} 
                >
                  Continue
                </button>
              </div>
            </>
          )}
          {isModalVisible && selectedQuizType === 'Q&A' && <CreateQAQuizModal quizData={{ quizName, quizType: 'Q&A' }} />}
          {isModalVisible && selectedQuizType === 'Poll Type' && <CreatePollModal quizData={{ quizName, quizType: 'Poll Type' }} />}

        </div>
      </div>
    </div>
  );
};

export default CreateQuizMainForm;
