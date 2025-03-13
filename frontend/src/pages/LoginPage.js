import React from 'react';

const LoginPage = ({ handleLogin }) => {
  return (
    <div className="container mt-5">
      <h1>Login</h1>
      <button className="btn btn-primary me-2" onClick={() => handleLogin('investor')}>
        Login as Investor
      </button>
      <button className="btn btn-success" onClick={() => handleLogin('entrepreneur')}>
        Login as Entrepreneur
      </button>
    </div>
  );
};

export default LoginPage;