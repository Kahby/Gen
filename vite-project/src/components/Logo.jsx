import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="text-yellow-400 font-bold text-2xl">GAI</div>
      <div className="flex flex-col">
        <span className="text-white font-semibold">Generative AI</span>
        <span className="text-gray-400 text-xs">From prompts to progress</span>
      </div>
    </Link>
  );
};

export default Logo;

