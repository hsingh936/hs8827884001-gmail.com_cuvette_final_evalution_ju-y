import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './QuizSuccesspage.module.css';

const QuizCreationSuccess = ({ userId ,quizId, onClose }) => {

  const handleShareClick = () => {
    const quizLink = `${window.location.origin}/quiz/${quizId}`;

    navigator.clipboard.writeText(quizLink).then(() => {
      toast.success('Link copied to clipboard');
    });
  };

  const navigate = useNavigate();

  const handleXclick = () => {
    navigate('/dashboard');
  };


  return (
    <div className={styles.modal}>
      <button className={styles.closeButton} onClick={handleXclick}>
        X
      </button>

      <h2>Congratulations! Quiz Created Successfully</h2>
      <p>
        <Link to={`/quiz/${quizId}`}>{`/quiz/${quizId}`}</Link>
      </p>
      <p>Share this link with others to allow them to attempt the quiz.</p>
      <div className={styles.centerButtonContainer}>
        <button className={styles.shareButton} onClick={handleShareClick}>
          Share
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default QuizCreationSuccess;
