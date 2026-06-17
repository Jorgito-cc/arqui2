import React, { useState, useEffect } from 'react';
import { Plus, Building2, Layers, Home, Edit, Trash2, Loader2 } from 'lucide-react';
import { ubicacionService } from '../../../services/ubicacionService';

import FacultadModal from './FacultadModal';
import ModuloModal from './ModuloModal';
import AmbienteModal from './AmbienteModal';
import './LocationsPage.css';

const LocationsPage = () => {
  const [activeSubTab, setActiveSubTab] = useState('facultades');
  const [loading, setLoading] = useState(true);

  // Estados para datos reales
  const [facultades, setFacultades] = useState([]);
  const [modulos, setModulos] = useState([]);
  const [ambientes, setAmbientes] = useState([]);

  // Estados para Modals
  const [isFacultadModalOpen, setIsFacultadModalOpen] = useState(false);
  const [isModuloModalOpen, setIsModuloModalOpen] = useState(false);
  const [isAmbienteModalOpen, setIsAmbienteModalOpen] = useState(false);

  // Estados para Edición
  const [selectedFacultad, setSelectedFacultad] = useState(null);
  const [selectedModulo, setSelectedModulo] = useState(null);
  const [selectedAmbiente, setSelectedAmbiente] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [fData, mData, aData] = await Promise.all([
      ubicacionService.getFacultades(),
      ubicacionService.getModulos(),
      ubicacionService.getAmbientes()]
      );
      setFacultades(fData);
      setModulos(mData);
      setAmbientes(aData);
    } catch (err) {
      console.error('Error al cargar datos de ubicación:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (type, id) => {
    const confirmMsg = type === 'facultad' ?
    '¿Estás seguro? Se eliminarán todos los módulos y ambientes asociados a esta facultad.' :
    '¿Estás seguro de eliminar este registro?';

    if (window.confirm(confirmMsg)) {
      try {
        if (type === 'facultad') await ubicacionService.deleteFacultad(id);
        if (type === 'modulo') await ubicacionService.deleteModulo(id);
        if (type === 'ambiente') await ubicacionService.deleteAmbiente(id);
        fetchData(); // Recargar todo para reflejar cambios en cascada
      } catch (err) {
        alert('Error al eliminar el registro.');
      }
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        
        <div className="header-info">
          <h1>Infraestructura</h1>
          
        </div>
      </div>

      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeSubTab === 'facultades' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('facultades')}>
          
          <Building2 size={18} />
          <span>Facultades</span>
        </button>
        <button
          className={`tab-btn ${activeSubTab === 'modulos' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('modulos')}>
          
          <Layers size={18} />
          <span>Módulos</span>
        </button>
        <button
          className={`tab-btn ${activeSubTab === 'ambientes' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('ambientes')}>
          
          <Home size={18} />
          <span>Ambientes</span>
        </button>
      </div>

      <div className="glass-card table-container">
        <div className="table-header-row">
          <h3>Lista de {activeSubTab.charAt(0).toUpperCase() + activeSubTab.slice(1)}</h3>
          <button
            className="add-btn"
            onClick={() => {
              if (activeSubTab === 'facultades') {setSelectedFacultad(null);setIsFacultadModalOpen(true);}
              if (activeSubTab === 'modulos') {setSelectedModulo(null);setIsModuloModalOpen(true);}
              if (activeSubTab === 'ambientes') {setSelectedAmbiente(null);setIsAmbienteModalOpen(true);}
            }}>
            
            <Plus size={16} />
            <span>Agregar {activeSubTab.slice(0, -1)}</span>
          </button>
        </div>

        {loading ?
        <div className="loading-state">
            <Loader2 className="animate-spin" size={32} />
            <p>Cargando datos...</p>
          </div> :

        <table className="custom-table">
            <thead>
              {activeSubTab === 'facultades' &&
            <tr>
                  <th>Nombre</th>
                  <th>Abreviatura</th>
                  <th>Acciones</th>
                </tr>
            }
              {activeSubTab === 'modulos' &&
            <tr>
                  <th>Nro Módulo</th>
                  <th>Facultad</th>
                  <th>Acciones</th>
                </tr>
            }
              {activeSubTab === 'ambientes' &&
            <tr>
                  <th>Nombre Ambiente</th>
                  <th>Piso</th>
                  <th>Módulo</th>
                  <th>Acciones</th>
                </tr>
            }
            </thead>
            <tbody>
              {activeSubTab === 'facultades' && facultades.map((f) =>
            <tr key={f.id}>
                  <td>{f.nombre}</td>
                  <td><span className="code-badge">{f.abreviatura}</span></td>
                  <td>
                    <div className="actions-cell">
                      <button className="edit-btn" onClick={() => {setSelectedFacultad(f);setIsFacultadModalOpen(true);}}><Edit size={16} /></button>
                      <button className="delete-btn" onClick={() => f.id && handleDelete('facultad', f.id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
            )}
              {activeSubTab === 'modulos' && modulos.map((m) =>
            <tr key={m.id}>
                  <td>Módulo {m.numero_modulo}</td>
                  <td>{facultades.find((f) => f.id === m.facultad_id)?.nombre || 'N/A'}</td>
                  <td>
                    <div className="actions-cell">
                      <button className="edit-btn" onClick={() => {setSelectedModulo(m);setIsModuloModalOpen(true);}}><Edit size={16} /></button>
                      <button className="delete-btn" onClick={() => m.id && handleDelete('modulo', m.id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
            )}
              {activeSubTab === 'ambientes' && ambientes.map((a) =>
            <tr key={a.id}>
                  <td>{a.nombre_ambiente}</td>
                  <td>{a.piso !== undefined ? `Piso ${a.piso}` : 'N/A'}</td>
                  <td>Módulo {modulos.find((m) => m.id === a.modulo_id)?.numero_modulo || 'N/A'}</td>
                  <td>
                    <div className="actions-cell">
                      <button className="edit-btn" onClick={() => {setSelectedAmbiente(a);setIsAmbienteModalOpen(true);}}><Edit size={16} /></button>
                      <button className="delete-btn" onClick={() => a.id && handleDelete('ambiente', a.id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
            )}
            </tbody>
          </table>
        }
      </div>

      {/* Modals */}
      <FacultadModal
        isOpen={isFacultadModalOpen}
        onClose={() => setIsFacultadModalOpen(false)}
        onSuccess={fetchData}
        facultadToEdit={selectedFacultad} />
      
      <ModuloModal
        isOpen={isModuloModalOpen}
        onClose={() => setIsModuloModalOpen(false)}
        onSuccess={fetchData}
        moduloToEdit={selectedModulo} />
      
      <AmbienteModal
        isOpen={isAmbienteModalOpen}
        onClose={() => setIsAmbienteModalOpen(false)}
        onSuccess={fetchData}
        ambienteToEdit={selectedAmbiente} />
      
    </div>);

};

export default LocationsPage;