// src/components/auth/AuthContainer.tsx
import React, { useState } from 'react';
import LoginForm from './LoginForm';

const AuthContainer: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="login-container">
      <div className="row justify-content-center">
        {/* <div className="col-12 col-sm-11 col-md-10 col-lg-8 col-xl-7"> */}
          {/* Header Section */}
          <div className="text-center mb-5">
            <div className="mb-4">
              <h1 className="display-4 fw-bold mb-3" style={{color: 'var(--primary-lavender)', fontFamily: 'Georgia, "Times New Roman", serif'}}>
                Queer Library and Archive Project
              </h1>
              <div className="accent-stripes mx-auto mt-3"></div>
            </div>
          </div>

          {/* Auth Card */}
            <LoginForm />
            {/* <div className="card-header card-header-custom text-center py-4">
              <AuthToggle isLogin={isLogin} onToggle={setIsLogin} />
            </div>

            <div className="card-body p-4 p-md-5">
              {isLogin ? <LoginForm /> : <RegisterForm />}
            </div> */}
        {/* </div> */}
      </div>
    </div>
  );
};

export default AuthContainer;