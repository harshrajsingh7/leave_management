import React, { useState, useContext } from 'react';
import './LoginPage.css';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    reg_no: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { loginUser } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!formData.reg_no.trim()) {
      newErrors.reg_no = 'Please enter your registration number';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Please enter your password';
      valid = false;
    } else if (formData.password.length < 5) {
      newErrors.password = 'Password must contain at least 5 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      try {
        await loginUser(formData);
      } catch (error) {
        console.error('Login failed:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-panel left-panel">
          <div className="brand-messaging">
            <div className="brand-icon"></div>
            <h1 className="headline">Welcome to the <br />Leave Management System</h1>
            <p className="subheadline">Streamlined workflow. Enhanced productivity.</p>
          </div>
        </div>

        <div className="login-panel right-panel">
          <div className="form-container">
            <div className="logo-area">
              <img src="./logo.png" alt="Company Logo" className="company-logo" />
            </div>
            
            <div className="authentication-container">
              <h2 className="auth-title">Sign in to your account</h2>
              
              <form className="auth-form" onSubmit={handleSubmit} noValidate>
                <div className="input-group">
                  <label htmlFor="reg_no" className="input-label">Registration Number</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      id="reg_no"
                      name="reg_no"
                      className={`input-field ${errors.reg_no ? 'has-error' : ''}`}
                      value={formData.reg_no}
                      onChange={handleChange}
                      placeholder="Enter your registration number"
                      autoComplete="off"
                      autoFocus
                    />
                    {errors.reg_no && <div className="error-message">{errors.reg_no}</div>}
                  </div>
                </div>

                <div className="input-group">
                  <div className="label-row">
                    <label htmlFor="password" className="input-label">Password</label>
                  </div>
                  <div className="input-wrapper password-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      className={`input-field ${errors.password ? 'has-error' : ''}`}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                    />
                    <button 
                      type="button" 
                      className="visibility-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                    {errors.password && <div className="error-message">{errors.password}</div>}
                  </div>
                </div>

                <button 
                  type="submit" 
                  className={`submit-button ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;