import React, { useState, useEffect } from 'react';
import {
  ClipboardList,
  ChevronDown,
  ChevronUp,
  User,
  MapPin,
  Loader2,
  AlertCircle } from
'lucide-react';
import { reporteService } from '../../../services/reporteService';

import './ProblemNotesPage.css';

const ProblemNotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedNote, setExpandedNote] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const data = await reporteService.getNotasProblema();
      setNotes(data);
    } catch (err) {
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleNote = (id) => {
    setExpandedNote(expandedNote === id ? null : id);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loader2 className="animate-spin" size={48} />
        <p>Cargando reportes...</p>
      </div>);

  }

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
      
        <div className="header-info">
          <h1>Reportes Recibidos</h1>
         
        </div>
      </div>

      <div className="notes-list">
        {notes.length === 0 ?
        <div className="empty-state glass-card">
            <AlertCircle size={48} />
            <p>No hay reportes registrados actualmente.</p>
          </div> :

        notes.map((note) =>
        <div key={note.id} className={`glass-card note-card ${expandedNote === note.id ? 'expanded' : ''}`}>
              <div className="note-summary" onClick={() => toggleNote(note.id)}>
                <div className="note-main-info">
                  <span className="note-id">#NOTA-{note.id}</span>
                  <span className="note-date">
                    {note.fecha_envio ? new Date(note.fecha_envio).toLocaleString() : 'Fecha no disp.'}
                  </span>
                  <span className="note-count-badge">
                    {note.detalles?.length || 0} Incidentes
                  </span>
                </div>

                <div className="note-reporter-brief">
                  <User size={16} />
                  <span>{note.reportador?.nombres || ''} {note.reportador?.apellidos || 'Anónimo'}</span>
                </div>

                <div className="note-toggle">
                  {expandedNote === note.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {expandedNote === note.id &&
          <div className="note-details-expanded animate-fade-in">
                  <div className="reporter-full-info">
                    <h4>Datos del Reportador</h4>
                    <div className="info-grid">
                      <p><strong>Correo:</strong> {note.reportador?.correo}</p>
                      <p><strong>Tipo:</strong> {note.reportador?.tipo_reportador}</p>
                    </div>
                  </div>

                  <div className="problems-table-container">
                    <h4>Detalles del Problema</h4>
                    <table className="problems-table">
                      <thead>
                        <tr>
                          <th>Descripción</th>
                          <th>Tipo</th>
                          <th>Ambiente</th>
                          <th>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {note.detalles?.map((detail) =>
                  <tr key={detail.id}>
                            <td>{detail.descripcion}</td>
                            <td>
                              <span className="type-pill">
                                {detail.tipo_incidencia?.nombre_tipo || 'Desconocido'}
                              </span>
                            </td>
                            <td className="cell-with-icon">
                              <MapPin size={14} />
                              {detail.ambiente ? `${detail.ambiente.nombre_ambiente} (Piso ${detail.ambiente.piso})` : 'Ubicación no disp.'}
                            </td>
                            <td>
                              <span className={`status-pill ${(detail.estado_actual || 'Pendiente').toLowerCase()}`}>
                                {detail.estado_actual || 'Pendiente'}
                              </span>
                            </td>
                          </tr>
                  )}
                      </tbody>
                    </table>
                  </div>
                </div>
          }
            </div>
        )
        }
      </div>
    </div>);

};

export default ProblemNotesPage;