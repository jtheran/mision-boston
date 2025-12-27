
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard, { DashboardHome } from './pages/Dashboard';
import Admissions from './pages/Admissions';
import AboutUs from './pages/AboutUs';
import GradesManagement from './pages/GradesManagement';
import Enrollment from './pages/Enrollment';
import Payments from './pages/Payments';
import UsersManagement from './pages/UsersManagement';
import CoursesManagement from './pages/CoursesManagement';
import Unauthorized from './pages/Unauthorized';
import { User, UserRole } from './types';

// Componente para proteger rutas por rol
const RoleGuard: React.FC<{ user: User | null, allowedRoles: UserRole[], children: React.ReactElement }> = ({ user, allowedRoles, children }) => {
  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" />;
  return children;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('mb_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('mb_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('mb_user');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/admisiones" element={<Admissions />} />
        <Route path="/nosotros" element={<AboutUs />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* Dashboard con Rutas Hijas Protegidas */}
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        >
          {/* Inicio: Todos los roles */}
          <Route index element={<DashboardHome user={user!} />} />
          
          {/* Notas: Admin, Teacher, Parent */}
          <Route path="grades" element={
            <RoleGuard user={user} allowedRoles={[UserRole.ADMIN, UserRole.TEACHER, UserRole.PARENT]}>
              <GradesManagement user={user!} />
            </RoleGuard>
          } />
          
          {/* Matrículas: Admin, Adminis, Parent */}
          <Route path="enrollment" element={
            <RoleGuard user={user} allowedRoles={[UserRole.ADMIN, UserRole.ADMINISTRATIVE, UserRole.PARENT]}>
              <Enrollment user={user!} />
            </RoleGuard>
          } />
          
          {/* Pagos: Admin, Adminis, Parent */}
          <Route path="payments" element={
            <RoleGuard user={user} allowedRoles={[UserRole.ADMIN, UserRole.ADMINISTRATIVE, UserRole.PARENT]}>
              <Payments user={user!} />
            </RoleGuard>
          } />
          
          {/* Gestión Cursos: Admin, Adminis, Teacher */}
          <Route path="courses" element={
            <RoleGuard user={user} allowedRoles={[UserRole.ADMIN, UserRole.ADMINISTRATIVE, UserRole.TEACHER]}>
              <CoursesManagement user={user!} />
            </RoleGuard>
          } />
          
          {/* Usuarios: Solo Admin */}
          <Route path="users" element={
            <RoleGuard user={user} allowedRoles={[UserRole.ADMIN]}>
              <UsersManagement user={user!} />
            </RoleGuard>
          } />
        </Route>
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
