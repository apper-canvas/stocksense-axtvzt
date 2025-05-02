import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

const NotFound = () => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-primary mb-8">
        {getIcon('FileQuestion')({ className: "w-24 h-24" })}
      </div>
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-surface-600 dark:text-surface-400 max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/" className="btn btn-primary flex items-center gap-2">
        {getIcon('Home')({ className: "w-5 h-5" })}
        <span>Back to Home</span>
      </Link>
    </motion.div>
  );
};

export default NotFound;