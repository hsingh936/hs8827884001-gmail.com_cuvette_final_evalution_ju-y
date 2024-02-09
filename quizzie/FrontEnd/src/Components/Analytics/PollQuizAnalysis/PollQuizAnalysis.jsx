import React from 'react';
import styles from './PollQuizAnalysis.module.css';

const PollQuizAnalysis = ({ quiz }) => {
  if (!quiz) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.quizAnalysisContainer}>
      <h2 className={styles.quizAnalysisTitle}>{`Poll ${quiz.quizName} Question Analysis`}</h2>
      <div className={styles.metadataContainer}>
          <p className={styles.metadataText}>{`Created on: ${new Date(quiz.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}</p>
          <p className={styles.metadataText}>{`Impressions: ${quiz.views}`}</p>
      </div>
      {quiz.questions.map((question, questionIndex) => (
        <div key={questionIndex} className={styles.questionContainer}>
          <p className={styles.questionText}>{`Q.${question.questionNumber} ${question.text}`}</p>

          <ul className={styles.attemptList}>
            {quiz.attempts && quiz.attempts.map((attempt, attemptIndex) => (
              <li key={attemptIndex} className={styles.attemptItem}>
                {attempt.answers && attempt.answers.map((answer, answerIndex) => (
                  answer.questionId === question._id && (
                    <p key={answerIndex}>
                      {`Attempt ${attemptIndex + 1}: Selected Option - ${answer.selectedOption}`}
                    </p>
                  )
                ))}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PollQuizAnalysis;
