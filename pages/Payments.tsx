
import React from 'react';
import { User, PaymentRecord } from '../types';

const Payments: React.FC<{ user: User }> = ({ user }) => {
  const mockPayments: PaymentRecord[] = [
    { id: 'P001', studentId: '1', concept: 'Matrícula 2024', amount: 850000, status: 'PAID', date: '2024-01-15' },
    { id: 'P002', studentId: '1', concept: 'Pensión Febrero', amount: 350000, status: 'PAID', date: '2024-02-05' },
    { id: 'P003', studentId: '1', concept: 'Pensión Marzo', amount: 350000, status: 'PENDING', date: '2024-03-05' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Cartera y Pagos</h2>
          <p className="text-gray-500">Administra los costos educativos y facturación.</p>
        </div>
        <button className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition flex items-center shadow-lg">
          <span className="mr-2">💳</span> Pagar Ahora (PSE / Tarjeta)
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-royal-blue">
          <p className="text-gray-400 text-xs font-bold uppercase">Total Pagado</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">$1.200.000</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-red-500">
          <p className="text-gray-400 text-xs font-bold uppercase">Saldo Pendiente</p>
          <p className="text-2xl font-bold text-red-600 mt-1">$350.000</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-school-yellow">
          <p className="text-gray-400 text-xs font-bold uppercase">Becas Vigentes</p>
          <p className="text-2xl font-bold text-royal-blue mt-1">10% Excelencia</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-gray-300">
          <p className="text-gray-400 text-xs font-bold uppercase">Próximo Vencimiento</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">05/03/2024</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Historial de Transacciones</h3>
          <button className="text-royal-blue text-sm font-bold hover:underline">Exportar Reporte</button>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
            <tr>
              <th className="px-6 py-4">Concepto</th>
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4">Monto</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4">Soporte</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {mockPayments.map(payment => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-800">{payment.concept}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{payment.date}</td>
                <td className="px-6 py-4 font-bold">${payment.amount.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    payment.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700 animate-pulse'
                  }`}>
                    {payment.status === 'PAID' ? 'Pagado' : 'Pendiente'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-royal-blue text-xs font-bold hover:underline">Recibo PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;
