import './styles/themes.css';

interface ProjectLink {
  label: string;
  url: string;
  image: string;
  description: string;
}

const projectLinks: ProjectLink[] = [
  {
    label: 'API Detail',
    url: 'HTTPS://USC242.ONRENDER.COM',
    image: 'https://images.unsplash.com/photo-1695668548342-c0c1ad479aee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBUEklMjBiYWNrZW5kJTIwc2VydmVyJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3Njk5ODIzMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Backend API endpoints and server details'
  },
  {
    label: 'React UI Landing',
    url: 'HTTPS://REACT242-HO2O.ONRENDER.COM/INDEXBASE.HTML',
    image: 'https://images.unsplash.com/photo-1659841064804-5f507b1b488a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxSZWFjdCUyMHdlYiUyMGFwcGxpY2F0aW9uJTIwbGFuZGluZyUyMHBhZ2V8ZW58MXx8fHwxNzY5OTgyMzMyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'React application landing page'
  },
  {
    label: 'React App Front Page',
    url: 'HTTPS://REACT242-HO2O.ONRENDER.COM/INDEX.HTML',
    image: 'https://images.unsplash.com/photo-1489436969537-cf0c1dc69cba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjByb290JTIwaG9zdGluZyUyMHNlcnZlcnxlbnwxfHx8fDE3Njk5ODIzMzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Main React application frontend'
  }
];

export function ProjectDetails() {
  return (
    <div className="flex-1 bg-white p-12 overflow-auto max-[999px]:text-[9pt]">
      {/* Header */}
      <h1 className="text-4xl font-bold mb-12">RENDER REACT PROJECT HOSTING DETAIL</h1>

      {/* Project Links */}
      <div className="mb-12 space-y-4">
        {projectLinks.map((link, index) => (
          <div key={index} className="flex gap-8">
            <div className="w-64 font-semibold">{link.label}</div>
            <a 
              href={link.url.toLowerCase()} 
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.url}
            </a>
          </div>
        ))}
      </div>

      {/* Project Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectLinks.map((link, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="rounded-lg overflow-hidden shadow-lg mb-3">
              <a 
                href={link.url.toLowerCase()} 
                target="_blank"
                rel="noopener noreferrer"
              >
                <img 
                  src={link.image} 
                  alt={link.label} 
                  className="hover:opacity-90 transition-opacity max-[999px]:w-[200px] max-[999px]:h-[200px] min-[1000px]:w-[400px] min-[1000px]:h-[400px] object-cover"
                />
              </a>
            </div>
            <h3 className="font-semibold text-lg mb-1">{link.label}</h3>
            <p className="text-sm text-gray-600">{link.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}