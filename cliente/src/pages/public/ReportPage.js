import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send,
  MapPin,
  User,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Plus,
  Trash2 } from
'lucide-react';
import { ubicacionService } from '../../services/ubicacionService';
import { reporteService } from '../../services/reporteService';


import './ReportPage.css';










const ReportPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Data for Selects
  const [facultades, setFacultades] = useState([]);
  const [modulos, setModulos] = useState([]);
  const [ambientes, setAmbientes] = useState([]);
  const [tipos, setTipos] = useState([]);

  // Top-Level Reportador State
  const [personalData, setPersonalData] = useState({
    nombres: '',
    apellidos: '',
    correo: '',
    tipo_reportador: 'Estudiante'
  });

  // Problemas Multiples State
  const [problemas, setProblemas] = useState([]);

  // Current Problem Form State
  const [currentProblem, setCurrentProblem] = useState({
    facultad_id: '',
    modulo_id: '',
    ambiente_id: '',
    tipo_incidencia_id: '',
    descripcion: ''
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [facData, tipoData] = await Promise.all([
      ubicacionService.getFacultades(),
      reporteService.getTiposIncidencia()]
      );
      setFacultades(facData);
      setTipos(tipoData);
    } catch (err) {
      console.error('Error cargando datos iniciales:', err);
    }
  };

  // Cascading Logic: Load Modulos when Facultad changes
  useEffect(() => {
    if (currentProblem.facultad_id) {
      const selectedFac = facultades.find((f) => f.id === parseInt(currentProblem.facultad_id));
      if (selectedFac && selectedFac.modulos) {
        setModulos(selectedFac.modulos);
      } else {
        setModulos([]);
      }
      setCurrentProblem((prev) => ({ ...prev, modulo_id: '', ambiente_id: '' }));
      setAmbientes([]);
    }
  }, [currentProblem.facultad_id, facultades]);

  // Cascading Logic: Load Ambientes when Modulo changes
  useEffect(() => {
    if (currentProblem.modulo_id) {
      const selectedMod = modulos.find((m) => m.id === parseInt(currentProblem.modulo_id));
      if (selectedMod && selectedMod.ambientes) {
        setAmbientes(selectedMod.ambientes);
      } else {
        setAmbientes([]);
      }
      setCurrentProblem((prev) => ({ ...prev, ambiente_id: '' }));
    }
  }, [currentProblem.modulo_id, modulos]);

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProblemChange = (e) => {
    const { name, value } = e.target;
    setCurrentProblem((prev) => ({ ...prev, [name]: value }));
  };


  const addProblemToList = () => {
    if (!currentProblem.ambiente_id || !currentProblem.tipo_incidencia_id || !currentProblem.descripcion) return;

    const ambiente = ambientes.find((a) => a.id === parseInt(currentProblem.ambiente_id));
    const modulo = modulos.find((m) => m.id === parseInt(currentProblem.modulo_id));
    const tipo = tipos.find((t) => t.id === parseInt(currentProblem.tipo_incidencia_id));

    const nuevoProblema = {
      id_temp: Math.random().toString(36).substr(2, 9),
      ambiente_id: currentProblem.ambiente_id,
      ambiente_desc: `${ambiente?.nombre_ambiente || 'Ambiente'} (Módulo ${modulo?.numero_modulo || 'N/A'})`,
      tipo_incidencia_id: currentProblem.tipo_incidencia_id,
      tipo_incidencia_desc: tipo?.nombre_tipo || 'Problema',
      descripcion: currentProblem.descripcion
    };

    setProblemas([...problemas, nuevoProblema]);

    // Reset current problem partially
    setCurrentProblem((prev) => ({
      ...prev,
      tipo_incidencia_id: '',
      descripcion: ''
    }));
  };

  const removeProblem = (id_temp) => {
    setProblemas(problemas.filter((p) => p.id_temp !== id_temp));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (problemas.length === 0) {
      alert("Debes agregar al menos un problema a la lista antes de enviar.");
      return;
    }

    setLoading(true);

    try {
      // 1. Crear Reportador
      const reportador = await reporteService.createReportador({
        nombres: personalData.nombres,
        apellidos: personalData.apellidos,
        correo: personalData.correo,
        tipo_reportador: personalData.tipo_reportador
      });

      // 2. Crear Nota de Problema (Tickets Maestro)
      const nota = await reporteService.createNota({
        reportador_id: reportador.id,
        fecha_envio: new Date().toISOString()
      });

      // 3. Crear TODOS los Detalles del Problema vinculados a esta nota
      const detallesPromises = problemas.map((prob) => {
        return reporteService.createDetalle({
          nota_id: nota.id,
          ambiente_id: parseInt(prob.ambiente_id),
          tipo_incidencia_id: parseInt(prob.tipo_incidencia_id),
          descripcion: prob.descripcion,
          estado_actual: 'Pendiente'
        });
      });

      await Promise.all(detallesPromises);

      setSubmitted(true);
    } catch (err) {
      alert('Hubo un error al enviar el reporte. Revisar consola.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="report-success-container">
        <div className="glass-card success-card animate-scale-in">
          <CheckCircle2 size={64} className="success-icon" />
          <h1>¡Lista de Reportes Enviada!</h1>
          <p>Gracias por ayudarnos a mejorar. Has reportado {problemas.length} incidencias.</p>
          <button className="primary-button" onClick={() => navigate('/')}>
            Volver al Inicio
          </button>
        </div>
      </div>);

  }

  return (
    <div className="report-page-container">
      <div className="report-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          <span>Volver</span>
        </button>
        <div className="report-titles">
          <h1>Reportar incidentes</h1>
        </div>
      </div>

      <div className="report-progress dual-step">
        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1. Datos Personales</div>
        <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2. Incidencias</div>
      </div>

      <div className="glass-card report-card multi-report-layout">
        <form onSubmit={handleSubmit}>
          {step === 1 &&
          <div className="form-section animate-fade-in">
              <h3><User size={20} /> Datos Personales</h3>

              <div className="form-row">
                <div className="form-group half-width">
                  <label>Nombres</label>
                  <input
                  type="text"
                  name="nombres"
                  required
                  placeholder="Ej. Juan Carlos"
                  value={personalData.nombres}
                  onChange={handlePersonalChange} />
                
                </div>
                <div className="form-group half-width">
                  <label>Apellidos</label>
                  <input
                  type="text"
                  name="apellidos"
                  required
                  placeholder="Ej. Pérez Silva"
                  value={personalData.apellidos}
                  onChange={handlePersonalChange} />
                
                </div>
              </div>

              <div className="form-group">
                <label>Correo Universitario / Personal</label>
                <input
                type="email"
                name="correo"
                required
                placeholder="usuario@uagrm.edu.bo"
                value={personalData.correo}
                onChange={handlePersonalChange} />
              
              </div>
              <div className="form-group">
                <label>Rol</label>
                <select name="tipo_reportador" value={personalData.tipo_reportador} onChange={handlePersonalChange}>
                  <option value="Estudiante">Estudiante</option>
                  <option value="Docente">Docente</option>
                  <option value="Administrativo">Personal Administrativo</option>
                </select>
              </div>
              <button
              type="button"
              className="primary-button full-width"
              disabled={!personalData.nombres || !personalData.apellidos || !personalData.correo}
              onClick={() => setStep(2)}>
              
                Continuar 
              </button>
            </div>
          }

          {step === 2 &&
          <div className="multi-report-grid animate-fade-in">
              {/* Lado Izquierdo: Formulario del Problema */}
              <div className="problem-form-panel">
                <h3><MapPin size={20} /> Agregar Nueva Incidencia</h3>

                <div className="form-group">
                  <label>Ubicación General</label>
                  <div className="location-row">
                    <select
                    name="facultad_id"
                    value={currentProblem.facultad_id}
                    onChange={handleProblemChange}>
                    
                      <option value="">Facultad</option>
                      {facultades.map((f) => <option key={f.id} value={f.id}>{f.abreviatura}</option>)}
                    </select>

                    <select
                    name="modulo_id"
                    disabled={!currentProblem.facultad_id}
                    value={currentProblem.modulo_id}
                    onChange={handleProblemChange}>
                    
                      <option value="">Módulo</option>
                      {modulos.map((m) => <option key={m.id} value={m.id}>{m.numero_modulo}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Ambiente Exacto</label>
                  <select
                  name="ambiente_id"
                  disabled={!currentProblem.modulo_id}
                  value={currentProblem.ambiente_id}
                  onChange={handleProblemChange}>
                  
                    <option value="">Selecciona Aula / Laboratorio</option>
                    {ambientes.map((a) =>
                  <option key={a.id} value={a.id}>{a.nombre_ambiente} - Piso {a.piso}</option>
                  )}
                  </select>
                </div>

                <div className="form-group">
                  <label>Tipo de Daño</label>
                  <select
                  name="tipo_incidencia_id"
                  value={currentProblem.tipo_incidencia_id}
                  onChange={handleProblemChange}>
                  
                    <option value="">¿De qué trata?</option>
                    {tipos.map((t) => <option key={t.id} value={t.id}>{t.nombre_tipo}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Descripción </label>
                  <textarea
                  name="descripcion"
                  rows={3}
                  placeholder="Describe los detalles del problema de forma breve..."
                  value={currentProblem.descripcion}
                  onChange={handleProblemChange} />
                
                </div>


                <button
                type="button"
                className="secondary-button full-width add-btn"
                disabled={!currentProblem.ambiente_id || !currentProblem.tipo_incidencia_id || !currentProblem.descripcion}
                onClick={addProblemToList}>
                
                  <Plus size={18} /> Añadir a mi Lista
                </button>
              </div>

              {/* Lado Derecho: Lista de Problemas */}
              <div className="problems-list-panel">
                <h3>Incidencias ({problemas.length})</h3>

                {problemas.length === 0 ?
              <div className="empty-problems">
                   
                    <p>Agrega mas incidencias.</p>
                  </div> :

              <div className="added-problems-container">
                    {problemas.map((prob) =>
                <div key={prob.id_temp} className="added-problem-card">
                        <div className="prob-header">
                          <span className="prob-type">{prob.tipo_incidencia_desc}</span>
                          <button type="button" className="delete-btn" onClick={() => removeProblem(prob.id_temp)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="prob-location"><MapPin size={12} /> {prob.ambiente_desc}</p>
                        <p className="prob-desc">{prob.descripcion}</p>
                      </div>
                )}
                  </div>
              }

                <div className="submit-section">
                  <button type="button" className="link-button" onClick={() => setStep(1)} disabled={loading}>
                    Editar Datos Personales
                  </button>
                  <button
                  type="submit"
                  className="primary-button submit-all-btn"
                  disabled={loading || problemas.length === 0}>
                  
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                    <span>Enviar </span>
                  </button>
                </div>
              </div>
            </div>
          }
        </form>
      </div>
    </div>);

};

export default ReportPage;