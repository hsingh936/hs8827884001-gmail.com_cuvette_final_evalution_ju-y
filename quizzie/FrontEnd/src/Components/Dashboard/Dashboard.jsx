import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import Sidebar from '../Sidebar/Sidebar';
import axios from 'axios';
import eyesicon from '../../images/eyes.png';

const formatImpressionCount = (count) => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  } else {
    return count.toString();
  }
};

const Dashboard = ({ userId }) => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const response = await axios.get(`https://quizzieapi.vercel.app/quiz/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          params: {
            sortBy: 'createdAt',
          },
        });
        setQuizzes(response.data.quizzes);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };

    fetchQuizzes();
  }, [userId]);

  const totalQuestions = quizzes.reduce((total, quiz) => total + quiz.questions.length, 0);
  const totalimpression = quizzes.reduce((total, quiz) => total + quiz.views, 0);

  return (
    <div className={styles.mainContainer}>
      <Sidebar />
      <div className={styles.right}>
        <div className={styles.dashboardscreen}>
          <div className={styles.dashboardheader}>
            <div className={styles.totalquiz}>
              <div className={styles.totalquizcreated}>{quizzes.length}</div>
              Quiz Created
            </div>

            <div className={styles.totalquestion}>
              <div className={styles.totalquestioncreated}>{totalQuestions}</div>
              Question Created
            </div>

            <div className={styles.totalimpression}>
              <div className={styles.totalimpressioncreated}>
                {formatImpressionCount(totalimpression)}
              </div>
              Total Impression
            </div>
          </div>

          <div>
            <h2>Trending Quizzes</h2>
            <div className={styles.trendingquizcontainer}>
              {quizzes.length === 0 ? (
                <p className={styles.createfirstquizPls}>
                  You haven't created any quizzes. Click on Create Quiz to create your first quiz.
                </p>
              ) : (
                quizzes.map((quiz) => (
                  <div key={quiz._id} className={styles.quizItem}>
                    <div className={styles.NameImp}>
                      <p className={styles.quizName}>{quiz.quizName}</p>
                      <div className={styles.quizimpression}>
                        {formatImpressionCount(quiz.views)}
                        <img src={eyesicon} alt='' />
                      </div>
                    </div>

                    <p className={styles.createdOn}>
                      Created on: {new Date(quiz.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
