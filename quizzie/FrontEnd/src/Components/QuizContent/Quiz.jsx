import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PollContentPage from './QuizPollContent/QuizPollContent';
import QaQuizContentPage from './QuizQAContent/QuizQAContent';

const Quiz = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`https://quizapi-nine.vercel.app/quiz/${quizId}`);
        setQuiz(response.data.quiz);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.error || 'An error occurred');
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!quiz) {
    return <div>Quiz not found</div>;
  }

  return (
    <div>
      {quiz.quizType === 'Poll Type' ? (
        <PollContentPage quiz={quiz} />
      ) : quiz.quizType === 'Q&A' ? (
        <QaQuizContentPage quiz={quiz} />
      ) : (
        <div>Unsupported quiz type</div>
      )}
    </div>
  );
};

export default Quiz;
