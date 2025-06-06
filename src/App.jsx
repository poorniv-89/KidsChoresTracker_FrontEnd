import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import './App.css'
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import ParentDashboardPage from './pages/ParentDashboardPage';
import ChildDashboardPage from './pages/ChildDashboardPage';
import ChoreManagementPage from './pages/ChoreManagementPage';
import RewardsPage from './pages/RewardsPage';
import HowItWorksPage from './pages/HowItWorksPage';
import NotFoundPage from './pages/NotFoundPage';
import AboutPage from './pages/AboutPage';
import Nav from './components/Nav';

function App() {

  return (
    <>
    <Nav/>
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/parent-dashboard" element={<ParentDashboardPage />} />
        <Route path="/child-dashboard" element={<ChildDashboardPage />} />
        <Route path="/chores" element={<ChoreManagementPage />} />
        <Route path="/rewards" element={<RewardsPage />} />
        <Route path="/about" element={<AboutPage/>}/>
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App
