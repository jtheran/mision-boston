
import React, { useState, useMemo } from 'react';
import { User, UserRole, GradeEntry, Student } from '../types';
import { getSmartReportSummary } from '../services/geminiService';

const GradesManagement: React.FC<{ user: User }> = ({ user }) => {
  const studentsMock: Student[] = [
    { id: '1', name: 'Mateo Rodríguez', grade: '9-A', parentEmail: 'padre@correo.com', generalRank: 3, totalStudentsInCourse: 25 },
    { id: '2', name: 'Sofía Rodríguez', grade: '7-B', parentEmail: 'padre@correo.com', generalRank: 1, totalStudentsInCourse: 22 },
  ];

  const [selectedStudentId, setSelectedStudentId] = useState(studentsMock[0].id);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [allGrades, setAllGrades] = useState<GradeEntry[]>([
    { studentId: '1', subject: 'Matemáticas', score: 4.8, period: 1, subjectRank: 2, history: [4.2, 4.5, 4.8] },
    { studentId: '1', subject: 'Lenguaje', score: 4.2, period: 1, subjectRank: 5, history: [3.8, 4.0, 4.2] },
    { studentId: '1', subject: 'Ciencias', score: 3.9, period: 1, subjectRank: 10, history: [4.0, 3.8, 3.9] },
    { studentId: '1', subject: 'Inglés', score: 4.5, period: 1, subjectRank: 4, history: [4.1, 4.3, 4.5] },
    { studentId: '2', subject: 'Matemáticas', score: 5.0, period: 1, subjectRank: 1, history: [4.9, 5.0, 5.0] },
    { studentId: '2', subject: 'Ciencias', score: 4.7, period: 1, subjectRank: 2, history: [4.5, 4.6, 4.7] },
  ]);

  const activeStudent = useMemo(() => 
    studentsMock.find(s => s.id === selectedStudentId) || studentsMock[0],
    [selectedStudentId]
  );

  const activeGrades = useMemo(() => 
    allGrades.filter(g => g.studentId === selectedStudentId),
    [allGrades, selectedStudentId]
  );

  const averageScore = useMemo(() => 
    (activeGrades.reduce((acc, curr) => acc + curr.score, 0) / activeGrades.length).toFixed(2),
    [activeGrades]
  );

  // Datos para la gráfica de tendencia general (promedio de los meses anteriores)
  const historicalAverages = [4.1, 4.3, 4.2, 4.5, 4.4, parseFloat(averageScore)];

  const handleScoreChange = (index: number, value: string) => {
    const score = parseFloat(value);
    if (isNaN(score) || score < 0 || score > 5.0) return;
    const newGrades = [...allGrades];
    const globalIndex = allGrades.findIndex(g => g.studentId === selectedStudentId && g.subject === activeGrades[index].subject);
    if (globalIndex !== -1) {
      newGrades[globalIndex].score = score;
      setAllGrades(newGrades);
    }
  };

  const handleGenerateSummary = async () => {
    setLoadingAi(true);
    const summary = await getSmartReportSummary(activeStudent.name, activeGrades);
    setAiSummary(summary || "No hay resumen disponible.");
    setLoadingAi(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Selector de Hijo */}
      {user.role === UserRole.PARENT && (
        <div className="flex items-center space-x-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Ver información de:</span>
          {studentsMock.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedStudentId(s.id)}
              className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${
                selectedStudentId === s.id 
                ? 'bg-royal-blue text-white shadow-lg scale-105' 
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight italic">
            Expediente Académico: {activeStudent.name}
          </h2>
          <p className="text-gray-500 font-medium">Grado {activeStudent.grade} • Análisis de Rendimiento 2024</p>
        </div>
        
        <div className="flex space-x-3">
          {user.role === UserRole.TEACHER && (
            <button 
              onClick={() => setEditMode(!editMode)}
              className={`px-8 py-2.5 rounded-2xl font-black transition-all shadow-md transform active:scale-95 text-sm ${
                editMode ? 'bg-green-500 text-white' : 'bg-royal-blue text-white'
              }`}
            >
              {editMode ? '✓ Guardar Cambios' : '✎ Editar Notas'}
            </button>
          )}
          <button className="bg-school-yellow text-royal-blue border-2 border-school-yellow px-6 py-2.5 rounded-2xl font-black hover:bg-yellow-400 transition-all text-sm shadow-sm">
             Descargar Boletín Oficial
          </button>
        </div>
      </div>

      {/* SECCIÓN DE RESUMEN HISTÓRICO CON GRÁFICA */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-gray-900 italic">Tendencia de Rendimiento Anual</h3>
            <div className="flex items-center space-x-4">
               <div className="flex items-center space-x-2">
                 <div className="w-3 h-3 bg-royal-blue rounded-full"></div>
                 <span className="text-[10px] font-bold text-gray-400 uppercase">Promedio General</span>
               </div>
            </div>
          </div>
          
          <div className="relative h-64 w-full flex items-end">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[5, 4, 3, 2, 1, 0].map(val => (
                <div key={val} className="border-t border-gray-50 w-full h-0 relative">
                  <span className="absolute -left-8 -top-2 text-[8px] font-black text-gray-300">{val}.0</span>
                </div>
              ))}
            </div>

            <svg className="w-full h-full relative z-10 overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0038A8" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#0038A8" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Área sombreada */}
              <path
                d={`M 0 256 ${historicalAverages.map((v, i) => `L ${(i * (100 / 5))}% ${256 - (v / 5 * 256)}`).join(' ')} L 100% 256 Z`}
                fill="url(#chartGradient)"
                className="transition-all duration-1000"
              />

              {/* Línea principal */}
              <polyline
                fill="none"
                stroke="#0038A8"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={historicalAverages.map((v, i) => `${(i * (100 / 5))}%,${256 - (v / 5 * 256)}`).join(' ')}
                className="animate-draw"
                style={{ vectorEffect: 'non-scaling-stroke' }}
              />

              {/* Puntos de datos interactivos */}
              {historicalAverages.map((v, i) => (
                <g key={i} className="group cursor-pointer">
                  <circle 
                    cx={`${(i * (100 / 5))}%`} 
                    cy={256 - (v / 5 * 256)} 
                    r="6" 
                    fill="#0038A8" 
                    className="hover:r-8 transition-all" 
                  />
                  <rect 
                    x={`${(i * (100 / 5)) - 2}%`} 
                    y={256 - (v / 5 * 256) - 30} 
                    width="40" 
                    height="20" 
                    rx="4" 
                    className="fill-gray-900 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  <text 
                    x={`${(i * (100 / 5))}%`} 
                    y={256 - (v / 5 * 256) - 16} 
                    textAnchor="middle" 
                    className="text-[10px] font-black fill-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  >
                    {v.toFixed(1)}
                  </text>
                </g>
              ))}
            </svg>

            <div className="absolute bottom-[-30px] w-full flex justify-between">
              {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'].map(mes => (
                <span key={mes} className="text-[10px] font-black text-gray-400 uppercase w-0 overflow-visible text-center" style={{marginLeft: '0%'}}>{mes}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 border-l border-gray-100 pl-8 space-y-6">
          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Tendencias Clave</h4>
          
          <div className="space-y-4">
             <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <p className="text-[10px] font-black text-royal-blue uppercase mb-1">Crecimiento Mensual</p>
                <div className="flex items-center space-x-2">
                   <span className="text-green-500 text-lg">▲</span>
                   <span className="text-xl font-black text-gray-900">+2.4%</span>
                </div>
             </div>

             <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Materia Destacada</p>
                <div className="flex items-center justify-between">
                   <span className="font-black text-gray-800 italic">Matemáticas</span>
                   <span className="bg-royal-blue text-white text-[10px] px-2 py-0.5 rounded-lg">4.8</span>
                </div>
             </div>

             <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Nivel de Esfuerzo</p>
                <div className="flex items-center space-x-1">
                   {[1,2,3,4,5].map(s => <span key={s} className={`text-sm ${s <= 4 ? 'text-school-yellow' : 'text-gray-200'}`}>★</span>)}
                   <span className="text-[10px] font-bold text-gray-500 ml-2">Alto</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 bg-gray-50/50 border-b flex items-center justify-between">
              <h3 className="font-black text-gray-900 italic">Calificaciones por Asignatura</h3>
              <select className="px-4 py-1 border border-gray-200 rounded-full outline-none font-bold text-xs bg-white text-gray-900">
                <option value="1">Primer Periodo</option>
                <option value="2">Segundo Periodo</option>
                <option value="3">Tercer Periodo</option>
              </select>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    <th className="px-8 py-4">Asignatura</th>
                    <th className="px-8 py-4 text-center">Nota</th>
                    <th className="px-8 py-4 text-center">Puesto</th>
                    <th className="px-8 py-4">Histórico</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {activeGrades.map((grade, i) => (
                    <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-8 py-6">
                        <p className="font-black text-gray-800 italic">{grade.subject}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Ver Competencias</p>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-center">
                          {editMode ? (
                            <input 
                              type="number"
                              step="0.1"
                              value={grade.score}
                              onChange={(e) => handleScoreChange(i, e.target.value)}
                              className="w-16 px-2 py-1 border-2 border-royal-blue rounded-lg text-center font-black text-gray-900"
                            />
                          ) : (
                            <span className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm border ${
                              grade.score >= 4.0 ? 'bg-green-50 text-green-600 border-green-100' : 
                              grade.score >= 3.0 ? 'bg-yellow-50 text-yellow-600 border-yellow-100' : 'bg-red-50 text-red-600 border-red-100'
                            }`}>
                              {grade.score.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="text-sm font-black text-royal-blue bg-blue-100/50 px-3 py-1 rounded-lg">
                          {grade.subjectRank}°
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="w-24 h-10 flex items-end space-x-1">
                          {grade.history?.map((h, idx) => (
                            <div 
                              key={idx} 
                              className="bg-royal-blue/30 w-full rounded-t-sm relative group"
                              style={{ height: `${(h / 5) * 100}%` }}
                            >
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-900 text-white text-[8px] font-bold px-1 rounded">
                                {h}
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-royal-blue p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 text-6xl opacity-20 rotate-12 group-hover:rotate-45 transition-transform duration-500 select-none">✨</div>
            <h3 className="text-xl font-black text-white mb-4 italic tracking-tight">Análisis IA Misión Boston</h3>
            <p className="text-blue-100 text-sm font-medium leading-relaxed mb-8 opacity-80">
              Analiza el progreso de {activeStudent.name.split(' ')[0]} para recibir consejos de mejora personalizados.
            </p>
            <button 
              onClick={handleGenerateSummary}
              disabled={loadingAi}
              className="w-full bg-school-yellow text-royal-blue py-4 rounded-2xl font-black hover:bg-yellow-400 transition-all shadow-xl transform active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-3"
            >
              {loadingAi ? <span className="animate-spin text-xl">🌀</span> : <span>Generar Informe IA</span>}
            </button>
          </div>

          {aiSummary && (
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border-2 border-school-yellow animate-slideIn relative">
              <div className="absolute top-[-10px] left-8 bg-school-yellow text-royal-blue text-[10px] font-black px-4 py-1 rounded-full uppercase shadow-sm">
                Perspectiva del Periodo
              </div>
              <p className="text-sm text-gray-700 font-medium italic leading-relaxed">"{aiSummary}"</p>
            </div>
          )}

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h4 className="text-sm font-black text-gray-900 mb-6 uppercase tracking-[0.2em] border-b pb-4">Rankings del Curso</h4>
            <div className="space-y-4">
               <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <span className="font-black text-gray-800">Puesto General</span>
                  <span className="text-royal-blue font-black text-xl">{activeStudent.generalRank}°</span>
               </div>
               <div className="p-4 border border-dashed border-gray-200 rounded-2xl text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Total Estudiantes</p>
                  <p className="font-black text-gray-900">{activeStudent.totalStudentsInCourse}</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradesManagement;
