
import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../constants';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-royal-blue text-white py-4 px-6 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-4">
              <Logo className="w-12 h-12" />
              <div>
                <h1 className="text-xl font-bold tracking-tight">Instituto Cristiano Misión Boston</h1>
                <p className="text-xs text-school-yellow italic">Sabiduría, Fe y Amor</p>
              </div>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8 text-sm font-medium">
            <Link to="/" className="hover:text-school-yellow transition">Inicio</Link>
            <Link to="/admisiones" className="hover:text-school-yellow transition">Admisiones</Link>
            <Link to="/nosotros" className="hover:text-school-yellow transition">Nuestro Colegio</Link>
            <a href="#contacto" className="hover:text-school-yellow transition">Contacto</a>
          </nav>
          <Link to="/login" className="bg-school-yellow text-royal-blue px-6 py-2 rounded-full font-bold hover:bg-yellow-400 transition transform hover:scale-105">
            Mi Misión Boston
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="relative h-[500px] flex items-center justify-center text-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1523050853064-8521a3030242?q=80&w=1600&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover brightness-[0.4]" 
          alt="Colegio Background" 
        />
        <div className="relative z-10 text-white px-4 max-w-4xl">
          <h2 className="text-5xl font-extrabold mb-6 drop-shadow-lg animate-fadeIn">Forjando Líderes con Valores Cristianos</h2>
          <p className="text-xl mb-8 drop-shadow-md animate-fadeIn" style={{ animationDelay: '0.2s' }}>Calidad educativa superior cimentada en principios bíblicos, formando corazones y mentes para el futuro.</p>
          <div className="flex flex-wrap justify-center gap-4 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <Link to="/admisiones" className="bg-royal-blue px-8 py-3 rounded-md font-semibold hover:bg-blue-800 transition shadow-lg text-white">
              Inscribir Ahora
            </Link>
            <Link to="/nosotros" className="bg-white text-royal-blue px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition shadow-lg">
              Conocer Más
            </Link>
          </div>
        </div>
      </section>

      {/* Stats/Icons */}
      <div className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-royal-blue text-4xl font-bold mb-2">20+</div>
            <div className="text-gray-600 uppercase text-xs font-semibold tracking-widest">Años de Excelencia</div>
          </div>
          <div>
            <div className="text-royal-blue text-4xl font-bold mb-2">500+</div>
            <div className="text-gray-600 uppercase text-xs font-semibold tracking-widest">Estudiantes Felices</div>
          </div>
          <div>
            <div className="text-royal-blue text-4xl font-bold mb-2">100%</div>
            <div className="text-gray-600 uppercase text-xs font-semibold tracking-widest">Valores Cristianos</div>
          </div>
          <div>
            <div className="text-royal-blue text-4xl font-bold mb-2">15:1</div>
            <div className="text-gray-600 uppercase text-xs font-semibold tracking-widest">Ratio Est/Prof</div>
          </div>
        </div>
      </div>

      {/* News Section */}
      <section id="noticias" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h3 className="text-3xl font-bold text-royal-blue mb-2">Últimas Noticias</h3>
              <p className="text-gray-600">Entérate de lo que sucede en nuestra comunidad.</p>
            </div>
            <button className="text-royal-blue font-bold border-b-2 border-royal-blue">Ver Todo</button>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                <img src={`https://picsum.photos/seed/${i + 10}/400/250`} className="w-full h-48 object-cover" alt="News" />
                <div className="p-6">
                  <span className="text-xs font-bold text-royal-blue bg-blue-50 px-2 py-1 rounded">NOTICIA</span>
                  <h4 className="text-xl font-bold mt-2 mb-3">Gran éxito en la semana cultural {2024 + i}</h4>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">Nuestros estudiantes demostraron su talento y fe en las presentaciones de música y arte del pasado viernes...</p>
                  <button className="text-royal-blue font-semibold text-sm">Leer más &rarr;</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contacto" className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <Logo className="w-14 h-14" />
              <div>
                <h4 className="text-2xl font-bold">Misión Boston</h4>
                <p className="text-school-yellow text-sm">Soledad 2000 Villa Monaco</p>
              </div>
            </div>
            <p className="text-gray-400 max-w-md">Transformamos vidas a través de una educación integral basada en principios bíblicos y excelencia académica.</p>
          </div>
          <div>
            <h5 className="text-lg font-bold mb-6">Enlaces Rápidos</h5>
            <ul className="space-y-3 text-gray-400">
              <li><Link to="/admisiones" className="hover:text-white transition">Admisiones</Link></li>
              <li><a href="#" className="hover:text-white transition">Calendario</a></li>
              <li><a href="#" className="hover:text-white transition">Paga en Línea</a></li>
              <li><Link to="/nosotros" className="hover:text-white transition">Nuestro Colegio</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-lg font-bold mb-6">Contacto</h5>
            <ul className="space-y-3 text-gray-400">
              <li>Calle Ficticia 123, Villa Mónaco</li>
              <li>(605) 123 4567</li>
              <li>contacto@misionboston.edu.co</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Instituto Cristiano Misión Boston. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
