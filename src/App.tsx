import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Landing from './pages/Landing';
import SidebarDemoPage from './pages/SidebarDemoPage';
import Folders from './pages/Folders';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from './components/ui/toaster';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/snippets" 
          element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/folders" 
          element={
            <ProtectedRoute>
              <Folders />
            </ProtectedRoute>
          } 
        />
        <Route path="/sidebar-demo" element={<SidebarDemoPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
};

export default App;
