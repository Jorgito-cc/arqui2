import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2, KeyRound } from 'lucide-react';
import { login } from '../../services/authService';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await login({ correo, password });

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.usuario));

      if (response.usuario.rol_id === 1) {
        navigate('/admin/usuarios');
      } else if (response.usuario.rol_id === 2) {
        navigate('/tecnico');
      } else {
        setError('Rol no autorizado para acceder al sistema administrativo.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-title-row">
            <div className="login-icon">
              <KeyRound size={20} />
            </div>
            <h2>Acceso al Sistema</h2>
          </div>
          <p>Ingresa tus credenciales institucionales</p>
        </div>
        
        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="input-group">
            <label><Mail size={14} /> Correo</label>
            <input
              type="email"
              placeholder="correo@institucion.edu.bo"
              required
              value={correo}
              onChange={(e) => setCorreo(e.target.value)} />
          </div>
          
          <div className="input-group">
            <label><Lock size={14} /> Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)} />
          </div>
          
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Iniciar Sesión'}
          </button>
        </form>
        
        <div className="login-footer">
          <button className="text-button" onClick={() => navigate('/')}>
            ← Volver al inicio
          </button>
        </div>
      </div>
    </div>);

};

export default LoginPage;