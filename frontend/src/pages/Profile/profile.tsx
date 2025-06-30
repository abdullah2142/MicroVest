"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate, Navigate } from "react-router-dom"
import {
  User,
  Mail,
  Phone,
  Camera,
  Save,
  X,
  Edit,
  LogOut,
  ArrowLeft,
  Upload,
  Trash2
} from "lucide-react"

//import Navbar from '../../components/navbar'; // Assuming you still need this if not commented out in actual project
import Footer from '../../components/footer';

// Define user state interface
interface UserState {
  isAuthenticated: boolean;
  authToken: string | null;
  userType: 'investor' | 'entrepreneur' | null;
  username: string | null;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  phone_number?: string | null;
  prof_pic?: string | null;
}

// Define editable user data interface
interface EditableUserData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserState>({
    isAuthenticated: false,
    authToken: null,
    userType: null,
    username: null,
    email: null,
    first_name: null,
    last_name: null,
    phone_number: null,
    prof_pic: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editData, setEditData] = useState<EditableUserData>({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // This state isn't used for now, consider removing or implementing.
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:8000/api';

  // Load user data from localStorage on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const storedAuthToken = localStorage.getItem('authToken');
      const storedUserType = localStorage.getItem('userType') as 'investor' | 'entrepreneur' | null;
      const storedUsername = localStorage.getItem('username');
      const storedEmail = localStorage.getItem('email');
      const storedFirstName = localStorage.getItem('first_name');
      const storedLastName = localStorage.getItem('last_name');
      const storedPhoneNumber = localStorage.getItem('phone_number');

      if (storedAuthToken && storedUsername) {
        try {
          // Fetch user data from backend to get the latest profile picture
          const response = await fetch(`${API_BASE_URL}/users/profile/`, {
            headers: {
              'Authorization': `Bearer ${storedAuthToken}`,
              'Content-Type': 'application/json'
            }
          });

          let userData = {
            isAuthenticated: true,
            authToken: storedAuthToken,
            userType: storedUserType || 'investor',
            username: storedUsername,
            email: storedEmail || '',
            first_name: storedFirstName || '',
            last_name: storedLastName || '',
            phone_number: storedPhoneNumber || '',
            prof_pic: null,
          };

          if (response.ok) {
            const backendData = await response.json();
            // Update with backend data (including profile picture)
            userData = {
              ...userData,
              email: backendData.email || userData.email,
              first_name: backendData.first_name || userData.first_name,
              last_name: backendData.last_name || userData.last_name,
              phone_number: backendData.phone_number || userData.phone_number,
              prof_pic: backendData.prof_pic || null,
            };
            
            // Update localStorage with backend data
            localStorage.setItem('email', userData.email);
            localStorage.setItem('first_name', userData.first_name);
            localStorage.setItem('last_name', userData.last_name);
            localStorage.setItem('phone_number', userData.phone_number);
            if (userData.prof_pic) {
              localStorage.setItem('prof_pic', userData.prof_pic);
            }
          }
          
          setUser(userData);
          setProfileImage(userData.prof_pic);
          
          // Initialize edit data with current user data
          setEditData({
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            email: userData.email || '',
            phone_number: userData.phone_number || '',
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Fallback to localStorage data if API fails
          const fallbackData = {
            isAuthenticated: true,
            authToken: storedAuthToken,
            userType: storedUserType || 'investor',
            username: storedUsername,
            email: storedEmail || '',
            first_name: storedFirstName || '',
            last_name: storedLastName || '',
            phone_number: storedPhoneNumber || '',
            prof_pic: localStorage.getItem('prof_pic') || null,
          };
          setUser(fallbackData);
          setProfileImage(fallbackData.prof_pic);
          setEditData({
            first_name: fallbackData.first_name || '',
            last_name: fallbackData.last_name || '',
            email: fallbackData.email || '',
            phone_number: fallbackData.phone_number || '',
          });
        }
      }
      
      setIsLoading(false);
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('first_name');
    localStorage.removeItem('last_name');
    localStorage.removeItem('phone_number');
    localStorage.removeItem('prof_pic');

    // Reset user state
    setUser({
      isAuthenticated: false,
      authToken: null,
      userType: null,
      username: null,
      email: null,
      first_name: null,
      last_name: null,
      phone_number: null,
      prof_pic: null,
    });

    navigate('/login');
  };

  const handleLoginNav = () => {
    navigate('/login');
  };

  const handleSignUpNav = () => {
    navigate('/signup');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset to original data
      setEditData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
      });
      setErrors({});
    }
    setIsEditing(!isEditing);
    setSuccessMessage(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'Please select a valid image file' }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image size should be less than 5MB' }));
        return;
      }

      setSelectedFile(file);
      setErrors(prev => ({ ...prev, image: '' }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setErrors(prev => ({ ...prev, image: '' }));

    try {
      const formData = new FormData();
      formData.append('profile_picture', selectedFile);

      const response = await fetch(`${API_BASE_URL}/users/profile/upload-picture/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.authToken}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        // Update localStorage and state
        localStorage.setItem('prof_pic', data.profile_picture_url);
        setUser(prev => ({
          ...prev,
          prof_pic: data.profile_picture_url
        }));
        setSuccessMessage('Profile picture updated successfully!');
        setSelectedFile(null);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        setErrors(prev => ({ ...prev, image: data.error || 'Failed to upload image' }));
      }
    } catch (error) {
      console.error('Image upload error:', error);
      setErrors(prev => ({ ...prev, image: 'Network error. Please try again.' }));
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!editData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }

    if (!editData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }

    if (!editData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(editData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (editData.phone_number && !/^[\+]?[1-9][\d]{0,15}$/.test(editData.phone_number.replace(/\s/g, ''))) {
      newErrors.phone_number = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    setErrors({});

    try {
      const response = await fetch(`${API_BASE_URL}/users/profile/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.authToken}`,
        },
        body: JSON.stringify({
          first_name: editData.first_name,
          last_name: editData.last_name,
          email: editData.email,
          phone_number: editData.phone_number,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Profile update successful:', data);
        
        // Update localStorage
        localStorage.setItem('first_name', editData.first_name);
        localStorage.setItem('last_name', editData.last_name);
        localStorage.setItem('email', editData.email);
        localStorage.setItem('phone_number', editData.phone_number);

        // Update user state
        setUser(prev => ({
          ...prev,
          first_name: editData.first_name,
          last_name: editData.last_name,
          email: editData.email,
          phone_number: editData.phone_number,
        }));

        setIsEditing(false);
        setSuccessMessage('Profile updated successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        console.error('Profile update failed:', data);
        if (data.email) {
          setErrors(prev => ({ ...prev, email: data.email[0] }));
        } else if (data.detail) {
          setErrors(prev => ({ ...prev, general: data.detail }));
        } else {
          setErrors(prev => ({ ...prev, general: 'Failed to update profile. Please try again.' }));
        }
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setErrors(prev => ({ ...prev, general: 'Network error. Please check your connection and try again.' }));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data including businesses, investments, and messages.'
    );
    
    if (!confirmed) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/delete-account/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Clear localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('userType');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        localStorage.removeItem('first_name');
        localStorage.removeItem('last_name');
        localStorage.removeItem('phone_number');
        localStorage.removeItem('prof_pic');

        // Reset user state
        setUser({
          isAuthenticated: false,
          authToken: null,
          userType: null,
          username: null,
          email: null,
          first_name: null,
          last_name: null,
          phone_number: null,
          prof_pic: null,
        });

        navigate('/login');
      } else {
        const errorData = await response.json();
        setErrors(prev => ({ ...prev, general: errorData.error || 'Failed to delete account. Please try again.' }));
      }
    } catch (error) {
      console.error('Account deletion error:', error);
      setErrors(prev => ({ ...prev, general: 'Network error. Please check your connection and try again.' }));
    } finally {
      setIsDeleting(false);
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F6F6] flex items-center justify-center"> {/* Background color updated */}
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2A363B] mx-auto"></div> {/* Spinner color updated */}
          <p className="mt-4 text-[#2A363B]">Loading...</p> {/* Text color updated */}
        </div>
      </div>
    );
  }

  // Only redirect if not loading and not authenticated
  if (!isLoading && !user.isAuthenticated) {
    console.log('Profile: Redirecting to login - user not authenticated');
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F8F6F6] flex flex-col w-full"> {/* Background color updated */}
      {/* Assuming Navbar if it's part of the layout */}
      {/* <Navbar /> */} 

      <div className="w-full max-w-[1920px] mx-auto px-8 py-8 flex-grow">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            {/* Colors updated for back button */}
            <button
              onClick={handleBackToDashboard}
              className="p-2 text-[#2A363B] hover:text-[#CF4647] hover:bg-gray-100 rounded-full transition-colors" 
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-[#2A363B]">Profile Settings</h1> {/* Text color updated */}
              <p className="text-gray-600">Manage your account information and preferences</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-[#2A363B] text-white rounded-md hover:bg-gray-700 transition-colors flex items-center space-x-2" 
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-[#F8F6F6] border border-[#F5D061] text-[#2A363B] px-4 py-3 rounded relative"> 
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}

        {/* General Error Message */}
        {errors.general && (
          <div className="mb-6 bg-[#F8F6F6] border border-[#CF4647] text-[#2A363B] px-4 py-3 rounded relative"> 
            <span className="block sm:inline">{errors.general}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
          {/* Profile Picture Section */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <div className="text-center">
                <div className="relative inline-block">
                  {profileImage ? (
                    <div className="relative">
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="h-32 w-32 rounded-full object-cover mx-auto border-4 border-gray-200"
                      />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 p-2 bg-[#2A363B] text-white rounded-full hover:bg-gray-700 transition-colors" 
                      >
                        <Camera className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="h-32 w-32 bg-[#F8F6F6] rounded-full flex items-center justify-center text-[#2A363B] text-4xl font-semibold mx-auto border-4 border-gray-200"> 
                        {(user.first_name || user.username || '').charAt(0).toUpperCase()}
                        {(user.last_name || '').charAt(0).toUpperCase()}
                      </div>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 p-2 bg-[#2A363B] text-white rounded-full hover:bg-gray-700 transition-colors" 
                      >
                        <Camera className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <h3 className="mt-4 text-xl font-semibold text-[#2A363B]"> {/* Text color updated */}
                  {user.first_name || user.username || 'User'} {user.last_name || ''}
                </h3>
                <p className="text-gray-600 capitalize">{user.userType}</p>
                <p className="text-sm text-gray-500 mt-2">Member since January 2024</p>

                {/* Image Upload Controls */}
                {selectedFile && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-600">{selectedFile.name}</p>
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={handleImageUpload}
                        disabled={isUploading}
                        className="px-3 py-1 bg-[#2A363B] text-white text-sm rounded hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center space-x-1" 
                      >
                        {isUploading ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="h-3 w-3" />
                            <span>Upload</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleRemoveImage}
                        className="px-3 py-1 bg-[#F8F6F6] text-[#2A363B] text-sm rounded hover:bg-gray-200 transition-colors flex items-center space-x-1" 
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                )}

                {errors.image && (
                  <p className="text-sm text-[#CF4647] mt-2">{errors.image}</p>
                )}
              </div>
            </div>
          </div>

          {/* Profile Information Section */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#2A363B]">Personal Information</h3> 
                  <button
                    onClick={handleEditToggle}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      isEditing
                        ? 'bg-[#F8F6F6] text-[#2A363B] hover:bg-gray-200' // Colors updated for Cancel state
                        : 'bg-[#2A363B] text-white hover:bg-gray-700' // Colors updated for Edit state
                    }`}
                  >
                    {isEditing ? (
                      <span className="flex items-center space-x-1">
                        <X className="h-4 w-4" />
                        <span>Cancel</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1">
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </span>
                    )}
                  </button>
                </div>
                <p className="text-gray-600 text-sm mt-1">
                  Update your personal details and contact information
                </p>
              </div>

              <div className="p-6 space-y-6">
                {/* Username (Read-only) */}
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <p className="text-[#2A363B]">{user.username}</p> {/* Text color updated */}
                    <p className="text-xs text-gray-500">Username cannot be changed</p>
                  </div>
                </div>

                {/* First Name */}
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="first_name"
                        value={editData.first_name}
                        onChange={handleInputChange}
                        className={`mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#CF4647] focus:border-[#CF4647] ${ /* Focus colors updated */
                          errors.first_name ? 'border-[#CF4647]' : 'border-gray-300' /* Error border color updated */
                        }`}
                        placeholder="Enter your first name"
                      />
                    ) : (
                      <p className="text-[#2A363B]">{user.first_name || 'Not set'}</p> 
                    )}
                    {errors.first_name && <p className="text-sm text-[#CF4647] mt-1">{errors.first_name}</p>}
                  </div>
                </div>

                {/* Last Name */}
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="last_name"
                        value={editData.last_name}
                        onChange={handleInputChange}
                        className={`mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#CF4647] focus:border-[#CF4647] ${ /* Focus colors updated */
                          errors.last_name ? 'border-[#CF4647]' : 'border-gray-300' /* Error border color updated */
                        }`}
                        placeholder="Enter your last name"
                      />
                    ) : (
                      <p className="text-[#2A363B]">{user.last_name || 'Not set'}</p> 
                    )}
                    {errors.last_name && <p className="text-sm text-[#CF4647] mt-1">{errors.last_name}</p>} 
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={editData.email}
                        onChange={handleInputChange}
                        className={`mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#CF4647] focus:border-[#CF4647] ${ /* Focus colors updated */
                          errors.email ? 'border-[#CF4647]' : 'border-gray-300' /* Error border color updated */
                        }`}
                        placeholder="Enter your email address"
                      />
                    ) : (
                      <p className="text-[#2A363B]">{user.email || 'Not set'}</p>
                    )}
                    {errors.email && <p className="text-sm text-[#CF4647] mt-1">{errors.email}</p>} 
                  </div>
                </div>

                {/* Phone Number */}
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone_number"
                        value={editData.phone_number}
                        onChange={handleInputChange}
                        className={`mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#CF4647] focus:border-[#CF4647] ${ /* Focus colors updated */
                          errors.phone_number ? 'border-[#CF4647]' : 'border-gray-300' /* Error border color updated */
                        }`}
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <p className="text-[#2A363B]">{user.phone_number || 'Not set'}</p>
                    )}
                    {errors.phone_number && <p className="text-sm text-[#CF4647] mt-1">{errors.phone_number}</p>} 
                  </div>
                </div>

                {/* User Type (Read-only) */}
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">User Type</label>
                    <p className="text-[#2A363B] capitalize">{user.userType}</p> {/* Text color updated */}
                    <p className="text-xs text-gray-500">User type cannot be changed</p>
                  </div>
                </div>

                {/* Save Button */}
                {isEditing && (
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={handleEditToggle}
                      className="px-4 py-2 border border-gray-300 text-[#2A363B] rounded-md hover:bg-[#F8F6F6] transition-colors" 
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-4 py-2 bg-[#2A363B] text-white rounded-md hover:bg-gray-700 transition-colors flex items-center space-x-2 disabled:opacity-50" 
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div className="mt-8">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-[#2A363B]">Account Settings</h3> {/* Text color updated */}
              <p className="text-gray-600 text-sm mt-1">
                Manage your account settings and preferences
              </p>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {/* Delete Account */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-[#2A363B]">Delete Account</h4> {/* Text color updated */}
                      <p className="text-sm text-gray-600 mt-1">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                    </div>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                      className="px-4 py-2 bg-[#CF4647] text-white rounded-md hover:bg-red-700 transition-colors flex items-center space-x-2 disabled:opacity-50" 
                    >
                      {isDeleting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Deleting...</span>
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4" />
                          <span>Delete Account</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}