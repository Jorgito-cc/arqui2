import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, Building2, FileText, Wrench } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const menuItems = [
  { id: 'usuarios', path: '/admin/usuarios', icon: Users, label: 'Gestión de Personal' },
  { id: 'ubicacion', path: '/admin/ubicacion', icon: Building2, label: 'Infraestructura' },
  { id: 'notas', path: '/admin/notas', icon: FileText, label: 'Incidencias Recibidas' },
  { id: 'asignaciones', path: '/admin/asignaciones', icon: Wrench, label: 'Órdenes de Trabajo' }];


  return (
    <aside className="sidebar-container">
      <div className="sidebar-header">
        <h3>Panel Administrativo</h3>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) =>
        <NavLink
          key={item.id}
          to={item.path}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          
            <item.icon className="nav-icon" size={18} />
            <span className="nav-label">{item.label}</span>
          </NavLink>
        )}
      </nav>

      <div className="sidebar-footer">
        <p>Examen Arqui 2026</p>
      </div>
    </aside>);

};

export default Sidebar;