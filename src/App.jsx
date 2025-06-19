import { Routes, Route } from 'react-router-dom';
import './App.css';

import Nav from './components/Nav';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import ParentDashboardPage from './pages/ParentDashboardPage';
import ChildDashboardPage from './pages/ChildDashboardPage';
import ChoreManagementPage from './pages/ChoreManagementPage';
import RewardsPage from './pages/RewardsPage';
import HowItWorksPage from './pages/HowItWorksPage';
import NotFoundPage from './pages/NotFoundPage';
import AddKidPage from './pages/AddKid';
import MykidsPage from './pages/MyKidsPage';
import ChildHistoryPage from './pages/ChildHistoryPage';

function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/parent-dashboard" element={<ParentDashboardPage />} />
        
        {/* Child Dashboard (ID and Token-based access) */}
        <Route path="/child/:childId" element={<ChildDashboardPage />} />
        <Route path="/child/token/:token" element={<ChildDashboardPage />} />

        {/* Chore and Rewards Pages */}
        <Route path="/chores" element={<ChoreManagementPage />} />
        <Route path="/rewards" element={<RewardsPage />} />

        {/* Informational Pages */}
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/add-kid" element={<AddKidPage />} />
        <Route path="/my-kids" element={<MykidsPage />} />

        {/* Child History (ID and Token-based access) */}
        <Route path="/child/:childId/history" element={<ChildHistoryPage />} />
        <Route path="/child/token/:token/history" element={<ChildHistoryPage />} />

        {/* 404 Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
