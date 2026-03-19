import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import projectImage from 'figma:asset/a97dafd66e22673ff82f15350f690eb0f257f1d6.png';

export function Phase10() {
  return (
    <div className="flex-1 bg-white flex flex-col">
      <div className="p-6 border-b">
        <Link to="/projects" className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
        <h1 className="text-3xl font-bold">Phase X</h1>
        <p className="text-gray-600">Maintenance & Support</p>
      </div>
      <div className="flex-1 p-12 overflow-auto max-[999px]:text-[9pt]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex justify-center">
            <img 
              src={projectImage} 
              alt="Phase 10"
              className="rounded-lg shadow-lg max-[999px]:w-[200px] max-[999px]:h-[200px] min-[1000px]:w-[400px] min-[1000px]:h-[400px] object-cover"
            />
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-gray-700 leading-relaxed">
                Phase X establishes ongoing maintenance and support procedures for the production application. 
                This phase ensures the system continues to operate effectively, addresses issues as they arise, 
                and implements enhancements based on user feedback and changing requirements.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Planned Deliverables</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Maintenance and Support Plan</li>
                <li>Service Level Agreements (SLAs)</li>
                <li>Bug Tracking and Resolution Process</li>
                <li>Enhancement Request Procedure</li>
                <li>Regular System Health Reports</li>
              </ul>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Planned Activities</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Monitor system performance and availability</li>
                <li>Respond to and resolve user-reported issues</li>
                <li>Apply security patches and updates</li>
                <li>Implement approved enhancements and features</li>
                <li>Conduct regular system backups and disaster recovery testing</li>
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
