
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../constants';
import { UserRole, User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.PARENT);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = 'El correo es obligatorio';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Correo inválido';
    
    if (!password) newErrors.password = 'La contraseña es obligatoria';
    else if (password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: role === UserRole.ADMIN ? 'Super Admin' : 
            role === UserRole.TEACHER ? 'Prof. Juan Pérez' : 
            role === UserRole.ADMINISTRATIVE ? 'Secretaria Clara' : 'Padre Familia',
      email: email,
      role: role,
    };
    onLogin(mockUser);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-royal-blue px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden p-8">
        <div className="text-center mb-10">
          <Logo className="mx-auto w-24 h-24 mb-6" />
          <h2 className="text-3xl font-extrabold text-royal-blue">Iniciar Sesión</h2>
          <p className="text-gray-500 mt-2 text-sm uppercase tracking-wider font-semibold">Portal Misión Boston</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Rol de Acceso</label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-royal-blue outline-none transition bg-gray-50 font-bold text-gray-900"
            >
              <option value={UserRole.PARENT} className="text-gray-900">Padre de Familia / Estudiante</option>
              <option value={UserRole.TEACHER} className="text-gray-900">Profesor</option>
              <option value={UserRole.ADMINISTRATIVE} className="text-gray-900">Administrativo</option>
              <option value={UserRole.ADMIN} className="text-gray-900">Administrador Sistema</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Correo Electrónico</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 outline-none transition text-gray-900 ${errors.email ? 'border-red-500 ring-red-100' : 'focus:ring-royal-blue border-gray-200'}`}
              placeholder="ejemplo@misionboston.edu"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Contraseña</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 outline-none transition text-gray-900 ${errors.password ? 'border-red-500 ring-red-100' : 'focus:ring-royal-blue border-gray-200'}`}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>}
          </div>

          <button 
            type="submit" 
            className="w-full bg-royal-blue text-white py-3.5 rounded-xl font-bold hover:bg-blue-800 transition shadow-lg transform active:scale-95 flex items-center justify-center space-x-2"
          >
            <span>Ingresar al Portal</span>
            <span className="text-xl">→</span>
          </button>
        </form>

        <div className="mt-8 text-center">
          <button className="text-royal-blue text-sm font-semibold hover:underline">¿Problemas para acceder?</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
