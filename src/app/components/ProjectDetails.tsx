interface ProjectLink {
  label: string;
  url: string;
  image: string;
  description: string;
}

interface HostingProvider {
  name: string;
  links: ProjectLink[];
}

const hostingProviders: HostingProvider[] = [
  {
    name: 'Render',
    links: [
      {
        label: 'API Detail',
        url: 'HTTPS://USC242.ONRENDER.COM',
        image: 'https://images.unsplash.com/photo-1695668548342-c0c1ad479aee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBUEklMjBiYWNrZW5kJTIwc2VydmVyJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3Njk5ODIzMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        description: 'Backend API endpoints and server details'
      },
      {
        label: 'API Swagger Documentation',
        url: 'HTTPS://API242.ONRENDER.COM/SWAGGER',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBUEklMjBkb2N1bWVudGF0aW9uJTIwc3dhZ2dlcnxlbnwxfHx8fDE3Njk5ODIzMzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
        description: 'Interactive API documentation with Swagger'
      },
      {
        label: 'React App Front Page',
        url: 'HTTPS://REACT242-HO2O.ONRENDER.COM/INDEX.HTML',
        image: 'https://images.unsplash.com/photo-1489436969537-cf0c1dc69cba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjByb290JTIwaG9zdGluZyUyMHNlcnZlcnxlbnwxfHx8fDE3Njk5ODIzMzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
        description: 'Main React application frontend'
      }
    ]
  },
  {
    name: 'Vercel',
    links: [
      {
        label: 'Production Deployment',
        url: 'HTTPS://YOUR-PROJECT.VERCEL.APP',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZXJjZWwlMjBkZXBsb3ltZW50JTIwd2ViJTIwaG9zdGluZ3xlbnwxfHx8fDE3Njk5ODIzMzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
        description: 'Vercel production hosting'
      }
    ]
  },
  {
    name: 'Netlify',
    links: [
      {
        label: 'Static Site Hosting',
        url: 'HTTPS://YOUR-SITE.NETLIFY.APP',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXRsaWZ5JTIwd2ViJTIwaG9zdGluZyUyMHN0YXRpY3xlbnwxfHx8fDE3Njk5ODIzMzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
        description: 'Netlify static site deployment'
      }
    ]
  }
];

export function ProjectDetails() {
  return (
    <div className="flex-1 bg-white p-12 overflow-auto max-[999px]:text-[9pt]">
      {/* Header */}
      <h1 className="text-4xl font-bold mb-12">HOSTING INFORMATION</h1>

      {/* Hosting Providers */}
      {hostingProviders.map((provider, providerIndex) => (
        <div key={providerIndex} className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-[#4CBB17]">{provider.name}</h2>
          
          {/* Provider Links */}
          <div className="mb-8 space-y-4">
            {provider.links.map((link, index) => (
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

          {/* Provider Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {provider.links.map((link, index) => (
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
      ))}
    </div>
  );
}