import React, { useState, useEffect } from 'react';
import { Play, CheckCircle2, Clock, MapPin, Camera, Loader2, Upload } from 'lucide-react';
import { reporteService } from '../../../services/reporteService';
import { gestionService } from '../../../services/gestionService';

import './EncargadoPage.css';






const EncargadoPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // Para la subida de fotos
  const [selectedTaskForPhoto, setSelectedTaskForPhoto] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const getCurrentUserId = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.uid || payload.id || null;
    } catch {
      return null;
    }
  };

  const fetchMyTasks = async () => {
    try {
      setLoading(true);
      const uid = getCurrentUserId();
      if (!uid) {
        alert("Sesión inválida. Vuelve a iniciar sesión.");
        return;
      }

      const [asignacionesBD, notasBD] = await Promise.all([
      gestionService.getAsignaciones(),
      reporteService.getNotasProblema()]
      );

      // 1. Filtrar las asignaciones que son mías y están activas
      const misAsignaciones = asignacionesBD.filter((asig) => asig.usuario_id === uid && asig.activo);

      // 2. Extraer todos los detalles de las notas
      const allDetalles = [];
      notasBD.forEach((nota) => {
        if (nota.detalles) {
          nota.detalles.forEach((d) => {
            allDetalles.push({ ...d, nota_id: nota.id });
          });
        }
      });

      // 3. Cruzar la información (Asignación -> Detalle)
      const misTareasCruzadas = [];
      misAsignaciones.forEach((asig) => {
        const detalleEncontrado = allDetalles.find((d) => d.id === asig.detalle_problema_id);
        if (detalleEncontrado) {
          misTareasCruzadas.push({
            ...detalleEncontrado,
            asignacion_id: asig.id
          });
        }
      });

      setTasks(misTareasCruzadas);

    } catch (err) {
      console.error("Error cargando tareas del encargado", err);
    } finally {
      setLoading(false);
    }
  };

  const startTask = async (task) => {
    setActionLoading(task.id);
    try {
      // 1. Registrar el historial
      await gestionService.createHistorial({
        tipo: 'Cambio de Estado',
        estado: 'En Proceso',
        asignacion_id: task.asignacion_id,
        comentario_tecnico: 'El técnico ha comenzado la reparación/revisión.'
      });

      // 2. Cambiar estado del detalle en Reportes
      await reporteService.updateDetalle(task.id, { estado_actual: 'En Proceso' });

      // 3. Actualizar UI
      setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, estado_actual: 'En Proceso' } : t));
    } catch (err) {
      alert("Error al iniciar la tarea. Revisa consola.");
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const finishTask = async (task) => {
    if (!photoFile) {
      alert("Debes adjuntar una fotografía como evidencia para finalizar la tarea.");
      return;
    }
    setActionLoading(task.id);

    try {
      // 1. Subir la Evidencia (Foto) usando FormData
      const formData = new FormData();
      formData.append('foto', photoFile);
      formData.append('asignacion_id', task.asignacion_id.toString());
      formData.append('momento', 'Despues'); // Momento final

      await gestionService.createEvidencia(formData);

      // 2. Registrar en Historial
      await gestionService.createHistorial({
        tipo: 'Cambio de Estado',
        estado: 'Finalizado',
        asignacion_id: task.asignacion_id,
        comentario_tecnico: 'Labor concluida y evidencia adjuntada exitosamente.'
      });

      // 3. Cambiar estado maestro del Problema a Finalizado
      await reporteService.updateDetalle(task.id, { estado_actual: 'Finalizado' });

      // 4. Actualizar UI
      setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, estado_actual: 'Finalizado' } : t));
      setSelectedTaskForPhoto(null);
      setPhotoFile(null);
    } catch (err) {
      alert("Error al intentar finalizar la tarea y subir evidencia.");
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loader2 className="animate-spin" size={48} />
        <p>Sincronizando tareas diarias...</p>
      </div>);

  }

  return (
    <div className="encargado-container animate-fade-in">
      <div className="encargado-header">
        <h1>Mi Planilla de Trabajo</h1>
        <p>Listado de problemas que te asignó el Decano. Debes resolverlos y subir evidencia fotográfica.</p>
      </div>

      <div className="stats-grid">
        <div className="glass-card stat-item">
          <span className="stat-label">Pendientes</span>
          <span className="stat-value">{tasks.filter((t) => t.estado_actual === 'Asignado' || t.estado_actual === 'Pendiente').length}</span>
        </div>
        <div className="glass-card stat-item">
          <span className="stat-label">En Proceso</span>
          <span className="stat-value highlight-text">{tasks.filter((t) => t.estado_actual === 'En Proceso').length}</span>
        </div>
        <div className="glass-card stat-item">
          <span className="stat-label">Resueltas</span>
          <span className="stat-value success-text">{tasks.filter((t) => t.estado_actual === 'Finalizado').length}</span>
        </div>
      </div>

      <div className="tasks-grid">
        {tasks.length === 0 ?
        <div className="empty-state glass-card" style={{ gridColumn: '1 / -1' }}>
            <CheckCircle2 size={48} />
            <p>No tienes tareas asignadas actualmente. </p>
          </div> :

        tasks.map((task) =>
        <div key={task.id} className={`glass-card task-card ${(task.estado_actual || 'Pendiente').toLowerCase().replace(' ', '-')}`}>
              <div className="task-badge-row">
                <span className={`priority-badge`}>{task.tipo_incidencia?.nombre_tipo || 'Desconocido'}</span>
                <span className={`status-text`}>
                  {(task.estado_actual === 'Asignado' || task.estado_actual === 'Pendiente') && <Clock size={14} />}
                  {task.estado_actual === 'En Proceso' && <Play size={14} />}
                  {task.estado_actual === 'Finalizado' && <CheckCircle2 size={14} />}
                  {task.estado_actual}
                </span>
              </div>

              <h3>{task.descripcion}</h3>

              <div className="task-meta">
                <MapPin size={16} />
                <span>
                  {task.ambiente ? `${task.ambiente.nombre_ambiente} (Piso ${task.ambiente.piso})` : `Ambiente ID: ${task.ambiente_id}`}
                </span>
              </div>

              <div className="task-actions">
                {/* BOTON DE INICIAR */}
                {(task.estado_actual === 'Asignado' || task.estado_actual === 'Pendiente') &&
            <button
              className="action-btn start-btn"
              onClick={() => startTask(task)}
              disabled={actionLoading === task.id}>
              
                    {actionLoading === task.id ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                    Iniciar Reparación
                  </button>
            }

                {/* BOTONES DE FINALIZAR Y SUBIDA DE EVIDENCIA */}
                {task.estado_actual === 'En Proceso' &&
            <div className="finish-task-group fade-in">
                    {selectedTaskForPhoto === task.id ?
              <div className="evidence-upload-zone">
                        <label htmlFor={`photo-upload-${task.id}`} className="evidence-btn">
                          <Camera size={16} />
                          {photoFile ? photoFile.name : 'Escoger Fotografía'}
                        </label>
                        <input
                  type="file"
                  id={`photo-upload-${task.id}`}
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setPhotoFile(e.target.files[0]);
                    }
                  }} />
                

                        <div className="evidence-actions">
                          <button className="cancel-evidence" onClick={() => {
                    setSelectedTaskForPhoto(null);
                    setPhotoFile(null);
                  }}>Cancelar</button>

                          <button
                    className="action-btn finish-btn"
                    onClick={() => finishTask(task)}
                    disabled={!photoFile || actionLoading === task.id}>
                    
                            {actionLoading === task.id ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                            Confirmar y Finalizar
                          </button>
                        </div>
                      </div> :

              <button
                className="action-btn finish-btn"
                onClick={() => setSelectedTaskForPhoto(task.id)}>
                
                        <CheckCircle2 size={16} /> Completar Tarea
                      </button>
              }
                  </div>
            }

                {/* ESTADO FINALIZADO */}
                {task.estado_actual === 'Finalizado' &&
            <div className="completed-msg">
                    <CheckCircle2 size={18} /> Labor Completa. Tienes evidencias en el sistema.
                  </div>
            }
              </div>
            </div>
        )
        }
      </div>
    </div>);

};

export default EncargadoPage;