"use client"

import { useState } from "react"
import type { ChangeEvent, DragEvent } from "react"
import { useNavigate } from "react-router-dom"


// Define TypeScript interfaces for our data structures
interface FormData {
  businessName: string;
  tagline: string;
  description: string;
  category: string;
  location: string;
  fundingGoal: string;
  minInvestment: string;
  teamSize: string;
  website: string;
  socialMedia: string;
  businessPlan: string;
  financialProjections: string;
  marketAnalysis: string;
  competitiveAdvantage: string;
  useOfFunds: string;
}

interface UploadedFile {
  file: File;
  name: string;
  size: number;
  id: string;
  thumbnailFile?: File; // Optional thumbnail for videos
}

interface UploadedFiles {
  images: UploadedFile[];
  videos: UploadedFile[];
  documents: UploadedFile[];
}

type DragActiveState = {
    images: boolean;
    videos: boolean;
    documents: boolean;
}

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

const BusinessPitchPage = () => {
  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    tagline: "",
    description: "",
    category: "",
    location: "",
    fundingGoal: "",
    minInvestment: "",
    teamSize: "",
    website: "",
    socialMedia: "",
    businessPlan: "",
    financialProjections: "",
    marketAnalysis: "",
    competitiveAdvantage: "",
    useOfFunds: "",
  })

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({
    images: [],
    videos: [],
    documents: [],
  })

  const [dragActive, setDragActive] = useState<DragActiveState>({
    images: false,
    videos: false,
    documents: false,
  })

  const navigate = useNavigate()

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDrag = (e: DragEvent<HTMLDivElement>, type: keyof DragActiveState) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive((prev) => ({ ...prev, [type]: true }))
    } else if (e.type === "dragleave") {
      setDragActive((prev) => ({ ...prev, [type]: false }))
    }
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>, type: keyof DragActiveState) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive((prev) => ({ ...prev, [type]: false }))

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const files = Array.from(e.dataTransfer.files) as File[]
        handleFiles(files, type)
    }
  }

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>, type: keyof DragActiveState) => {
    if (e.target.files && e.target.files.length > 0) {
        const files = Array.from(e.target.files) as File[]
        handleFiles(files, type)
    }
  }

  const handleFiles = (files: File[], type: keyof UploadedFiles) => {
    const validFiles = files.filter((file) => {
      if (type === "images") return file.type.startsWith("image/")
      if (type === "videos") return file.type.startsWith("video/")
      if (type === "documents")
        return file.type === "application/pdf" || file.type.startsWith("application/vnd.") || file.type === "text/plain"
      return false
    })

    const newFiles: UploadedFile[] = validFiles.map((file) => ({
        file,
        name: file.name,
        size: file.size,
        id: Math.random().toString(36).substr(2, 9),
    }));

    setUploadedFiles((prev) => ({
      ...prev,
      [type]: [...prev[type], ...newFiles],
    }))
  }

  const removeFile = (id: string, type: keyof UploadedFiles) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [type]: prev[type].filter((item) => item.id !== id),
    }))
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const data = new FormData()

    // Append form data fields
    data.append("title", formData.businessName)
    data.append("tagline", formData.tagline)
    data.append("description", formData.description)
    data.append("category", formData.category)
    data.append("location", formData.location)
    data.append("funding_goal", formData.fundingGoal)
    data.append("min_investment", formData.minInvestment)
    data.append("team_size", formData.teamSize)
    data.append("website", formData.website)
    data.append("social_media", formData.socialMedia)
    data.append("business_plan", formData.businessPlan)
    data.append("financial_projections", formData.financialProjections)
    data.append("market_analysis", formData.marketAnalysis)
    data.append("competitive_advantage", formData.competitiveAdvantage)
    data.append("use_of_funds", formData.useOfFunds)

    // Append uploaded files
    uploadedFiles.images.forEach((item, index) => {
      data.append(`images`, item.file)
    })

    uploadedFiles.videos.forEach((item, index) => {
      data.append(`videos`, item.file)
    })

    uploadedFiles.documents.forEach((item, index) => {
      data.append(`documents`, item.file)
    })

    try {
      const token = localStorage.getItem('authToken');
      const headers: HeadersInit = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        alert('Please log in to submit a business pitch');
        navigate('/login');
        return;
      }

      const response = await fetch("http://localhost:8000/api/businesses/pitch/", {
        method: "POST",
        headers,
        body: data,
      })

      if (!response.ok) {
        const errorData = await response.json()
        
        // Check if token is expired
        if (errorData.code === 'token_not_valid' || errorData.detail?.includes('expired')) {
          alert('Your session has expired. Please log in again.');
          localStorage.removeItem('authToken');
          localStorage.removeItem('userId');
          navigate('/login');
          return;
        }
        
        console.error("Submission error:", errorData)
        alert(`Failed to submit pitch: ${JSON.stringify(errorData)}`)
        return
      }

      const result = await response.json()
      console.log("Pitch submitted successfully:", result)
      alert("Pitch submitted successfully! We will review your submission and get back to you within 48 hours.")

      // Reset form
      setFormData({
        businessName: "", tagline: "", description: "", category: "", location: "",
        fundingGoal: "", minInvestment: "", teamSize: "",
        website: "", socialMedia: "", businessPlan: "", financialProjections: "",
        marketAnalysis: "", competitiveAdvantage: "", useOfFunds: "",
      })
      setUploadedFiles({ images: [], videos: [], documents: [] })

    } catch (error) {
      console.error("Network or unexpected error:", error)
      alert("An error occurred while submitting your pitch. Please try again.")
    }
  }

  // Icon components
  const ImageIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21,15 16,10 5,21"></polyline>
    </svg>
  )

  const VideoIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <polygon points="23,7 16,12 23,17 23,7"></polygon>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
    </svg>
  )

  const FileTextIcon = ({ className }: { className: string }) => (
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

  // FileUploadArea component
  interface FileUploadAreaProps {
    type: keyof UploadedFiles;
    title: string;
    description: string;
    acceptedTypes: string;
    icon: React.ComponentType<{ className: string }>;
  }

  const FileUploadArea = ({ type, title, description, acceptedTypes, icon: Icon }: FileUploadAreaProps) => (
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
          accept={acceptedTypes}
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

  return (
    <div className="absolute inset-0 top-16 bg-black overflow-y-auto">
      <main className="w-full px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Submit Your Business Pitch</h2>
            <p className="text-xl text-gray-300 mb-2">Present your business idea to potential investors</p>
            <p className="text-gray-400">
              Fill out the form below to get your business featured on our investment platform
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 w-full">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Business Name *</label>
                  <input type="text" name="businessName" value={formData.businessName} onChange={handleInputChange} required className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-white focus:outline-none" placeholder="Enter your business name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tagline</label>
                  <input type="text" name="tagline" value={formData.tagline} onChange={handleInputChange} className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-white focus:outline-none" placeholder="Brief catchy tagline" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Business Description *</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} required rows={4} className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-white focus:outline-none" placeholder="Describe your business, what problem it solves, and your target market" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} required className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:border-white focus:outline-none">
                    <option value="">Select a category</option>
                    {categories.map((category) => ( <option key={category} value={category}> {category} </option> ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Location *</label>
                  <input type="text" name="location" value={formData.location} onChange={handleInputChange} required className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-white focus:outline-none" placeholder="City, State"/>
                </div>
              </div>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
               <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>
                  Funding Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Funding Goal ($) *</label>
                  <input type="number" name="fundingGoal" value={formData.fundingGoal} onChange={handleInputChange} required min="1000" className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-white focus:outline-none" placeholder="50000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Minimum Investment ($) *</label>
                  <input type="number" name="minInvestment" value={formData.minInvestment} onChange={handleInputChange} required min="50" className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-white focus:outline-none" placeholder="100" />
                </div>
              </div>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
               <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg>
                  Business Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Team Size</label>
                      <input type="number" name="teamSize" value={formData.teamSize} onChange={handleInputChange} min="1" className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-white focus:outline-none" placeholder="5" />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                      <input type="url" name="website" value={formData.website} onChange={handleInputChange} className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-white focus:outline-none" placeholder="https://yourbusiness.com" />
                  </div>
                  <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Social Media</label>
                      <input type="text" name="socialMedia" value={formData.socialMedia} onChange={handleInputChange} className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-white focus:outline-none" placeholder="@yourbusiness" />
                  </div>
              </div>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-6">Detailed Information</h3>
              <div className="space-y-6">
                  <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Business Plan Summary *</label>
                      <textarea name="businessPlan" value={formData.businessPlan} onChange={handleInputChange} required rows={4} className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-white focus:outline-none" placeholder="Provide a detailed summary of your business plan..."/>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Financial Projections *</label>
                      <textarea name="financialProjections" value={formData.financialProjections} onChange={handleInputChange} required rows={3} className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-white focus:outline-none" placeholder="Describe your revenue projections..."/>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Market Analysis *</label>
                      <textarea name="marketAnalysis" value={formData.marketAnalysis} onChange={handleInputChange} required rows={3} className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-white focus:outline-none" placeholder="Explain your target market..."/>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Competitive Advantage *</label>
                      <textarea name="competitiveAdvantage" value={formData.competitiveAdvantage} onChange={handleInputChange} required rows={3} className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-white focus:outline-none" placeholder="What makes your business unique?"/>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Use of Funds *</label>
                      <textarea name="useOfFunds" value={formData.useOfFunds} onChange={handleInputChange} required rows={3} className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-white focus:outline-none" placeholder="How will you use the investment funds?"/>
                  </div>
              </div>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-6">Supporting Materials</h3>
              <div className="space-y-8">
                  <FileUploadArea type="images" title="Business Images" description="Upload photos of your business, products, or team" acceptedTypes="image/*" icon={ImageIcon} />
                  <FileUploadArea type="videos" title="Pitch Videos" description="Upload your pitch video or product demonstrations" acceptedTypes="video/*" icon={VideoIcon} />
                  <FileUploadArea type="documents" title="Business Documents" description="Upload business plan, financial statements..." acceptedTypes=".pdf,.doc,.docx,.txt" icon={FileTextIcon} />
              </div>
            </div>
            <div className="text-center pt-8">
              <button type="submit" className="px-8 py-4 bg-white text-black text-lg font-semibold rounded-md hover:bg-gray-200 transition-colors">
                Submit Business Pitch
              </button>
              <p className="text-gray-400 text-sm mt-4">
                By submitting, you agree to our terms and conditions. We'll review your pitch within 48 hours.
              </p>
            </div>
          </form>
        </div>
      </main>

      <footer className="border-t border-gray-800 bg-gray-900 mt-16">
        <div className="w-full px-4 py-8">
          <div className="text-center text-gray-300">
            <p>&copy; 2024 MicroVest. Empowering small businesses through community investment.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default BusinessPitchPage;
