import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Role, Student, Assignment, Tutor, Booking, PermissionSlip, ChatThread } from '../types';
import {
  initialStudents,
  initialAssignments,
  initialTutors,
  initialBookings,
  initialPermissionSlips,
  initialThreads,
} from '../data/mockData';
import { translations } from '../i18n/translations';
import type { Language } from '../i18n/translations';


interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['en'];
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  currentView: 'dashboard' | 'marketplace' | 'compliance' | 'messages' | 'landing';
  setCurrentView: (view: 'dashboard' | 'marketplace' | 'compliance' | 'messages' | 'landing') => void;
  activeStudentId: string;
  setActiveStudentId: (id: string) => void;
  students: Student[];
  assignments: Assignment[];
  tutors: Tutor[];
  bookings: Booking[];
  permissionSlips: PermissionSlip[];
  threads: ChatThread[];
  isSyncing: boolean;
  lastSyncedText: string;
  syncWithLMS: () => void;
  createBooking: (tutorId: string, studentId: string, date: string, timeSlot: string) => void;
  signPermissionSlip: (slipId: string, signerName: string, signatureCanvasData?: string) => void;
  submitAssignment: (assignmentId: string, fileName: string) => void;
  addAssignment: (newAssignment: Omit<Assignment, 'id'>) => void;
  sendMessage: (threadId: string, content: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('orbit_lang') as Language;
    return saved === 'es' || saved === 'en' ? saved : 'en'; // English is default
  });

  const [activeRole, setActiveRole] = useState<Role>('parent');
  const [currentView, setCurrentView] = useState<'dashboard' | 'marketplace' | 'compliance' | 'messages' | 'landing'>('dashboard');
  const [activeStudentId, setActiveStudentId] = useState<string>('all');
  
  const [students] = useState<Student[]>(initialStudents);
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('orbit_assignments');
    return saved ? JSON.parse(saved) : initialAssignments;
  });
  const [tutors] = useState<Tutor[]>(initialTutors);
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('orbit_bookings');
    return saved ? JSON.parse(saved) : initialBookings;
  });
  const [permissionSlips, setPermissionSlips] = useState<PermissionSlip[]>(() => {
    const saved = localStorage.getItem('orbit_slips');
    return saved ? JSON.parse(saved) : initialPermissionSlips;
  });
  const [threads, setThreads] = useState<ChatThread[]>(() => {
    const saved = localStorage.getItem('orbit_threads');
    return saved ? JSON.parse(saved) : initialThreads;
  });

  const t = translations[language];

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('orbit_lang', lang);
  };

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedText, setLastSyncedText] = useState<string>(() =>
    language === 'en' ? 'Synced today at 10:30 AM' : 'Sincronizado hoy a las 10:30 AM'
  );

  useEffect(() => {
    localStorage.setItem('orbit_assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('orbit_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('orbit_slips', JSON.stringify(permissionSlips));
  }, [permissionSlips]);

  useEffect(() => {
    localStorage.setItem('orbit_threads', JSON.stringify(threads));
  }, [threads]);

  const syncWithLMS = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastSyncedText(
        language === 'en'
          ? `Synced just now (${time}) with Google Classroom & Canvas`
          : `Sincronizado recién (${time}) con Google Classroom y Canvas`
      );
    }, 1100);
  };

  const createBooking = (tutorId: string, studentId: string, date: string, timeSlot: string) => {
    const tutor = tutors.find(t => t.id === tutorId);
    const student = students.find(s => s.id === studentId);
    if (!tutor || !student) return;

    const newBooking: Booking = {
      id: `b-${Date.now()}`,
      tutorId,
      tutorName: tutor.name,
      studentId,
      studentName: student.name,
      subject: tutor.subjects[0] || (language === 'en' ? 'General Tutoring' : 'Tutoría General'),
      date,
      timeSlot,
      hourlyRate: tutor.hourlyRate,
      status: 'confirmed',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setBookings(prev => [newBooking, ...prev]);
  };

  const signPermissionSlip = (slipId: string, signerName: string, signatureCanvasData?: string) => {
    setPermissionSlips(prev =>
      prev.map(slip => {
        if (slip.id === slipId) {
          return {
            ...slip,
            status: 'signed',
            signedBy: signerName || (language === 'en' ? 'Mark Miller (Parent)' : 'Mark Miller (Padre)'),
            signedAt: new Date().toLocaleString(),
            signatureData: signatureCanvasData,
            ferpaAuditId: `FERPA-AUDIT-${Math.floor(1000 + Math.random() * 9000)}-WVH`,
          };
        }
        return slip;
      })
    );
  };

  const submitAssignment = (assignmentId: string, fileName: string) => {
    setAssignments(prev =>
      prev.map(a => {
        if (a.id === assignmentId) {
          return {
            ...a,
            status: 'submitted',
            submittedFile: fileName,
          };
        }
        return a;
      })
    );
  };

  const addAssignment = (newAssignment: Omit<Assignment, 'id'>) => {
    const created: Assignment = {
      ...newAssignment,
      id: `a-${Date.now()}`,
    };
    setAssignments(prev => [created, ...prev]);
  };

  const sendMessage = (threadId: string, content: string) => {
    if (!content.trim()) return;
    setThreads(prev =>
      prev.map(thread => {
        if (thread.id === threadId) {
          const newMsg = {
            id: `msg-${Date.now()}`,
            senderName: activeRole === 'parent' ? 'Mark Miller' : (language === 'en' ? 'User' : 'Usuario'),
            senderRole: activeRole === 'parent' ? t.roles.parent : t.roles[activeRole],
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
            content,
            timestamp: language === 'en' ? 'Just now' : 'Ahora',
            isCurrentUser: true,
          };
          return {
            ...thread,
            lastMessage: content,
            lastTimestamp: language === 'en' ? 'Just now' : 'Ahora',
            messages: [...thread.messages, newMsg],
          };
        }
        return thread;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        activeRole,
        setActiveRole,
        currentView,
        setCurrentView,
        activeStudentId,
        setActiveStudentId,
        students,
        assignments,
        tutors,
        bookings,
        permissionSlips,
        threads,
        isSyncing,
        lastSyncedText,
        syncWithLMS,
        createBooking,
        signPermissionSlip,
        submitAssignment,
        addAssignment,
        sendMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
