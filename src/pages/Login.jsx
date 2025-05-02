import { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { isInitialized, showLogin } = useContext(AuthContext);

  useEffect(() => {
    // Initialize login UI when component mounts
    if (isInitialized) {
      showLogin();
    }
  }, [isInitialized, showLogin]);

  return (
    <motion.div 
      className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-surface-50 dark:bg-surface-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-surface-800 shadow-md rounded-xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-primary">StockSense</h2>
            <p className="mt-2 text-sm text-surface-600 dark:text-surface-400">
              Sign in to your inventory management system
            </p>
          </div>

          <div id="authentication" className="min-h-[300px]"></div>

          <div className="mt-6 text-center">
            <p className="text-sm text-surface-600 dark:text-surface-400">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-primary hover:text-primary-dark transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;