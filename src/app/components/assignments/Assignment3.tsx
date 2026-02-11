import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import assignmentImage from './someassignment.png';

export function Assignment3() {
  return (
    <div className="flex-1 bg-white flex flex-col">
      <div className="p-6 border-b">
        <Link to="/assignments" className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Assignments
        </Link>
        <h1 className="text-3xl font-bold">Assignment 3</h1>
        <p className="text-gray-600">Flexbox Layout</p>
      </div>
      <div className="flex-1 p-12 overflow-auto max-[999px]:text-[9pt]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex justify-center">
            <img 
              src={assignmentImage} 
              alt="Assignment 3"
              className="rounded-lg shadow-lg max-[999px]:w-[200px] max-[999px]:h-[200px] min-[1000px]:w-[400px] min-[1000px]:h-[400px] object-cover"
            />
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-gray-700 leading-relaxed">
                Master CSS Flexbox for creating responsive, flexible layouts. Learn to align, distribute, and organize 
                content using modern layout techniques that work across all screen sizes.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Learning Objectives</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Understand flexbox container and item properties</li>
                <li>Create responsive multi-column layouts</li>
                <li>Master alignment and justification</li>
                <li>Build navigation bars and card layouts</li>
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Requirements</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Create a responsive navigation bar using flexbox</li>
                <li>Build a card-based layout with 3 columns</li>
                <li>Implement center-aligned content sections</li>
                <li>Make layout responsive for mobile devices</li>
                <li>Use flex-grow, flex-shrink, and flex-basis</li>
              </ul>
            </div>

            <div className="border-l-4 border-red-500 bg-red-50 p-6 rounded">
              <h3 className="text-xl font-semibold mb-2">Due Date</h3>
              <p className="text-gray-700">March 1, 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
