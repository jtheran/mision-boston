
import React from 'react';
import { User, UserRole } from '../types';

const CoursesManagement: React.FC<{ user: User }> = ({ user }) => {
  const courses = [
    { id: 'C01', name: 'Transición A', director: 'Marta Rivas', students: 22, level: 'Preescolar' },
    { id: 'C02', name: 'Primero A', director: 'Juan Pérez', students: 25, level: 'Primaria' },
    { id: 'C03', name: 'Noveno A', director: 'Claudia Gomez', students: 18, level: 'Secundaria' },
    { id: 'C04', name: 'Once A', director: 'Andres Marín', students: 15, level: 'Media' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight italic">Cursos y Salones</h2>
          <p className="text-gray-500 font-medium mt-1">Organización académica del Instituto Misión Boston.</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white border-2 border-royal-blue text-royal-blue px-6 py-2.5 rounded-2xl font-black hover:bg-blue-50 transition-all text-sm">
            Calendario Escolar
          </button>
          {user.role !== UserRole.TEACHER && (
            <button className="bg-royal-blue text-white px-6 py-2.5 rounded-2xl font-black hover:bg-blue-800 transition-all shadow-xl text-sm transform active:scale-95">
              + Crear Curso
            </button>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group cursor-pointer relative overflow-hidden">
            <div className="absolute right-[-15px] top-[-15px] w-16 h-16 bg-blue-50 rounded-full group-hover:scale-[3] transition-transform duration-500 -z-0"></div>
            <div className="relative z-10">
              <span className="text-[10px] font-black text-royal-blue bg-blue-50 px-3 py-1 rounded-full uppercase mb-4 inline-block">
                {course.level}
              </span>
              <h3 className="text-2xl font-black text-gray-900 mb-1">{course.name}</h3>
              <p className="text-xs font-bold text-gray-400 mb-6">Dir: {course.director}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase">Estudiantes</p>
                  <p className="text-xl font-black text-royal-blue">{course.students}</p>
                </div>
                <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white font-black text-xs hover:bg-royal-blue transition-colors">
                  VER
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-royal-blue p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
         <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="text-white">
               <h3 className="text-2xl font-black italic">¿Necesitas ayuda con los horarios?</h3>
               <p className="text-blue-100 mt-2 font-medium opacity-80">El sistema de IA puede sugerirte una distribución óptima de clases basada en la disponibilidad docente.</p>
            </div>
            <button className="bg-school-yellow text-royal-blue px-10 py-4 rounded-[1.5rem] font-black shadow-lg hover:scale-105 transition-transform shrink-0">
               ✨ Optimizar con IA
            </button>
         </div>
         <div className="absolute top-0 right-0 p-4 text-white opacity-5 text-9xl font-black select-none">IA</div>
      </div>
    </div>
  );
};

export default CoursesManagement;
