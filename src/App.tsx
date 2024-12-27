import React from 'react';
import Dashboard from './pages/dashboard/Dashboard';
import { useAuth } from './hooks/useAuth';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
// import SignUp from './pages/signUp/SignUp';
import Login from './pages/login/Login';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';

const App: React.FC = () => {
  const { isAuthenticated, login, logout } = useAuth();

  console.log(isAuthenticated)

  return (
    <BrowserRouter>
      <AuthProvider>


        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>

    </BrowserRouter>
    // <Login />
    // <SignUp />
    // <Dashboard />
  )
}

export default App;
