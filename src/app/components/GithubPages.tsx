export function GithubPages() {
  const githubLinks = [
    {
      label: 'GitHub Profile',
      url: 'https://github.com/jssg33',
      description: 'View all repositories and contributions'
    },
    {
      label: 'USC242 Repository',
      url: 'https://github.com/jssg33/usc242',
      description: 'USC242 project source code'
    },
    {
      label: 'Project Documentation',
      url: 'https://jssg33.github.io/usc242',
      description: 'Technical documentation and guides'
    }
  ];

  return (
    <div className="flex-1 bg-white p-12 overflow-auto max-[999px]:text-[9pt]">
      <h1 className="text-4xl font-bold mb-8">GitHub Pages</h1>
      <p className="text-lg text-gray-600 mb-8">
        Access your GitHub repositories and deployed pages.
      </p>

      <div className="space-y-6">
        {githubLinks.map((link, index) => (
          <div key={index} className="p-6 border rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{link.label}</h3>
                <p className="text-gray-600 mb-3">{link.description}</p>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center gap-2"
                >
                  {link.url}
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">GitHub Pages Deployment</h2>
        <div className="space-y-3 text-gray-700">
          <p>
            <strong>Status:</strong> <span className="text-green-600">Active</span>
          </p>
          <p>
            <strong>Last Deployed:</strong> January 30, 2026
          </p>
          <p>
            <strong>Branch:</strong> main
          </p>
          <p>
            <strong>Build Tool:</strong> GitHub Actions
          </p>
        </div>
      </div>
    </div>
  );
}