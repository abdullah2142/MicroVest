"use client"

import type React from "react"

import { useState } from "react"
import { TrendingUp, Eye, EyeOff, ArrowLeft } from "lucide-react"
import { Link, useNavigate } from "react-router-dom" // Import useNavigate
import { useUser } from "../../context/UserContext" // Import UserContext


// --- Custom Button Component (remains the same) ---
const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  ...props
}: {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  className?: string
  disabled?: boolean
  [key: string]: any
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"

  const variants = {
    primary: "bg-black text-white hover:bg-gray-800 focus:ring-gray-500",
    secondary: "bg-white text-black border border-gray-300 hover:bg-gray-50 focus:ring-gray-500",
    outline: "border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
    ghost: "text-gray-600 hover:text-black hover:bg-gray-100 focus:ring-gray-500",
  }

  const sizes = {
    sm: "px-3 py-2 text-sm rounded-md",
    md: "px-4 py-2 text-sm rounded-md",
    lg: "px-6 py-3 text-base rounded-lg",
  }

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

// --- Custom Input Component (remains the same) ---
const Input = ({
  label,
  error,
  className = "",
  ...props
}: {
  label?: string
  error?: string
  className?: string
  [key: string]: any
}) => {
  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <input
        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors ${
          error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""
        } ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default function LoginPage() {
  // --- CORRECT PLACEMENT FOR HOOKS AND ENVIRONMENT VARIABLES ---
  const navigate = useNavigate() // <--- CORRECT: navigate hook inside the component
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // <--- CORRECT: API_BASE_URL inside the component
  const { login } = useUser(); // <--- ADD: Use UserContext login function
  // --- END CORRECT PLACEMENT ---

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "", // <--- CORRECT: Changed from email to username
    password: "",
    rememberMe: false,
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({}) // <--- CORRECT: Type is object for field errors
  const [formError, setFormError] = useState<string | null>(null) // <--- CORRECT: General form error state
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Clear field-specific error when user starts typing in that field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
    // Clear general form error as user types
    if (formError) {
      setFormError(null);
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    // Validation for username field
    if (!formData.username) {
      newErrors.username = "Username is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      // Note: Adjust this length based on your Django API's password requirements if different
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null); // Clear previous form errors before new submission

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/users/login/`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              username: formData.username, // Send username, not email
              password: formData.password,
          }),
      });

      const data = await response.json();

      if (response.ok) {
          console.log('Login successful:', data);
          // Use UserContext login function instead of manually setting localStorage
          login(data);
          
          // Redirect to the dashboard
          console.log('Attempting to navigate to dashboard...');
          navigate('/dashboard');
      } else {
          // Handle API errors (e.g., invalid credentials, user not found)
          console.error('Login failed:', data);
          if (data.detail) { // General error from DRF
              setFormError(data.detail);
          } else if (data.non_field_errors) { // Example for non_field_errors
              setFormError(data.non_field_errors[0]);
          } else if (data.username) { // Specific errors for username field
              setErrors(prev => ({ ...prev, username: data.username[0] }));
          } else if (data.password) { // Specific errors for password field
              setErrors(prev => ({ ...prev, password: data.password[0] }));
          } else {
              setFormError("An unexpected error occurred during login. Please try again.");
          }
      }
    } catch (error) {
      console.error("Login network or other error:", error);
      setFormError("Failed to connect to the server. Please check your internet connection or try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-black">MicroVest</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-black">Sign in to your account</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          {/* Corrected Link to registration page */}
          <Link to="/signup" className="font-medium text-black hover:text-gray-800 underline">
            create a new account
          </Link>
        </p>
      </div>

      {/* Login Form */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* --- CORRECTED: General form error display --- */}
            {formError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{formError}</span>
              </div>
            )}
            {/* --- END CORRECTED --- */}

            {/* --- CORRECTED: Username Field --- */}
            <Input
              label="Username" // Changed label
              name="username" // Changed name
              type="text"    // Changed type
              autoComplete="username"
              required
              value={formData.username} // Bind to formData.username
              onChange={handleInputChange}
              error={errors.username}   // Bind to errors.username
              placeholder="Enter your username" // Changed placeholder
            />
            {/* --- END CORRECTED --- */}

            {/* Password Field (remains largely the same, but ensure errors.password is correct) */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors ${
                    errors.password ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""
                  }`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-black hover:text-gray-800 underline">
                  Forgot your password?
                </a>
              </div>
            </div>

            {/* Submit Button - Navigation handled by handleSubmit */}
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full" onClick={() => console.log("Google login")}>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>

              <Button variant="outline" className="w-full" onClick={() => console.log("GitHub login")}>
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </Button>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link to='/'>
            <a href="" className="inline-flex items-center text-sm text-gray-600 hover:text-black transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
                Back to homepage
            </a>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-gray-500">
        <p>
          By signing in, you agree to our{" "}
          <a href="#" className="underline hover:text-gray-700">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-gray-700">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  )
}