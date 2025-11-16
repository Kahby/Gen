const PrimaryButton = ({ children, onClick, type = 'button', className = '', disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`bg-yellow-400 text-black font-bold rounded-lg px-6 py-2 hover:bg-yellow-500 transition-colors ${
        disabled ? 'opacity-50 cursor-not-allowed hover:bg-yellow-400' : ''
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;

