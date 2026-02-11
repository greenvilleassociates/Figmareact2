import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import someimage from './someassignment.png';

export function Assignment8() {
  return (
    <div className="flex-1 bg-white flex flex-col">
      <div className="p-6 border-b">
        <Link to="/assignments" className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Assignments
        </Link>
        <h1 className="text-3xl font-bold">Assignment 8</h1>
        <p className="text-gray-600">API Integration</p>
      </div>
      <div className="flex-1 p-12 overflow-auto max-[999px]:text-[9pt]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex justify-center">
            <img 
              src={assignmentImage} 
              alt="Assignment 8"
              className="rounded-lg shadow-lg max-[999px]:w-[200px] max-[999px]:h-[200px] min-[1000px]:w-[400px] min-[1000px]:h-[400px] object-cover"
            />
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-gray-700 leading-relaxed">
                Learn to fetch and display data from external APIs using JavaScript's Fetch API. Work with JSON data, 
                handle asynchronous operations, and display dynamic content from remote sources.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Learning Objectives</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Use the Fetch API to retrieve data</li>
                <li>Work with Promises and async/await</li>
                <li>Parse and display JSON data</li>
                <li>Handle API errors gracefully</li>
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Requirements</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Fetch data from a public API</li>
                <li>Display at least 10 items from the API</li>
                <li>Implement loading state indicators</li>
                <li>Handle and display error messages</li>
                <li>Format and style the displayed data</li>
              </ul>
            </div>

            <div className="border-l-4 border-red-500 bg-red-50 p-6 rounded">
              <h3 className="text-xl font-semibold mb-2">Due Date</h3>
              <p className="text-gray-700">April 5, 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
