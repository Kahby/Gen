const SecondaryButton = ({ children, onClick, type = 'button', className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-white text-gray-800 border border-gray-300 rounded-lg px-6 py-2 hover:bg-gray-100 transition-colors ${className}`}
    >
      {children}
    </button>
  );
};

export default SecondaryButton;

