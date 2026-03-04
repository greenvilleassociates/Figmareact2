import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import projectImage from 'figma:asset/a97dafd66e22673ff82f15350f690eb0f257f1d6.png';

export function Phase8() {
  return (
    <div className="flex-1 bg-white flex flex-col">
      <div className="p-6 border-b">
        <Link to="/projects" className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
        <h1 className="text-3xl font-bold">Phase VIII</h1>
        <p className="text-gray-600">Deployment Preparation</p>
      </div>
      <div className="flex-1 p-12 overflow-auto max-[999px]:text-[9pt]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex justify-center">
            <img 
              src={projectImage} 
              alt="Phase 8"
              className="rounded-lg shadow-lg max-[999px]:w-[200px] max-[999px]:h-[200px] min-[1000px]:w-[400px] min-[1000px]:h-[400px] object-cover"
            />
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-gray-700 leading-relaxed">
                Phase VIII prepares the application for production deployment. This phase includes finalizing 
                deployment configurations, creating deployment scripts, preparing production infrastructure, 
                and ensuring all necessary documentation and training materials are ready.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Planned Deliverables</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Deployment Plan and Runbook</li>
                <li>Production Environment Configuration</li>
                <li>Deployment Automation Scripts</li>
                <li>Rollback and Recovery Procedures</li>
                <li>User Documentation and Training Materials</li>
              </ul>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Planned Activities</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Configure production environment on Render and GitHub Pages</li>
                <li>Create deployment scripts and CI/CD pipelines</li>
                <li>Prepare database migration scripts</li>
                <li>Develop monitoring and alerting systems</li>
                <li>Create user guides and administrator documentation</li>
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
