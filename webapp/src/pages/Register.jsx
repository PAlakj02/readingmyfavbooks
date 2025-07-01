import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import PasswordInput from '../components/PasswordInput';

export default function Register({ setToken }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  // Validation functions
  const validateField = (field, value) => {
    const errors = {};
    
    if (field === 'name') {
      if (!value.trim()) {
        errors.name = 'Name is required';
      } else if (value.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters';
      }
    }
    
    if (field === 'email') {
      if (!value.trim()) {
        errors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors.email = 'Please enter a valid email';
      }
    }
    
    if (field === 'password') {
      if (!value) {
        errors.password = 'Password is required';
      } else if (value.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      }
    }
    
    if (field === 'confirmPassword') {
      if (!value) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (value !== formData.password) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setValidationErrors(prev => ({ ...prev, ...errors }));
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Validate field on change (but not for confirm password until both are entered)
    if (field !== 'confirmPassword' || formData.password) {
      validateField(field, value);
    }
    
    // Clear general error when typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const isValid = Object.entries(formData).every(([field, value]) => 
      validateField(field, value)
    );
    
    if (!isValid) return;
    
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password
        }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        navigate("/dashboard");
      } else {
        setError(data.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Input field component for non-password fields
  const InputField = ({ 
    type, 
    placeholder, 
    value, 
    onChange, 
    icon, 
    error,
    success
  }) => (
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        {icon}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800 placeholder-gray-500 text-white focus:outline-none focus:ring-2 transition-all duration-200 ${
          error 
            ? 'border border-red-500 focus:ring-red-500' 
            : success
            ? 'border border-green-500 focus:ring-green-500'
            : 'focus:ring-purple-500 focus:bg-gray-750'
        }`}
        disabled={isLoading}
      />
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-400">Join our community today</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 shadow-lg">
          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
              <InputField
                type="text"
                placeholder="Your full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                icon={<User className="w-5 h-5" />}
                error={validationErrors.name}
              />
              {validationErrors.name && (
                <p className="mt-1 text-xs text-red-400">{validationErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <InputField
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                icon={<Mail className="w-5 h-5" />}
                error={validationErrors.email}
              />
              {validationErrors.email && (
                <p className="mt-1 text-xs text-red-400">{validationErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <PasswordInput
                value={formData.password}
                onChange={(value) => handleInputChange('password', value)}
                disabled={isLoading}
                placeholder="At least 8 characters"
                showStrength={true}
                className={validationErrors.password ? 'border border-red-500 focus:ring-red-500' : ''}
              />
              {validationErrors.password && (
                <p className="mt-1 text-xs text-red-400">{validationErrors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
              <PasswordInput
                value={formData.confirmPassword}
                onChange={(value) => handleInputChange('confirmPassword', value)}
                disabled={isLoading}
                placeholder="Confirm your password"
                showStrength={false}
                className={
                  validationErrors.confirmPassword 
                    ? 'border border-red-500 focus:ring-red-500' 
                    : formData.confirmPassword && !validationErrors.confirmPassword
                    ? 'border border-green-500 focus:ring-green-500'
                    : ''
                }
              />
              {formData.confirmPassword && !validationErrors.confirmPassword && (
                <div className="flex items-center gap-1 mt-1 text-xs text-green-400">
                  <CheckCircle className="w-3 h-3" />
                  <span>Passwords match</span>
                </div>
              )}
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-xs text-red-400">{validationErrors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 mt-6 flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing Up...
                </>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium">
              Log in
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          By registering, you agree to our Terms and Privacy Policy
        </div>
      </div>
    </div>
  );
}