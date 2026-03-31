import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import Authentication from './pages/Authentication';
import { AuthProvider } from './context/Authcontext';
import Jobposting from './pages/Jobposting.jsx';
import Profile from './pages/Profile.jsx';
import SearchJob from './pages/SearchJob.jsx';
import ApplyJob from './pages/ApplyJob.jsx';
import MyPostedJobs from './pages/MyPostedJobs.jsx';
import ResumeAnalyzer from './pages/ResumeAnalyzer.jsx';
import Navbar from './pages/Navbar.jsx';
import AnalyzeCandidates from './pages/AnalyzedCandidates.jsx';

function App() {
  return (
    <Router>
      
      <AuthProvider>
        <Navbar/>
       
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Authentication />} />
          <Route path="/register" element={<Authentication />} />
         
          <Route path="/post-job" element={<Jobposting/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/search" element={<SearchJob/>}/>
          <Route path="/apply/:jobId" element={<ApplyJob />} />

          {/* ✅ FIX 1: proper route for My Jobs */}
          <Route path="/my-jobs" element={<MyPostedJobs />} />

          {/* ✅ FIX 2: keep old route also (no break) */}
          <Route path="/user/:userId" element={<MyPostedJobs />} />

          <Route path="/check-resume-score" element={<ResumeAnalyzer/>}/>
          <Route path="/analyze/:jobId" element={<AnalyzeCandidates/>}/>
        </Routes>

      </AuthProvider>
    </Router>
  );
}

export default App;