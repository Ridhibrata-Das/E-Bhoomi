'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  Bell, 
  Lightbulb,
  Menu,
  X,
  LogOut,
  Bot,
  Sprout,
  BarChart3,
  Camera,
  CloudRain,
  Settings,
  Leaf
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const menuItems = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard
  },
  {
    path: '/dashboard/sensors',
    label: 'Sensors',
    icon: Activity
  },
  {
    path: '/dashboard/alerts',
    label: 'Alerts',
    icon: Bell
  },
  {
    path: '/dashboard/recommendations',
    label: 'Recommendations',
    icon: Lightbulb
  },
  {
    path: '/dashboard/balaram-ai',
    label: 'Balaram AI',
    icon: Bot
  },
  // e-bhoomi-style additional items (routes can be wired later if needed)
  { path: '/dashboard/my-farm', label: 'My Farm', icon: Sprout },
  { path: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/dashboard/drone', label: 'Drone View', icon: Camera },
  { path: '/dashboard/weather', label: 'Weather', icon: CloudRain },
  { path: '/dashboard/settings', label: 'Settings', icon: Settings }
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Logo Header */}
      <div className={`flex items-center h-16 border-b border-gray-200 bg-white ${
        isSidebarOpen ? 'justify-between px-4' : 'justify-center px-2'
      }`}>
        <Link href="/" className={`flex items-center ${
          isSidebarOpen ? 'space-x-3' : 'justify-center'
        }`}>
          <Image 
            src="/logo.png" 
            alt="E-Bhoomi Logo" 
            width={isSidebarOpen ? 36 : 32} 
            height={isSidebarOpen ? 36 : 32}
            className="rounded-lg flex-shrink-0"
          />
          {isSidebarOpen && (
            <span className="text-lg font-semibold text-gray-900 whitespace-nowrap">E-Bhoomi</span>
          )}
        </Link>
        {isSidebarOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hidden lg:flex hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      {/* Collapsed State Toggle Button */}
      {!isSidebarOpen && (
        <div className="flex justify-center py-2 border-b border-gray-200 bg-white">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hidden lg:flex hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Navigation */}
      <nav className={`flex-1 py-6 space-y-2 overflow-y-auto ${
        isSidebarOpen ? 'px-3' : 'px-2'
      }`}>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`group flex items-center w-full text-sm font-medium rounded-xl transition-all duration-200 text-gray-700 hover:bg-green-50 hover:text-green-700 hover:shadow-sm ${
              isSidebarOpen ? 'px-4 py-3' : 'px-2 py-3 justify-center'
            }`}
            title={!isSidebarOpen ? item.label : undefined}
          >
            <item.icon className={`h-5 w-5 text-gray-500 group-hover:text-green-600 flex-shrink-0 ${
              isSidebarOpen ? 'mr-4' : ''
            }`} />
            {isSidebarOpen && (
              <span className="whitespace-nowrap">{item.label}</span>
            )}
          </Link>
        ))}
      </nav>

      {/* Footer action */}
      <div className={`border-t border-gray-200 bg-gray-50 ${
        isSidebarOpen ? 'p-4' : 'p-2'
      }`}>
        <Button
          variant="ghost"
          className={`w-full flex items-center text-gray-700 hover:bg-red-50 hover:text-red-700 py-3 ${
            isSidebarOpen ? 'justify-start' : 'justify-center'
          }`}
          title={!isSidebarOpen ? 'Logout' : undefined}
        >
          <LogOut className={`h-5 w-5 flex-shrink-0 ${
            isSidebarOpen ? 'mr-4' : ''
          }`} />
          {isSidebarOpen && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-72' : 'w-16'
        } bg-white shadow-lg transition-all duration-300 relative hidden lg:block`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Menu */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Image 
              src="/logo.png" 
              alt="E-Bhoomi Logo" 
              width={32} 
              height={32}
              className="rounded-lg"
            />
            <h2 className="text-xl font-bold text-grey-900">E-Bhoomi</h2>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="p-2 hover:bg-gray-100">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 pt-16 lg:pt-0">
        <div className="container mx-auto px-4">
          {children}
        </div>
      </main>
    </div>
  );
} 