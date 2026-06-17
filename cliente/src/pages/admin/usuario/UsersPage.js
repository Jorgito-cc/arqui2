import { UserPlus, Edit2, Trash2, Loader2 } from 'lucide-react';
import { usuarioService } from '../../../services/usuarioService';

import UserModal from './UserModal';
import './UsersPage.css';
import { useState, useEffect } from 'react';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para el modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await usuarioService.getUsuarios();
      setUsers(data);
    } catch (err) {
      setError('Error al cargar la lista de usuarios. Revisa la conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        await usuarioService.deleteUsuario(id);
        setUsers(users.filter((u) => u.id !== id));
      } catch (err) {
        alert('Error al eliminar el usuario.');
      }
    }
  };

  const openCreateModal = () => {
    setUserToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setUserToEdit(user);
    setIsModalOpen(true);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-info">
          <h1>Gestión de Usuarios</h1>
        </div>
        <button className="primary-button" onClick={openCreateModal}>
          <UserPlus size={18} />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      {/* Modal de Usuario */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchUsers}
        userToEdit={userToEdit} />
      

      {loading ?
      <div className="loading-state">
          <Loader2 className="animate-spin" size={40} />
          <p>Cargando personal...</p>
        </div> :
      error ?
      <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchUsers} className="retry-btn">Reintentar</button>
        </div> :

      <div className="glass-card table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) =>
            <tr key={user.id}>
                  <td>
                    <div className="user-cell">
                      <div className="avatar-sm">
                        {user.nombres[0]}{user.apellidos[0]}
                      </div>
                      <span>{user.nombres} {user.apellidos}</span>
                    </div>
                  </td>
                  <td>{user.correo}</td>
                  <td>
                    <span className="rol-badge">
                      {user.rol_id === 1 ? 'Administrador' : user.rol_id === 2 ? 'Mantenimiento' : 'Estudiante'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.activo ? 'activo' : 'inactivo'}`}>
                      {user.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button
                    title="Editar"
                    onClick={() => openEditModal(user)}>
                    
                        <Edit2 size={16} />
                      </button>
                      <button
                    title="Eliminar"
                    className="delete-btn"
                    onClick={() => user.id && handleDelete(user.id)}>
                    
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
            )}
            </tbody>
          </table>
          {users.length === 0 &&
        <div className="empty-state">No hay usuarios registrados.</div>
        }
        </div>
      }
    </div>);

};

export default UsersPage;