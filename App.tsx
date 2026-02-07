
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Static Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OnboardingFlow from './pages/OnboardingFlow';
import UserProfileSettings from './pages/UserProfileSettings';

// Client Pages
import ClientDashboard from './pages/ClientDashboard';
import WorkflowRequestForm from './pages/WorkflowRequestForm';
import KnowledgeBaseLibrary from './pages/KnowledgeBaseLibrary';
import ClientAddons from './pages/ClientAddons';
import ClientConnectedAccounts from './pages/ClientConnectedAccounts';
import ClientConversations from './pages/ClientConversations';
import ClientAnalytics from './pages/ClientAnalytics';
import ClientSettings from './pages/ClientSettings';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminWorkflowFulfillment from './pages/AdminWorkflowFulfillment';
import AdminAllClients from './pages/AdminAllClients';
import AdminWorkflowRequests from './pages/AdminWorkflowRequests';
import AdminSystemWorkflows from './pages/AdminSystemWorkflows';
import AdminPlatformAnalytics from './pages/AdminPlatformAnalytics';
import AdminSettings from './pages/AdminSettings';

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogin = (adminStatus: boolean) => {
    setIsAdmin(adminStatus);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsSidebarOpen(false);
  };

  return (
    <HashRouter>
      <div className="flex min-h-screen bg-background-light dark:bg-background-dark overflow-x-hidden">
        {isLoggedIn && (
          <>
            <button 
              onClick={() => setIsAdmin(!isAdmin)}
              className="fixed bottom-4 right-4 z-[9999] px-4 py-2 bg-primary text-background-dark rounded-full font-bold shadow-lg text-xs hover:scale-105 transition-transform"
            >
              {isAdmin ? 'Client' : 'Admin'} Mode
            </button>
            <Sidebar 
              isAdmin={isAdmin} 
              onLogout={handleLogout} 
              isOpen={isSidebarOpen} 
              onClose={() => setIsSidebarOpen(false)} 
            />
          </>
        )}
        
        <div className={`flex-1 flex flex-col min-w-0 ${isLoggedIn ? 'md:ml-64 lg:ml-72' : ''} transition-all duration-300`}>
          {isLoggedIn && (
            <Header 
              isAdmin={isAdmin} 
              onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
            />
          )}
          
          <main className={`flex-1 ${isLoggedIn ? 'logged-in p-4 md:p-8' : ''}`}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={!isLoggedIn ? <LandingPage /> : <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace />} />
              <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/onboarding" element={<OnboardingFlow />} />
              
              {/* Common Logged-in Routes */}
              <Route path="/profile" element={isLoggedIn ? <UserProfileSettings /> : <Navigate to="/login" replace />} />
              
              {/* Client Routes */}
              <Route path="/dashboard" element={isLoggedIn ? <ClientDashboard /> : <Navigate to="/login" replace />} />
              <Route path="/workflows/new" element={isLoggedIn ? <WorkflowRequestForm /> : <Navigate to="/login" replace />} />
              <Route path="/knowledge-bases" element={isLoggedIn ? <KnowledgeBaseLibrary /> : <Navigate to="/login" replace />} />
              <Route path="/addons" element={isLoggedIn ? <ClientAddons /> : <Navigate to="/login" replace />} />
              <Route path="/accounts" element={isLoggedIn ? <ClientConnectedAccounts /> : <Navigate to="/login" replace />} />
              <Route path="/conversations" element={isLoggedIn ? <ClientConversations /> : <Navigate to="/login" replace />} />
              <Route path="/analytics" element={isLoggedIn ? <ClientAnalytics /> : <Navigate to="/login" replace />} />
              <Route path="/settings" element={isLoggedIn ? <ClientSettings /> : <Navigate to="/login" replace />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={isLoggedIn && isAdmin ? <AdminDashboard /> : <Navigate to="/login" replace />} />
              <Route path="/admin/clients" element={isLoggedIn && isAdmin ? <AdminAllClients /> : <Navigate to="/login" replace />} />
              <Route path="/admin/requests" element={isLoggedIn && isAdmin ? <AdminWorkflowRequests /> : <Navigate to="/login" replace />} />
              <Route path="/admin/request/:id" element={isLoggedIn && isAdmin ? <AdminWorkflowFulfillment /> : <Navigate to="/login" replace />} />
              <Route path="/admin/system-workflows" element={isLoggedIn && isAdmin ? <AdminSystemWorkflows /> : <Navigate to="/login" replace />} />
              <Route path="/admin/platform-analytics" element={isLoggedIn && isAdmin ? <AdminPlatformAnalytics /> : <Navigate to="/login" replace />} />
              <Route path="/admin/settings" element={isLoggedIn && isAdmin ? <AdminSettings /> : <Navigate to="/login" replace />} />
              
              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
