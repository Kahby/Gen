const Speedometer = ({ accuracy = 0 }) => {
  // Clamp accuracy between 0 and 100
  const clampedAccuracy = Math.max(0, Math.min(100, accuracy));
  
  // Calculate angle for needle (0-100 maps to 0-180 degrees)
  // Assuming the gauge goes from 0 to 220, we'll map 0-100 to 0-180 degrees
  const angle = (clampedAccuracy / 100) * 180;
  
  // SVG dimensions
  const size = 300;
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = 120;
  
  // Calculate needle endpoint
  const needleLength = radius * 0.8;
  const needleAngle = angle - 90; // Start from top
  const needleX = centerX + needleLength * Math.cos((needleAngle * Math.PI) / 180);
  const needleY = centerY + needleLength * Math.sin((needleAngle * Math.PI) / 180);
  
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background arc */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke="#374151"
          strokeWidth="20"
          strokeLinecap="round"
        />
        
        {/* Active arc (yellow) */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke="#facc15"
          strokeWidth="20"
          strokeLinecap="round"
          strokeDasharray={`${(angle / 180) * Math.PI * radius * 2} ${Math.PI * radius * 2}`}
          className="transition-all duration-1000"
        />
        
        {/* Needle */}
        <line
          x1={centerX}
          y1={centerY}
          x2={needleX}
          y2={needleY}
          stroke="#facc15"
          strokeWidth="4"
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
        
        {/* Center dot */}
        <circle
          cx={centerX}
          cy={centerY}
          r="8"
          fill="#facc15"
        />
      </svg>
      
      {/* Scale labels */}
      <div className="relative w-full mt-4">
        <div className="flex justify-between text-gray-400 text-sm">
          <span>0</span>
          <span>30</span>
          <span>45</span>
          <span>100</span>
          <span>220</span>
        </div>
      </div>
    </div>
  );
};

export default Speedometer;

