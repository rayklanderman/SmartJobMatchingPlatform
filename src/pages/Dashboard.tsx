import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const jobApplicationsData = {
    labels: ['Applied', 'Interviews', 'Offers', 'Rejected'],
    datasets: [
      {
        label: 'Job Applications',
        data: [15, 5, 2, 3],
        backgroundColor: [
          'rgba(99, 102, 241, 0.5)',
          'rgba(59, 130, 246, 0.5)',
          'rgba(16, 185, 129, 0.5)',
          'rgba(239, 68, 68, 0.5)',
        ],
        borderColor: [
          'rgb(99, 102, 241)',
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900">Total Applications</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-2">25</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900">Interviews</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">5</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900">Job Offers</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">2</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900">Response Rate</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">28%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Application Status</h3>
          <Bar
            data={jobApplicationsData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
          />
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { action: 'Applied to', company: 'Tech Corp', role: 'Frontend Developer', date: '2025-04-09' },
              { action: 'Interview scheduled with', company: 'Design Studio', role: 'UX Designer', date: '2025-04-08' },
              { action: 'Received offer from', company: 'Startup Inc', role: 'Product Designer', date: '2025-04-07' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-600 mt-2" />
                <div>
                  <p className="text-gray-600">
                    {activity.action}{' '}
                    <span className="font-medium text-gray-900">{activity.company}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    {activity.role} • {activity.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
