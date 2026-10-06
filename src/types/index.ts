export type Role = 'parent' | 'student' | 'teacher' | 'tutor';

export interface Student {
  id: string;
  name: string;
  grade: string;
  school: string;
  avatar: string;
  lmsConnected: ('Google Classroom' | 'Canvas' | 'Schoology')[];
  gpa?: string;
}

export interface Assignment {
  id: string;
  studentId: string;
  studentName: string;
  title: string;
  subject: string;
  dueDate: string;
  dueTime?: string;
  sourceLms: 'Google Classroom' | 'Canvas' | 'Schoology' | 'Direct Upload';
  status: 'missing' | 'due-soon' | 'submitted' | 'graded';
  grade?: string;
  instructions?: string;
  submittedFile?: string;
  teacherName?: string;
}

export interface Tutor {
  id: string;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  hourlyRate: number;
  subjects: string[];
  education: string;
  isVerified: boolean;
  backgroundChecked: boolean;
  nextAvailable: string;
  bio: string;
  location: string;
  availableSlots: string[];
}

export interface Booking {
  id: string;
  tutorId: string;
  tutorName: string;
  studentId: string;
  studentName: string;
  subject: string;
  date: string;
  timeSlot: string;
  hourlyRate: number;
  status: 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface PermissionSlip {
  id: string;
  studentId: string;
  studentName: string;
  title: string;
  description: string;
  issuer: string;
  school: string;
  deadline: string;
  status: 'pending' | 'signed';
  signedBy?: string;
  signedAt?: string;
  signatureData?: string;
  ferpaAuditId?: string;
}

export interface ChatMessage {
  id: string;
  senderName: string;
  senderRole: string;
  avatar: string;
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
}

export interface ChatThread {
  id: string;
  recipientName: string;
  recipientRole: string;
  studentTag?: string;
  avatar: string;
  unreadCount: number;
  lastMessage: string;
  lastTimestamp: string;
  messages: ChatMessage[];
}
