import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/#home' },
    { name: 'About', href: '/#about' },
    { name: 'Themes', href: '/#themes' },
    { name: 'Rules', href: '/#rules' },
    { name: 'Prizes', href: '/#prizes' },
    { name: 'FAQ', href: '/#faq' },
    { name: 'Contact', href: '/#contact' },
  ];

  const handleNavClick = (e, href) => {
    if (href === '/#home') {
      e.preventDefault();
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (location.pathname !== '/' && href.startsWith('/#')) {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(href.substring(2));
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (href.startsWith('/#')) {
      e.preventDefault();
      const element = document.getElementById(href.substring(2));
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  // Hide navbar on admin pages (admin has its own layout)
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'glass py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {isAdmin ? (
                <Link to="/admin/dashboard"><Button variant="outline" size="sm">Admin Dashboard</Button></Link>
              ) : (
                <Link to="/participant/dashboard"><Button variant="outline" size="sm">Dashboard</Button></Link>
              )}
              <Button variant="ghost" size="sm" onClick={() => { logout(); navigate('/'); }}>Logout</Button>
            </>
          ) : (
            <Link to="/login"><Button variant="outline" size="sm">Login</Button></Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full glass-dark border-t border-white/10 flex flex-col py-4 px-4 gap-4 shadow-xl">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-gray-300 hover:text-white px-2 py-1"
            >
              {link.name}
            </a>
          ))}
          <div className="border-t border-white/10 pt-4 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                {isAdmin ? (
                  <Link to="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)}><Button variant="outline" className="w-full">Admin Dashboard</Button></Link>
                ) : (
                  <Link to="/participant/dashboard" onClick={() => setIsMobileMenuOpen(false)}><Button variant="outline" className="w-full">Dashboard</Button></Link>
                )}
                <Button variant="ghost" className="w-full" onClick={() => { logout(); navigate('/'); setIsMobileMenuOpen(false); }}>Logout</Button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}><Button variant="outline" className="w-full">Login</Button></Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
