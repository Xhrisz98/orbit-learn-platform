import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ParentDashboard } from './components/parent/ParentDashboard';
import { StudentDashboard } from './components/student/StudentDashboard';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { TutorDashboard } from './components/tutor/TutorDashboard';
import { MarketplaceView } from './components/marketplace/MarketplaceView';
import { ComplianceView } from './components/compliance/ComplianceView';
import { MessagesView } from './components/messages/MessagesView';
import { LandingPage } from './components/landing/LandingPage';

const AppContent: React.FC = () => {
  const { currentView, activeRole } = useApp();

  const renderDashboardByRole = () => {
    switch (activeRole) {
      case 'student':
        return <StudentDashboard />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'tutor':
        return <TutorDashboard />;
      case 'parent':
      default:
        return <ParentDashboard />;
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage />;
      case 'marketplace':
        return <MarketplaceView />;
      case 'compliance':
        return <ComplianceView />;
      case 'messages':
        return <MessagesView />;
      case 'dashboard':
      default:
        return renderDashboardByRole();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F3]">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
