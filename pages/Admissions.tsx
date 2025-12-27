
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../constants';

const Admissions: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-royal-blue text-white py-4 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-4">
            <Logo className="w-12 h-12" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">Misión Boston</h1>
              <p className="text-xs text-school-yellow italic">Admisiones 2025</p>
            </div>
          </Link>
          <Link to="/" className="text-sm font-bold hover:text-school-yellow transition">
            &larr; Volver al Inicio
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-12">
        {/* Process Info */}
        <div className="space-y-8">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Únete a nuestra Familia</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            En el Instituto Cristiano Misión Boston, buscamos formar líderes íntegros. Nuestro proceso de admisión está diseñado para conocer a cada familia y asegurar una alineación con nuestros valores cristianos.
          </p>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-royal-blue">Proceso de Admisión</h3>
            <div className="space-y-4">
              {[
                { step: '1', title: 'Formulario de Interés', desc: 'Diligencia el formulario en esta página para iniciar el contacto.' },
                { step: '2', title: 'Entrevista Familiar', desc: 'Una reunión con rectoría para conocer nuestro proyecto educativo.' },
                { step: '3', title: 'Pruebas Diagnósticas', desc: 'Evaluación de competencias académicas y psicoemocionales.' },
                { step: '4', title: 'Matrícula Oficial', desc: 'Entrega de documentos y pago de derechos de matrícula.' },
              ].map((item) => (
                <div key={item.step} className="flex space-x-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-royal-blue transition">
                  <div className="w-10 h-10 bg-royal-blue text-white rounded-full flex items-center justify-center font-black flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 h-fit sticky top-24">
          {submitted ? (
            <div className="text-center py-12 space-y-6">
              <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-4xl mx-auto border-4 border-green-100">✓</div>
              <h3 className="text-2xl font-black text-gray-900">¡Solicitud Enviada!</h3>
              <p className="text-gray-500">Nuestro equipo de admisiones se pondrá en contacto contigo en las próximas 24 horas hábiles.</p>
              <button onClick={() => setSubmitted(false)} className="text-royal-blue font-bold text-sm hover:underline">Enviar otra solicitud</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Solicitar Cupo</h3>
                <p className="text-sm text-gray-500">Completa tus datos y nos contactaremos contigo.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1">Nombre Completo del Padre/Madre</label>
                  <input required type="text" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-royal-blue outline-none transition text-gray-900 shadow-sm" placeholder="Ej: Juan Pérez" />
                </div>
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1">Correo Electrónico</label>
                  <input required type="email" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-royal-blue outline-none transition text-gray-900 shadow-sm" placeholder="correo@ejemplo.com" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1">Teléfono</label>
                    <input required type="tel" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-royal-blue outline-none transition text-gray-900 shadow-sm" placeholder="300 123 4567" />
                  </div>
                  <div>
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1">Grado de Interés</label>
                    <select required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-royal-blue outline-none transition bg-white text-gray-900 font-medium">
                      <option value="" className="text-gray-900">Seleccione...</option>
                      <option value="transicion" className="text-gray-900">Transición</option>
                      <option value="primaria" className="text-gray-900">Primaria</option>
                      <option value="secundaria" className="text-gray-900">Secundaria</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1">¿Cómo nos conociste?</label>
                  <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-royal-blue outline-none transition bg-white text-gray-900 font-medium">
                    <option value="web" className="text-gray-900">Búsqueda Web</option>
                    <option value="redes" className="text-gray-900">Redes Sociales</option>
                    <option value="referido" className="text-gray-900">Referencia Familiar</option>
                    <option value="otro" className="text-gray-900">Otro</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full bg-royal-blue text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-800 transition shadow-xl transform active:scale-95">
                Iniciar Proceso de Admisión
              </button>
              
              <p className="text-[10px] text-gray-400 text-center uppercase font-bold">Al enviar, aceptas nuestras políticas de tratamiento de datos.</p>
            </form>
          )}
        </div>
      </main>

      {/* Footer Info */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-black text-gray-900 mb-8 italic">Requisitos Documentales</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <span className="text-2xl block mb-2">📄</span>
              <p className="font-bold text-gray-800">Registro Civil</p>
              <p className="text-sm text-gray-500">Copia auténtica del menor.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <span className="text-2xl block mb-2">🏥</span>
              <p className="font-bold text-gray-800">Seguro Médico</p>
              <p className="text-sm text-gray-500">Certificado de EPS o Prepago.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <span className="text-2xl block mb-2">🎓</span>
              <p className="font-bold text-gray-800">Certificados</p>
              <p className="text-sm text-gray-500">De años anteriores (si aplica).</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Admissions;
