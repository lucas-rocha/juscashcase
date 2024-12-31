import React from 'react';
import Dashboard from './pages/dashboard/Dashboard';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/login/Login';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import SignUp from './pages/signUp/SignUp';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>


        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/criar-conta" element={<SignUp />} />
          <Route
            path="/"
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
