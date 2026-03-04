import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import assignmentImage from 'figma:asset/a97dafd66e22673ff82f15350f690eb0f257f1d6.png';

export function Assignment6() {
  return (
    <div className="flex-1 bg-white flex flex-col">
      <div className="p-6 border-b">
        <Link to="/assignments" className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Assignments
        </Link>
        <h1 className="text-3xl font-bold">Assignment 6</h1>
        <p className="text-gray-600">Event Handling</p>
      </div>
      <div className="flex-1 p-12 overflow-auto max-[999px]:text-[9pt]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex justify-center">
            <img 
              src={assignmentImage} 
              alt="Assignment 6"
              className="rounded-lg shadow-lg max-[999px]:w-[200px] max-[999px]:h-[200px] min-[1000px]:w-[400px] min-[1000px]:h-[400px] object-cover"
            />
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-gray-700 leading-relaxed">
                Create interactive web pages by handling user events. Learn to respond to clicks, keyboard input, 
                mouse movements, and form submissions to create engaging user experiences.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Learning Objectives</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Attach event listeners to elements</li>
                <li>Handle click, hover, and keyboard events</li>
                <li>Understand event propagation and bubbling</li>
                <li>Prevent default behavior when needed</li>
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Requirements</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Implement at least 3 different event types</li>
                <li>Create interactive buttons with click handlers</li>
                <li>Add hover effects using mouse events</li>
                <li>Handle keyboard input for user interaction</li>
                <li>Use event.preventDefault() appropriately</li>
              </ul>
            </div>

            <div className="border-l-4 border-red-500 bg-red-50 p-6 rounded">
              <h3 className="text-xl font-semibold mb-2">Due Date</h3>
              <p className="text-gray-700">March 22, 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
