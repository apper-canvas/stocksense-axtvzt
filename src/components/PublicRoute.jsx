import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

function PublicRoute() {
  const { isAuthenticated, loading } = useSelector((state) => state.user);
  
  // Show loading indicator while checking authentication
  if (loading) {
    return <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }
  
  // If already authenticated, redirect to home/dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // Otherwise, render the public content
  return <Outlet />;
}

export default PublicRoute;