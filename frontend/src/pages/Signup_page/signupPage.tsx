import type React from "react"

import { useState } from "react"
import { TrendingUp, ArrowLeft, ArrowRight, User, Building, Eye, EyeOff, Upload, Check } from "lucide-react"
import { Link, useNavigate } from "react-router-dom" // Import useNavigate

// Custom Button Component with reverse theme (remains the same)
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
    primary: "bg-white text-black hover:bg-gray-100 focus:ring-white",
    secondary: "bg-gray-800 text-white border border-gray-600 hover:bg-gray-700 focus:ring-gray-400",
    outline: "border-2 border-gray-400 text-gray-300 hover:bg-gray-800 focus:ring-gray-400",
    ghost: "text-gray-300 hover:text-white hover:bg-gray-800 focus:ring-gray-400",
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

// Custom Input Component with dark theme (remains the same)
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
      {label && <label className="block text-sm font-medium text-gray-200">{label}</label>}
      <input
        className={`w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-colors ${
          error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""
        } ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
}

// Custom Select Component (remains the same)
const Select = ({
  label,
  options,
  error,
  className = "",
  ...props
}: {
  label?: string
  options: { value: string; label: string }[]
  error?: string
  className?: string
  [key: string]: any
}) => {
  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-gray-200">{label}</label>}
      <select
        className={`w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-colors ${
          error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""
        } ${className}`}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
}

type UserType = "investor" | "entrepreneur" | null
type Step = 1 | 2 | 3

interface FormData {
  userType: UserType
  // Basic Info
  username: string // Added username field here
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  // Investor specific
  annualIncome: string
  investmentCap: string
  avgInvestment: string
  priorInvestment: string
  riskTolerance: string
  proofOfFunds: File | null
  // Entrepreneur specific
  previousVentures: string
  yearsExperience: string
  employmentStatus: string
  currentFund: string
  personalFundInvested: string
  commitmentTime: string
}

export default function SignupPage() {
  const navigate = useNavigate() // Initialize navigate hook
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL // Define API base URL

  const [step, setStep] = useState<Step>(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({}) // Field-specific errors
  const [formError, setFormError] = useState<string | null>(null) // General form errors from backend

  const [formData, setFormData] = useState<FormData>({
    userType: null,
    username: "", // Initialize username
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    annualIncome: "",
    investmentCap: "",
    avgInvestment: "",
    priorInvestment: "",
    riskTolerance: "",
    proofOfFunds: null,
    previousVentures: "",
    yearsExperience: "",
    employmentStatus: "",
    currentFund: "",
    personalFundInvested: "",
    commitmentTime: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear field-specific error when user starts typing
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({
      ...prev,
      proofOfFunds: file,
    }))
  }

  // --- Validation functions (updated for username) ---
  const validateStep1 = () => {
    const newErrors: { [key: string]: string } = {}
    if (!formData.userType) {
      newErrors.userType = "Please select a user type"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.username.trim()) { // Validate username
      newErrors.username = "Username is required";
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep3 = () => {
    const newErrors: { [key: string]: string } = {}

    if (formData.userType === "investor") {
      if (!formData.annualIncome) newErrors.annualIncome = "Annual income is required"
      if (!formData.investmentCap) newErrors.investmentCap = "Investment cap is required"
      if (!formData.avgInvestment) newErrors.avgInvestment = "Average investment amount is required"
      if (!formData.priorInvestment) newErrors.priorInvestment = "Prior investment experience is required"
      if (!formData.riskTolerance) newErrors.riskTolerance = "Risk tolerance is required"
    } else if (formData.userType === "entrepreneur") {
      if (!formData.previousVentures) newErrors.previousVentures = "Previous ventures information is required"
      if (!formData.yearsExperience) newErrors.yearsExperience = "Years of experience is required"
      if (!formData.employmentStatus) newErrors.employmentStatus = "Employment status is required"
      if (!formData.currentFund) newErrors.currentFund = "Current fund information is required"
      if (!formData.personalFundInvested) newErrors.personalFundInvested = "Personal fund invested is required"
      if (!formData.commitmentTime) newErrors.commitmentTime = "Commitment time is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    let isValid = false
    if (step === 1) isValid = validateStep1()
    else if (step === 2) isValid = validateStep2()

    if (isValid && step < 3) {
      setStep((prev) => (prev + 1) as Step)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as Step)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null); // Clear previous general errors

    if (!validateStep3()) return

    setIsLoading(true)

    // Prepare data for the API
    const dataToSend: { [key: string]: any } = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      password2: formData.confirmPassword, // Django REST typically expects password2 for confirmation
      first_name: formData.firstName,
      last_name: formData.lastName,
      user_type: formData.userType, // Send the user type
    };

    // Add user-type specific fields
    if (formData.userType === "investor") {
      dataToSend.investor_profile = {
        annual_income: formData.annualIncome,
        investment_cap: formData.investmentCap,
        avg_investment: formData.avgInvestment,
        prior_investment_experience: formData.priorInvestment, // Match backend field name
        risk_tolerance: formData.riskTolerance,
        // proof_of_funds will be handled separately in FormData
      };
    } else if (formData.userType === "entrepreneur") {
      dataToSend.entrepreneur_profile = {
        previous_ventures: formData.previousVentures,
        years_of_experience: formData.yearsExperience, // Match backend field name
        employment_status: formData.employmentStatus,
        current_fund_requirement: formData.currentFund, // Match backend field name
        personal_fund_invested: formData.personalFundInvested,
        commitment_time: formData.commitmentTime,
      };
    }

    // Use FormData for file uploads (if proofOfFunds exists)
    const formApiData = new FormData();
    for (const key in dataToSend) {
        if (typeof dataToSend[key] === 'object' && !Array.isArray(dataToSend[key]) && !(dataToSend[key] instanceof File)) {
            // If it's a nested object (like investor_profile or entrepreneur_profile), stringify it
            formApiData.append(key, JSON.stringify(dataToSend[key]));
        } else {
            formApiData.append(key, dataToSend[key]);
        }
    }

    // Append proof_of_funds if it exists
    if (formData.userType === "investor" && formData.proofOfFunds) {
        formApiData.append('investor_profile.proof_of_funds', formData.proofOfFunds); // Django might expect this as 'investor_profile.proof_of_funds' or similar
    }


    try {
      const response = await fetch(`${API_BASE_URL}/users/register/`, {
          method: 'POST',
          // Note: Do NOT set 'Content-Type': 'multipart/form-data' explicitly when using FormData.
          // The browser sets it automatically with the correct boundary.
          body: formApiData, // Send FormData object
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok) {
          console.log('Registration successful:', data);
          // Redirect to login page after successful registration
          navigate('/login');
      } else {
          console.error('Registration failed:', data);
          if (data.detail) {
              setFormError(data.detail); // General error from DRF
          } else if (data.non_field_errors) {
              setFormError(data.non_field_errors[0]); // For errors like "passwords do not match" if not caught by frontend
          } else {
              // Set field-specific errors from backend
              const backendErrors: { [key: string]: string } = {};
              for (const key in data) {
                  // This loop assumes backend returns an array of strings for each field error
                  if (Array.isArray(data[key]) && data[key].length > 0) {
                      // Adjust key names to match frontend formData if necessary (e.g., first_name -> firstName)
                      const frontendKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase()); // Converts snake_case to camelCase
                      backendErrors[frontendKey] = data[key][0];
                  } else if (typeof data[key] === 'object' && data[key] !== null) {
                      // Handle nested profile errors (e.g., investor_profile.annual_income)
                      for (const nestedKey in data[key]) {
                          if (Array.isArray(data[key][nestedKey]) && data[key][nestedKey].length > 0) {
                              const frontendNestedKey = nestedKey.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
                              // You might need a more robust way to map nested errors to parent form if they are not flat
                              // For now, let's just log and set a general error if complex.
                              // If backend sends "investor_profile": {"annual_income": ["This field is required."]}
                              // You could try to map it to errors.annualIncome
                              if (formData.userType === "investor" && key === "investor_profile") {
                                  backendErrors[frontendNestedKey] = data[key][nestedKey][0];
                              } else if (formData.userType === "entrepreneur" && key === "entrepreneur_profile") {
                                  backendErrors[frontendNestedKey] = data[key][nestedKey][0];
                              } else {
                                  setFormError("One or more fields are invalid. Please check your inputs.");
                                  console.error("Unmapped nested error:", key, nestedKey, data[key][nestedKey][0]);
                              }
                          }
                      }
                  }
              }
              setErrors(backendErrors);
              // Fallback for any unhandled errors or if backend response is too complex
              if (Object.keys(backendErrors).length === 0 && !data.detail && !data.non_field_errors) {
                  setFormError("An unexpected error occurred during registration. Please try again.");
              }
          }
      }
    } catch (error) {
      console.error("Registration network or other error:", error);
      setFormError("Failed to connect to the server. Please check your internet connection or try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  const incomeOptions = [
    { value: "under-50k", label: "Under $50,000" },
    { value: "50k-100k", label: "$50,000 - $100,000" },
    { value: "100k-250k", label: "$100,000 - $250,000" },
    { value: "250k-500k", label: "$250,000 - $500,000" },
    { value: "500k-1m", label: "$500,000 - $1,000,000" },
    { value: "over-1m", label: "Over $1,000,000" },
  ]

  const investmentCapOptions = [
    { value: "under-10k", label: "Under $10,000" },
    { value: "10k-50k", label: "$10,000 - $50,000" },
    { value: "50k-100k", label: "$50,000 - $100,000" },
    { value: "100k-500k", label: "$100,000 - $500,000" },
    { value: "over-500k", label: "Over $500,000" },
  ]

  const avgInvestmentOptions = [
    { value: "under-1k", label: "Under $1,000" },
    { value: "1k-5k", label: "$1,000 - $5,000" },
    { value: "5k-10k", label: "$5,000 - $10,000" },
    { value: "10k-25k", label: "$10,000 - $25,000" },
    { value: "over-25k", label: "Over $25,000" },
  ]

  const experienceOptions = [
    { value: "none", label: "No prior investment experience" },
    { value: "beginner", label: "Beginner (1-2 years)" },
    { value: "intermediate", label: "Intermediate (3-5 years)" },
    { value: "experienced", label: "Experienced (5+ years)" },
    { value: "expert", label: "Expert (10+ years)" },
  ]

  const riskToleranceOptions = [
    { value: "conservative", label: "Conservative" },
    { value: "moderate", label: "Moderate" },
    { value: "aggressive", label: "Aggressive" },
    { value: "very-aggressive", label: "Very Aggressive" },
  ]

  const employmentStatusOptions = [
    { value: "employed", label: "Employed" },
    { value: "self-employed", label: "Self-employed" },
    { value: "unemployed", label: "Unemployed" },
    { value: "student", label: "Student" },
    { value: "retired", label: "Retired" },
  ]

  const yearsExpOptions = [
    { value: "0-1", label: "0-1 years" },
    { value: "2-5", label: "2-5 years" },
    { value: "6-10", label: "6-10 years" },
    { value: "11-15", label: "11-15 years" },
    { value: "15+", label: "15+ years" },
  ]

  const commitmentTimeOptions = [
    { value: "part-time", label: "Part-time (10-20 hours/week)" },
    { value: "full-time", label: "Full-time (40+ hours/week)" },
    { value: "flexible", label: "Flexible schedule" },
    { value: "weekends", label: "Weekends only" },
  ]

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-black" />
            </div>
            <span className="text-2xl font-bold text-white">MicroVest</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-white">Create your account</h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-white hover:text-gray-300 underline"> {/* Link to login */}
            Sign in here
          </Link>
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Step {step} of 3</span>
            <span className="text-sm text-gray-400">{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-700">
          {/* General form error display */}
          {formError && (
            <div className="bg-red-700 text-white px-4 py-3 rounded relative mb-6" role="alert">
              <span className="block sm:inline">{formError}</span>
            </div>
          )}

          {/* Step 1: User Type Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Choose your account type</h3>
                <div className="grid grid-cols-1 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, userType: "investor" }))}
                    className={`p-4 border-2 rounded-lg transition-colors ${
                      formData.userType === "investor"
                        ? "border-white bg-gray-700 text-white"
                        : "border-gray-600 text-gray-300 hover:border-gray-500"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <User className="w-6 h-6" />
                      <div className="text-left">
                        <div className="font-medium">Investor</div>
                        <div className="text-sm text-gray-400">
                          I want to invest in promising businesses and earn returns
                        </div>
                      </div>
                      {formData.userType === "investor" && <Check className="w-5 h-5 ml-auto" />}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, userType: "entrepreneur" }))}
                    className={`p-4 border-2 rounded-lg transition-colors ${
                      formData.userType === "entrepreneur"
                        ? "border-white bg-gray-700 text-white"
                        : "border-gray-600 text-gray-300 hover:border-gray-500"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Building className="w-6 h-6" />
                      <div className="text-left">
                        <div className="font-medium">Entrepreneur</div>
                        <div className="text-sm text-gray-400">
                          I want to raise funds for my business and share profits
                        </div>
                      </div>
                      {formData.userType === "entrepreneur" && <Check className="w-5 h-5 ml-auto" />}
                    </div>
                  </button>
                </div>
                {errors.userType && <p className="text-sm text-red-400 mt-2">{errors.userType}</p>}
              </div>

              <Button onClick={handleNext} className="w-full" size="lg">
                Continue
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          )}

          {/* Step 2: Basic Information */}
          {step === 2 && (
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Basic Information</h3>
              </div>

              <Input // Added username input
                label="Username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleInputChange}
                error={errors.username}
                placeholder="Choose a unique username"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  error={errors.firstName}
                  placeholder="John"
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  error={errors.lastName}
                  placeholder="Doe"
                />
              </div>

              <Input
                label="Email Address"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                placeholder="john@example.com"
              />

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-200">Password</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a strong password"
                    className={`w-full px-3 py-2 pr-10 bg-gray-800 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-colors ${
                      errors.password ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    )}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-400">{errors.password}</p>}
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-200">Confirm Password</label>
                <div className="relative">
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className={`w-full px-3 py-2 pr-10 bg-gray-800 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-colors ${
                      errors.confirmPassword ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-sm text-red-400">{errors.confirmPassword}</p>}
              </div>

              <div className="flex space-x-4">
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  <ArrowLeft className="mr-2 w-5 h-5" />
                  Back
                </Button>
                <Button onClick={handleNext} className="flex-1">
                  Continue
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </form>
          )}

          {/* Step 3: User-specific Information */}
          {step === 3 && (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <h3 className="text-lg font-medium text-white mb-4">
                  {formData.userType === "investor" ? "Investment Profile" : "Business Profile"}
                </h3>
              </div>

              {formData.userType === "investor" && (
                <>
                  <Select
                    label="Annual Income Range"
                    name="annualIncome"
                    options={incomeOptions}
                    value={formData.annualIncome}
                    onChange={handleInputChange}
                    error={errors.annualIncome}
                  />

                  <Select
                    label="Annual Investment Cap"
                    name="investmentCap"
                    options={investmentCapOptions}
                    value={formData.investmentCap}
                    onChange={handleInputChange}
                    error={errors.investmentCap}
                  />

                  <Select
                    label="Average Investment Amount"
                    name="avgInvestment"
                    options={avgInvestmentOptions}
                    value={formData.avgInvestment}
                    onChange={handleInputChange}
                    error={errors.avgInvestment}
                  />

                  <Select
                    label="Prior Investment Experience"
                    name="priorInvestment"
                    options={experienceOptions}
                    value={formData.priorInvestment}
                    onChange={handleInputChange}
                    error={errors.priorInvestment}
                  />

                  <Select
                    label="Risk Tolerance"
                    name="riskTolerance"
                    options={riskToleranceOptions}
                    value={formData.riskTolerance}
                    onChange={handleInputChange}
                    error={errors.riskTolerance}
                  />

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-200">
                      Proof of Funds <span className="text-gray-400">(Optional)</span>
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer hover:border-gray-500">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-400">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PDF, PNG, JPG (MAX. 10MB)</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                    {formData.proofOfFunds && (
                      <p className="text-sm text-green-400">File uploaded: {formData.proofOfFunds.name}</p>
                    )}
                  </div>
                </>
              )}

              {formData.userType === "entrepreneur" && (
                <>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-200">Previous Ventures</label>
                    <textarea
                      name="previousVentures"
                      rows={3}
                      value={formData.previousVentures}
                      onChange={handleInputChange}
                      placeholder="Describe your previous business ventures or startup experience..."
                      className={`w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-colors ${
                        errors.previousVentures ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""
                      }`}
                    />
                    {errors.previousVentures && <p className="text-sm text-red-400">{errors.previousVentures}</p>}
                  </div>

                  <Select
                    label="Years of Experience"
                    name="yearsExperience"
                    options={yearsExpOptions}
                    value={formData.yearsExperience}
                    onChange={handleInputChange}
                    error={errors.yearsExperience}
                  />

                  <Select
                    label="Employment Status"
                    name="employmentStatus"
                    options={employmentStatusOptions}
                    value={formData.employmentStatus}
                    onChange={handleInputChange}
                    error={errors.employmentStatus}
                  />

                  <Input
                    label="Current Fund Requirement"
                    name="currentFund"
                    type="text"
                    value={formData.currentFund}
                    onChange={handleInputChange}
                    error={errors.currentFund}
                    placeholder="e.g., $50,000"
                  />

                  <Input
                    label="Personal Fund Already Invested"
                    name="personalFundInvested"
                    type="text"
                    value={formData.personalFundInvested}
                    onChange={handleInputChange}
                    error={errors.personalFundInvested}
                    placeholder="e.g., $10,000"
                  />

                  <Select
                    label="Time Commitment"
                    name="commitmentTime"
                    options={commitmentTimeOptions}
                    value={formData.commitmentTime}
                    onChange={handleInputChange}
                    error={errors.commitmentTime}
                  />
                </>
              )}

              <div className="flex space-x-4">
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  <ArrowLeft className="mr-2 w-5 h-5" />
                  Back
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                      Creating Account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Back to Home */}
        <Link to='/'>
            <div className="mt-6 text-center">
            <a href="#" className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to homepage
            </a>
            </div>
        </Link>
        </div>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-gray-500">
        <p>
          By creating an account, you agree to our{" "}
          <a href="#" className="underline hover:text-gray-400">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-gray-400">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  )
}