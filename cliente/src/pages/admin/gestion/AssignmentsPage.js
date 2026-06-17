import React, { useState, useEffect } from 'react';
import { UserPlus, CheckCircle2, Send, Loader2, AlertCircle, CheckSquare, Image as ImageIcon } from 'lucide-react';
import { reporteService } from '../../../services/reporteService';
import { gestionService } from '../../../services/gestionService';
import { usuarioService } from '../../../services/usuarioService';


import './AssignmentsPage.css';











const AssignmentsPage = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  // Data States
  const [problems, setProblems] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  // Interaction States
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [assignedSuccess, setAssignedSuccess] = useState(null);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [notasData, usersData, asignacionesData, evidenciasData] = await Promise.all([
      reporteService.getNotasProblema(),
      usuarioService.getUsuarios(),
      gestionService.getAsignaciones(),
      gestionService.getEvidencias()]
      );

      const pendingList = [];
      const completedList = [];

      // Filtrar Técnicos
      const techs = usersData.filter((u) => u.rol_id === 2);
      setTechnicians(techs);

      // Procesar problemas de todas las notas
      notasData.forEach((nota) => {
        if (nota.detalles) {
          nota.detalles.forEach((detalle) => {
            // 1. Huérfanos Pendientes
            if (detalle.estado_actual === 'Pendiente') {
              pendingList.push({ ...detalle, nota_id: nota.id });
            }
            // 2. Tareas Finalizadas (Cruzando evidencias)
            else if (detalle.estado_actual === 'Finalizado') {
              // A) Buscar Asignación
              const asig = asignacionesData.find((a) => a.detalle_problema_id === detalle.id && a.activo);
              if (asig) {
                // B) Buscar Evidencia
                const ev = evidenciasData.find((e) => e.asignacion_id === asig.id && e.activo);
                // C) Buscar Técnico
                const tech = techs.find((t) => t.id === asig.usuario_id);

                if (ev) {
                  completedList.push({
                    ...detalle,
                    nota_id: nota.id,
                    tecnico_nombre: tech ? `${tech.nombres} ${tech.apellidos}` : 'Técnico Desconocido',
                    evidencia_url: `http://localhost:3004${ev.url_archivo}` // API de MS Gestión Evidencia
                  });
                }
              }
            }
          });
        }
      });

      setProblems(pendingList);
      setCompletedTasks(completedList);

    } catch (err) {
      console.error('Error fetching assignment data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (problemId, technicianId) => {
    setAssigning(true);
    try {
      const asignacion = await gestionService.createAsignacion({
        detalle_problema_id: problemId,
        usuario_id: technicianId
      });

      await gestionService.createHistorial({
        tipo: 'Cambio de Estado',
        estado: 'Asignado',
        asignacion_id: asignacion.id,
        comentario_tecnico: 'Asignado automáticamente por Administración'
      });

      await reporteService.updateDetalle(problemId, { estado_actual: 'Asignado' });

      setAssignedSuccess(problemId);
      setTimeout(() => {
        setAssignedSuccess(null);
        setSelectedProblem(null);
        setProblems((prev) => prev.filter((p) => p.id !== problemId));
      }, 1500);

    } catch (err) {
      alert("Error al asignar tarea. Revisa la consola.");
      console.error(err);
    } finally {
      setAssigning(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loader2 className="animate-spin" size={48} />
        <p>Cargando información del sistema...</p>
      </div>);

  }

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        
        <div className="header-info">
          <h1>Operaciones</h1>
        </div>
      </div>

      <div className="custom-tabs">
        <button
          className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}>
          
          <UserPlus size={16} /> 
          Por Delegar ({problems.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}>
          
          <ImageIcon size={16} /> 
          Trabajos Completados ({completedTasks.length})
        </button>
      </div>

      {activeTab === 'pending' &&
      <div className="problems-grid fade-in">
          {problems.length === 0 ?
        <div className="empty-state glass-card" style={{ gridColumn: '1/-1' }}>
               <AlertCircle size={48} />
               <p>No hay problemas pendientes por asignar en este momento. ¡Buen trabajo!</p>
            </div> :

        problems.map((problem) =>
        <div key={problem.id} className={`glass-card assignment-card ${selectedProblem === problem.id ? 'active' : ''}`}>
                <div className="assignment-content">
                  <div className="assignment-top">
                    <span className="priority-tag media">TICKET #{problem.nota_id}-{problem.id}</span>
                    <span className="type-label">{problem.tipo_incidencia?.nombre_tipo || 'Desconocido'}</span>
                  </div>
                  
                  <h3>{problem.descripcion}</h3>
                  <p className="problem-location">Ubicación ID: {problem.ambiente_id}</p>
    
                  {assignedSuccess === problem.id ?
            <div className="success-overlay">
                      <CheckCircle2 size={32} />
                      <span>Tarea Asignada Exitosamente</span>
                    </div> :
            selectedProblem === problem.id ?
            <div className="technician-selector fade-in">
                      <h4>Seleccionar Técnico</h4>
                      {technicians.length === 0 ?
              <p className="error-text">No hay técnicos disponibles.</p> :

              technicians.map((tech) =>
              <button
                key={tech.id}
                className="tech-option"
                onClick={() => handleAssign(problem.id, tech.id)}
                disabled={assigning}>
                
                            <div className="tech-info">
                              <span className="tech-name">{tech.nombres} {tech.apellidos}</span>
                              <span className="tech-desc">{tech.correo}</span>
                            </div>
                            {assigning ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                          </button>
              )
              }
                      <button className="cancel-btn" onClick={() => setSelectedProblem(null)} disabled={assigning}>
                        Cancelar
                      </button>
                    </div> :

            <button className="assign-btn" onClick={() => setSelectedProblem(problem.id)}>
                      Delegar a un Técnico
                    </button>
            }
                </div>
              </div>
        )
        }
        </div>
      }

      {activeTab === 'completed' &&
      <div className="evidence-grid fade-in">
          {completedTasks.length === 0 ?
        <div className="empty-state glass-card">
              <ImageIcon size={48} />
              <p>No hay evidencias de trabajos completados aún.</p>
            </div> :

        completedTasks.map((task) =>
        <div key={task.id} className="glass-card completed-task-card">
                <div className="completed-image-wrapper">
                  <img src={task.evidencia_url} alt="Evidencia del Trabajo" className="evidence-photo" />
                  <div className="status-overlay">
                    <CheckCircle2 size={16} /> Finalizado
                  </div>
                </div>
                <div className="completed-task-info">
                  <h4>{task.descripcion}</h4>
                  <p className="tech-label">Reparado por: <strong>{task.tecnico_nombre}</strong></p>
                  <div className="task-tags">
                    <span className="tiny-tag">{task.tipo_incidencia?.nombre_tipo}</span>
                    <span className="tiny-tag">Ref: #{task.nota_id}-{task.id}</span>
                  </div>
                </div>
              </div>
        )
        }
        </div>
      }
    </div>);

};

export default AssignmentsPage;