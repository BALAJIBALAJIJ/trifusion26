import React, { useState } from 'react';
import { Menu, Search, Bell } from 'lucide-react';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children, title = 'Dashboard' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-body flex">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col md:pl-64 transition-all duration-300">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30 h-16 flex items-center justify-between px-4 sm:px-6 shadow-sm">
          <div className="flex items-center">
            <button
              className="md:hidden mr-4 text-gray-500 hover:text-gray-900 focus:outline-none"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block text-gray-400 focus-within:text-cyan-500">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-full text-sm focus:bg-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 w-64 transition-colors"
              />
            </div>
            <button className="text-gray-400 hover:text-gray-600 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>
            <div className="h-8 w-8 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
