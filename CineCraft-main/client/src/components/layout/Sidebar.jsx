import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    FileText,
    PlusCircle,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Menu,
    Users,
    Calendar
} from 'lucide-react';

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: PlusCircle, label: 'New Project', path: '/create' },
        { icon: FileText, label: 'My Screenplays', path: '/scripts' },
        { icon: Users, label: 'Character Studio', path: '/characters' },
        { icon: Calendar, label: 'Schedule', path: '/production' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    const sidebarVariants = {
        expanded: { width: 240 },
        collapsed: { width: 80 }
    };

    return (
        <motion.aside
            initial="expanded"
            animate={isCollapsed ? "collapsed" : "expanded"}
            variants={sidebarVariants}
            className="h-screen sticky top-0 bg-surface/80 backdrop-blur-md border-r border-white/10 flex flex-col z-50 hidden md:flex"
        >
            {/* Header */}
            <div className="h-20 flex items-center justify-center border-b border-white/5 relative">
                <AnimatePresence mode="wait">
                    {!isCollapsed ? (
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-2xl font-serif font-bold tracking-tighter"
                        >
                            Cine<span className="text-primary">Craft</span>
                        </motion.h1>
                    ) : (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-xl font-bold text-primary"
                        >
                            CC
                        </motion.span>
                    )}
                </AnimatePresence>

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-8 bg-surface border border-white/20 rounded-full p-1 text-muted hover:text-white transition-colors"
                >
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-8 px-2 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 group
                            ${isActive ? 'bg-primary/20 text-primary' : 'text-muted hover:bg-white/5 hover:text-white'}
                            ${isCollapsed ? 'justify-center' : ''}
                        `}
                    >
                        <item.icon size={20} className={isCollapsed ? "" : "min-w-[20px]"} />
                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: 'auto' }}
                                    exit={{ opacity: 0, width: 0 }}
                                    className="overflow-hidden whitespace-nowrap"
                                >
                                    {item.label}
                                </motion.span>
                            )}
                        </AnimatePresence>

                        {/* Tooltip for collapsed state */}
                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-surface border border-white/10 rounded text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                                {item.label}
                            </div>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/5">
                <button className={`
                    flex items-center gap-4 w-full px-4 py-3 rounded-lg text-muted hover:text-red-400 hover:bg-white/5 transition-colors
                    ${isCollapsed ? 'justify-center' : ''}
                `}>
                    <LogOut size={20} />
                    {!isCollapsed && <span>Logout</span>}
                </button>
            </div>
        </motion.aside>
    );
};

export default Sidebar;
