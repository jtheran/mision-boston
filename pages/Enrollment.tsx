
import React, { useState } from 'react';
import { User } from '../types';

const Enrollment: React.FC<{ user: User }> = ({ user }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', grade: '', comments: '' });
  const [errors, setErrors] = useState<{ name?: string; grade?: string }>({});
  const [touched, setTouched] = useState<{ name?: boolean; grade?: boolean }>({});
  
  const documents = [
    { id: 'doc1', name: 'Documento Identidad Estudiante', status: 'Cargado', description: 'El documento ha sido subido correctamente y está a la espera de validación final.' },
    { id: 'doc2', name: 'Certificados Años Anteriores', status: 'Pendiente', description: 'Aún no has subido este documento. Es obligatorio para finalizar el proceso.' },
    { id: 'doc3', name: 'Carnet de Vacunación', status: 'En Revisión', description: 'Nuestro equipo administrativo está verificando la validez del documento cargado.' },
  ];

  const validate = (data: typeof formData) => {
    const newErrors: { name?: string; grade?: string } = {};
    
    // Validación de Nombre
    const nameTrimmed = data.name.trim();
    if (!nameTrimmed) {
      newErrors.name = 'El nombre completo es obligatorio';
    } else if (nameTrimmed.length < 4) {
      newErrors.name = 'El nombre es demasiado corto (mínimo 4 caracteres)';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nameTrimmed)) {
      newErrors.name = 'El nombre solo debe contener letras y espacios';
    }

    // Validación de Grado
    if (!data.grade) {
      newErrors.grade = 'Debe seleccionar un grado para el aspirante';
    }

    return newErrors;
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    
    // Validar en tiempo real si ya fue tocado
    if (touched[field as keyof typeof touched]) {
      const fieldErrors = validate(newData);
      setErrors(prev => ({ ...prev, [field]: fieldErrors[field as keyof typeof errors] }));
    }
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const fieldErrors = validate(formData);
    setErrors(prev => ({ ...prev, [field]: fieldErrors[field as keyof typeof errors] }));
  };

  const handleNextStep1 = () => {
    setTouched({ name: true, grade: true });
    const validationErrors = validate(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Scroll suave al primer error si fuera un formulario largo
      return;
    }
    
    setErrors({});
    setStep(2);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn pb-20">
      {/* Header del Proceso */}
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-gray-900 tracking-tight italic">Proceso de Matrícula 2024</h2>
        <div className="flex items-center justify-center space-x-3">
          <span className="w-10 h-1 bg-school-yellow rounded-full"></span>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em]">Sabiduría • Fe • Amor</p>
          <span className="w-10 h-1 bg-school-yellow rounded-full"></span>
        </div>
      </div>

      {/* Stepper Moderno */}
      <div className="relative px-4">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full"></div>
        <div 
          className="absolute top-1/2 left-0 h-1 bg-royal-blue -translate-y-1/2 rounded-full transition-all duration-700 ease-in-out"
          style={{ width: `${((step - 1) / 2) * 100}%` }}
        ></div>
        
        <div className="relative flex items-center justify-between">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center group">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl transition-all duration-500 z-10 border-4 ${
                step >= s 
                ? 'bg-royal-blue text-white border-white shadow-2xl scale-110' 
                : 'bg-white text-gray-300 border-gray-100'
              }`}>
                {step > s ? '✓' : s}
              </div>
              <span className={`text-[10px] mt-4 font-black uppercase tracking-widest transition-colors duration-500 ${
                step >= s ? 'text-royal-blue' : 'text-gray-400'
              }`}>
                {s === 1 ? 'Datos' : s === 2 ? 'Documentos' : 'Finalizar'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-royal-blue/5 rounded-bl-[5rem] -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
        
        {step === 1 && (
          <div className="space-y-10">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-50 text-royal-blue rounded-2xl flex items-center justify-center text-2xl shadow-inner">👤</div>
              <div>
                <h3 className="text-2xl font-black text-gray-900 italic">Información del Aspirante</h3>
                <p className="text-sm text-gray-500 font-medium">Inicie el registro con los datos legales del estudiante.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-x-10 gap-y-8">
              {/* Campo: Nombre */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label htmlFor="student-name" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Nombres Completos</label>
                  {touched.name && !errors.name && <span className="text-[10px] font-black text-green-500 uppercase">✓ Válido</span>}
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-40">📝</span>
                  <input 
                    id="student-name"
                    type="text" 
                    value={formData.name}
                    onBlur={() => handleBlur('name')}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full pl-12 pr-6 py-4 border-2 rounded-[1.5rem] focus:ring-4 outline-none transition-all font-bold text-gray-900 ${
                      errors.name && touched.name
                      ? 'border-red-100 bg-red-50 focus:ring-red-100 focus:border-red-400' 
                      : touched.name && !errors.name 
                        ? 'border-green-100 bg-green-50 focus:ring-green-100 focus:border-green-400'
                        : 'border-gray-50 bg-gray-50/50 focus:ring-royal-blue/10 focus:border-royal-blue focus:bg-white'
                    }`}
                    placeholder="Ej: Mateo Rodríguez"
                  />
                </div>
                {errors.name && touched.name && <p className="text-red-500 text-[10px] font-black uppercase tracking-wider ml-2 animate-fadeIn">⚠️ {errors.name}</p>}
              </div>

              {/* Campo: Grado */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label htmlFor="target-grade" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Grado al que Aspira</label>
                  {touched.grade && !errors.grade && <span className="text-[10px] font-black text-green-500 uppercase">✓ Seleccionado</span>}
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-40">🎓</span>
                  <select 
                    id="target-grade"
                    value={formData.grade}
                    onBlur={() => handleBlur('grade')}
                    onChange={(e) => handleInputChange('grade', e.target.value)}
                    className={`w-full pl-12 pr-6 py-4 border-2 rounded-[1.5rem] focus:ring-4 outline-none transition-all font-bold text-gray-900 appearance-none bg-white ${
                      errors.grade && touched.grade
                      ? 'border-red-100 bg-red-50 focus:ring-red-100 focus:border-red-400' 
                      : touched.grade && !errors.grade
                        ? 'border-green-100 bg-green-50 focus:ring-green-100 focus:border-green-400'
                        : 'border-gray-50 bg-gray-50/50 focus:ring-royal-blue/10 focus:border-royal-blue'
                    }`}
                  >
                    <option value="">Seleccione un grado...</option>
                    <option value="transicion">Transición (Preescolar)</option>
                    <option value="primero">Primero de Primaria</option>
                    <option value="segundo">Segundo de Primaria</option>
                    <option value="tercero">Tercero de Primaria</option>
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 font-bold">▼</div>
                </div>
                {errors.grade && touched.grade && <p className="text-red-500 text-[10px] font-black uppercase tracking-wider ml-2 animate-fadeIn">⚠️ {errors.grade}</p>}
              </div>

              {/* Campo: Observaciones */}
              <div className="md:col-span-2 space-y-3">
                <label htmlFor="med-comments" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Observaciones Médicas o Pedagógicas (Opcional)</label>
                <div className="relative">
                  <span className="absolute left-4 top-6 text-xl opacity-40">🏥</span>
                  <textarea 
                    id="med-comments"
                    value={formData.comments}
                    onChange={(e) => setFormData({...formData, comments: e.target.value})}
                    className="w-full pl-12 pr-6 py-5 border-2 border-gray-50 bg-gray-50/50 rounded-[2rem] focus:ring-4 focus:ring-royal-blue/10 focus:border-royal-blue focus:bg-white outline-none h-40 transition-all font-medium text-gray-900 italic resize-none"
                    placeholder="Indique alergias, medicamentos recurrentes o necesidades especiales de aprendizaje..."
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <button 
                onClick={handleNextStep1}
                className="bg-royal-blue text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-blue-800 transition-all shadow-2xl shadow-royal-blue/20 transform active:scale-95 flex items-center space-x-3"
              >
                <span>Continuar Proceso</span>
                <span className="text-xl">→</span>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-10">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-50 text-royal-blue rounded-2xl flex items-center justify-center text-2xl shadow-inner">📂</div>
              <div>
                <h3 className="text-2xl font-black text-gray-900 italic">Carga de Documentación</h3>
                <p className="text-sm text-gray-500 font-medium">Formatos permitidos: PDF, JPG o PNG (Máx 5MB).</p>
              </div>
            </div>

            <div className="grid gap-6">
              {documents.map((doc) => (
                <div key={doc.id} className="group/item flex flex-col md:flex-row md:items-center justify-between p-8 border-2 border-gray-50 rounded-[2rem] hover:border-royal-blue/20 hover:bg-blue-50/30 transition-all duration-300 gap-6">
                  <div className="space-y-2">
                    <p className="font-black text-gray-800 text-lg group-hover/item:text-royal-blue transition-colors">{doc.name}</p>
                    <div className="relative group/tooltip inline-block">
                      <div className="flex items-center space-x-3 cursor-help">
                        <span className={`w-3 h-3 rounded-full shadow-sm ${
                          doc.status === 'Cargado' ? 'bg-green-500' : 
                          doc.status === 'En Revisión' ? 'bg-yellow-500 animate-pulse' : 'bg-red-400'
                        }`}></span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest underline decoration-2 decoration-gray-200 underline-offset-4">{doc.status}</span>
                      </div>
                      <div className="absolute bottom-full left-0 mb-4 hidden group-hover/tooltip:block w-64 bg-gray-900 text-white text-[11px] font-medium p-4 rounded-2xl shadow-2xl z-50 animate-fadeIn leading-relaxed">
                        {doc.description}
                        <div className="absolute top-full left-4 border-8 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </div>
                  <button className="bg-white text-royal-blue border-2 border-royal-blue/10 px-8 py-3 rounded-2xl font-black text-sm hover:bg-royal-blue hover:text-white transition-all shadow-sm transform active:scale-95 whitespace-nowrap">
                    Subir Archivo
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-8 border-t border-gray-50">
              <button onClick={() => setStep(1)} className="text-gray-400 font-black px-6 py-2 hover:text-royal-blue transition-colors uppercase text-xs tracking-widest underline decoration-2 underline-offset-8">← Regresar</button>
              <button onClick={() => setStep(3)} className="bg-royal-blue text-white px-12 py-5 rounded-2xl font-black shadow-xl hover:bg-blue-800 transition-all transform active:scale-95">Validar y Continuar</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-6 space-y-10">
            <div className="relative inline-block">
              <div className="w-28 h-28 bg-green-50 text-green-500 rounded-[2rem] flex items-center justify-center text-5xl mx-auto border-4 border-green-100 shadow-inner">✓</div>
              <div className="absolute -top-4 -right-4 bg-school-yellow text-royal-blue w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border-4 border-white shadow-lg animate-bounce">✨</div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-3xl font-black text-gray-900 italic tracking-tight">¡Validación Institucional Exitosa!</h3>
              <p className="text-gray-500 max-w-md mx-auto font-medium leading-relaxed">
                Su información ha sido verificada satisfactoriamente. Proceda al pago para oficializar la matrícula en el **Instituto Cristiano Misión Boston**.
              </p>
            </div>

            {/* Recibo Digital Estilizado */}
            <div className="relative mx-auto max-w-sm">
              <div className="bg-royal-blue p-10 rounded-t-[3rem] text-white border-b-2 border-dashed border-white/20">
                <p className="text-[10px] font-black text-blue-100 uppercase tracking-[0.3em] mb-3">Resumen de Pago 2024</p>
                <p className="text-6xl font-black tracking-tighter">$850.000</p>
                <div className="flex justify-center space-x-2 mt-4">
                   <span className="bg-white/10 px-3 py-1 rounded-lg text-[9px] font-bold uppercase">Concepto: Matrícula</span>
                   <span className="bg-white/10 px-3 py-1 rounded-lg text-[9px] font-bold uppercase">Validado</span>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-b-[3rem] border border-gray-100 border-t-0 text-left space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
                   <span>Seguro Estudiantil</span>
                   <span className="text-gray-900">Incluido</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
                   <span>Carnetización</span>
                   <span className="text-gray-900">Incluido</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-4 pt-6">
              <button className="bg-royal-blue text-white px-16 py-5 rounded-[2rem] font-black hover:bg-blue-800 shadow-2xl shadow-royal-blue/30 transform active:scale-95 transition-all text-xl flex items-center justify-center space-x-4">
                <span>Pagar con PSE / Crédito</span>
                <span className="text-2xl">💳</span>
              </button>
              <button className="text-royal-blue font-black text-xs uppercase tracking-widest hover:underline decoration-2 underline-offset-8">
                Descargar Recibo para Pago en Ventanilla
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer de Soporte */}
      <div className="text-center">
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
          ¿Problemas con el proceso? Contacte a: admisiones@misionboston.edu.co
        </p>
      </div>
    </div>
  );
};

export default Enrollment;
