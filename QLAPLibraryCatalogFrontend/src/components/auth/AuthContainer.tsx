import React from 'react';
import { useLocation } from 'react-router-dom';
import { LoginForm } from './LoginForm';
import { RegistrationForm } from './RegistrationForm';

const AuthContainer: React.FC = () => {
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  return (
    <div className="bg-gray-100">
      {/* Header Section - Shows on both pages */}
      <div className="pt-6 pb-2 text-center">
        <div className="mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-lavender-600 mb-3">
            Queer Library and Archive Project
          </h1>
          {/* Decorative accent stripes */}
          {/* <div className="flex justify-center">
            <div className="flex space-x-1">
              <div className="w-8 h-1 bg-lavender-400 rounded-full"></div>
              <div className="w-12 h-1 bg-lavender-600 rounded-full"></div>
              <div className="w-8 h-1 bg-lavender-400 rounded-full"></div>
            </div>
          </div> */}
        </div>
      </div>

      {/* Form Container */}
      <div className="flex justify-center px-4">
        {isLogin ? <LoginForm /> : <RegistrationForm />}
      </div>
    </div>
  );
};

export default AuthContainer;