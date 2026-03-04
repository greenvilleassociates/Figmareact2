import assignmentImage from 'figma:asset/a97dafd66e22673ff82f15350f690eb0f257f1d6.png';
import { Link } from 'react-router';
import { useState, useEffect } from 'react';

interface AssignmentImage {
  id: number;
  imageUrl: string;
}

interface AssignmentData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
}

export function AssignmentsPage() {
  const [customImages, setCustomImages] = useState<AssignmentImage[]>([]);
  const [assignmentData, setAssignmentData] = useState<AssignmentData[]>([]);
  const [projectId, setProjectId] = useState<string>('');

  // Load custom images and assignment data from localStorage
  useEffect(() => {
    const savedImages = localStorage.getItem('assignmentImages');
    const savedProjectConfig = localStorage.getItem('project_config');
    
    if (savedImages) {
      setCustomImages(JSON.parse(savedImages));
    }
    
    if (savedProjectConfig) {
      const config = JSON.parse(savedProjectConfig);
      setProjectId(config.projectid);
      loadAssignmentData(config.projectid);
    }
  }, []);

  const loadAssignmentData = (projectid: string) => {
    const assignments: AssignmentData[] = [];
    // Load first 10 assignments
    for (let i = 1; i <= 10; i++) {
      const saved = localStorage.getItem(`assignment_${projectid}_${i}`);
      if (saved) {
        assignments.push(JSON.parse(saved));
      } else {
        // Fallback to default data if no JSON found
        assignments.push({
          id: i,
          title: `Assignment ${i}`,
          subtitle: `Subtitle ${i}`,
          description: `Description ${i}`,
          imageUrl: assignmentImage
        });
      }
    }
    setAssignmentData(assignments);
  };

  const getImageForAssignment = (id: number) => {
    // Check if there's assignment data with image URL
    const assignment = assignmentData.find(a => a.id === id);
    if (assignment && assignment.imageUrl) {
      return assignment.imageUrl;
    }
    
    // Fallback to custom images
    const customImage = customImages.find(img => img.id === id);
    if (customImage?.imageUrl) {
      return customImage.imageUrl;
    }
    
    // Final fallback to default image
    return assignmentImage;
  };

  // Use assignment data if available, otherwise use default
  const assignments = assignmentData.length > 0 ? assignmentData.map(a => ({
    ...a,
    path: `/assignments/${a.id}`
  })) : [
    {
      id: 1,
      title: 'Assignment 1',
      subtitle: 'Basic HTML Structure',
      description: 'Introduction to HTML fundamentals and page structure',
      imageUrl: getImageForAssignment(1),
      path: '/assignments/1'
    },
    {
      id: 2,
      title: 'Assignment 2',
      subtitle: 'CSS Styling Basics',
      description: 'Learning CSS selectors, properties, and layout',
      imageUrl: getImageForAssignment(2),
      path: '/assignments/2'
    },
    {
      id: 3,
      title: 'Assignment 3',
      subtitle: 'Flexbox Layout',
      description: 'Mastering flexbox for responsive layouts',
      imageUrl: getImageForAssignment(3),
      path: '/assignments/3'
    },
    {
      id: 4,
      title: 'Assignment 4',
      subtitle: 'JavaScript Fundamentals',
      description: 'Introduction to JavaScript programming',
      imageUrl: getImageForAssignment(4),
      path: '/assignments/4'
    },
    {
      id: 5,
      title: 'Assignment 5',
      subtitle: 'DOM Manipulation',
      description: 'Working with the Document Object Model',
      imageUrl: getImageForAssignment(5),
      path: '/assignments/5'
    },
    {
      id: 6,
      title: 'Assignment 6',
      subtitle: 'Event Handling',
      description: 'Interactive web pages with JavaScript events',
      imageUrl: getImageForAssignment(6),
      path: '/assignments/6'
    },
    {
      id: 7,
      title: 'Assignment 7',
      subtitle: 'Form Validation',
      description: 'Client-side form validation techniques',
      imageUrl: getImageForAssignment(7),
      path: '/assignments/7'
    },
    {
      id: 8,
      title: 'Assignment 8',
      subtitle: 'API Integration',
      description: 'Fetching and displaying data from external APIs',
      imageUrl: getImageForAssignment(8),
      path: '/assignments/8'
    },
    {
      id: 9,
      title: 'Assignment 9',
      subtitle: 'Local Storage',
      description: 'Persistent data storage in the browser',
      imageUrl: getImageForAssignment(9),
      path: '/assignments/9'
    },
    {
      id: 10,
      title: 'Assignment 10',
      subtitle: 'Final Project',
      description: 'Comprehensive web application project',
      imageUrl: getImageForAssignment(10),
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
                  src={assignment.imageUrl}
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