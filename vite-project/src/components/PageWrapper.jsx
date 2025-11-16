const PageWrapper = ({ children }) => {
  return (
    <div className="flex-grow min-h-screen bg-black">
      {children}
    </div>
  );
};

export default PageWrapper;

