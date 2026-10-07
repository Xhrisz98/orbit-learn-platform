import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { RecruiterDashboard } from './components/recruiter/RecruiterDashboard';
import { CandidatePortal } from './components/candidate/CandidatePortal';

const AppContent: React.FC = () => {
  const { activeRole } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f8fc] text-[#10243e]">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeRole === 'recruiter' ? <RecruiterDashboard /> : <CandidatePortal />}
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
