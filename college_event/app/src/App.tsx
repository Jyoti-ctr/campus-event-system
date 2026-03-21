import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import Events from './sections/Events';
import Categories from './sections/Categories';
import Stats from './sections/Stats';
import SubmitEvent from './sections/SubmitEvent';
import Footer from './sections/Footer';
import Login from './sections/Login'; 
import Register from './sections/Register'; // Import the new file // This is your real file
import Admin from './sections/Admin';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Toaster position="top-right" richColors closeButton />
        <Navigation />
        
        <Routes>
          {/* THE HOME PAGE */}
          <Route path="/" element={
            <main>
              <Hero />
              <Events />
              <Categories />
              <Stats />
              <SubmitEvent />
            </main>
          } />
        {/* ADD THESE NEW ONES */}
        <Route path="/register" element={<Register />} /> 
        <Route path="/event/:id" element={<Events />} />
        <Route path="/submit" element={<SubmitEvent />} />
        <Route path="/admin" element={<Admin />} />
          {/* THE LOGIN PAGE */}
          <Route path="/events" element={<div className="pt-20"><Events /></div>} />
          <Route path="/login" element={<Login />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;