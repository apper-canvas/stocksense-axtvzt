import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] container mx-auto px-4 flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        {getIcon('AlertCircle')({ className: "w-20 h-20 text-primary mx-auto mb-6" })}
        <h1 className="text-4xl md:text-5xl font-bold mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-surface-600 dark:text-surface-400 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
      </motion.div>
      
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="btn btn-primary flex items-center gap-2 px-6 py-3"
        onClick={() => navigate('/')}
      >
        {getIcon('Home')({ className: "w-5 h-5" })}
        <span>Back to Dashboard</span>
      </motion.button>
    </div>
  );
};

export default NotFound;