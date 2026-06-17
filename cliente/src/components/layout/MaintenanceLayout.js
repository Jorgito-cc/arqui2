import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { LogOut, Wrench } from 'lucide-react';
import './MaintenanceLayout.css';

const MaintenanceLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/', { replace: true });
  };

  return (
    <div className="maintenance-layout">
      <header className="maintenance-header">
        <div className="header-brand">
          <Wrench size={20} />
          <span></span>
        </div>

        <div className="header-actions">
          <div className="user-pill">
            <span>Personal </span>
          </div>
          <button onClick={handleLogout} className="logout-pill" title="Cerrar Sesión">
            <LogOut size={16} />
            <span>Salir</span>
          </button>
        </div>
      </header>

      <main className="maintenance-content">
        <Outlet />
      </main>
    </div>);

};

export default MaintenanceLayout;