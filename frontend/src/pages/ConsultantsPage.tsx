import React, { useState, useEffect, useCallback } from 'react';
import { Search, Mail, Phone, MapPin, Star, Filter, X, Send } from 'lucide-react';
import Sidebar from '../components/Sidebar'; // Import the Sidebar component
import { useLocation } from 'react-router-dom'; // Import useLocation to get current path
import { useUser } from '../context/UserContext'; // Assuming you need useUser for openAddFundsModal

interface Consultant {
  id: number;
  name: string;
  expertise: string[];
  experience: number;
  rating: number;
  location: string;
  email: string;
  phone: string;
  bio: string;
  hourlyRate: number;
  image: string;
}

interface EmailForm {
  to: string;
  from: string;
  subject: string;
  message: string;
}

const ConsultantsPage: React.FC = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [filteredConsultants, setFilteredConsultants] = useState<Consultant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('rating');
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [emailForm, setEmailForm] = useState<EmailForm>({
    to: '',
    from: '',
    subject: '',
    message: ''
  });
  const [isSending, setIsSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Debounced search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const location = useLocation(); // Hook to get current path
  const { openAddFundsModal } = useUser(); // For passing to Sidebar

  // Mock data for consultants
  const mockConsultants: Consultant[] = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      expertise: ["Business Strategy", "Financial Planning", "Market Analysis"],
      experience: 15,
      rating: 4.8,
      location: "New York, NY",
      email: "sarah.johnson@consulting.com",
      phone: "+1 (555) 123-4567",
      bio: "Experienced business consultant with expertise in helping startups scale and established businesses optimize their operations.",
      hourlyRate: 250,
      image: "/src/assets/doctor.avif"
    },
    {
      id: 2,
      name: "Michael Chen",
      expertise: ["Technology", "Digital Transformation", "Product Development"],
      experience: 12,
      rating: 4.9,
      location: "San Francisco, CA",
      email: "michael.chen@techconsulting.com",
      phone: "+1 (555) 234-5678",
      bio: "Technology consultant specializing in digital transformation and product development for growing companies.",
      hourlyRate: 300,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      expertise: ["Marketing", "Brand Strategy", "Social Media"],
      experience: 8,
      rating: 4.7,
      location: "Los Angeles, CA",
      email: "emily.rodriguez@marketing.com",
      phone: "+1 (555) 345-6789",
      bio: "Marketing consultant helping businesses build strong brands and effective marketing strategies.",
      hourlyRate: 200,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 4,
      name: "David Thompson",
      expertise: ["Operations", "Supply Chain", "Process Optimization"],
      experience: 20,
      rating: 4.6,
      location: "Chicago, IL",
      email: "david.thompson@operations.com",
      phone: "+1 (555) 456-7890",
      bio: "Operations expert with decades of experience in supply chain management and process optimization.",
      hourlyRate: 275,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 5,
      name: "Lisa Wang",
      expertise: ["Human Resources", "Organizational Development", "Leadership Training"],
      experience: 10,
      rating: 4.8,
      location: "Seattle, WA",
      email: "lisa.wang@hrconsulting.com",
      phone: "+1 (555) 567-8901",
      bio: "HR consultant focused on organizational development and leadership training for high-growth companies.",
      hourlyRate: 225,
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
    }
  ];

  useEffect(() => {
    setConsultants(mockConsultants);
    setFilteredConsultants(mockConsultants);
  }, []);

  // Debounce search term
  useEffect(() => {
    if (searchTerm !== debouncedSearchTerm) {
      setIsSearching(true);
    }
    
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, debouncedSearchTerm]);

  useEffect(() => {
    let filtered = [...consultants]; // Create a copy to avoid mutating original

    // Filter by search term (improved logic)
    if (debouncedSearchTerm.trim()) {
      const searchLower = debouncedSearchTerm.toLowerCase().trim();
      filtered = filtered.filter(consultant => {
        // Search in name
        if (consultant.name.toLowerCase().includes(searchLower)) return true;
        
        // Search in expertise (exact match or contains)
        if (consultant.expertise.some(exp => 
          exp.toLowerCase().includes(searchLower) || 
          searchLower.includes(exp.toLowerCase())
        )) return true;
        
        // Search in bio
        if (consultant.bio.toLowerCase().includes(searchLower)) return true;
        
        // Search in location
        if (consultant.location.toLowerCase().includes(searchLower)) return true;
        
        return false;
      });
    }

    // Filter by expertise (improved logic)
    if (selectedExpertise !== 'all') {
      const expertiseLower = selectedExpertise.toLowerCase();
      filtered = filtered.filter(consultant =>
        consultant.expertise.some(exp => 
          exp.toLowerCase() === expertiseLower ||
          exp.toLowerCase().includes(expertiseLower) ||
          expertiseLower.includes(expertiseLower)
        )
      );
    }

    // Sort consultants (improved logic)
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating; // Highest rating first
        case 'experience':
          return b.experience - a.experience; // Most experience first
        case 'rate':
          return a.hourlyRate - b.hourlyRate; // Lowest rate first
        case 'name':
          return a.name.localeCompare(b.name); // Alphabetical
        default:
          return 0;
      }
    });

    setFilteredConsultants(filtered);
  }, [consultants, debouncedSearchTerm, selectedExpertise, sortBy]);

  const expertiseOptions = [
    'all',
    'business strategy',
    'financial planning',
    'market analysis',
    'technology',
    'digital transformation',
    'product development',
    'marketing',
    'brand strategy',
    'social media',
    'operations',
    'supply chain',
    'process optimization',
    'human resources',
    'organizational development',
    'leadership training'
  ];

  const handleContact = (consultant: Consultant) => {
    setSelectedConsultant(consultant);
    setEmailForm({
      to: consultant.email,
      from: '', // User's email would go here, perhaps from context
      subject: `Consultation Request - ${consultant.name}`,
      message: `Dear ${consultant.name},\n\nI am interested in your consulting services and would like to discuss potential collaboration.\n\nBest regards,\n[Your Name]`
    });
    setIsEmailModalOpen(true);
    setEmailSent(false);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    
    // Simulate email sending
    setTimeout(() => {
      setIsSending(false);
      setEmailSent(true);
      setTimeout(() => {
        setIsEmailModalOpen(false);
        setEmailSent(false);
      }, 2000); // Close modal after 2 seconds
    }, 1500); // Simulate network delay
  };

  const closeEmailModal = () => {
    setIsEmailModalOpen(false);
    setSelectedConsultant(null);
    setEmailSent(false); // Reset email sent status
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedExpertise('all');
    setSortBy('rating');
  };

  const hasActiveFilters = debouncedSearchTerm || selectedExpertise !== 'all';

  return (
    <div className="flex min-h-screen bg-[#F8F6F6]"> {/* Apply theme background */}
      {/* Left Sidebar */}
      <Sidebar active="Look for Consultants" onAddFundsClick={openAddFundsModal} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 ml-80"> {/* Add ml-80 */}
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl max-text-7xl font-bold text-[#2A363B] mt-8 mb-2">Find Expert Consultants</h1> {/* Increased size to text-4xl and bolded */}
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4"> {/* Increased size to text-xl */}
            Connect with experienced consultants who can help grow your business and provide expert guidance.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-6 mb-8"> {/* Apply theme shadow */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${isSearching ? 'text-[#CF4647] animate-pulse' : 'text-gray-400'}`} /> {/* Apply theme accent color */}
              <input
                type="text"
                placeholder="Search consultants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF4647] focus:border-transparent" // Apply theme accent color
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Expertise Filter */}
            <div>
              <select
                value={selectedExpertise}
                onChange={(e) => setSelectedExpertise(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF4647] focus:border-transparent" // Apply theme accent color
              >
                {expertiseOptions.map(option => (
                  <option key={option} value={option}>
                    {option === 'all' ? 'All Expertise' : option.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF4647] focus:border-transparent" // Apply theme accent color
              >
                <option value="rating">Highest Rating</option>
                <option value="experience">Most Experience</option>
                <option value="rate">Lowest Rate</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>

            {/* Results Count and Clear Filters */}
            <div className="flex items-center justify-between">
              <span className="text-gray-600">
                {filteredConsultants.length} consultant{filteredConsultants.length !== 1 ? 's' : ''} found
              </span>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-[#CF4647] hover:text-[#2A363B] font-medium" // Apply theme accent color
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Consultants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConsultants.map((consultant) => (
            <div key={consultant.id} className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-hidden hover:shadow-lg transition-shadow duration-300"> {/* Apply theme shadow */}
              {/* Consultant Header */}
              <div className="p-6 border-b border-gray-100"> {/* Lighter border */}
                <div className="flex items-center space-x-4">
                  <img
                    src={consultant.image}
                    alt={consultant.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-100" // Added light border
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2A363B]">{consultant.name}</h3> {/* Apply theme text color */}
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-[#F5D061] fill-current" /> {/* Apply theme yellow accent */}
                        <span className="ml-1 text-sm text-gray-600">{consultant.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-600">{consultant.experience} years</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Consultant Details */}
              <div className="p-6">
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-[#2A363B] mb-2">Expertise</h4> {/* Apply theme text color */}
                  <div className="flex flex-wrap gap-2">
                    {consultant.expertise.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-[#F8F6F6] text-[#2A363B] text-xs rounded-full" // Soft background, dark text
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{consultant.bio}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-[#CF4647]" /> {/* Apply theme accent color */}
                    {consultant.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2 text-[#CF4647]" /> {/* Apply theme accent color */}
                    {consultant.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2 text-[#CF4647]" /> {/* Apply theme accent color */}
                    {consultant.phone}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold text-[#2A363B]"> {/* Apply theme text color */}
                    ${consultant.hourlyRate}/hr
                  </div>
                  <button
                    onClick={() => handleContact(consultant)}
                    className="bg-[#CF4647] text-white px-4 py-2 rounded-lg hover:bg-[#2A363B] transition-colors duration-200 shadow-md" // Apply theme accent colors
                  >
                    Contact
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredConsultants.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] mt-6"> {/* Apply theme shadow */}
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-[#2A363B] mb-2">No consultants found</h3> {/* Apply theme text color */}
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </main>

      {/* Email Modal */}
      {isEmailModalOpen && selectedConsultant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedConsultant.image}
                  alt={selectedConsultant.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-[#2A363B]">Contact {selectedConsultant.name}</h3> {/* Apply theme text color */}
                  <p className="text-sm text-gray-600">{selectedConsultant.expertise.join(', ')}</p>
                </div>
              </div>
              <button
                onClick={closeEmailModal}
                className="text-gray-400 hover:text-[#CF4647] transition-colors" // Apply theme accent color
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To:</label>
                  <input
                    type="email"
                    value={emailForm.to}
                    readOnly // To field should generally be read-only for contact forms
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From:</label>
                  <input
                    type="email"
                    value={emailForm.from}
                    onChange={(e) => setEmailForm(prev => ({ ...prev, from: e.target.value }))}
                    placeholder="your.email@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF4647] focus:border-transparent" // Apply theme accent color
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject:</label>
                <input
                  type="text"
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF4647] focus:border-transparent" // Apply theme accent color
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message:</label>
                <textarea
                  value={emailForm.message}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, message: e.target.value }))}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF4647] focus:border-transparent resize-none" // Apply theme accent color
                  required
                />
              </div>

              {/* Success Message */}
              {emailSent && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    <span>Email sent successfully!</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeEmailModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSending || emailSent}
                  className="px-4 py-2 bg-[#CF4647] text-white rounded-lg hover:bg-[#2A363B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2" // Apply theme accent colors
                >
                  {isSending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </>
                  ) : emailSent ? (
                    <>
                      <Mail className="h-4 w-4" />
                      <span>Sent!</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Send Email</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultantsPage;