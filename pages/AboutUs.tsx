
import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../constants';

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-royal-blue text-white py-4 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-4">
            <Logo className="w-12 h-12" />
            <h1 className="text-xl font-bold tracking-tight">Misión Boston</h1>
          </Link>
          <Link to="/" className="text-sm font-bold hover:text-school-yellow transition">
            &larr; Volver al Inicio
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-[400px] flex items-center justify-center text-white text-center">
        <img 
          src="https://images.unsplash.com/photo-1544717297-fa15c3902112?q=80&w=1600&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover brightness-[0.3]" 
          alt="School Spirit" 
        />
        <div className="relative z-10 px-6">
          <h2 className="text-5xl font-black mb-4 tracking-tighter italic">Nuestra Historia y Propósito</h2>
          <p className="text-xl max-w-2xl mx-auto font-medium opacity-90">Formando generaciones con excelencia académica y cimientos eternos.</p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <h3 className="text-3xl font-black text-royal-blue tracking-tight">Filosofía Educativa</h3>
          <p className="text-lg text-gray-600 leading-relaxed italic border-l-4 border-school-yellow pl-6">
            "Instruye al niño en su camino, y aun cuando fuere viejo no se apartará de él." <br />
            <span className="font-black text-gray-400 text-sm">— Proverbios 22:6</span>
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Creemos que la educación no es solo la transferencia de datos, sino la transformación del carácter. En Misión Boston, integramos la fe en cada asignatura, desde las matemáticas hasta las artes, reconociendo a Dios como la fuente de toda sabiduría.
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
              <span className="text-3xl block mb-2">📖</span>
              <p className="text-[10px] font-black uppercase text-gray-400">Sabiduría</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
              <span className="text-3xl block mb-2">🙏</span>
              <p className="text-[10px] font-black uppercase text-gray-400">Fe</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
              <span className="text-3xl block mb-2">❤️</span>
              <p className="text-[10px] font-black uppercase text-gray-400">Amor</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop" className="rounded-3xl shadow-lg w-full h-64 object-cover" alt="Classroom" />
          <img src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop" className="rounded-3xl shadow-lg w-full h-64 object-cover mt-12" alt="Students" />
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-royal-blue py-20 text-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          <div className="bg-white/10 p-10 rounded-[2.5rem] border border-white/20 backdrop-blur-sm">
            <h3 className="text-3xl font-black mb-6 text-school-yellow italic">Misión</h3>
            <p className="text-lg leading-relaxed opacity-90 font-medium">
              Brindar una educación de alta calidad bajo principios bíblicos, enfocada en el desarrollo integral del ser humano, potenciando habilidades cognitivas, espirituales y sociales para impactar positivamente a la sociedad.
            </p>
          </div>
          <div className="bg-white/10 p-10 rounded-[2.5rem] border border-white/20 backdrop-blur-sm">
            <h3 className="text-3xl font-black mb-6 text-school-yellow italic">Visión</h3>
            <p className="text-lg leading-relaxed opacity-90 font-medium">
              Para el año 2030, ser reconocidos como el colegio líder en formación cristiana y excelencia académica de la región, destacando por nuestros graduados íntegros, competentes y comprometidos con el servicio a Dios y al prójimo.
            </p>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-20 max-w-4xl mx-auto px-6 text-center space-y-8">
        <h3 className="text-3xl font-black text-gray-900 tracking-tight">Nuestra Historia</h3>
        <p className="text-lg text-gray-600 leading-relaxed">
          Fundado en el año 2004 por una visión pastoral de servir a la comunidad de Soledad 2000, el Instituto Cristiano Misión Boston comenzó con solo 15 estudiantes en una pequeña casa. Hoy, gracias a la bendición de Dios, contamos con una sede moderna y cientos de familias que confían en nuestro proyecto.
        </p>
        <div className="w-24 h-1 bg-school-yellow mx-auto rounded-full"></div>
        <p className="text-sm font-black text-royal-blue uppercase tracking-[0.3em]">Creciendo en Gracia y Sabiduría</p>
      </section>

      {/* Call to action */}
      <section className="bg-school-yellow py-12 mb-20 mx-6 rounded-[3rem] shadow-xl text-center">
        <h3 className="text-3xl font-black text-royal-blue mb-4">¿Quieres ser parte de nosotros?</h3>
        <p className="text-royal-blue/70 font-bold mb-8">Admisiones abiertas para todos los niveles.</p>
        <Link to="/admisiones" className="bg-royal-blue text-white px-12 py-4 rounded-2xl font-black text-lg hover:bg-blue-800 transition shadow-lg inline-block">
          Ver Proceso de Admisión
        </Link>
      </section>
    </div>
  );
};

export default AboutUs;
