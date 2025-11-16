import { NavLink, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import PrimaryButton from './PrimaryButton';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { isAuthenticated, userEmail, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-black border-b border-gray-800 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <Logo />
          
          <nav className="flex items-center gap-4 md:gap-6 flex-wrap">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? 'text-yellow-400 font-medium'
                  : 'text-white hover:text-yellow-400 transition-colors'
              }
            >
              Home
            </NavLink>
            {isAuthenticated && (
              <NavLink
                to="/submit"
                className={({ isActive }) =>
                  isActive
                    ? 'text-yellow-400 font-medium'
                    : 'text-white hover:text-yellow-400 transition-colors'
                }
              >
                Submit Prompt
              </NavLink>
            )}
            <NavLink
              to="/evaluation"
              className={({ isActive }) =>
                isActive
                  ? 'text-yellow-400 font-medium'
                  : 'text-white hover:text-yellow-400 transition-colors'
              }
            >
              Evaluation Process
            </NavLink>
          </nav>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-white text-sm hidden md:block">{userEmail}</span>
                <PrimaryButton onClick={handleLogout} className="text-sm md:text-base">
                  Logout
                </PrimaryButton>
              </>
            ) : (
              <NavLink to="/login">
                <PrimaryButton className="text-sm md:text-base">Login</PrimaryButton>
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

