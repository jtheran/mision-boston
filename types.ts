
export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  PARENT = 'PARENT',
  ADMINISTRATIVE = 'ADMINISTRATIVE'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  assignedStudents?: string[]; // IDs de los hijos para el rol PARENT
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  parentEmail: string;
  generalRank: number;
  totalStudentsInCourse: number;
}

export interface GradeEntry {
  studentId: string;
  subject: string;
  score: number;
  period: number;
  subjectRank?: number; // Puesto en la materia
  history?: number[];   // Notas de periodos anteriores para gráficas
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'Evento' | 'Noticia' | 'Circular';
  image?: string;
}

export interface PaymentRecord {
  id: string;
  studentId: string;
  concept: string;
  amount: number;
  status: 'PAID' | 'PENDING';
  date: string;
}
