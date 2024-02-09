// QAQuizAnalysis.jsx

import React from 'react';
import styles from './QAQuizAnalysis.module.css';

const QAQuizAnalysis = ({ quiz }) => {
  if (!quiz) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.quizAnalysisContainer}>
      <div className={styles.quizInfo}>
        <h2 className={styles.quizAnalysisTitle}>{`Quiz ${quiz.quizName} Question Analysis`}</h2>
        <div className={styles.metadataContainer}>
          <p className={styles.metadataText}>{`Created on: ${new Date(quiz.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}</p>
          <p className={styles.metadataText}>{`Impressions: ${quiz.views}`}</p>
        </div>
      </div>

      {quiz.questions.map((question, index) => (
        <div key={index} className={styles.questionContainer}>
          <p className={styles.questionText}>{`Q.${question.questionNumber} ${question.text}`}</p>
          <div className={styles.statsContainer}>
            <div className={styles.statItem}>
              <p className={styles.attemptedText}>{`${question.totalAttempts} people Attempted`}</p>
            </div>
            <div className={styles.statItem}>
              <p className={styles.correctText}>{`${question.correctAttempts} people Correct`}</p>
            </div>
            <div className={styles.statItem}>
              <p className={styles.incorrectText}>{`${question.incorrectAttempts} people Incorrect`}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QAQuizAnalysis;
