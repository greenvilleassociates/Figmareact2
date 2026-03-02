import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import projectImage from './assets//a97dafd66e22673ff82f15350f690eb0f257f1d6.png';

export function Phase4() {
  return (
    <div className="flex-1 bg-white flex flex-col">
      <div className="p-6 border-b">
        <Link to="/projects" className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
        <h1 className="text-3xl font-bold">Phase IV</h1>
        <p className="text-gray-600">Frontend Development</p>
      </div>
      <div className="flex-1 p-12 overflow-auto max-[999px]:text-[9pt]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex justify-center">
            <img 
              src={projectImage} 
              alt="Phase 4"
              className="rounded-lg shadow-lg max-[999px]:w-[200px] max-[999px]:h-[200px] min-[1000px]:w-[400px] min-[1000px]:h-[400px] object-cover"
            />
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-gray-700 leading-relaxed">
                Phase IV implements the user interface and client-side functionality. This phase brings the 
                design to life using React and Tailwind CSS, creating responsive and interactive components. 
                All pages including Personal Pages, Assignments, Projects, and GitHub integration are developed.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Key Deliverables</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Responsive React Components</li>
                <li>React Router Navigation Implementation</li>
                <li>Sidebar Navigation with USC Branding</li>
                <li>Personal Pages with Iframe Integration</li>
                <li>Assignments and Projects Pages</li>
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Accomplishments</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Implemented red sidebar navigation with USC Cocky logo</li>
                <li>Created 10 assignment subpages with individual routing</li>
                <li>Developed responsive design with media queries (1000px breakpoint)</li>
                <li>Built iframe-based personal page navigation system</li>
                <li>Integrated GitHub Pages component with repository links</li>
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
