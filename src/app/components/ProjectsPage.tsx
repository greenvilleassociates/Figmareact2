import assignmentImage from 'figma:asset/a97dafd66e22673ff82f15350f690eb0f257f1d6.png';

export function ProjectsPage() {
  const phases = [
    { phase: 'Phase I', title: 'Project Initialization', status: 'Completed', image: assignmentImage },
    { phase: 'Phase II', title: 'Requirements Gathering', status: 'Completed', image: assignmentImage },
    { phase: 'Phase III', title: 'Design & Architecture', status: 'Completed', image: assignmentImage },
    { phase: 'Phase IV', title: 'Frontend Development', status: 'Completed', image: assignmentImage },
    { phase: 'Phase V', title: 'Backend Development', status: 'In Progress', image: assignmentImage },
    { phase: 'Phase VI', title: 'Integration Testing', status: 'Pending', image: assignmentImage },
    { phase: 'Phase VII', title: 'User Acceptance Testing', status: 'Pending', image: assignmentImage },
    { phase: 'Phase VIII', title: 'Deployment Preparation', status: 'Pending', image: assignmentImage },
    { phase: 'Phase IX', title: 'Production Deployment', status: 'Pending', image: assignmentImage },
    { phase: 'Phase X', title: 'Maintenance & Support', status: 'Pending', image: assignmentImage },
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
            <div key={index} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden flex items-center justify-center">
                <img
                  src={phase.image}
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
            </div>
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