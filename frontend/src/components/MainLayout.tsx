import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/navbar';
import { useUser } from '../context/UserContext';
import AddFundsModal from '../pages/addfunds';

const MainLayout: React.FC = () => {
    const { user, isAddFundsModalOpen, closeAddFundsModal } = useUser();

    // Cleanup modal state when component unmounts
    useEffect(() => {
        return () => {
            if (isAddFundsModalOpen) {
                closeAddFundsModal();
            }
        };
    }, [isAddFundsModalOpen, closeAddFundsModal]);

    if (user.loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Navbar />
            <main className="flex-1 flex pt-20">
                <Outlet />
            </main>
            {isAddFundsModalOpen && (
                <AddFundsModal
                    isOpen={isAddFundsModalOpen}
                    onClose={closeAddFundsModal}
                />
            )}
        </div>
    );
};

export default MainLayout; 