const InfoCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="bg-gray-900 border border-yellow-400 rounded-lg p-6 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-full border-2 border-yellow-400 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-yellow-400" />
      </div>
      <h3 className="text-white font-bold text-xl mb-2">{title}</h3>
      <p className="text-gray-300 text-sm">{description}</p>
    </div>
  );
};

export default InfoCard;

