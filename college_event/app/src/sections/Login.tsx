import { useState } from 'react';
import { Calendar, Mail, Lock, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt with:", { email, password });
    
    // Mocking authentication logic: assign 'admin' role to a specific email, and 'user' to others
    const isAdmin = email.toLowerCase() === 'admin@university.edu';
    const role = isAdmin ? 'admin' : 'user';
    const name = isAdmin ? 'Admin User' : email.split('@')[0];

    localStorage.setItem('campus_user', JSON.stringify({ id: isAdmin ? 1 : Math.floor(Math.random() * 1000) + 2, name, email, role }));
    toast.success('Logged in successfully!');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 pt-20">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-[#ff8a01] rounded-xl flex items-center justify-center">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to manage your campus events
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#ff8a01] focus:border-[#ff8a01] sm:text-sm"
                placeholder="College Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#ff8a01] focus:border-[#ff8a01] sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="#" className="font-medium text-[#ff8a01] hover:text-[#e67c00]">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#ff8a01] hover:bg-[#e67c00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff8a01] transition-all"
            >
              Sign In
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </form>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/" className="font-medium text-[#ff8a01] hover:text-[#e67c00]">
              Contact Admin
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}