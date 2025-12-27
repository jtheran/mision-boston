
import React, { useState } from 'react';
import { User, UserRole, PaymentRecord } from '../types';

const Payments: React.FC<{ user: User }> = ({ user }) => {
  const [isNotifying, setIsNotifying] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState<string | null>(null);

  const mockPayments: PaymentRecord[] = [
    { id: 'P001', studentId: '1', concept: 'Matrícula 2024', amount: 850000, status: 'PAID', date: '2024-01-15' },
    { id: 'P002', studentId: '1', concept: 'Pensión Febrero', amount: 350000, status: 'PAID', date: '2024-02-05' },
    { id: 'P003', studentId: '1', concept: 'Pensión Marzo', amount: 350000, status: 'PENDING', date: '2024-03-05' },
    { id: 'P004', studentId: '2', concept: 'Pensión Marzo', amount: 420000, status: 'PENDING', date: '2024-03-05' },
  ];

  const handleNotifyOverdue = async () => {
    setIsNotifying(true);
    setNotificationStatus("Iniciando envío de recordatorios...");
    
    // Simulación de proceso de red
    await new Promise(resolve => setTimeout(resolve, 2000));

    const pendingPayments = mockPayments.filter(p => p.status === 'PENDING');
    
    pendingPayments.forEach(payment => {
      // Simulación de envío automatizado (Email/WhatsApp API)
      console.log(`%c[NOTIFICACIÓN ENVIADA]`, 'color: #0038A8; font-weight: bold;', 
        `Enviando recordatorio de pago por ${payment.concept} ($${payment.amount}) al acudiente del estudiante ID: ${payment.studentId}.`);
    });

    setNotificationStatus(`Éxito: Se enviaron ${pendingPayments.length} notificaciones automáticas.`);
    setIsNotifying(false);

    // Limpiar mensaje después de 5 segundos
    setTimeout(() => setNotificationStatus(null), 5000);
  };

  const isAdminOrSecretaria = user.role === UserRole.ADMIN || user.role === UserRole.ADMINISTRATIVE;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight italic">Gestión de Cartera y Pagos</h2>
          <p className="text-gray-500 font-medium">Administra los costos educativos y facturación institucional.</p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          {isAdminOrSecretaria && (
            <button 
              onClick={handleNotifyOverdue}
              disabled={isNotifying}
              className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-black transition-all shadow-md transform active:scale-95 ${
                isNotifying ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-school-yellow text-royal-blue hover:bg-yellow-400'
              }`}
            >
              <span>{isNotifying ? '⏳' : '🔔'}</span>
              <span>{isNotifying ? 'Procesando...' : 'Enviar Recordatorios'}</span>
            </button>
          )}
          
          <button className="bg-green-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-green-700 transition flex items-center shadow-lg transform active:scale-95">
            <span className="mr-2">💳</span> Pagar Ahora (PSE / Tarjeta)
          </button>
        </div>
      </div>

      {notificationStatus && (
        <div className="bg-royal-blue text-white p-4 rounded-2xl flex items-center justify-between animate-fadeIn shadow-xl border-2 border-school-yellow/30">
          <div className="flex items-center space-x-3">
            <span className="text-xl">✅</span>
            <span className="text-sm font-bold tracking-wide">{notificationStatus}</span>
          </div>
          <button onClick={() => setNotificationStatus(null)} className="text-white/50 hover:text-white font-black">✕</button>
        </div>
      )}

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:border-royal-blue/30 transition-colors">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Total Pagado</p>
          <p className="text-3xl font-black text-gray-900 mt-2">$1.200.000</p>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 border-b-4 border-b-red-500">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Saldo Pendiente</p>
          <p className="text-3xl font-black text-red-600 mt-2">$770.000</p>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Becas Vigentes</p>
          <p className="text-2xl font-black text-royal-blue mt-2">10% Excelencia</p>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Vencimiento</p>
          <p className="text-2xl font-black text-gray-800 mt-2">05/03/2024</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
          <h3 className="font-black text-gray-900 italic text-xl">Historial de Transacciones</h3>
          <div className="flex space-x-2">
            <button className="bg-white text-royal-blue border border-gray-200 px-4 py-2 rounded-xl text-xs font-black hover:bg-gray-50 transition shadow-sm uppercase">Filtrar</button>
            <button className="bg-royal-blue text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-blue-800 transition shadow-sm uppercase">Exportar Reporte</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                <th className="px-8 py-5">Concepto</th>
                <th className="px-8 py-5">Fecha</th>
                <th className="px-8 py-5">Monto</th>
                <th className="px-8 py-5">Estado</th>
                <th className="px-8 py-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockPayments.map(payment => (
                <tr key={payment.id} className="hover:bg-blue-50/20 transition-colors group">
                  <td className="px-8 py-6">
                    <p className="font-black text-gray-800 italic">{payment.concept}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Referencia: {payment.id}</p>
                  </td>
                  <td className="px-8 py-6 text-sm text-gray-500 font-medium">{payment.date}</td>
                  <td className="px-8 py-6">
                    <span className="font-black text-gray-900 text-lg">${payment.amount.toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                      payment.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-500 animate-pulse border border-red-100'
                    }`}>
                      {payment.status === 'PAID' ? '✓ Pagado' : '⏳ Pendiente'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="bg-white border border-gray-100 p-2.5 rounded-xl text-royal-blue hover:bg-royal-blue hover:text-white transition-all shadow-sm group-hover:scale-105 transform">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-royal-blue p-10 rounded-[3rem] shadow-2xl relative overflow-hidden text-white flex flex-col md:flex-row items-center gap-10">
        <div className="absolute right-[-20px] top-[-20px] text-[10rem] font-black opacity-5 select-none leading-none rotate-12">💳</div>
        <div className="relative z-10 flex-1">
          <h3 className="text-2xl font-black mb-4 italic">Seguridad y Transparencia</h3>
          <p className="text-blue-100 font-medium leading-relaxed opacity-80 max-w-2xl">
            Todos nuestros procesos de recaudo están protegidos por estándares internacionales de seguridad. Recuerde que el Instituto Misión Boston no solicita información de tarjetas de crédito por teléfono o WhatsApp.
          </p>
        </div>
        <div className="bg-white/10 p-6 rounded-[2rem] border border-white/20 backdrop-blur-sm shrink-0">
          <p className="text-xs font-black uppercase text-school-yellow mb-2 tracking-widest">Soporte Financiero</p>
          <p className="font-bold text-lg">tesoreria@misionboston.edu.co</p>
        </div>
      </div>
    </div>
  );
};

export default Payments;
