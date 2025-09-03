
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Heart, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand section */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <div>
                <h5 className="text-xl font-bold mb-1">QLAP</h5>
                <p className="text-gray-400 text-sm">Queer Library & Archive Project</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Preserving LGBTQ+ stories, building community, and ensuring our 
              voices are heard and remembered.
            </p>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-lavender-400 transition-colors text-xl" 
                aria-label="Facebook"
              >
                <Facebook size={24} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-lavender-400 transition-colors text-xl" 
                aria-label="Twitter"
              >
                <Twitter size={24} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-lavender-400 transition-colors text-xl" 
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-lavender-400 transition-colors text-xl" 
                aria-label="Email"
              >
                <Mail size={24} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h6 className="font-bold mb-4 text-white">Quick Links</h6>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-400 hover:text-lavender-400 transition-colors text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/books" 
                  className="text-gray-400 hover:text-lavender-400 transition-colors text-sm"
                >
                  Browse Books
                </Link>
              </li>
              <li>
                <Link 
                  to="/archive" 
                  className="text-gray-400 hover:text-lavender-400 transition-colors text-sm"
                >
                  Archive
                </Link>
              </li>
              <li>
                <Link 
                  to="/community" 
                  className="text-gray-400 hover:text-lavender-400 transition-colors text-sm"
                >
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h6 className="font-bold mb-4 text-white">Support</h6>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/help" 
                  className="text-gray-400 hover:text-lavender-400 transition-colors text-sm"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-400 hover:text-lavender-400 transition-colors text-sm"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/donate" 
                  className="text-gray-400 hover:text-lavender-400 transition-colors text-sm"
                >
                  Donate
                </Link>
              </li>
              <li>
                <Link 
                  to="/volunteer" 
                  className="text-gray-400 hover:text-lavender-400 transition-colors text-sm"
                >
                  Volunteer
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Contact combined */}
          <div>
            <h6 className="font-bold mb-4 text-white">Resources</h6>
            <ul className="space-y-2 mb-6">
              <li>
                <Link 
                  to="/safety" 
                  className="text-gray-400 hover:text-lavender-400 transition-colors text-sm"
                >
                  Safety Guidelines
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="text-gray-400 hover:text-lavender-400 transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="text-gray-400 hover:text-lavender-400 transition-colors text-sm"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  to="/accessibility" 
                  className="text-gray-400 hover:text-lavender-400 transition-colors text-sm"
                >
                  Accessibility
                </Link>
              </li>
            </ul>
            
            {/* Contact info */}
            <div className="text-gray-300 text-sm space-y-2">
              <div className="flex items-center">
                <Mail size={16} className="mr-2 text-lavender-400" />
                <span>qlap-houston@proton.me</span>
              </div>
              <div className="flex items-center">
                <MapPin size={16} className="mr-2 text-lavender-400" />
                <span>Community-Based</span>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-8 border-gray-600" />

        {/* Bottom footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} Queer Library and Archive Project. 
            Built with ❤️ for our community.
          </p>
          <div className="text-gray-400 text-sm flex items-center">
            <Heart size={16} className="text-red-500 mr-2" />
            Made by and for the LGBTQ+ community
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;