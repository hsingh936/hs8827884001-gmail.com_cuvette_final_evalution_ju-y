import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleButtonClick = (page) => {
    navigate(page);
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.dashLogo}>QUIZZIE</div>
      <div className={styles.Sidebarbths}>
        <button onClick={() => handleButtonClick('/dashboard')} className={styles.dashBtn}>
          Dashboard
        </button>
        <button onClick={() => handleButtonClick('/analytics')} className={styles.analBtn}>
          Analytics
        </button>
        <button onClick={() => handleButtonClick('/create-quiz')} className={styles.createBtn}>
          Create Quiz
        </button>
      </div>
      <button onClick={() => handleButtonClick('/login')} className={styles.logoutbtn}>
        LOGOUT
      </button>
    </div>
  );
};

export default Sidebar;
