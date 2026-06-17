import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Lock, Compass, Activity } from 'lucide-react';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <header className="home-nav">
        <div className="home-logo">
         
        </div>
        <button className="login-link-btn" onClick={() => navigate('/login')}>
          Ingresar
          
        </button>
      </header>

      <main className="home-hero">
        <div className="hero-content">
          <div className="badge">Plataforma de Registro de Fallas</div>
          <h1>Notifica un <span className="highlight">problema</span> en el campus fácilmente.</h1>
          <p>¿Detectaste una falla en las instalaciones? Regístrala en segundos para que el equipo técnico la atienda.</p>
          
          <div className="hero-actions">
            <button className="cta-button" onClick={() => navigate('/reportar')}>
              <span>Registrar Falla</span>
              <Bell size={19} />
            </button>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="glass-card feature-card">
            <Lock className="feature-icon primary" size={22} />
            <h3>Acceso Seguro</h3>
            <p>Identificación verificada mediante credenciales institucionales.</p>
          </div>
          <div className="glass-card feature-card offset">
            <Compass className="feature-icon accent" size={22} />
            <h3>Localización Exacta</h3>
            <p>Indica la facultad, bloque y aula donde ocurrió la incidencia.</p>
          </div>
          <div className="glass-card feature-card">
            <Activity className="feature-icon secondary" size={22} />
            <h3>Estado en Tiempo Real</h3>
            <p>El reporte avanza por estados hasta su resolución definitiva.</p>
          </div>
        </div>
      </main>

  
      
      <footer className="home-footer">
        <p></p>
      </footer>
    </div>);

};

export default HomePage;