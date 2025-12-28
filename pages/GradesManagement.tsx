
import React, { useState, useMemo } from 'react';
import { User, UserRole, GradeEntry, Student } from '../types';
import { getSmartReportSummary } from '../services/geminiService';

// Extendemos localmente el tipo para soportar detalles de tareas y metadata de materias
interface ExtendedGradeEntry extends GradeEntry {
  assignments?: { name: string; score: number; weight: string; date?: string }[];
  teacherComment?: string;
}

const GradesManagement: React.FC<{ user: User }> = ({ user }) => {
  const studentsMock: Student[] = [
    { id: '1', name: 'Mateo Rodríguez', grade: '9-A', parentEmail: 'mateo.padre@boston.edu', generalRank: 3, totalStudentsInCourse: 25 },
    { id: '2', name: 'Sofía Rodríguez', grade: '7-B', parentEmail: 'sofia.padre@boston.edu', generalRank: 1, totalStudentsInCourse: 22 },
  ];

  const [selectedStudentId, setSelectedStudentId] = useState(studentsMock[0].id);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isViewingDetail, setIsViewingDetail] = useState(false);
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [isBulletinEnabled, setIsBulletinEnabled] = useState(false);
  const [isGeneratingOfficial, setIsGeneratingOfficial] = useState(false);

  // Estados para Filtros
  const [filterSubject, setFilterSubject] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('');
  const [filterScoreRange, setFilterScoreRange] = useState('');

  // Estados para Edición Masiva
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [selectedRowSubjects, setSelectedRowSubjects] = useState<Set<string>>(new Set());
  const [bulkScore, setBulkScore] = useState<string>('');
  const [bulkComment, setBulkComment] = useState<string>('');
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);

  const [allGrades, setAllGrades] = useState<ExtendedGradeEntry[]>([
    { 
      studentId: '1', subject: 'Matemáticas', score: 4.8, period: 1, subjectRank: 2, history: [4.2, 4.5, 4.8],
      assignments: [
        { name: 'Examen Álgebra', score: 4.5, weight: '40%', date: '2024-02-15' },
        { name: 'Taller Funciones', score: 5.0, weight: '30%', date: '2024-02-28' },
        { name: 'Participación', score: 5.0, weight: '30%', date: 'Diario' }
      ],
      teacherComment: "Excelente razonamiento lógico y disposición para ayudar a sus compañeros. Demuestra liderazgo en resolución de problemas complejos y gran dominio de las funciones cuadráticas."
    },
    { 
      studentId: '1', subject: 'Lenguaje', score: 4.2, period: 1, subjectRank: 5, history: [3.8, 4.0, 4.2],
      assignments: [
        { name: 'Ensayo Crítico', score: 4.0, weight: '50%', date: '2024-03-02' },
        { name: 'Control Lectura', score: 4.4, weight: '50%', date: '2024-03-10' }
      ],
      teacherComment: "Buen manejo de la ortografía, puede profundizar más en sus análisis literarios mediante la conexión de contextos históricos y crítica social."
    },
    { 
      studentId: '1', subject: 'Ciencias', score: 3.2, period: 1, subjectRank: 18, history: [4.0, 3.8, 3.2],
      assignments: [
        { name: 'Lab. Biología', score: 2.5, weight: '40%', date: '2024-02-20' },
        { name: 'Proyecto Feria', score: 3.7, weight: '60%', date: '2024-03-05' }
      ],
      teacherComment: "Se recomienda reforzar los conceptos de biología celular. El estudiante requiere mayor atención al seguir protocolos de laboratorio y mejorar sus reportes técnicos."
    },
    { 
      studentId: '1', subject: 'Inglés', score: 4.5, period: 1, subjectRank: 4, history: [4.1, 4.3, 4.5],
      assignments: [
        { name: 'Listening Test', score: 4.8, weight: '30%', date: '2024-03-01' },
        { name: 'Oral Presentation', score: 4.3, weight: '70%', date: '2024-03-12' }
      ],
      teacherComment: "Fluidez destacada en diálogos espontáneos. Se recomienda practicar vocabulario técnico especializado para mejorar la precisión léxica."
    },
    { 
      studentId: '2', subject: 'Matemáticas', score: 5.0, period: 1, subjectRank: 1, history: [4.9, 5.0, 5.0],
      assignments: [{ name: 'Parcial Final', score: 5.0, weight: '100%', date: '2024-03-15' }],
      teacherComment: "Desempeño impecable en todas las áreas de la materia. Es un ejemplo para el grupo y demuestra un compromiso total con su proceso de aprendizaje."
    },
    { 
      studentId: '2', subject: 'Ciencias', score: 4.7, period: 1, subjectRank: 2, history: [4.5, 4.6, 4.7],
      assignments: [{ name: 'Taller Células', score: 4.7, weight: '100%', date: '2024-03-08' }],
      teacherComment: "Gran interés investigativo y excelente capacidad de síntesis en sus informes de laboratorio."
    },
  ]);

  const activeStudent = useMemo(() => 
    studentsMock.find(s => s.id === selectedStudentId) || studentsMock[0],
    [selectedStudentId]
  );

  const getScoreLabel = (score: number) => {
    if (score >= 4.6) return 'Superior';
    if (score >= 4.0) return 'Alto';
    if (score >= 3.5) return 'Básico';
    return 'Bajo';
  };

  const activeGrades = useMemo(() => {
    let filtered = allGrades.filter(g => g.studentId === selectedStudentId);
    
    if (filterSubject) {
      filtered = filtered.filter(g => g.subject.toLowerCase().includes(filterSubject.toLowerCase()));
    }
    
    if (filterPeriod) {
      filtered = filtered.filter(g => g.period === parseInt(filterPeriod));
    }
    
    if (filterScoreRange) {
      if (filterScoreRange === 'superior') filtered = filtered.filter(g => g.score >= 4.6);
      else if (filterScoreRange === 'alto') filtered = filtered.filter(g => g.score >= 4.0 && g.score < 4.6);
      else if (filterScoreRange === 'basico') filtered = filtered.filter(g => g.score >= 3.5 && g.score < 4.0);
      else if (filterScoreRange === 'bajo') filtered = filtered.filter(g => g.score < 3.5);
    }
    
    return filtered;
  }, [allGrades, selectedStudentId, filterSubject, filterPeriod, filterScoreRange]);

  const averageScore = useMemo(() => {
    const studentGrades = allGrades.filter(g => g.studentId === selectedStudentId);
    if (studentGrades.length === 0) return "0.00";
    return (studentGrades.reduce((acc, curr) => acc + curr.score, 0) / studentGrades.length).toFixed(2);
  }, [allGrades, selectedStudentId]);

  const historicalAverages = [4.1, 4.3, 4.2, 4.5, 4.4, parseFloat(averageScore)];

  const resetFilters = () => {
    setFilterSubject('');
    setFilterPeriod('');
    setFilterScoreRange('');
  };

  const handleExportCSV = () => {
    if (activeGrades.length === 0) return;
    const headers = ["Asignatura", "Periodo", "Calificación", "Desempeño", "Comentario del Docente"];
    const rows = activeGrades.map(g => [
      g.subject,
      g.period,
      g.score.toFixed(1),
      getScoreLabel(g.score),
      `"${(g.teacherComment || "").replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const fileName = `Notas_${activeStudent.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleScoreChange = (index: number, value: string) => {
    const score = parseFloat(value);
    if (isNaN(score) || score < 0 || score > 5.0) return;
    const newGrades = [...allGrades];
    const targetGrade = activeGrades[index];
    const globalIndex = allGrades.findIndex(g => g.studentId === selectedStudentId && g.subject === targetGrade.subject && g.period === targetGrade.period);
    if (globalIndex !== -1) {
      newGrades[globalIndex].score = score;
      setAllGrades(newGrades);
    }
  };

  const toggleRowSelection = (subject: string) => {
    const newSelection = new Set(selectedRowSubjects);
    if (newSelection.has(subject)) newSelection.delete(subject);
    else newSelection.add(subject);
    setSelectedRowSubjects(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedRowSubjects.size === activeGrades.length) {
      setSelectedRowSubjects(new Set());
    } else {
      setSelectedRowSubjects(new Set(activeGrades.map(g => g.subject)));
    }
  };

  const applyBulkChanges = () => {
    const newGrades = [...allGrades];
    const scoreVal = parseFloat(bulkScore);
    selectedRowSubjects.forEach(subject => {
      const globalIndex = newGrades.findIndex(g => g.studentId === selectedStudentId && g.subject === subject);
      if (globalIndex !== -1) {
        if (!isNaN(scoreVal)) newGrades[globalIndex].score = scoreVal;
        if (bulkComment.trim()) newGrades[globalIndex].teacherComment = bulkComment;
      }
    });
    setAllGrades(newGrades);
    setIsBulkMode(false);
    setSelectedRowSubjects(new Set());
    setBulkScore('');
    setBulkComment('');
    setShowBulkConfirm(false);
  };

  const toggleRow = (subject: string) => {
    if (isBulkMode) return;
    setExpandedSubject(expandedSubject === subject ? null : subject);
  };

  const handleGenerateSummary = async () => {
    setLoadingAi(true);
    const summary = await getSmartReportSummary(activeStudent.name, activeGrades);
    setAiSummary(summary || "No hay resumen disponible.");
    setLoadingAi(false);
  };

  const handleDownloadBulletin = () => {
    if (!isBulletinEnabled) return;
    alert(`Generando Boletín Oficial de ${activeStudent.name}...\n\nPromedio: ${averageScore}\nPuesto: ${activeStudent.generalRank}\n\nDocumento validado por Secretaría Académica del Instituto Cristiano Misión Boston.`);
  };

  const handleDownloadOfficialReport = async () => {
    setIsGeneratingOfficial(true);
    // Simular generación de reporte legal con sellos administrativos
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert(`REPORTE ADMINISTRATIVO GENERADO\n\nAlumno: ${activeStudent.name}\nGrado: ${activeStudent.grade}\nPromedio Consolidado: ${averageScore}\n\nEste documento incluye sellos digitales de Secretaría Académica y Rectoría.`);
    setIsGeneratingOfficial(false);
  };

  const canEnableBulletins = user.role === UserRole.ADMIN || user.role === UserRole.ADMINISTRATIVE;

  const getScoreBadgeStyles = (score: number) => {
    if (score >= 4.6) return 'bg-royal-blue text-white ring-4 ring-royal-blue/10';
    if (score >= 4.0) return 'bg-green-100 text-green-700 ring-4 ring-green-50';
    if (score >= 3.5) return 'bg-yellow-100 text-yellow-700 ring-4 ring-yellow-50';
    return 'bg-red-100 text-red-600 ring-4 ring-red-50';
  };

  if (isViewingDetail) {
    return (
      <div className="space-y-10 animate-fadeIn text-black pb-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => setIsViewingDetail(false)}
              className="w-14 h-14 bg-white border-2 border-royal-blue/10 rounded-2xl flex items-center justify-center text-royal-blue hover:bg-royal-blue hover:text-white transition-all shadow-sm transform hover:scale-105"
            >
              <span className="text-2xl">←</span>
            </button>
            <div>
              <h2 className="text-4xl font-black text-gray-900 tracking-tight italic">Pasaporte Estudiantil</h2>
              <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Hoja de Vida Académica Institucional • MB-2024</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            <span className="bg-school-yellow text-royal-blue px-6 py-2 rounded-full font-black text-xs uppercase shadow-md">Año Lectivo 2024</span>
            <button onClick={() => window.print()} className="bg-white border-2 border-gray-100 p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
               🖨️
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 flex flex-col items-center text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-2 bg-royal-blue"></div>
              <div className="w-36 h-36 bg-royal-blue rounded-[3rem] flex items-center justify-center text-white text-6xl font-black shadow-2xl mb-8 transform group-hover:rotate-6 transition-transform relative ring-8 ring-blue-50">
                {activeStudent.name.charAt(0)}
                <div className="absolute -bottom-2 -right-2 bg-school-yellow w-12 h-12 rounded-2xl flex items-center justify-center border-4 border-white text-2xl">🎓</div>
              </div>
              <h3 className="text-3xl font-black text-gray-900 leading-tight">{activeStudent.name}</h3>
              <p className="text-royal-blue font-black uppercase tracking-widest text-sm mt-1">Estudiante Regular</p>
              
              <div className="w-full space-y-5 mt-10 pt-10 border-t border-gray-100">
                <div className="flex justify-between items-center group/info">
                  <span className="text-gray-400 font-bold text-[10px] uppercase tracking-wider">Grado Actual:</span>
                  <span className="font-black text-gray-900 bg-blue-50 px-4 py-1.5 rounded-xl transition-all group-hover/info:scale-110">{activeStudent.grade}</span>
                </div>
                <div className="flex justify-between items-center group/info">
                  <span className="text-gray-400 font-bold text-[10px] uppercase tracking-wider">Código MB:</span>
                  <span className="font-black text-gray-900">MB-2024-{activeStudent.id}</span>
                </div>
                <div className="flex justify-between items-center group/info">
                  <span className="text-gray-400 font-bold text-[10px] uppercase tracking-wider">Puesto General:</span>
                  <span className="font-black text-royal-blue">#{activeStudent.generalRank} / {activeStudent.totalStudentsInCourse}</span>
                </div>
                <div className="pt-4 mt-4 border-t border-gray-50 text-left">
                  <span className="text-gray-400 font-bold text-[10px] uppercase tracking-wider block mb-2">Acudiente Responsable:</span>
                  <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-2xl">
                     <span className="text-lg">📧</span>
                     <span className="font-bold text-gray-700 text-sm truncate">{activeStudent.parentEmail}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-royal-blue p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group">
              <div className="absolute -right-10 -bottom-10 text-[12rem] font-black opacity-10 leading-none select-none transition-transform group-hover:scale-110">🎖️</div>
              <h4 className="font-black text-xl mb-8 italic flex items-center">
                 <span className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mr-4 text-xl">✨</span>
                 Méritos y Logros
              </h4>
              <div className="space-y-5 relative z-10">
                <div className="flex items-center space-x-4 bg-white/10 p-5 rounded-3xl border border-white/10 backdrop-blur-md">
                  <span className="text-3xl">🏆</span>
                  <div>
                    <p className="font-black text-sm">Cuadro de Honor</p>
                    <p className="text-[10px] text-blue-100 uppercase font-bold">Primer Periodo 2024</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 bg-white/10 p-5 rounded-3xl border border-white/10 opacity-60">
                  <span className="text-3xl">⚽</span>
                  <div>
                    <p className="font-black text-sm">Deportista Destacado</p>
                    <p className="text-[10px] text-blue-100 uppercase font-bold">Intercolegiados</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-10">
            <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-gray-100 relative">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                <div>
                  <h3 className="text-3xl font-black text-gray-900 italic tracking-tight">Rendimiento Histórico</h3>
                  <p className="text-gray-400 font-medium text-sm mt-1">Evolución del promedio ponderado institucional</p>
                </div>
                <div className="flex items-center bg-royal-blue text-white px-8 py-5 rounded-[2rem] shadow-xl transform hover:scale-105 transition-transform">
                  <div className="mr-6">
                    <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest">Promedio Actual</p>
                    <p className="text-4xl font-black">{averageScore}</p>
                  </div>
                  <span className="text-4xl">📊</span>
                </div>
              </div>

              <div className="relative h-80 w-full flex items-end">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[5, 4, 3, 2, 1, 0].map(val => (
                    <div key={val} className="border-t border-gray-100 w-full h-0 relative">
                      <span className="absolute -left-12 -top-2 text-[10px] font-black text-gray-300">{val}.0</span>
                    </div>
                  ))}
                </div>

                <svg className="w-full h-full relative z-10 overflow-visible" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#0038A8" stopOpacity="1" />
                      <stop offset="100%" stopColor="#0038A8" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                  <polyline
                    fill="none"
                    stroke="url(#lineGrad)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={historicalAverages.map((v, i) => `${(i * (100 / 5))}%,${320 - (v / 5 * 320)}`).join(' ')}
                    className="animate-draw"
                  />
                  {historicalAverages.map((v, i) => (
                    <g key={i} className="cursor-pointer group">
                      <circle cx={`${(i * (100 / 5))}%`} cy={320 - (v / 5 * 320)} r="10" fill="#FFD700" stroke="#0038A8" strokeWidth="4" />
                      <text x={`${(i * (100 / 5))}%`} y={320 - (v / 5 * 320) - 20} textAnchor="middle" className="text-[10px] font-black fill-royal-blue opacity-0 group-hover:opacity-100 transition-opacity">
                        {v}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
              <div className="flex justify-between mt-8 px-2">
                {['Per. 1', 'Per. 2', 'Per. 3', 'Per. 4', 'Final 2023', 'Actual'].map((l, idx) => (
                  <span key={idx} className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{l}</span>
                ))}
              </div>
            </div>

            <div className="bg-blue-50/50 p-10 rounded-[3rem] border-2 border-dashed border-royal-blue/10">
               <h4 className="text-xl font-black text-royal-blue mb-4 italic">Observaciones de Coordinación</h4>
               <p className="text-gray-600 font-medium leading-relaxed italic">
                 "El estudiante {activeStudent.name} mantiene una trayectoria de excelencia. Su compromiso con el proyecto de vida cristiano es evidente en su interacción social y liderazgo escolar. Se recomienda continuar fortaleciendo sus habilidades en ciencias básicas para el próximo periodo."
               </p>
               <div className="mt-8 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                     <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-royal-blue shadow-sm border border-gray-100">🛡️</div>
                     <div>
                        <p className="text-xs font-black text-gray-800 uppercase tracking-widest">Coordinación Académica</p>
                        <p className="text-[10px] text-gray-400 font-bold">Validado para el Periodo 1</p>
                     </div>
                  </div>
                  <button onClick={() => setIsViewingDetail(false)} className="text-royal-blue font-black text-xs uppercase tracking-[0.2em] underline decoration-4 underline-offset-8">Volver a Notas</button>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn text-black pb-32">
      {/* Panel Administrativo */}
      {canEnableBulletins && (
        <div className="bg-white border-2 border-gray-100 p-6 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm hover:border-royal-blue/20 transition-all">
          <div className="flex items-center space-x-5">
             <div className="w-14 h-14 bg-royal-blue text-school-yellow rounded-2xl flex items-center justify-center text-3xl shadow-lg transform -rotate-3">⚙️</div>
             <div className="max-w-md">
                <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">Panel de Control Académico</h3>
                <p className="text-[10px] font-medium text-gray-500 mt-1 uppercase tracking-tighter">Habilitar descargas globales y emisión de reportes institucionales legales.</p>
             </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 bg-gray-50 px-6 py-3 rounded-3xl border border-gray-100">
            {/* Botón de Reporte Oficial (Solo para Admins) */}
            <button 
              onClick={handleDownloadOfficialReport}
              disabled={isGeneratingOfficial}
              className={`flex items-center space-x-3 px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-md ${isGeneratingOfficial ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-royal-blue text-white hover:bg-blue-800 transform active:scale-95'}`}
            >
               <span>{isGeneratingOfficial ? '🌀' : '📜'}</span>
               <span>Generar Acta Oficial (Master)</span>
            </button>

            <div className="h-8 w-[2px] bg-gray-200 mx-2 hidden md:block"></div>

            <div className="flex items-center space-x-3">
               <span className={`text-[10px] font-black uppercase tracking-widest ${!isBulletinEnabled ? 'text-royal-blue' : 'text-gray-300'}`}>Boletines Cerrados</span>
               <button onClick={() => setIsBulletinEnabled(!isBulletinEnabled)} className={`w-14 h-8 rounded-full relative transition-all duration-300 ${isBulletinEnabled ? 'bg-green-500' : 'bg-gray-300'}`}>
                 <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${isBulletinEnabled ? 'left-7' : 'left-1'}`}></div>
               </button>
               <span className={`text-[10px] font-black uppercase tracking-widest ${isBulletinEnabled ? 'text-green-600' : 'text-gray-400'}`}>Abiertos al Público</span>
            </div>
          </div>
        </div>
      )}

      {/* Selector de Estudiante (Para Padres) */}
      {user.role === UserRole.PARENT && (
        <div className="flex items-center space-x-4 bg-white p-4 rounded-[1.5rem] shadow-sm border border-gray-100 overflow-x-auto custom-scrollbar">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 whitespace-nowrap">Hijos vinculados:</span>
          {studentsMock.map(s => (
            <button key={s.id} onClick={() => setSelectedStudentId(s.id)} className={`px-8 py-2.5 rounded-2xl font-black text-sm transition-all whitespace-nowrap ${selectedStudentId === s.id ? 'bg-royal-blue text-white shadow-xl scale-105' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
              {s.name}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-3 group">
             <div className="w-2 h-8 bg-school-yellow rounded-full"></div>
             <h2 className="text-3xl font-black text-gray-900 tracking-tight italic">Calificaciones: {activeStudent.name}</h2>
             <button 
                onClick={() => setIsViewingDetail(true)}
                className="ml-4 w-10 h-10 bg-blue-50 text-royal-blue rounded-xl flex items-center justify-center hover:bg-royal-blue hover:text-white transition-all shadow-sm"
                title="Ver Perfil Completo"
             >
                👤
             </button>
          </div>
          <p className="text-gray-500 font-medium ml-5">Reporte académico consolidado 2024</p>
        </div>
        
        <div className="flex flex-wrap gap-3 items-center">
          {user.role === UserRole.TEACHER && (
            <>
              <button 
                onClick={() => { setIsBulkMode(!isBulkMode); setEditMode(false); setSelectedRowSubjects(new Set()); }}
                className={`px-6 py-3 rounded-2xl font-black transition-all shadow-xl transform active:scale-95 text-sm ${
                  isBulkMode ? 'bg-royal-blue text-white ring-4 ring-blue-100' : 'bg-white border-2 border-royal-blue text-royal-blue'
                }`}
              >
                {isBulkMode ? '✕ Cancelar Selección' : '⚡ Edición Masiva'}
              </button>
              <button 
                onClick={() => { setEditMode(!editMode); setIsBulkMode(false); }}
                className={`px-8 py-3 rounded-2xl font-black transition-all shadow-xl transform active:scale-95 text-sm ${
                  editMode ? 'bg-green-500 text-white animate-pulse' : 'bg-royal-blue text-white'
                }`}
              >
                {editMode ? '✓ Finalizar Edición' : '✎ Cargar Notas'}
              </button>
            </>
          )}

          <button 
            onClick={handleExportCSV}
            className="flex items-center space-x-2 px-6 py-3 rounded-2xl font-black transition-all text-sm shadow-xl border-2 bg-white text-royal-blue border-royal-blue hover:bg-blue-50 transform active:scale-95"
          >
             <span className="text-xl">📊</span>
             <span>Exportar CSV</span>
          </button>
          
          <button onClick={handleDownloadBulletin} disabled={!isBulletinEnabled} className={`flex items-center space-x-2 px-8 py-3 rounded-2xl font-black transition-all text-sm shadow-xl border-2 ${isBulletinEnabled ? 'bg-school-yellow text-royal-blue border-school-yellow hover:bg-yellow-400 transform active:scale-95' : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60'}`}>
             <span className="text-xl">📥</span>
             <span>Boletín PDF</span>
          </button>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Asignatura</label>
          <input 
            type="text" 
            placeholder="Buscar materia..." 
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="w-full px-4 py-2.5 border-2 border-gray-50 rounded-xl focus:border-royal-blue outline-none transition-all font-medium text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Periodo</label>
          <select 
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="w-full px-4 py-2.5 border-2 border-gray-50 rounded-xl focus:border-royal-blue outline-none transition-all font-medium text-sm bg-white"
          >
            <option value="">Todos los periodos</option>
            <option value="1">Periodo 1</option>
            <option value="2">Periodo 2</option>
            <option value="3">Periodo 3</option>
            <option value="4">Periodo 4</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Desempeño</label>
          <select 
            value={filterScoreRange}
            onChange={(e) => setFilterScoreRange(e.target.value)}
            className="w-full px-4 py-2.5 border-2 border-gray-50 rounded-xl focus:border-royal-blue outline-none transition-all font-medium text-sm bg-white"
          >
            <option value="">Cualquier puntaje</option>
            <option value="superior">Superior (4.6 - 5.0)</option>
            <option value="alto">Alto (4.0 - 4.5)</option>
            <option value="basico">Básico (3.5 - 3.9)</option>
            <option value="bajo">Bajo (0.0 - 3.4)</option>
          </select>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={resetFilters}
            className="flex-1 bg-gray-100 text-gray-500 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
          >
            Limpiar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b">
                <th className="px-10 py-5">
                   {isBulkMode ? (
                     <div className="flex items-center space-x-3">
                        <input 
                          type="checkbox" 
                          checked={selectedRowSubjects.size === activeGrades.length} 
                          onChange={toggleSelectAll}
                          className="w-5 h-5 accent-royal-blue rounded-md cursor-pointer"
                        />
                        <span>Asignatura</span>
                     </div>
                   ) : 'Área / Asignatura'}
                </th>
                <th className="px-10 py-5 text-center">Calificación</th>
                <th className="px-10 py-5 text-center">Desempeño</th>
                <th className="px-10 py-5 text-right">Pasaporte Académico</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {activeGrades.map((grade, i) => (
                <React.Fragment key={`${grade.subject}-${grade.period}`}>
                  <tr 
                    className={`group transition-all duration-300 cursor-pointer ${selectedRowSubjects.has(grade.subject) ? 'bg-blue-50/80 border-l-4 border-royal-blue' : (expandedSubject === grade.subject ? 'bg-blue-50/50' : 'hover:bg-gray-50/80')}`}
                    onClick={() => isBulkMode ? toggleRowSelection(grade.subject) : toggleRow(grade.subject)}
                  >
                    <td className="px-10 py-6">
                      <div className="flex items-center space-x-5">
                        {isBulkMode ? (
                           <input 
                            type="checkbox" 
                            checked={selectedRowSubjects.has(grade.subject)}
                            onChange={() => toggleRowSelection(grade.subject)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-5 h-5 accent-royal-blue rounded-md cursor-pointer"
                           />
                        ) : (
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${expandedSubject === grade.subject ? 'bg-royal-blue text-white rotate-90 shadow-lg' : 'bg-gray-100 text-gray-400 group-hover:bg-blue-100'}`}>
                             <span className="text-xs">▶</span>
                          </div>
                        )}
                        <div>
                          <div className="flex items-center space-x-2">
                             <p className="font-black text-gray-800 text-lg group-hover:text-royal-blue transition-colors italic">{grade.subject}</p>
                             <button 
                                onClick={(e) => { e.stopPropagation(); setIsViewingDetail(true); }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-royal-blue text-sm"
                                title="Ver Historial del Alumno"
                             >
                                🔗
                             </button>
                          </div>
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Periodo {grade.period} • 2024</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex justify-center">
                        {editMode ? (
                          <input 
                            type="number" step="0.1" value={grade.score}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => handleScoreChange(i, e.target.value)}
                            className="w-20 px-4 py-2 border-2 border-royal-blue rounded-xl text-center font-black text-gray-900 bg-white shadow-inner focus:ring-4 focus:ring-royal-blue/10 outline-none"
                          />
                        ) : (
                          <div className={`w-16 h-16 rounded-[1.5rem] flex flex-col items-center justify-center font-black text-xl transition-all shadow-md group-hover:scale-110 ${getScoreBadgeStyles(grade.score)}`}>
                             <span>{grade.score.toFixed(1)}</span>
                             <span className="text-[8px] uppercase tracking-tighter opacity-70 mt-[-2px]">Nota</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-10 py-6 text-center">
                      <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${getScoreBadgeStyles(grade.score)}`}>
                        {getScoreLabel(grade.score)}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setIsViewingDetail(true); }}
                        className="bg-royal-blue text-white text-[10px] font-black px-8 py-3 rounded-2xl hover:bg-blue-800 transition-all uppercase tracking-widest shadow-lg transform active:scale-95 flex items-center space-x-2 ml-auto"
                      >
                        <span>📂</span>
                        <span>Ver Historial</span>
                      </button>
                    </td>
                  </tr>
                  
                  {expandedSubject === grade.subject && !isBulkMode && (
                    <tr className="bg-white/80 animate-fadeIn border-l-4 border-royal-blue">
                      <td colSpan={4} className="px-12 py-12">
                        <div className="grid lg:grid-cols-2 gap-16">
                          <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                               <h4 className="text-xs font-black text-royal-blue uppercase tracking-widest flex items-center">
                                  <span className="w-2 h-4 bg-royal-blue rounded-full mr-3"></span>
                                  Desglose de Calificaciones
                               </h4>
                               <span className="text-[9px] font-bold text-gray-400 uppercase">Suma de pesos: 100%</span>
                            </div>
                            <div className="grid gap-4">
                              {grade.assignments?.map((assign, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm hover:bg-white hover:shadow-lg hover:border-royal-blue/20 transition-all cursor-default group/item">
                                  <div className="flex items-center space-x-5">
                                     <div className="w-12 h-12 bg-white rounded-2xl flex flex-col items-center justify-center font-black text-royal-blue border border-gray-100 group-hover/item:bg-royal-blue group-hover/item:text-white transition-colors">
                                        <span className="text-xs">{idx + 1}</span>
                                        <span className="text-[8px] uppercase tracking-tighter opacity-70">Actividad</span>
                                     </div>
                                     <div>
                                        <p className="font-black text-gray-800 text-sm italic">{assign.name}</p>
                                        <div className="flex items-center space-x-3 mt-1">
                                           <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Peso: {assign.weight}</p>
                                           <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                           <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{assign.date}</p>
                                        </div>
                                     </div>
                                  </div>
                                  <div className={`px-5 py-2.5 rounded-2xl font-black text-lg border-2 shadow-sm ${assign.score >= 4.0 ? 'border-green-100 bg-green-50 text-green-700' : (assign.score >= 3.0 ? 'border-yellow-100 bg-yellow-50 text-yellow-700' : 'border-red-100 bg-red-50 text-red-600')}`}>
                                     {assign.score.toFixed(1)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-6">
                            <h4 className="text-xs font-black text-royal-blue uppercase tracking-widest flex items-center border-b border-gray-100 pb-4">
                               <span className="w-2 h-4 bg-school-yellow rounded-full mr-3"></span>
                               Observaciones del Profesor
                            </h4>
                            <div className="bg-blue-50/50 p-10 rounded-[2.5rem] border-2 border-dashed border-royal-blue/20 relative">
                               <p className="text-gray-700 text-base leading-relaxed italic font-medium relative z-10">
                                  {grade.teacherComment || "El docente aún no ha registrado observaciones adicionales para este periodo evaluativo."}
                                </p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 mt-12">
        <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 space-y-8">
           <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-black text-gray-900 italic flex items-center">
                 <span className="w-12 h-12 bg-blue-50 text-royal-blue rounded-2xl flex items-center justify-center mr-5 text-2xl shadow-inner">📈</span>
                 Promedio Estudiantil
              </h3>
              <button onClick={() => setIsViewingDetail(true)} className="text-[10px] font-black text-royal-blue uppercase tracking-widest hover:underline">Ver Historial Completo →</button>
           </div>
           <div className="relative h-64 w-full flex items-end px-4">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[5, 4, 3, 2, 1, 0].map(val => (
                  <div key={val} className="border-t border-gray-50 w-full h-0 relative">
                    <span className="absolute -left-8 -top-2 text-[8px] font-black text-gray-300">{val}.0</span>
                  </div>
                ))}
              </div>
              <svg className="w-full h-full relative z-10 overflow-visible" preserveAspectRatio="none">
                <polyline
                  fill="none"
                  stroke="#0038A8"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={historicalAverages.map((v, i) => `${(i * (100 / 5))}%,${256 - (v / 5 * 256)}`).join(' ')}
                  className="animate-draw"
                  style={{ vectorEffect: 'non-scaling-stroke' }}
                />
              </svg>
           </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-royal-blue p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
            <h3 className="text-xl font-black text-white mb-4 italic tracking-tight">Análisis IA Misión Boston</h3>
            <p className="text-blue-100 text-sm font-medium leading-relaxed mb-8 opacity-80">
              Analiza el progreso académico de su hijo con tecnología de punta y valores cristianos.
            </p>
            <button 
              onClick={handleGenerateSummary} disabled={loadingAi}
              className="w-full bg-school-yellow text-royal-blue py-5 rounded-3xl font-black hover:bg-yellow-400 transition-all shadow-xl transform active:scale-95"
            >
              {loadingAi ? 'Analizando...' : 'Generar Resumen Inteligente'}
            </button>
          </div>
          {aiSummary && (
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border-4 border-school-yellow/30 animate-fadeIn">
              <p className="text-sm text-gray-700 font-medium italic leading-relaxed">"{aiSummary}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GradesManagement;
