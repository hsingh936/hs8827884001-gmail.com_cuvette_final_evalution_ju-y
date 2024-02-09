import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './Components/LoginSignup/Signup';
import Login from './Components/LoginSignup/Login';
import Dashboard from './Components/Dashboard/Dashboard';
import Analytics from './Components/Analytics/Analytics';
import CreateQuiz from './Components/CreateQuiz/CreateQuizMainForm';
import QuizContent from './Components/QuizContent/Quiz';

function App() {
  const [activePage, setActivePage] = useState('signup');
  const [userId, setUserId] = useState(null); 

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Signup setActivePage={setActivePage} />} />
          <Route path="/Signup" element={<Signup setActivePage={setActivePage} />} />
          <Route path="/login" element={<Login setActivePage={setActivePage} setUserId={setUserId} />} />
          <Route path="/dashboard" element={<Dashboard />} userId={userId} />
          <Route path="/analytics" element={<Analytics />} userId={userId} />
          <Route path="/create-quiz" element={<CreateQuiz userId={userId} />} />
          <Route path="/quiz/:quizId" element={<QuizContent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
