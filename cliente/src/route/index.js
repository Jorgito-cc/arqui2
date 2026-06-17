import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/public/HomePage';
import ReportPage from '../pages/public/ReportPage';
import LoginPage from '../pages/auth/LoginPage';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import AdminLayout from '../components/layout/AdminLayout';
import MaintenanceLayout from '../components/layout/MaintenanceLayout';
import UsersPage from '../pages/admin/usuario/UsersPage';
import LocationsPage from '../pages/admin/ubicaion/LocationsPage';
import EncargadoPage from '../pages/admin/encargado/EncargadoPage';
import ProblemNotesPage from '../pages/admin/reporte/ProblemNotesPage';
import AssignmentsPage from '../pages/admin/gestion/AssignmentsPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/reportar" element={<ReportPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Rutas de Administración (Decanos) */}
      <Route path="/admin" element={
      <ProtectedRoute allowedRoleIds={[1]}>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/admin/usuarios" replace />} />
        <Route path="usuarios" element={<UsersPage />} />
        <Route path="ubicacion" element={<LocationsPage />} />
        <Route path="notas" element={<ProblemNotesPage />} />
        <Route path="asignaciones" element={<AssignmentsPage />} />
        
        <Route path="dashboard" element={
        <div className="page-container">
            <h1>Panel Administrativo</h1>
            <p>Bienvenido al área de gestión centralizada.</p>
          </div>
        } />
      </Route>

      {/* Rutas para Encargados de Mantenimiento (Técnicos) */}
      <Route path="/tecnico" element={
      <ProtectedRoute allowedRoleIds={[2]}>
          <MaintenanceLayout />
        </ProtectedRoute>
      }>
        <Route index element={<EncargadoPage />} />
      </Route>

      {/* Redirección para rutas no encontradas */}

      {/* Redirección para rutas no encontradas */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>);

};

export default AppRoutes;