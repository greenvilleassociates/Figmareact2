import assignmentImage from 'figma:asset/a97dafd66e22673ff82f15350f690eb0f257f1d6.png';
import { Link } from 'react-router';
import { useState, useEffect } from 'react';

interface ProjectImage {
  id: number;
  imageUrl: string;
}

interface ProjectPhaseData {
  id: number;
  phase: string;
  title: string;
  status: string;
  imageUrl: string;
}

export function ProjectsPage() {
  const [customImages, setCustomImages] = useState<ProjectImage[]>([]);
  const [projectPhaseData, setProjectPhaseData] = useState<ProjectPhaseData[]>([]);
  const [projectId, setProjectId] = useState<string>('');

  // Load custom images and project phase data from localStorage
  useEffect(() => {
    const savedImages = localStorage.getItem('projectImages');
    const savedProjectConfig = localStorage.getItem('project_config');
    
    if (savedImages) {
      setCustomImages(JSON.parse(savedImages));
    }
    
    if (savedProjectConfig) {
      const config = JSON.parse(savedProjectConfig);
      setProjectId(config.projectid);
      loadProjectPhaseData(config.projectid);
    }
  }, []);

  const loadProjectPhaseData = (projectid: string) => {
    const phases: ProjectPhaseData[] = [];
    // Load all 10 project phases
    for (let i = 1; i <= 10; i++) {
      const saved = localStorage.getItem(`project_phase_${projectid}_${i}`);
      if (saved) {
        phases.push(JSON.parse(saved));
      } else {
        // Fallback to default data if no JSON found
        phases.push({
          id: i,
          phase: `Phase ${toRoman(i)}`,
          title: `Phase ${i} Title`,
          status: i <= 4 ? 'Completed' : i === 5 ? 'In Progress' : 'Pending',
          imageUrl: assignmentImage
        });
      }
    }
    setProjectPhaseData(phases);
  };

  const toRoman = (num: number): string => {
    const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
    return romanNumerals[num - 1] || num.toString();
  };

  const getImageForPhase = (id: number) => {
    // Check if there's project phase data with image URL
    const phase = projectPhaseData.find(p => p.id === id);
    if (phase && phase.imageUrl) {
      return phase.imageUrl;
    }
    
    // Fallback to custom images
    const customImage = customImages.find(img => img.id === id);
    if (customImage?.imageUrl) {
      return customImage.imageUrl;
    }
    
    // Final fallback to default image
    return assignmentImage;
  };

  // Use project phase data if available, otherwise use default
  const phases = projectPhaseData.length > 0 ? projectPhaseData.map(p => ({
    ...p,
    path: `/projects/${p.id}`
  })) : [
    { phase: 'Phase I', title: 'Project Initialization', status: 'Completed', image: getImageForPhase(1), path: '/projects/1' },
    { phase: 'Phase II', title: 'Requirements Gathering', status: 'Completed', image: getImageForPhase(2), path: '/projects/2' },
    { phase: 'Phase III', title: 'Design & Architecture', status: 'Completed', image: getImageForPhase(3), path: '/projects/3' },
    { phase: 'Phase IV', title: 'Frontend Development', status: 'Completed', image: getImageForPhase(4), path: '/projects/4' },
    { phase: 'Phase V', title: 'Backend Development', status: 'In Progress', image: getImageForPhase(5), path: '/projects/5' },
    { phase: 'Phase VI', title: 'Integration Testing', status: 'Pending', image: getImageForPhase(6), path: '/projects/6' },
    { phase: 'Phase VII', title: 'User Acceptance Testing', status: 'Pending', image: getImageForPhase(7), path: '/projects/7' },
    { phase: 'Phase VIII', title: 'Deployment Preparation', status: 'Pending', image: getImageForPhase(8), path: '/projects/8' },
    { phase: 'Phase IX', title: 'Production Deployment', status: 'Pending', image: getImageForPhase(9), path: '/projects/9' },
    { phase: 'Phase X', title: 'Maintenance & Support', status: 'Pending', image: getImageForPhase(10), path: '/projects/10' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700';
      case 'In Progress':
        return 'bg-blue-100 text-blue-700';
      case 'Pending':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex-1 bg-gray-50 p-12 overflow-auto max-[999px]:text-[9pt]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Project Phases</h1>
        <p className="text-gray-500 mb-6">Development Lifecycle</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {phases.map((phase, index) => (
            <Link 
              key={index} 
              to={phase.path}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden flex items-center justify-center">
                <img
                  src={phase.imageUrl || phase.image}
                  alt={phase.phase}
                  className="rounded max-[999px]:w-[200px] max-[999px]:h-[200px] min-[1000px]:w-[400px] min-[1000px]:h-[400px] object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-1">{phase.phase}</h3>
                <p className="text-sm text-gray-600 mb-2">{phase.title}</p>
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(phase.status)}`}>
                  {phase.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Project Summary */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-green-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Completed</h3>
          <p className="text-3xl font-bold text-green-600">
            {phases.filter(p => p.status === 'Completed').length}
          </p>
        </div>
        <div className="p-6 bg-blue-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">In Progress</h3>
          <p className="text-3xl font-bold text-blue-600">
            {phases.filter(p => p.status === 'In Progress').length}
          </p>
        </div>
        <div className="p-6 bg-gray-100 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Pending</h3>
          <p className="text-3xl font-bold text-gray-600">
            {phases.filter(p => p.status === 'Pending').length}
          </p>
        </div>
      </div>
    </div>
  );
}