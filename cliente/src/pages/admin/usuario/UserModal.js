import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { usuarioService } from '../../../services/usuarioService';
import { ubicacionService } from '../../../services/ubicacionService';


import './UserModal.css';








const UserModal = ({ isOpen, onClose, onSuccess, userToEdit }) => {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    correo: '',
    telefono: '',
    password: '',
    rol_id: 3, // Estudiante por defecto
    facultad_id: undefined
  });

  const [roles, setRoles] = useState([]);
  const [facultades, setFacultades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadDependencies();
      if (userToEdit) {
        setFormData({ ...userToEdit, password: '' });
      } else {
        setFormData({
          nombres: '',
          apellidos: '',
          correo: '',
          telefono: '',
          password: '',
          rol_id: 3,
          facultad_id: undefined
        });
      }
    }
  }, [isOpen, userToEdit]);

  const loadDependencies = async () => {
    try {
      setDataLoading(true);
      const [rolesData, facultadesData] = await Promise.all([
      usuarioService.getRoles(),
      ubicacionService.getFacultades()]
      );
      setRoles(rolesData);
      setFacultades(facultadesData);
    } catch (err) {
      console.error('Error al cargar dependencias:', err);
    } finally {
      setDataLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (userToEdit?.id) {
        // Clonamos los datos y eliminamos password si está vacío para no sobreescribir con hash de ""
        const dataToUpdate = { ...formData };
        if (!dataToUpdate.password || dataToUpdate.password.trim() === '') {
          delete dataToUpdate.password;
        }
        await usuarioService.updateUsuario(userToEdit.id, dataToUpdate);
      } else {
        await usuarioService.createUsuario(formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      const mensajeError = err.response?.data?.error || 'Error al guardar el usuario. Verifica que el correo no esté duplicado.';
      alert(mensajeError);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="glass-card modal-container animate-fade-in">
        <div className="modal-header">
          <h2>{userToEdit ? 'Editar Usuario' : 'Registrar Nuevo Personal'}</h2>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Nombres</label>
              <input
                type="text"
                required
                value={formData.nombres}
                onChange={(e) => setFormData({ ...formData, nombres: e.target.value })} />
              
            </div>
            <div className="form-group">
              <label>Apellidos</label>
              <input
                type="text"
                required
                value={formData.apellidos}
                onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })} />
              
            </div>
            <div className="form-group">
              <label>Correo Electrónico</label>
              <input
                type="email"
                required
                value={formData.correo}
                onChange={(e) => setFormData({ ...formData, correo: e.target.value })} />
              
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="text"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} />
              
            </div>
            <div className="form-group">
              <label>Contraseña {userToEdit && '(dejar vacío para no cambiar)'}</label>
              <input
                type="password"
                required={!userToEdit}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
              
            </div>
            <div className="form-group">
              <label>Rol del Sistema</label>
              <select
                required
                value={formData.rol_id}
                onChange={(e) => setFormData({ ...formData, rol_id: parseInt(e.target.value) })}>
                
                {roles.map((rol) =>
                <option key={rol.id} value={rol.id}>{rol.nombre_rol}</option>
                )}
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="submit-btn" disabled={loading || dataLoading}>
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              <span>{userToEdit ? 'Actualizar' : 'Registrar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>);

};

export default UserModal;