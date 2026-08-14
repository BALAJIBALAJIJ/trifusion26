import { Link } from 'react-router-dom';
import { eventConfig } from '../../config/eventConfig';

const Footer = () => {
  return (
    <footer className="bg-dark-card border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h2 className="font-heading text-2xl font-bold text-primary mb-4 neon-text">TRIFUSION&apos;26</h2>
            <p className="text-gray-400 mb-6 max-w-md">
              {eventConfig.description || "The ultimate tech hackathon where innovation meets reality. Join us for 24 hours of non-stop coding, building, and fun."}
            </p>
          </div>
          <div>
            <h3 className="font-heading text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/#about" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="/#themes" className="hover:text-primary transition-colors">Themes</a></li>
              <li><a href="/#rules" className="hover:text-primary transition-colors">Rules</a></li>
              <li><a href="/#faq" className="hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-heading text-lg font-semibold mb-4 text-white">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li>{eventConfig.contact.email}</li>
              <li>{eventConfig.contact.phone}</li>
              <li>{eventConfig.contact.location}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} TRIFUSION&apos;26. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link to="/admin/login" className="text-xs text-gray-600 hover:text-gray-400">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
