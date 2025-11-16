import { Zap, Users, FolderOpen, Target } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import StatCard from '../components/StatCard';

const ScoreboardPage = () => {
  // Mock data for the scoreboard
  const scoreboardData = [
    { position: 1, teamNumber: 15, teamName: 'Aditya', category: 'Movie', accuracy: 82 },
    { position: 2, teamNumber: 9, teamName: 'Amritanshu', category: 'Image', accuracy: 86 },
    { position: 3, teamNumber: 10, teamName: 'Anuj', category: 'Song', accuracy: 75 },
    { position: 4, teamNumber: 4, teamName: 'Ayush', category: 'Image', accuracy: 80 },
    { position: 5, teamNumber: 12, teamName: 'Rahul', category: 'Poetry', accuracy: 78 },
    { position: 6, teamNumber: 7, teamName: 'Priya', category: 'Meme', accuracy: 85 },
  ];

  return (
    <PageWrapper>
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Page Title */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <Zap className="w-8 h-8 text-yellow-400" />
            <h1 className="text-5xl font-bold text-white">Scoreboard</h1>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StatCard icon={Users} title="Total Teams :" value="47" />
            <StatCard icon={FolderOpen} title="Categories :" value="5" />
            <StatCard icon={Target} title="Average Accuracy :" value="79%" />
          </div>

          {/* Scoreboard Table */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-800 border-b border-gray-700">
                    <th className="px-6 py-4 text-left text-yellow-400 font-bold">Position</th>
                    <th className="px-6 py-4 text-left text-yellow-400 font-bold">Team Number</th>
                    <th className="px-6 py-4 text-left text-yellow-400 font-bold">Team Name</th>
                    <th className="px-6 py-4 text-left text-yellow-400 font-bold">Category</th>
                    <th className="px-6 py-4 text-left text-yellow-400 font-bold">Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  {scoreboardData.map((row, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-800 hover:bg-gray-800 transition-colors"
                    >
                      <td className="px-6 py-4 text-white">{row.position}</td>
                      <td className="px-6 py-4 text-white">Team {row.teamNumber}</td>
                      <td className="px-6 py-4 text-white">{row.teamName}</td>
                      <td className="px-6 py-4 text-white">{row.category}</td>
                      <td className="px-6 py-4 text-yellow-400 font-semibold">{row.accuracy}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ScoreboardPage;

