import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import projectImage from './assets//a97dafd66e22673ff82f15350f690eb0f257f1d6.png';

export function Phase3() {
  return (
    <div className="flex-1 bg-white flex flex-col">
      <div className="p-6 border-b">
        <Link to="/projects" className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
        <h1 className="text-3xl font-bold">Phase III</h1>
        <p className="text-gray-600">Design & Architecture</p>
      </div>
      <div className="flex-1 p-12 overflow-auto max-[999px]:text-[9pt]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex justify-center">
            <img 
              src={projectImage} 
              alt="Phase 3"
              className="rounded-lg shadow-lg max-[999px]:w-[200px] max-[999px]:h-[200px] min-[1000px]:w-[400px] min-[1000px]:h-[400px] object-cover"
            />
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-gray-700 leading-relaxed">
                Phase III focuses on creating comprehensive design specifications and system architecture. This 
                phase transforms requirements into detailed technical designs including UI/UX mockups, database 
                schemas, API specifications, and system architecture diagrams.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Key Deliverables</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>System Architecture Document</li>
                <li>Database Design and ER Diagrams</li>
                <li>UI/UX Wireframes and Mockups</li>
                <li>API Specification Document</li>
                <li>Technology Stack Documentation</li>
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Accomplishments</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Created comprehensive architecture diagrams</li>
                <li>Designed responsive UI layouts for all pages</li>
                <li>Developed database schema with normalization</li>
                <li>Selected React, Tailwind CSS, and React Router as core technologies</li>
                <li>Defined RESTful API endpoints and data models</li>
              </ul>
            </div>

            <div className="border-l-4 border-green-500 bg-green-50 p-6 rounded">
              <h3 className="text-xl font-semibold mb-2">Status</h3>
              <p className="text-gray-700 font-bold text-green-700">Completed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
