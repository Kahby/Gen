import { Link } from 'react-router-dom';
import { MapPin, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black border-t-2 border-yellow-400 border-b-2 border-yellow-400">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Information */}
          <div>
            <h2 className="text-2xl font-bold mb-2">
              <span className="text-white">PROMPT</span>{' '}
              <span className="text-yellow-400">MASTERS</span>
            </h2>
            <p className="text-gray-400 text-sm">From Prompts to Progress</p>
            <p className="text-gray-400 text-sm">Organized by GAI VIT Bhopal</p>
          </div>
          
          {/* Navigation */}
          <div>
            <h3 className="text-white font-bold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/submit" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Submit Prompt
                </Link>
              </li>
              <li>
                <Link to="/evaluation" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Evaluation Process
                </Link>
              </li>
                  <li>
                    <Link to="/leaderboard" className="text-gray-400 hover:text-yellow-400 transition-colors">
                      Leaderboard
                    </Link>
                  </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Us */}
          <div>
            <h3 className="text-white font-bold mb-4">Contact Us</h3>
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
              <div className="text-gray-400 text-sm">
                <p>VIT Bhopal University,</p>
                <p>Kothrikalan, Sehore</p>
                <p>Pin - 466114</p>
              </div>
            </div>
          </div>
          
          {/* Follow Us */}
          <div>
            <h3 className="text-white font-bold mb-4">Follow Us</h3>
            <div className="flex gap-4 mb-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-yellow-400 transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-yellow-400 transition-colors"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
            <p className="text-gray-400 text-sm">
              Stay updated with the latest news and announcements from Generative AI VIT Bhopal
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

