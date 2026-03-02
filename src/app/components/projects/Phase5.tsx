import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import projectImage from './assets//a97dafd66e22673ff82f15350f690eb0f257f1d6.png';

export function Phase5() {
  return (
    <div className="flex-1 bg-white flex flex-col">
      <div className="p-6 border-b">
        <Link to="/projects" className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
        <h1 className="text-3xl font-bold">Phase V</h1>
        <p className="text-gray-600">Backend Development</p>
      </div>
      <div className="flex-1 p-12 overflow-auto max-[999px]:text-[9pt]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex justify-center">
            <img 
              src={projectImage} 
              alt="Phase 5"
              className="rounded-lg shadow-lg max-[999px]:w-[200px] max-[999px]:h-[200px] min-[1000px]:w-[400px] min-[1000px]:h-[400px] object-cover"
            />
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-gray-700 leading-relaxed">
                Phase V focuses on developing server-side functionality, database implementation, and API 
                development. This phase creates the backend infrastructure to support data persistence, 
                authentication, and business logic processing.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Key Deliverables</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>RESTful API Implementation</li>
                <li>Database Schema Implementation</li>
                <li>Authentication and Authorization System</li>
                <li>Data Validation and Error Handling</li>
                <li>API Documentation</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Current Progress</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Backend framework selected and configured</li>
                <li>Database connections established</li>
                <li>Core API endpoints in development</li>
                <li>Authentication middleware being implemented</li>
                <li>Initial testing of data models underway</li>
              </ul>
            </div>

            <div className="border-l-4 border-blue-500 bg-blue-50 p-6 rounded">
              <h3 className="text-xl font-semibold mb-2">Status</h3>
              <p className="text-gray-700 font-bold text-blue-700">In Progress</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
