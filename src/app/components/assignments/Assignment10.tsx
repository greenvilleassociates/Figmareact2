import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import assignmentImage from 'figma:asset/a97dafd66e22673ff82f15350f690eb0f257f1d6.png';

export function Assignment10() {
  return (
    <div className="flex-1 bg-white flex flex-col">
      <div className="p-6 border-b">
        <Link to="/assignments" className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Assignments
        </Link>
        <h1 className="text-3xl font-bold">Assignment 10</h1>
        <p className="text-gray-600">Final Project</p>
      </div>
      <div className="flex-1 p-12 overflow-auto max-[999px]:text-[9pt]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex justify-center">
            <img 
              src={assignmentImage} 
              alt="Assignment 10"
              className="rounded-lg shadow-lg max-[999px]:w-[200px] max-[999px]:h-[200px] min-[1000px]:w-[400px] min-[1000px]:h-[400px] object-cover"
            />
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-gray-700 leading-relaxed">
                Create a comprehensive web application that demonstrates mastery of all concepts learned throughout 
                the course. This capstone project should showcase HTML, CSS, JavaScript, API integration, and 
                persistent storage working together in a cohesive application.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Learning Objectives</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Integrate multiple technologies into one project</li>
                <li>Design and implement a complete user experience</li>
                <li>Apply best practices for code organization</li>
                <li>Create responsive, accessible web applications</li>
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Requirements</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Minimum of 3 interconnected pages</li>
                <li>Responsive design for mobile and desktop</li>
                <li>Integration with at least one external API</li>
                <li>Form with validation and localStorage</li>
                <li>Interactive features using event handling</li>
                <li>Professional styling and user experience</li>
                <li>Clean, well-documented code</li>
              </ul>
            </div>

            <div className="border-l-4 border-red-500 bg-red-50 p-6 rounded">
              <h3 className="text-xl font-semibold mb-2">Due Date</h3>
              <p className="text-gray-700">April 26, 2026</p>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
              <h3 className="text-xl font-semibold mb-2 text-purple-800">Presentation</h3>
              <p className="text-gray-700">
                Final presentations will be held during the last week of class. Prepare a 10-minute demonstration 
                of your project highlighting key features and technical implementations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
