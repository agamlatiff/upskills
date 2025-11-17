import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogoIcon, MenuIcon, XIcon } from "./Icons";
import { useAuth } from "../hooks/useAuth";
import { getProfilePhotoUrl } from "../utils/imageUrl";

const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({
  to,
  children,
}) => (
  <Link
    to={to}
    className="text-slate-300 hover:text-blue-400 transition-colors duration-300"
  >
    {children}
  </Link>
);

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/courses", label: "Courses" },
    { to: "/pricing", label: "Pricing" },
    { to: "/features", label: "Features" },
    { to: "/testimonials", label: "Testimonials" },
  ];

  return (
    <header className="bg-brand-dark/80 backdrop-blur-lg sticky top-0 z-50 border-b border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center h-20 justify-between lg:justify-start">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <LogoIcon className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-bold text-slate-50">Upskills</span>
            </Link>
          </div>

          {/* Desktop Navigation - Precisely Centered */}
          <nav className="hidden lg:flex lg:items-center lg:space-x-8 absolute left-1/2 transform -translate-x-1/2">
            {navLinks.map((link) => (
              <NavLink key={link.label} to={link.to}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center space-x-4 ml-auto">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-5 py-2 text-slate-300 border border-slate-700 rounded-full hover:bg-slate-800 transition-colors"
                >
                  Dashboard
                </Link>
                <div className="relative group">
                  <button
                    className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-blue-400 transition-colors"
                    aria-label={`User menu for ${user?.name}`}
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <span>{user?.name}</span>
                    {user?.photo ? (
                      <img
                        src={getProfilePhotoUrl(user.photo)}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                        <span className="text-xs text-slate-400">
                          {user?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-slate-300 hover:bg-slate-700"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/dashboard/subscriptions"
                        className="block px-4 py-2 text-slate-300 hover:bg-slate-700"
                      >
                        My Subscriptions
                      </Link>
                      {(() => {
                        // Check if user has mentor role
                        const userRoles = user?.roles || [];
                        const roleArray = Array.isArray(userRoles)
                          ? userRoles
                          : [];
                        const hasMentorRole = roleArray.some((r: any) => {
                          const roleName =
                            typeof r === "string" ? r : r?.name || "";
                          return roleName === "mentor";
                        });

                        return hasMentorRole;
                      })() && (
                        <Link
                          to="/mentor/courses"
                          className="block px-4 py-2 text-slate-300 hover:bg-slate-700"
                        >
                          My Courses
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-700"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="px-5 py-2 text-slate-300 border border-slate-700 rounded-full hover:bg-slate-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-label={isMenuOpen ? "Close main menu" : "Open main menu"}
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">
                {isMenuOpen ? "Close main menu" : "Open main menu"}
              </span>
              {isMenuOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute  top-20 left-0 w-full bg-brand-dark shadow-lg border-t border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:text-blue-400 hover:bg-slate-800/50"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-slate-800">
            <div className="px-5 flex flex-col space-y-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-center px-5 py-2 text-slate-300 border border-slate-700 rounded-full hover:bg-slate-800 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-center px-5 py-2 text-slate-300 border border-slate-700 rounded-full hover:bg-slate-800 transition-colors"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/dashboard/subscriptions"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-center px-5 py-2 text-slate-300 border border-slate-700 rounded-full hover:bg-slate-800 transition-colors"
                  >
                    My Subscriptions
                  </Link>
                  {(() => {
                    // Check if user has mentor role
                    const userRoles = user?.roles || [];
                    const roleArray = Array.isArray(userRoles) ? userRoles : [];
                    const hasMentorRole = roleArray.some((r: any) => {
                      const roleName =
                        typeof r === "string" ? r : r?.name || "";
                      return roleName === "mentor";
                    });

                    return hasMentorRole;
                  })() && (
                    <Link
                      to="/mentor/courses"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full text-center px-5 py-2 text-slate-300 border border-slate-700 rounded-full hover:bg-slate-800 transition-colors"
                    >
                      My Courses
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-center px-5 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-center px-5 py-2 text-slate-300 border border-slate-700 rounded-full hover:bg-slate-800 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-center px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
