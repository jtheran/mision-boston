
import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../constants';

const Unauthorized: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8 animate-fadeIn">
        <div className="relative inline-block">
          <Logo className="w-32 h-32 mx-auto opacity-20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-7xl">🚫</span>
          </div>
        </div>
        
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>
          <h2 className="text-3xl font-black text-gray-900 italic mb-4">Acceso Restringido</h2>
          <p className="text-gray-500 font-medium leading-relaxed">
            Lo sentimos, no tienes los permisos necesarios para acceder a esta sección de la plataforma académica.
          </p>
          
          <div className="mt-8 p-4 bg-red-50 rounded-2xl border border-red-100">
            <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">Seguridad Misión Boston</p>
            <p className="text-xs font-bold text-gray-400 mt-1">Este intento ha sido registrado por motivos de seguridad institucional.</p>
          </div>
          
          <Link 
            to="/dashboard" 
            className="mt-8 w-full bg-royal-blue text-white py-4 rounded-2xl font-black shadow-xl hover:bg-blue-800 transition-all transform active:scale-95 inline-block uppercase text-sm tracking-widest"
          >
            Volver al Inicio Seguro
          </Link>
        </div>
        
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">
          Sabiduría • Fe • Amor
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;
