import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/navbar';
import { useUser } from '../context/UserContext';

const MainLayout: React.FC = () => {
    const { user } = useUser();

    if (user.loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Navbar />
            <main className="flex-1 flex pt-20">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout; 