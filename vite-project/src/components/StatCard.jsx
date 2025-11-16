const StatCard = ({ icon: Icon, title, value }) => {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="w-6 h-6 text-yellow-400" />}
        <div>
          <p className="text-white text-sm font-medium">{title}</p>
          <p className="text-yellow-400 text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;

