// src/components/Sidebar.tsx
"use client";

import React from 'react';
import { useNavigate } from "react-router-dom";
import {
  Home,
  DollarSign,
  Settings,
  MessageSquare,
  Search,
  UserCheck,
} from "lucide-react";

interface SidebarProps {
  active: string;
  onAddFundsClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ active, onAddFundsClick }) => {
  const navigate = useNavigate();

  const nav = [
    { label: "Overview", icon: Home, action: () => navigate('/dashboard') },
    { label: "Add Funds", icon: DollarSign, action: onAddFundsClick },
    { label: "Messages", icon: MessageSquare, action: () => navigate('/messages') },
    { label: "Browse Businesses", icon: Search, action: () => navigate('/catalogue') },
    { label: "Look for Consultants", icon: UserCheck, action: () => navigate('/consultants') },
    { label: "Settings", icon: Settings, action: () => navigate('/profile') },
  ];

  return (
    <aside className="hidden md:flex flex-col w-80 min-h-screen bg-white py-8 px-6 shadow-[2px_0_20px_rgba(0,0,0,0.08)] fixed top-0 left-0 h-full z-10">
      <div className="flex flex-col justify-center flex-grow">
        {nav.map((item) => (
          <button
            key={item.label}
            onClick={item.action}
            className={`flex items-center gap-4 px-5 py-3 rounded-xl text-base font-medium transition-colors w-full ${
              active === item.label
                ? "bg-[#F8F6F6] text-[#2A363B]"
                : "text-gray-600 hover:bg-[#F8F6F6]"
            }`}
          >
            <item.icon className="w-6 h-6" />
            {item.label}
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;