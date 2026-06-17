import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import './AdminLayout.css';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/', { replace: true });
  };

  const activeTab = location.pathname.split('/').pop() || 'admin';

  return (
    <div className="admin-layout">
      <Sidebar />
      
      <div className="admin-wrapper">
        <header className="admin-header">
          <div className="header-breadcrumbs">
            <span>Inicio</span> / <span className="active-bc">{activeTab}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Cerrar Sesión</button>
        </header>

        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>);

};

export default AdminLayout;