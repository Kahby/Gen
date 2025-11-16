import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../components/PrimaryButton';
import PageWrapper from '../components/PageWrapper';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config/api';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    // Validate email format
    if (!formData.email.endsWith('@vitbhopal.ac.in')) {
      setError('Only @vitbhopal.ac.in email addresses are allowed.');
      setIsSubmitting(false);
      return;
    }

    // Validate password
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setIsSubmitting(false);
      return;
    }

    try {
      if (isLoginMode) {
        // Login
        const response = await fetch(`${API_BASE_URL}/api/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Login failed. Please try again.');
          setIsSubmitting(false);
          return;
        }

        // Login successful
        login(formData.email);
        navigate('/submit');
      } else {
        // Register
        const response = await fetch(`${API_BASE_URL}/api/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Registration failed. Please try again.');
          setIsSubmitting(false);
          return;
        }

        // Registration successful - auto login
        setSuccess('Account created successfully! Logging you in...');
        login(formData.email);
        setTimeout(() => {
          navigate('/submit');
        }, 1000);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper>
      <div className="pt-24 pb-12 px-4 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
            <h1 className="text-4xl font-bold text-white mb-2 text-center">
              {isLoginMode ? 'LOGIN' : 'REGISTER'}
            </h1>
            <p className="text-gray-300 text-center mb-8">
              {isLoginMode ? 'Welcome back!' : 'Create your account'}
            </p>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-4 p-3 bg-green-900 border border-green-700 rounded-lg text-green-300 text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email ID */}
              <div>
                <label className="block text-white mb-2">Email ID</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
                  placeholder="your.name@vitbhopal.ac.in"
                  required
                />
                <p className="text-gray-500 text-xs mt-1">Only @vitbhopal.ac.in emails allowed</p>
              </div>

              {/* Password */}
              <div>
                <label className="block text-white mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
                  placeholder="Enter your password"
                  required
                  minLength={6}
                />
                <p className="text-gray-500 text-xs mt-1">Minimum 6 characters</p>
              </div>

              {/* Submit Button */}
              <div>
                <PrimaryButton type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting
                    ? isLoginMode
                      ? 'Logging in...'
                      : 'Registering...'
                    : isLoginMode
                    ? 'Login'
                    : 'Register'}
                </PrimaryButton>
              </div>

              {/* Toggle between Login and Register */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginMode(!isLoginMode);
                    setError('');
                    setSuccess('');
                  }}
                  className="text-white hover:text-yellow-400 transition-colors text-sm"
                >
                  {isLoginMode
                    ? "Don't have an account? Register"
                    : 'Already have an account? Login'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default AdminLoginPage;

