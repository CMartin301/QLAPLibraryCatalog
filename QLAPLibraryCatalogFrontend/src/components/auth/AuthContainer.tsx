// AuthContainer.tsx - Best practice approach
import React from 'react';
import { useLocation } from 'react-router-dom';
import { LoginForm } from './LoginForm';
import { RegistrationForm } from './RegistrationForm';

const AuthContainer: React.FC = () => {
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  return (
    <div className="login-container">
      <div className="row justify-content-center">
        {/* Header Section - Shows on both pages */}
        <div className="text-center mb-5">
          <div className="mb-4">
            <h1 className="display-4 fw-bold mb-3" style={{color: 'var(--primary-lavender)', fontFamily: 'Georgia, "Times New Roman", serif'}}>
              Queer Library and Archive Project
            </h1>
            <div className="accent-stripes mx-auto mt-3"></div>
          </div>
        </div>

        {/* Conditional rendering based on current route */}
        {isLogin ? <LoginForm /> : <RegistrationForm />}
      </div>
    </div>
  );
};

export default AuthContainer;