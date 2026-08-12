import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Download, Settings, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Registrations', icon: Users, path: '/admin/registrations' },
    { name: 'Export', icon: Download, path: '/admin/export' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold font-heading text-cyan-400">TRIFUSION'26</span>
          </div>
          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setIsOpen(false)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-400 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
