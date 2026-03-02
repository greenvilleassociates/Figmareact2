import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import projectImage from 'figma:asset/a97dafd66e22673ff82f15350f690eb0f257f1d6.png';

export function Phase6() {
  return (
    <div className="flex-1 bg-white flex flex-col">
      <div className="p-6 border-b">
        <Link to="/projects" className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
        <h1 className="text-3xl font-bold">Phase VI</h1>
        <p className="text-gray-600">Integration Testing</p>
      </div>
      <div className="flex-1 p-12 overflow-auto max-[999px]:text-[9pt]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex justify-center">
            <img 
              src={projectImage} 
              alt="Phase 6"
              className="rounded-lg shadow-lg max-[999px]:w-[200px] max-[999px]:h-[200px] min-[1000px]:w-[400px] min-[1000px]:h-[400px] object-cover"
            />
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-gray-700 leading-relaxed">
                Phase VI involves comprehensive integration testing to ensure all components work together 
                seamlessly. This phase tests the interaction between frontend and backend systems, validates 
                data flow, and identifies integration issues before user acceptance testing.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Planned Deliverables</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Integration Test Plan</li>
                <li>Test Cases and Test Scripts</li>
                <li>Automated Integration Test Suite</li>
                <li>Test Results and Bug Reports</li>
                <li>Performance Testing Results</li>
              </ul>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Planned Activities</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Test frontend-backend API integration</li>
                <li>Validate data persistence and retrieval</li>
                <li>Test authentication and authorization flows</li>
                <li>Verify error handling and edge cases</li>
                <li>Conduct performance and load testing</li>
              </ul>
            </div>

            <div className="border-l-4 border-gray-500 bg-gray-50 p-6 rounded">
              <h3 className="text-xl font-semibold mb-2">Status</h3>
              <p className="text-gray-700 font-bold text-gray-700">Pending</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
