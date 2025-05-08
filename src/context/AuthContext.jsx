import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser, clearUser, setLoading } from '../store/userSlice';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize ApperUI once when the app loads
  useEffect(() => {
    dispatch(setLoading(true));

    const initializeAuth = async () => {
      try {
        const { ApperClient, ApperUI } = window.ApperSDK;
        const client = new ApperClient({
          apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
          apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
        });

        // Initialize but don't show login yet
        ApperUI.setup(client, {
          target: '#authentication',
          clientId: import.meta.env.VITE_APPER_PROJECT_ID,
          view: 'both',
          onSuccess: function (user) {
            let currentPath = window.location.pathname + window.location.search;
            // Store user data in Redux store
            if (user && user.isAuthenticated) {
              dispatch(setUser(user));
              navigate('/');
            } else {
              dispatch(clearUser());
              if (currentPath) {
                navigate(currentPath);
              }
              else {
                navigate('/login');
              }
            }
          },
          onError: function (error) {
            console.error("Authentication failed:", error);
            dispatch(clearUser());
          }
        });

        setIsInitialized(true);
        dispatch(setLoading(false));
      } catch (error) {
        console.error("Failed to initialize authentication:", error);
        dispatch(setLoading(false));
      }
    };

    initializeAuth();
  }, [dispatch, navigate]);

  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    logout: () => {
      try {
        const { ApperUI } = window.ApperSDK;
        ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    },
    showLogin: () => {
      if (isInitialized) {
        const { ApperUI } = window.ApperSDK;
        ApperUI.showLogin("#authentication");
      }
    },
    showSignup: () => {
      if (isInitialized) {
        const { ApperUI } = window.ApperSDK;
        ApperUI.showSignup("#authentication");
      }
    }
  };

  return (
    <AuthContext.Provider value={authMethods}>
      {children}
    </AuthContext.Provider>
  );
}