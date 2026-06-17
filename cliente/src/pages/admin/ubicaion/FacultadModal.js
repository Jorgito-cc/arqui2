import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { ubicacionService } from '../../../services/ubicacionService';

import './LocationModal.css';








const FacultadModal = ({ isOpen, onClose, onSuccess, facultadToEdit }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    abreviatura: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (facultadToEdit) {
        setFormData(facultadToEdit);
      } else {
        setFormData({ nombre: '', abreviatura: '' });
      }
    }
  }, [isOpen, facultadToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (facultadToEdit?.id) {
        await ubicacionService.updateFacultad(facultadToEdit.id, formData);
      } else {
        await ubicacionService.createFacultad(formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      alert('Error al guardar la facultad.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="location-modal-overlay">
      <div className="location-modal-container">
        <div className="location-modal-header">
          <h2>{facultadToEdit ? 'Editar Facultad' : 'Nueva Facultad'}</h2>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="location-form">
          <div className="form-group">
            <label>Nombre de la Facultad</label>
            <input
              type="text"
              required
              placeholder="Ej: Facultad de Ciencias Exactas"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
            
          </div>
          
          <div className="form-group">
            <label>Abreviatura / Código</label>
            <input
              type="text"
              required
              placeholder="Ej: FICCT"
              value={formData.abreviatura}
              onChange={(e) => setFormData({ ...formData, abreviatura: e.target.value })} />
            
          </div>

          <div className="modal-actions">
            <button type="button" className="secondary-btn" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              <span>{facultadToEdit ? 'Actualizar' : 'Registrar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>);

};

export default FacultadModal;