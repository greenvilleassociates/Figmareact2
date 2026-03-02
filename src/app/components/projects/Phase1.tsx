import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import projectImage from 'figma:asset/a97dafd66e22673ff82f15350f690eb0f257f1d6.png';

export function Phase1() {
  return (
    <div className="flex-1 bg-white flex flex-col">
      <div className="p-6 border-b">
        <Link to="/projects" className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
        <h1 className="text-3xl font-bold">Phase I</h1>
        <p className="text-gray-600">Project Initialization</p>
      </div>
      <div className="flex-1 p-12 overflow-auto max-[999px]:text-[9pt]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex justify-center">
            <img 
              src={projectImage} 
              alt="Phase 1"
              className="rounded-lg shadow-lg max-[999px]:w-[200px] max-[999px]:h-[200px] min-[1000px]:w-[400px] min-[1000px]:h-[400px] object-cover"
            />
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-gray-700 leading-relaxed">
                Phase I marks the beginning of the project lifecycle. This phase focuses on establishing 
                project foundations, setting up the development environment, and defining initial project scope 
                and objectives. Key stakeholders are identified and the project charter is created.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Key Deliverables</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Project Charter Document</li>
                <li>Stakeholder Identification Matrix</li>
                <li>Initial Project Scope Statement</li>
                <li>Development Environment Setup</li>
                <li>Version Control Repository Creation</li>
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Accomplishments</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>GitHub repository established at https://github.com/jssg33/usc242</li>
                <li>Project team roles and responsibilities defined</li>
                <li>Communication channels established</li>
                <li>Initial timeline and milestones created</li>
                <li>Development tools and frameworks selected</li>
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
