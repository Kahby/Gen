import { Link } from 'react-router-dom';
import { Brain, Zap, Trophy } from 'lucide-react';
import PrimaryButton from '../components/PrimaryButton';
import PageWrapper from '../components/PageWrapper';

const HomePage = () => {
  return (
    <PageWrapper>
      <div className="pt-24 pb-12 px-4">
        {/* Hero Section */}
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left Column */}
          <div className="space-y-6">
            <h1 className="text-6xl font-bold">
              <span className="text-white">PROMPT</span>{' '}
              <span className="text-yellow-400">MASTERS</span>
            </h1>
            <p className="text-white text-xl">From Prompts to Progress</p>
            <p className="text-gray-300 text-lg">
              Unlock the power of AI prompting. Analyze, refine, and master your creative prompts
              across multiple themes including memes, art, stories, music, and poetry.
            </p>
            <Link to="/login">
              <PrimaryButton>Get Started</PrimaryButton>
            </Link>
            
            {/* Feature Highlights */}
            <div className="flex gap-6 pt-4">
              <div className="flex items-center gap-2 text-yellow-400">
                <Brain className="w-5 h-5" />
                <span className="text-sm">AI Powered Analysis</span>
              </div>
              <div className="flex items-center gap-2 text-yellow-400">
                <Zap className="w-5 h-5" />
                <span className="text-sm">Instant Feedback</span>
              </div>
              <div className="flex items-center gap-2 text-yellow-400">
                <Trophy className="w-5 h-5" />
                <span className="text-sm">Exciting Prizes</span>
              </div>
            </div>
          </div>
          
          {/* Right Column - Graphic */}
          <div className="flex justify-center items-center">
            <div className="relative w-96 h-96">
              <svg viewBox="0 0 400 400" className="w-full h-full">
                {/* Central Circle */}
                <circle cx="200" cy="200" r="60" fill="#000" stroke="#facc15" strokeWidth="3" />
                <text x="200" y="210" textAnchor="middle" fill="#facc15" fontSize="24" fontWeight="bold">
                  PROMPT
                </text>
                
                {/* Network Lines and Nodes */}
                <line x1="200" y1="140" x2="200" y2="80" stroke="#facc15" strokeWidth="2" />
                <circle cx="200" cy="80" r="8" fill="#facc15" />
                <text x="200" y="70" textAnchor="middle" fill="#facc15" fontSize="12">STORYTELLING</text>
                
                <line x1="200" y1="260" x2="200" y2="320" stroke="#facc15" strokeWidth="2" />
                <circle cx="200" cy="320" r="8" fill="#facc15" />
                <text x="200" y="335" textAnchor="middle" fill="#facc15" fontSize="12">MUSIC</text>
                
                <line x1="140" y1="200" x2="80" y2="200" stroke="#facc15" strokeWidth="2" />
                <circle cx="80" cy="200" r="8" fill="#facc15" />
                <text x="80" y="190" textAnchor="middle" fill="#facc15" fontSize="12">VISUAL ART</text>
                
                <line x1="260" y1="200" x2="320" y2="200" stroke="#facc15" strokeWidth="2" />
                <circle cx="320" cy="200" r="8" fill="#facc15" />
                <text x="320" y="190" textAnchor="middle" fill="#facc15" fontSize="12">POETRY</text>
                
                <line x1="260" y1="140" x2="320" y2="100" stroke="#facc15" strokeWidth="2" />
                <circle cx="320" cy="100" r="8" fill="#facc15" />
                <text x="320" y="90" textAnchor="middle" fill="#facc15" fontSize="12">MEME</text>
                
                <line x1="260" y1="260" x2="320" y2="300" stroke="#facc15" strokeWidth="2" />
                <circle cx="320" cy="300" r="8" fill="#facc15" />
                <text x="320" y="315" textAnchor="middle" fill="#facc15" fontSize="12">CODE</text>
              </svg>
            </div>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="container mx-auto mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900 border border-yellow-400 rounded-lg p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full border-2 border-yellow-400 flex items-center justify-center">
                  <span className="text-yellow-400 text-2xl">👥</span>
                </div>
              </div>
              <h3 className="text-white font-bold text-xl mb-2">5 Creative Themes</h3>
              <p className="text-gray-300 text-sm">Choose from diverse categories</p>
            </div>
            
            <div className="bg-gray-900 border border-yellow-400 rounded-lg p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full border-2 border-yellow-400 flex items-center justify-center">
                  <span className="text-yellow-400 text-2xl">📜</span>
                </div>
              </div>
              <h3 className="text-white font-bold text-xl mb-2">Detailed Evaluation</h3>
              <p className="text-gray-300 text-sm">Comprehensive scoring criteria</p>
            </div>
            
            <div className="bg-gray-900 border border-yellow-400 rounded-lg p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full border-2 border-yellow-400 flex items-center justify-center">
                  <span className="text-yellow-400 text-2xl">⭐</span>
                </div>
              </div>
              <h3 className="text-white font-bold text-xl mb-2">Learn & Improve</h3>
              <p className="text-gray-300 text-sm">Master AI prompt engineering</p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default HomePage;

