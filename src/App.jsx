import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import About from './sections/About';
import RestaurantHighlight from './sections/RestaurantHighlight';
import PrinciMahal from './sections/PrinciMahal';
import AshaFoods from './sections/AshaFoods';
import Location from './sections/Location';
import Footer from './sections/Footer';
import AuthPage from './pages/AuthPage';
import MenuPage from './pages/MenuPage';
import AdminDashboard from './pages/AdminDashboard';
import { Utensils, Loader2 } from "lucide-react";
import { supabase } from './lib/supabase';

const ProtectedRoute = ({ children, requiredRole }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profile && profile.role === requiredRole) {
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }
      setLoading(false);
    };

    checkAuth();
  }, [requiredRole]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 animate-spin text-accent" />
      </div>
    );
  }

  if (!authorized) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

function HomePage() {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <RestaurantHighlight />
        <PrinciMahal />
        <AshaFoods />
        <Location />
      </main>
      <Footer />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-4 right-4 md:bottom-12 md:right-12 z-50 flex flex-col items-center gap-3">
        <button 
          onClick={() => navigate('/menu')}
          className="bg-accent text-black w-14 h-14 md:w-20 md:h-20 rounded-none-none border-4 border-black flex flex-col items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[4px_4px_0px_#000000] md:shadow-[8px_8px_0px_#000000]"
        >
          <Utensils className="text-lg md:text-3xl" size={24} />
          <span className="text-[6px] md:text-[8px] font-black uppercase tracking-tighter mt-1 whitespace-nowrap">Dine In</span>
        </button>
      </div>
    </>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-white text-black selection:bg-accent/30 selection:text-black font-sans">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/table/:tableId" element={<MenuPage />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;