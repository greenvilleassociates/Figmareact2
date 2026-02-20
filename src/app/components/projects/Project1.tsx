import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import assignmentImage from '../assets/a97dafd66e22673ff82f15350f690eb0f257f1d6.png';

export function Assignment1() {
  return (
    <div className="flex-1 bg-white flex flex-col">
      <div className="p-6 border-b">
        <Link to="/assignments" className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Assignments
        </Link>
        <h1 className="text-3xl font-bold">Assignment 1</h1>
        <p className="text-gray-600">Basic HTML Structure</p>
      </div>
      <div className="flex-1 p-12 overflow-auto max-[999px]:text-[9pt]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex justify-center">
            <img 
              src={assignmentImage} 
              alt="Assignment 1"
              className="rounded-lg shadow-lg max-[999px]:w-[200px] max-[999px]:h-[200px] min-[1000px]:w-[400px] min-[1000px]:h-[400px] object-cover"
            />
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-gray-700 leading-relaxed">
                This assignment introduces the fundamentals of HTML structure. Students will learn how to create 
                a basic webpage using semantic HTML elements including headers, paragraphs, lists, and links.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Learning Objectives</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Understand the basic structure of an HTML document</li>
                <li>Learn to use semantic HTML5 elements</li>
                <li>Create proper document hierarchy with heading tags</li>
                <li>Implement lists and links effectively</li>
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Requirements</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Valid HTML5 document structure</li>
                <li>Minimum of 3 sections with proper headings</li>
                <li>At least one ordered and one unordered list</li>
                <li>Include at least 5 hyperlinks</li>
                <li>Use semantic tags (header, nav, main, footer)</li>
              </ul>
            </div>

            <div className="border-l-4 border-red-500 bg-red-50 p-6 rounded">
              <h3 className="text-xl font-semibold mb-2">Due Date</h3>
              <p className="text-gray-700">February 15, 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
