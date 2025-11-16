
import React from 'react';
import { Link } from 'react-router-dom';
import { LogoIcon, GitHubIcon, TwitterIcon, LinkedInIcon } from './Icons';

const SocialLink: React.FC<{ href: string; Icon: React.FC<{className?: string}> }> = ({ href, Icon }) => (
    <a href={href} className="text-slate-400 hover:text-blue-400 transition-colors">
        <span className="sr-only">{Icon.name.replace('Icon', '')}</span>
        <Icon className="h-6 w-6" />
    </a>
);

const FooterLink: React.FC<{ to: string, children: React.ReactNode }> = ({ to, children }) => (
    <Link to={to} className="text-sm text-slate-400 hover:text-white transition-colors">{children}</Link>
);

const Footer: React.FC = () => {
    return (
        <footer className="bg-brand-dark border-t border-slate-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Column 1: Logo and mission */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2">
                            <LogoIcon className="h-8 w-8 text-blue-500" />
                            <span className="text-2xl font-bold text-slate-50">Upskills</span>
                        </Link>
                        <p className="text-slate-400 text-sm max-w-xs">
                            Master in-demand skills, build a strong portfolio, and accelerate your tech career.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <SocialLink href="#" Icon={TwitterIcon} />
                            <SocialLink href="#" Icon={GitHubIcon} />
                            <SocialLink href="#" Icon={LinkedInIcon} />
                        </div>
                    </div>

                    {/* Column 2 & 3: Links */}
                    <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Product</h3>
                            <ul className="mt-4 space-y-3">
                                <li><FooterLink to="/features">Features</FooterLink></li>
                                <li><FooterLink to="/pricing">Pricing</FooterLink></li>
                                <li><FooterLink to="/courses">Roadmaps</FooterLink></li>
                                <li><FooterLink to="/testimonials">Testimonials</FooterLink></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Company</h3>
                            <ul className="mt-4 space-y-3">
                                <li><FooterLink to="#">About Us</FooterLink></li>
                                <li><FooterLink to="#">Careers</FooterLink></li>
                                <li><FooterLink to="#">Blog</FooterLink></li>
                                <li><FooterLink to="#">Contact</FooterLink></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Support</h3>
                            <ul className="mt-4 space-y-3">
                                <li><FooterLink to="#">Help Center</FooterLink></li>
                                <li><FooterLink to="#">FAQ</FooterLink></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Legal</h3>
                            <ul className="mt-4 space-y-3">
                                <li><FooterLink to="#">Privacy Policy</FooterLink></li>
                                <li><FooterLink to="#">Terms of Service</FooterLink></li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
                    <p>&copy; {new Date().getFullYear()} Upskills, Inc. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;