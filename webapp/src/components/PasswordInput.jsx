import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

export default function PasswordInput({ 
  value, 
  onChange, 
  disabled = false,
  placeholder = 'Password',
  showStrength = false,
  className = ''
}) {
  const [showPassword, setShowPassword] = useState(false);

  const getStrengthClass = () => {
    if (!showStrength || !value) return '';
    const strength = Math.min(Math.floor(value.length / 3), 4);
    const colors = [
      'bg-red-500',    // 0-2 chars
      'bg-orange-500', // 3-5
      'bg-yellow-500', // 6-8
      'bg-blue-500',   // 9-11
      'bg-green-500'   // 12+
    ];
    return colors[strength];
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Lock className="w-5 h-5" />
        </div>
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full pl-10 pr-10 py-3 rounded-lg bg-gray-800 border border-gray-700 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={disabled}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
          disabled={disabled}
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      {showStrength && value && (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-700 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all duration-300 ${getStrengthClass()}`}
              style={{ width: `${Math.min((value.length / 12) * 100, 100)}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-400">
            {value.length < 6 ? 'Weak' : value.length < 9 ? 'Fair' : 'Strong'}
          </span>
        </div>
      )}
    </div>
  );
}