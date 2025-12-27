
import React, { useState } from 'react';
import { User, UserRole } from '../types';

const UsersManagement: React.FC<{ user: User }> = () => {
  const [users, setUsers] = useState([
    { id: '1', name: 'Dr. Alejandro Soto', role: UserRole.ADMIN, status: 'Activo', email: 'director@misionboston.edu' },
    { id: '2', name: 'Marta Lucia Rivas', role: UserRole.TEACHER, status: 'Activo', email: 'marta.rivas@misionboston.edu' },
    { id: '3', name: 'Carlos Mario Ruiz', role: UserRole.PARENT, status: 'Activo', email: 'cruiz@gmail.com' },
    { id: '4', name: 'Ana Maria Lopez', role: UserRole.ADMINISTRATIVE, status: 'Inactivo', email: 'alopez@misionboston.edu' },
  ]);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Gestión de Usuarios</h2>
          <p className="text-gray-500 font-medium">Control de accesos y roles institucionales.</p>
        </div>
        <button className="bg-royal-blue text-white px-6 py-3 rounded-2xl font-black hover:bg-blue-800 transition-all shadow-xl flex items-center space-x-2 transform active:scale-95">
          <span>+</span>
          <span>Nuevo Usuario</span>
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Nombre Completo</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Rol</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Email</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Estado</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center font-black text-gray-400 group-hover:bg-royal-blue group-hover:text-white transition-all">
                        {u.name.charAt(0)}
                      </div>
                      <span className="font-black text-gray-800">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-black px-3 py-1 bg-blue-50 text-royal-blue rounded-lg uppercase">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm text-gray-500 font-medium">{u.email}</td>
                  <td className="px-8 py-6">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${u.status === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="text-royal-blue font-black text-xs hover:underline mr-4">Editar</button>
                    <button className="text-red-500 font-black text-xs hover:underline">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersManagement;
