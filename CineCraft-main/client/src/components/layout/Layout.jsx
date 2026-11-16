import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    const location = useLocation();
    // Hide sidebar on Landing Page ('/')
    const hideSidebar = location.pathname === '/';

    return (
        <div className="min-h-screen bg-background text-text selection:bg-primary selection:text-background font-sans flex">
            {!hideSidebar && <Sidebar />}
            <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
                {/* Mobile Header could go here in future */}
                <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
