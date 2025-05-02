import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import getIcon from '../utils/iconUtils';

const Navbar = ({ isDarkMode, toggleDarkMode }) => {
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { logout } = useContext(AuthContext);
  
  // Check if current path matches the link
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-surface-800 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <motion.div 
              initial={{ rotate: -10 }} 
              animate={{ rotate: 0 }}
              transition={{ duration: 0.5 }}
              className="text-accent"
            >
              {getIcon('PackageOpen')({ className: "w-7 h-7" })}
            </motion.div>
            <Link to="/" className="text-lg md:text-xl font-bold text-primary">StockSense</Link>
          </div>
          
          {isAuthenticated && (
            <nav className="hidden md:flex space-x-6">
              <Link 
                to="/" 
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive('/') 
                    ? 'text-primary dark:text-primary-light' 
                    : 'text-surface-600 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                to="/products" 
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive('/products') 
                    ? 'text-primary dark:text-primary-light' 
                    : 'text-surface-600 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200'
                }`}
              >
                Products
              </Link>
            </nav>
          )}
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors duration-200"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? (
                getIcon('Sun')({ className: "w-5 h-5 text-yellow-400" })
              ) : (
                getIcon('Moon')({ className: "w-5 h-5 text-surface-600" })
              )}
            </button>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{user?.firstName || 'User'}</p>
                </div>
                <div className="relative group">
                  <button 
                    className="p-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-200"
                    aria-label="User menu"
                  >
                    {getIcon('User')({ className: "w-5 h-5" })}
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-800 rounded-md shadow-lg overflow-hidden z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right transform scale-95 group-hover:scale-100">
                    <div className="py-1">
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors duration-150 flex items-center"
                      >
                        {getIcon('LogOut')({ className: "w-4 h-4 mr-2" })}
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-sm font-medium text-primary hover:text-primary-dark transition-colors">
                  Sign in
                </Link>
                <Link to="/signup" className="text-sm font-medium bg-primary hover:bg-primary-dark text-white px-3 py-1.5 rounded-md transition-colors">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;