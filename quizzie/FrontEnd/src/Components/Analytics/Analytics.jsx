import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../Sidebar/Sidebar';
import styles from './Analytics.module.css';
import DeleteConfirmation from './DeleteConfirmation/Delete';
import QAQuizAnalysis from './QAQuizAnalysis/QAQuizAnalysis';
import PollQuizAnalysis from './PollQuizAnalysis/PollQuizAnalysis';
import EditQuiz from './QuizEdit/QuizEdit';
import edit from '../../images/edit.png'
import deleteImg from '../../images/delete.png'
import shareImg from '../../images/share.png'


const AnalyticsPage = ({ userId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showQuizTypeAnalysis, setShowQuizTypeAnalysis] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editQuizData, setEditQuizData] = useState(null);

  const fetchQuizzes = useCallback(async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await axios.get(`https://quizapi-f5wf.onrender.com/quiz/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setQuizzes(response.data.quizzes);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  }, [userId]);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  const handleEdit = (quizId) => {
    const selected = quizzes.find((quiz) => quiz.quizId === quizId);
    setEditQuizData(selected);
    setIsEditing(true);
  };

  const handleDelete = (quizId) => {
    setQuizToDelete(quizId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      await axios.delete(`https://quizapi-f5wf.onrender.com/quiz/${quizToDelete}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log('Quiz deleted successfully');
      setShowDeleteModal(false);
      fetchQuizzes();
    } catch (error) {
      console.error('Error deleting quiz:', error);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setQuizToDelete(null);
  };

  const handleShare = (quizId) => {
    const quizLink = `${window.location.origin}/quiz/${quizId}`;

    navigator.clipboard.writeText(quizLink).then(() => {
      toast.success('Link copied to clipboard');
    });
  };

  const handleQuestionAnalysis = (quiz) => {
    setSelectedQuiz(quiz);
    setShowQuizTypeAnalysis(true);
  };

  const handleBackToGeneralAnalytics = () => {
    setSelectedQuiz(null);
    setShowQuizTypeAnalysis(false);
  };

  const handleEditQuizClose = () => {
    setIsEditing(false);
    setEditQuizData(null);
  };

  const formatDate = (date) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className={styles.mainContainer}>
      <Sidebar />
      <div className={styles.analyticsScreen}>
        {isEditing ? (
          <EditQuiz quiz={editQuizData} onClose={handleEditQuizClose} />
        ) : (
          <>
            {showQuizTypeAnalysis && selectedQuiz ? (
              <>
                {selectedQuiz.quizType === 'Q&A' ? (
                  <QAQuizAnalysis quiz={selectedQuiz} />
                ) : (
                  <PollQuizAnalysis quiz={selectedQuiz} />
                )}
                <button onClick={handleBackToGeneralAnalytics}>Back to General Analytics</button>
              </>
            ) : (
              <>
                <h1 className={styles.analyticsHeading}>Quiz Analytics</h1>
                <table className={styles.analyticsTable}>
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Quiz Name</th>
                      <th>Created on</th>
                      <th>Impression</th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizzes.map((quiz, index) => (
                      <tr key={quiz.quizId}>
                        <td>{index + 1}</td>
                        <td>{quiz.quizName}</td>
                        <td>{formatDate(new Date(quiz.createdAt))}</td>
                        <td>{quiz.views}</td>
                        <td>
                          <button className={styles.edit} onClick={() => handleEdit(quiz.quizId)}>
                            <img src={edit} alt="" />
                          </button>
                        </td>
                        <td>
                          <button className={styles.delete} onClick={() => handleDelete(quiz.quizId)}>
                            <img src={deleteImg} alt="" />
                          </button>
                        </td>
                        <td>
                          <button className={styles.share} onClick={() => handleShare(quiz.quizId)}>
                            <img src={shareImg} alt="" />
                          </button>
                        </td>
                        <td>
                          <button className={styles.AnalSisBtn} onClick={() => handleQuestionAnalysis(quiz)}>Question Wise Analysis</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </>
        )}
      </div>
      {showDeleteModal && (
        <DeleteConfirmation
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AnalyticsPage;
