
import React, { useState } from 'react';
import { User } from '../types';

const Enrollment: React.FC<{ user: User }> = ({ user }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', grade: '', comments: '' });
  const [errors, setErrors] = useState<{ name?: string; grade?: string }>({});
  
  const documents = [
    { id: 'doc1', name: 'Documento Identidad Estudiante', status: 'Cargado', date: '2024-01-10' },
    { id: 'doc2', name: 'Certificados Años Anteriores', status: 'Pendiente', date: '-' },
    { id: 'doc3', name: 'Carnet de Vacunación', status: 'En Revisión', date: '2024-01-11' },
  ];

  const handleNextStep1 = () => {
    const newErrors: { name?: string; grade?: string } = {};
    if (!formData.name) newErrors.name = 'El nombre es obligatorio';
    if (!formData.grade) newErrors.grade = 'Debe seleccionar un grado';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setStep(2);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-royal-blue">Proceso de Matrícula 2024</h2>
        <p className="text-gray-500 mt-2">Sabiduría, Fe y Amor en cada paso de su formación.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-12 px-4 relative">
        <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200 -z-0"></div>
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex flex-col items-center relative z-10 bg-gray-100 px-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors duration-500 ${
              step >= s ? 'bg-royal-blue text-white shadow-lg' : 'bg-white text-gray-400 border-2 border-gray-200'
            }`}>
              {s}
            </div>
            <span className={`text-[10px] mt-2 font-bold uppercase tracking-tighter ${step >= s ? 'text-royal-blue' : 'text-gray-400'}`}>
              {s === 1 ? 'Datos' : s === 2 ? 'Documentos' : 'Finalizar'}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        {step === 1 && (
          <div className="space-y-6">
            <div className="border-b pb-4 mb-6">
              <h3 className="text-xl font-bold text-gray-800">1. Información del Estudiante</h3>
              <p className="text-sm text-gray-500">Diligencie los datos básicos del aspirante.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Nombres Completos</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 outline-none transition text-gray-900 ${errors.name ? 'border-red-500 ring-red-50' : 'border-gray-200 focus:ring-royal-blue'}`}
                  placeholder="Ej: Mateo Rodríguez"
                />
                {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.name}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Grado al que Aspira</label>
                <select 
                  value={formData.grade}
                  onChange={(e) => setFormData({...formData, grade: e.target.value})}
                  className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 outline-none transition bg-white text-gray-900 font-medium ${errors.grade ? 'border-red-500 ring-red-50' : 'border-gray-200 focus:ring-royal-blue'}`}
                >
                  <option value="" className="text-gray-900">Seleccione...</option>
                  <option value="transicion" className="text-gray-900">Transición</option>
                  <option value="primero" className="text-gray-900">Primero de Primaria</option>
                  <option value="segundo" className="text-gray-900">Segundo de Primaria</option>
                </select>
                {errors.grade && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.grade}</p>}
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Observaciones Médicas</label>
                <textarea 
                  value={formData.comments}
                  onChange={(e) => setFormData({...formData, comments: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-royal-blue outline-none h-24 text-gray-900"
                  placeholder="Alergias, medicamentos, etc..."
                />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button 
                onClick={handleNextStep1}
                className="bg-royal-blue text-white px-10 py-3 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-md transform active:scale-95"
              >
                Continuar Proceso →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="border-b pb-4 mb-6">
              <h3 className="text-xl font-bold text-gray-800">2. Carga de Documentación</h3>
              <p className="text-sm text-gray-500">Suba los archivos escaneados en formato PDF o Imagen.</p>
            </div>
            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors gap-4">
                  <div>
                    <p className="font-bold text-gray-800">{doc.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`w-2 h-2 rounded-full ${doc.status === 'Cargado' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{doc.status}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button className="text-royal-blue text-sm font-bold border border-royal-blue px-4 py-1.5 rounded-lg hover:bg-blue-50">Subir Archivo</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-6 border-t">
              <button onClick={() => setStep(1)} className="text-gray-400 font-bold px-4 py-2 hover:text-royal-blue transition underline">← Regresar</button>
              <button onClick={() => setStep(3)} className="bg-royal-blue text-white px-10 py-3 rounded-xl font-bold hover:bg-blue-800 shadow-md">Validar y Seguir →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-8 space-y-6">
            <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-5xl mx-auto border-4 border-green-100">✓</div>
            <h3 className="text-2xl font-black text-gray-800 tracking-tight">¡Validación Exitosa!</h3>
            <p className="text-gray-500 max-w-sm mx-auto">Su información ha sido verificada. Realice el pago para oficializar su matrícula en el periodo 2024.</p>
            <div className="bg-blue-50 p-8 rounded-3xl inline-block w-full max-w-md border border-blue-100">
              <p className="text-xs font-bold text-royal-blue uppercase tracking-widest mb-1">Costo de Matrícula</p>
              <p className="text-5xl font-black text-gray-900">$850.000</p>
              <p className="text-[10px] text-gray-400 mt-2">Incluye: Seguro estudiantil y carnetización.</p>
            </div>
            <div className="flex flex-col space-y-3 pt-4">
              <button className="bg-royal-blue text-white px-16 py-4 rounded-2xl font-black hover:bg-blue-800 shadow-xl transform active:scale-95 transition-all text-lg">
                Pagar con PSE / Crédito
              </button>
              <button className="text-royal-blue font-bold text-sm">Descargar recibo para pago físico</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Enrollment;
