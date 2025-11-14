import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogoIcon, MenuIcon, XIcon, HeartIcon } from './Icons';
import useWishlistStore from '../store/wishlistStore';

const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <Link to={to} className="text-slate-300 hover:text-blue-400 transition-colors duration-300">
    {children}
  </Link>
);

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { wishlist } = useWishlistStore();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/courses', label: 'Courses' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/features', label: 'Features' },
    { to: '/testimonials', label: 'Testimonials' },
  ];

  return (
    <header className="bg-brand-dark/80 backdrop-blur-lg sticky top-0 z-50 border-b border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <LogoIcon className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-bold text-slate-50">Upskill</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:items-center lg:space-x-8">
            {navLinks.map((link) => (
              <NavLink key={link.label} to={link.to}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link to="/wishlist" className="relative text-slate-300 hover:text-blue-400 transition-colors p-2" aria-label={`Wishlist, ${wishlist.length} items`}>
                <HeartIcon className="h-6 w-6" />
                {wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold ring-2 ring-brand-dark">{wishlist.length}</span>
                )}
            </Link>
            <Link to="/signin" className="px-5 py-2 text-slate-300 border border-slate-700 rounded-full hover:bg-slate-800 transition-colors">
              Sign In
            </Link>
            <Link to="/signup" className="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-sm">
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-brand-dark shadow-lg border-t border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link key={link.label} to={link.to} onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:text-blue-400 hover:bg-slate-800/50">
                {link.label}
              </Link>
            ))}
            <Link to="/wishlist" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:text-blue-400 hover:bg-slate-800/50">
                <HeartIcon className="h-6 w-6" />
                <span>Wishlist</span>
                {wishlist.length > 0 && (
                    <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">{wishlist.length}</span>
                )}
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-slate-800">
            <div className="px-5 flex flex-col space-y-3">
              <Link to="/signin" onClick={() => setIsMenuOpen(false)} className="w-full text-center px-5 py-2 text-slate-300 border border-slate-700 rounded-full hover:bg-slate-800 transition-colors">
                Sign In
              </Link>
              <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="w-full text-center px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-sm">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;