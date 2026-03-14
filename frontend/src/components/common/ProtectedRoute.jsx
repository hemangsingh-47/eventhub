import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="relative">
          <div className="h-10 w-10 border-3 border-[var(--color-surface-tertiary)] rounded-full"></div>
          <div className="absolute top-0 h-10 w-10 border-3 border-transparent border-t-[var(--color-primary)] rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return (
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="h-14 w-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100">
            <span className="text-2xl">🔒</span>
          </div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">Access Denied</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            You need <span className="font-bold text-[var(--color-primary)]">{role}</span> access to view this page.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
