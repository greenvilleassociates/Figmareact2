import assignmentImage from 'figma:asset/a97dafd66e22673ff82f15350f690eb0f257f1d6.png';
import { Link } from 'react-router';

export function AssignmentsPage() {
  const assignments = [
    {
      id: 1,
      title: 'Assignment 1',
      subtitle: 'Basic HTML Structure',
      description: 'Introduction to HTML fundamentals and page structure',
      image: assignmentImage,
      path: '/assignments/1'
    },
    {
      id: 2,
      title: 'Assignment 2',
      subtitle: 'CSS Styling Basics',
      description: 'Learning CSS selectors, properties, and layout',
      image: assignmentImage,
      path: '/assignments/2'
    },
    {
      id: 3,
      title: 'Assignment 3',
      subtitle: 'Flexbox Layout',
      description: 'Mastering flexbox for responsive layouts',
      image: assignmentImage,
      path: '/assignments/3'
    },
    {
      id: 4,
      title: 'Assignment 4',
      subtitle: 'JavaScript Fundamentals',
      description: 'Introduction to JavaScript programming',
      image: assignmentImage,
      path: '/assignments/4'
    },
    {
      id: 5,
      title: 'Assignment 5',
      subtitle: 'DOM Manipulation',
      description: 'Working with the Document Object Model',
      image: assignmentImage,
      path: '/assignments/5'
    },
    {
      id: 6,
      title: 'Assignment 6',
      subtitle: 'Event Handling',
      description: 'Interactive web pages with JavaScript events',
      image: assignmentImage,
      path: '/assignments/6'
    },
    {
      id: 7,
      title: 'Assignment 7',
      subtitle: 'Form Validation',
      description: 'Client-side form validation techniques',
      image: assignmentImage,
      path: '/assignments/7'
    },
    {
      id: 8,
      title: 'Assignment 8',
      subtitle: 'API Integration',
      description: 'Fetching and displaying data from external APIs',
      image: assignmentImage,
      path: '/assignments/8'
    },
    {
      id: 9,
      title: 'Assignment 9',
      subtitle: 'Local Storage',
      description: 'Persistent data storage in the browser',
      image: assignmentImage,
      path: '/assignments/9'
    },
    {
      id: 10,
      title: 'Assignment 10',
      subtitle: 'Final Project',
      description: 'Comprehensive web application project',
      image: assignmentImage,
      path: '/assignments/10'
    },
  ];

  return (
    <div className="flex-1 bg-gray-50 p-12 overflow-auto max-[999px]:text-[9pt]">
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-1">Assignments</h1>
        <p className="text-gray-500 mb-6">CSCE242</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {assignments.map((assignment) => (
            <Link 
              key={assignment.id} 
              to={assignment.path}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden flex items-center justify-center">
                <img
                  src={assignment.image}
                  alt={assignment.title}
                  className="rounded max-[999px]:w-[200px] max-[999px]:h-[200px] min-[1000px]:w-[400px] min-[1000px]:h-[400px] object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-1">{assignment.title}</h3>
                <p className="text-sm text-gray-600">{assignment.subtitle}</p>
                <p className="text-xs text-gray-500 mt-2">{assignment.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}