
import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { User, UserRole } from '../types';
import { Logo } from '../constants';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { label: 'Inicio', path: '/dashboard', icon: '🏠', roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.PARENT, UserRole.ADMINISTRATIVE] },
    { label: 'Notas y Boletines', path: '/dashboard/grades', icon: '📝', roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.PARENT] },
    { label: 'Matrículas', path: '/dashboard/enrollment', icon: '🎓', roles: [UserRole.ADMIN, UserRole.ADMINISTRATIVE, UserRole.PARENT] },
    { label: 'Pagos y Cartera', path: '/dashboard/payments', icon: '💰', roles: [UserRole.ADMIN, UserRole.ADMINISTRATIVE, UserRole.PARENT] },
    { label: 'Gestión Cursos', path: '/dashboard/courses', icon: '🏫', roles: [UserRole.ADMIN, UserRole.ADMINISTRATIVE, UserRole.TEACHER] },
    { label: 'Usuarios', path: '/dashboard/users', icon: '👥', roles: [UserRole.ADMIN] },
  ];

  const activeMenu = menuItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className={`bg-royal-blue text-white w-72 flex-shrink-0 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-72 absolute h-full z-40'}`}>
        <div className="p-8 flex items-center space-x-4 border-b border-blue-900/50">
          <Logo className="w-12 h-12 border-white bg-white shadow-lg" />
          <div className="overflow-hidden">
            <h1 className="text-base font-black truncate">Misión Boston</h1>
            <p className="text-[9px] text-school-yellow uppercase font-bold tracking-[0.2em]">Sede Principal</p>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar">
          {activeMenu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-200 ${
                location.pathname === item.path ? 'bg-white text-royal-blue font-black shadow-xl scale-[1.02]' : 'hover:bg-blue-800/50 text-blue-100 font-medium'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6">
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-3 px-5 py-4 rounded-2xl bg-red-500/10 hover:bg-red-500 transition-all group text-red-200 hover:text-white"
          >
            <span className="text-xl">🚪</span>
            <span className="font-bold text-sm">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white/80 backdrop-blur-md h-20 flex items-center justify-between px-10 border-b border-gray-100 z-10">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-royal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          </button>
          
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-sm font-black text-gray-900 leading-none">{user.name}</p>
              <p className="text-[10px] text-royal-blue font-bold uppercase mt-1 tracking-widest">{user.role}</p>
            </div>
            <div className="w-12 h-12 bg-royal-blue rounded-2xl shadow-lg border-2 border-white flex items-center justify-center text-white font-black text-xl overflow-hidden ring-4 ring-blue-50">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 bg-gray-50/50">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export const DashboardHome: React.FC<{ user: User }> = ({ user }) => (
  <div className="space-y-10 animate-fadeIn">
    <div className="relative bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden group">
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-royal-blue/5 rounded-full group-hover:scale-110 transition-transform duration-700"></div>
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight italic">¡Buen día, {user.name.split(' ')[0]}!</h2>
          <p className="text-gray-500 mt-3 text-lg font-medium">Panel de Control Académico • Periodo 2024</p>
          <div className="flex items-center mt-6 space-x-4">
             <span className="bg-school-yellow text-royal-blue px-4 py-1.5 rounded-full font-black text-xs uppercase shadow-sm">Sabiduría</span>
             <span className="bg-royal-blue text-white px-4 py-1.5 rounded-full font-black text-xs uppercase shadow-sm">Fe</span>
             <span className="bg-blue-50 text-royal-blue px-4 py-1.5 rounded-full font-black text-xs uppercase">Amor</span>
          </div>
        </div>
        <div className="bg-white border-4 border-royal-blue/10 p-6 rounded-[2rem] shadow-xl flex flex-col items-center min-w-[160px]">
          <span className="text-4xl mb-2">🗓️</span>
          <p className="text-xs font-black text-royal-blue uppercase tracking-widest">{new Date().toLocaleDateString('es-ES', { weekday: 'long' })}</p>
          <p className="text-2xl font-black text-gray-900 mt-1">{new Date().getDate()}</p>
          <p className="text-xs font-bold text-gray-400 uppercase">{new Date().toLocaleDateString('es-ES', { month: 'short' })}</p>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <StatCard title="Rendimiento" value="94%" icon="📈" color="bg-green-500" />
      <StatCard title="Pagos" value="Al día" icon="🛡️" color="bg-royal-blue" />
      <StatCard title="Inasistencia" value="2" icon="⏳" color="bg-school-yellow" textColor="text-royal-blue" />
    </div>
    
    <div className="grid lg:grid-cols-2 gap-10">
       <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
         <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center">
           <span className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mr-4 text-xl">🔔</span>
           Noticias de la Semana
         </h3>
         <div className="space-y-6">
           <NotificationItem title="Escuela de Padres" time="Hoy" desc="Transformando familias con amor cristiano. Auditorio 4:00 PM." />
           <NotificationItem title="Nivelaciones" time="Mañana" desc="Inician las jornadas extraordinarias del primer periodo." />
         </div>
       </div>

       <div className="bg-royal-blue p-10 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 text-[10rem] font-black -mb-10 -mr-10 leading-none select-none">MB</div>
          <h3 className="text-2xl font-black mb-8 flex items-center">
            <span className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mr-4 text-xl">📚</span>
            Agenda de Hoy
          </h3>
          <div className="space-y-5">
             <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                <span className="font-bold">Dirección de Curso</span>
                <span className="text-xs font-bold text-school-yellow">07:00 AM</span>
             </div>
             <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors border border-white/10">
                <span className="font-bold">Capilla Semanal</span>
                <span className="text-xs font-bold text-school-yellow">09:15 AM</span>
             </div>
          </div>
       </div>
    </div>
  </div>
);

const StatCard = ({ title, value, icon, color, textColor = "text-white" }: any) => (
  <div className={`p-8 rounded-[2rem] shadow-sm ${color} ${textColor} transform hover:translate-y-[-5px] transition-all duration-300 cursor-default group overflow-hidden relative`}>
    <div className="absolute right-[-10px] bottom-[-10px] text-6xl opacity-20 group-hover:scale-125 transition-transform">{icon}</div>
    <p className="text-xs font-black uppercase opacity-70 tracking-widest">{title}</p>
    <p className="text-4xl font-black mt-3 tracking-tighter">{value}</p>
  </div>
);

const NotificationItem = ({ title, time, desc }: any) => (
  <div className="group flex items-start space-x-5 p-5 hover:bg-gray-50 rounded-3xl transition-all border border-transparent hover:border-gray-100">
    <div className="w-3 h-3 mt-2 rounded-full bg-royal-blue group-hover:scale-150 transition-transform"></div>
    <div className="flex-1">
      <div className="flex justify-between items-baseline mb-1">
        <h4 className="font-black text-gray-800 tracking-tight">{title}</h4>
        <span className="text-[10px] text-royal-blue font-black uppercase">{time}</span>
      </div>
      <p className="text-sm text-gray-500 font-medium leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default Dashboard;
