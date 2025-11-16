import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SubmitPromptPage from './pages/SubmitPromptPage';
import EvaluationProcessPage from './pages/EvaluationProcessPage';
import AdminLoginPage from './pages/AdminLoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-black">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/submit"
              element={
                <ProtectedRoute>
                  <SubmitPromptPage />
                </ProtectedRoute>
              }
            />
            <Route path="/evaluation" element={<EvaluationProcessPage />} />
            <Route path="/login" element={<AdminLoginPage />} />
          </Routes>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
