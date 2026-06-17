import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { ubicacionService } from '../../../services/ubicacionService';

import './LocationModal.css';








const ModuloModal = ({ isOpen, onClose, onSuccess, moduloToEdit }) => {
  const [formData, setFormData] = useState({
    numero_modulo: '',
    facultad_id: undefined
  });
  const [facultades, setFacultades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadFacultades();
      if (moduloToEdit) {
        setFormData(moduloToEdit);
      } else {
        setFormData({ numero_modulo: '', facultad_id: undefined });
      }
    }
  }, [isOpen, moduloToEdit]);

  const loadFacultades = async () => {
    try {
      setDataLoading(true);
      const data = await ubicacionService.getFacultades();
      setFacultades(data);
    } catch (err) {
      console.error('Error cargando facultades:', err);
    } finally {
      setDataLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (moduloToEdit?.id) {
        await ubicacionService.updateModulo(moduloToEdit.id, formData);
      } else {
        await ubicacionService.createModulo(formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      alert('Error al guardar el módulo.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="location-modal-overlay">
      <div className="location-modal-container">
        <div className="location-modal-header">
          <h2>{moduloToEdit ? 'Editar Módulo' : 'Nuevo Módulo'}</h2>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="location-form">
          <div className="form-group">
            <label>Número de Módulo</label>
            <input
              type="text"
              required
              placeholder="Ej: 236"
              value={formData.numero_modulo}
              onChange={(e) => setFormData({ ...formData, numero_modulo: e.target.value })} />
            
          </div>
          
          <div className="form-group">
            <label>Facultad Perteneciente</label>
            <select
              required
              value={formData.facultad_id || ''}
              onChange={(e) => setFormData({ ...formData, facultad_id: parseInt(e.target.value) })}
              disabled={dataLoading}>
              
              <option value="">Selecciona una facultad...</option>
              {facultades.map((f) =>
              <option key={f.id} value={f.id}>{f.nombre} ({f.abreviatura})</option>
              )}
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="secondary-btn" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="primary-btn" disabled={loading || dataLoading}>
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              <span>{moduloToEdit ? 'Actualizar' : 'Registrar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>);

};

export default ModuloModal;