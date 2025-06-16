"use client"

import { useState } from "react"
import Header from "../../components/Header2"

const categories = [
  "Food & Beverage",
  "Technology",
  "Agriculture",
  "Services",
  "Manufacturing",
  "Retail",
  "Healthcare",
  "Education",
]

export default function BusinessPitchPage() {
  const [formData, setFormData] = useState({
    businessName: "",
    tagline: "",
    description: "",
    category: "",
    location: "",
    fundingGoal: "",
    minInvestment: "",
    expectedReturn: "",
    teamSize: "",
    website: "",
    socialMedia: "",
    businessPlan: "",
    financialProjections: "",
    marketAnalysis: "",
    competitiveAdvantage: "",
    useOfFunds: "",
  })

  const [uploadedFiles, setUploadedFiles] = useState({
    images: [],
    videos: [],
    documents: [],
  })

  const [dragActive, setDragActive] = useState({
    images: false,
    videos: false,
    documents: false,
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDrag = (e, type) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive((prev) => ({ ...prev, [type]: true }))
    } else if (e.type === "dragleave") {
      setDragActive((prev) => ({ ...prev, [type]: false }))
    }
  }

  const handleDrop = (e, type) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive((prev) => ({ ...prev, [type]: false }))

    const files = Array.from(e.dataTransfer.files)
    handleFiles(files, type)
  }

  const handleFileInput = (e, type) => {
    const files = Array.from(e.target.files)
    handleFiles(files, type)
  }

  const handleFiles = (files, type) => {
    const validFiles = files.filter((file) => {
      if (type === "images") return file.type.startsWith("image/")
      if (type === "videos") return file.type.startsWith("video/")
      if (type === "documents")
        return file.type === "application/pdf" || file.type.startsWith("application/vnd.") || file.type === "text/plain"
      return false
    })

    setUploadedFiles((prev) => ({
      ...prev,
      [type]: [
        ...prev[type],
        ...validFiles.map((file) => ({
          file,
          name: file.name,
          size: file.size,
          id: Math.random().toString(36).substr(2, 9),
        })),
      ],
    }))
  }

  const removeFile = (id, type) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [type]: prev[type].filter((item) => item.id !== id),
    }))
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form Data:", formData)
    console.log("Uploaded Files:", uploadedFiles)
    alert("Pitch submitted successfully! We will review your submission and get back to you within 48 hours.")
  }

  const FileUploadArea = ({ type, title, description, acceptedTypes, icon: Icon }) => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Icon className="h-5 w-5 text-white" />
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive[type] ? "border-white bg-gray-800" : "border-gray-600 hover:border-gray-500"
        }`}
        onDragEnter={(e) => handleDrag(e, type)}
        onDragLeave={(e) => handleDrag(e, type)}
        onDragOver={(e) => handleDrag(e, type)}
        onDrop={(e) => handleDrop(e, type)}
      >
        <svg className="h-8 w-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p className="text-gray-300 mb-2">{description}</p>
        <p className="text-sm text-gray-400 mb-4">{acceptedTypes}</p>
        <input
          type="file"
          multiple
          accept={
            type === "images" ? "image/*" : type === "videos" ? "video/*" : ".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
          }
          onChange={(e) => handleFileInput(e, type)}
          className="hidden"
          id={`file-${type}`}
        />
        <label
          htmlFor={`file-${type}`}
          className="inline-block px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200 cursor-pointer transition-colors"
        >
          Choose Files
        </label>
      </div>

      {uploadedFiles[type].length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-300">Uploaded Files:</h4>
          {uploadedFiles[type].map((item) => (
            <div key={item.id} className="flex items-center justify-between bg-gray-800 p-3 rounded-md">
              <div className="flex items-center space-x-3">
                <Icon className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-white">{item.name}</p>
                  <p className="text-xs text-gray-400">{formatFileSize(item.size)}</p>
                </div>
              </div>
              <button
                onClick={() => removeFile(item.id, type)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  // Icon components
  const ImageIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21,15 16,10 5,21"></polyline>
    </svg>
  )

  const Video = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <polygon points="23,7 16,12 23,17"></polygon>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
    </svg>
  )

  const FileText = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
      />
      <polyline points="14,2 14,8 20,8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10,9 9,9 8,9"></polyline>
    </svg>
  )

  return (
    <div className="min-h-screen bg-black">
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Submit Your Business Pitch</h2>
          <p className="text-xl text-gray-300 mb-2">Present your business idea to potential investors</p>
          <p className="text-gray-400">
            Fill out the form below to get your business featured on our investment platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Business Name *</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-white focus:outline-none"
                  placeholder="Enter your business name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tagline</label>
                <input
                  type="text"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-white focus:outline-none"
                  placeholder="Brief catchy tagline"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Business Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-white focus:outline-none"
                  placeholder="Describe your business, what problem it solves, and your target market"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:border-white focus:outline-none"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <svg className="inline h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-white focus:outline-none"
                  placeholder="City, State"
                />
              </div>
            </div>
          </div>

          {/* Funding Details */}
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
              Funding Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Funding Goal ($) *</label>
                <input
                  type="number"
                  name="fundingGoal"
                  value={formData.fundingGoal}
                  onChange={handleInputChange}
                  required
                  min="1000"
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-white focus:outline-none"
                  placeholder="50000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Minimum Investment ($) *</label>
                <input
                  type="number"
                  name="minInvestment"
                  value={formData.minInvestment}
                  onChange={handleInputChange}
                  required
                  min="50"
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-white focus:outline-none"
                  placeholder="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <svg className="inline h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                  Expected Return (%) *
                </label>
                <input
                  type="text"
                  name="expectedReturn"
                  value={formData.expectedReturn}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-white focus:outline-none"
                  placeholder="12-15%"
                />
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
              Business Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Team Size</label>
                <input
                  type="number"
                  name="teamSize"
                  value={formData.teamSize}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-white focus:outline-none"
                  placeholder="5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-white focus:outline-none"
                  placeholder="https://yourbusiness.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Social Media</label>
                <input
                  type="text"
                  name="socialMedia"
                  value={formData.socialMedia}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-white focus:outline-none"
                  placeholder="@yourbusiness"
                />
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6">Detailed Information</h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Business Plan Summary *</label>
                <textarea
                  name="businessPlan"
                  value={formData.businessPlan}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-white focus:outline-none"
                  placeholder="Provide a detailed summary of your business plan, including your business model, target market, and growth strategy"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Financial Projections *</label>
                <textarea
                  name="financialProjections"
                  value={formData.financialProjections}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-white focus:outline-none"
                  placeholder="Describe your revenue projections, break-even analysis, and financial milestones"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Market Analysis *</label>
                <textarea
                  name="marketAnalysis"
                  value={formData.marketAnalysis}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-white focus:outline-none"
                  placeholder="Explain your target market, market size, and customer demographics"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Competitive Advantage *</label>
                <textarea
                  name="competitiveAdvantage"
                  value={formData.competitiveAdvantage}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-white focus:outline-none"
                  placeholder="What makes your business unique? How do you differentiate from competitors?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Use of Funds *</label>
                <textarea
                  name="useOfFunds"
                  value={formData.useOfFunds}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-white focus:outline-none"
                  placeholder="How will you use the investment funds? Break down the allocation"
                />
              </div>
            </div>
          </div>

          {/* File Uploads */}
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6">Supporting Materials</h3>

            <div className="space-y-8">
              <FileUploadArea
                type="images"
                title="Business Images"
                description="Upload photos of your business, products, or team"
                acceptedTypes="PNG, JPG, JPEG up to 10MB each"
                icon={ImageIcon}
              />

              <FileUploadArea
                type="videos"
                title="Pitch Videos"
                description="Upload your pitch video or product demonstrations"
                acceptedTypes="MP4, MOV, AVI up to 100MB each"
                icon={Video}
              />

              <FileUploadArea
                type="documents"
                title="Business Documents"
                description="Upload business plan, financial statements, or other relevant documents"
                acceptedTypes="PDF, DOC, DOCX, XLS, XLSX up to 25MB each"
                icon={FileText}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center pt-8">
            <button
              type="submit"
              className="px-8 py-4 bg-white text-black text-lg font-semibold rounded-md hover:bg-gray-200 transition-colors"
            >
              Submit Business Pitch
            </button>
            <p className="text-gray-400 text-sm mt-4">
              By submitting, you agree to our terms and conditions. We'll review your pitch within 48 hours.
            </p>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-300">
            <p>&copy; 2024 MicroVest. Empowering small businesses through community investment.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
