import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { ubicacionService } from '../../../services/ubicacionService';

import './LocationModal.css';








const AmbienteModal = ({ isOpen, onClose, onSuccess, ambienteToEdit }) => {
  const [formData, setFormData] = useState({
    nombre_ambiente: '',
    piso: 0,
    modulo_id: undefined
  });
  const [modulos, setModulos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadModulos();
      if (ambienteToEdit) {
        setFormData(ambienteToEdit);
      } else {
        setFormData({ nombre_ambiente: '', piso: 0, modulo_id: undefined });
      }
    }
  }, [isOpen, ambienteToEdit]);

  const loadModulos = async () => {
    try {
      setDataLoading(true);
      const data = await ubicacionService.getModulos();
      setModulos(data);
    } catch (err) {
      console.error('Error cargando módulos:', err);
    } finally {
      setDataLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (ambienteToEdit?.id) {
        await ubicacionService.updateAmbiente(ambienteToEdit.id, formData);
      } else {
        await ubicacionService.createAmbiente(formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      alert('Error al guardar el ambiente.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="location-modal-overlay">
      <div className="location-modal-container">
        <div className="location-modal-header">
          <h2>{ambienteToEdit ? 'Editar Ambiente' : 'Nuevo Ambiente'}</h2>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="location-form">
          <div className="form-group">
            <label>Nombre del Ambiente</label>
            <input
              type="text"
              required
              placeholder="Ej: Aula 12 / Laboratorio 1"
              value={formData.nombre_ambiente}
              onChange={(e) => setFormData({ ...formData, nombre_ambiente: e.target.value })} />
            
          </div>

          <div className="form-group">
            <label>Piso</label>
            <select
              required
              value={formData.piso ?? 0}
              onChange={(e) => setFormData({ ...formData, piso: parseInt(e.target.value) })}>
              
              <option value={0}>Planta Baja</option>
              <option value={1}>Piso 1</option>
              <option value={2}>Piso 2</option>
              <option value={3}>Piso 3</option>
              <option value={4}>Piso 4</option>
            </select>
          </div>

          <div className="form-group">
            <label>Módulo Perteneciente</label>
            <select
              required
              value={formData.modulo_id || ''}
              onChange={(e) => setFormData({ ...formData, modulo_id: parseInt(e.target.value) })}
              disabled={dataLoading}>
              
              <option value="">Selecciona un módulo...</option>
              {modulos.map((m) =>
              <option key={m.id} value={m.id}>Módulo {m.numero_modulo}</option>
              )}
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="secondary-btn" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="primary-btn" disabled={loading || dataLoading}>
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              <span>{ambienteToEdit ? 'Actualizar' : 'Registrar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>);

};

export default AmbienteModal;