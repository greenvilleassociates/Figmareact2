export function PersonalPages() {
  const pages = [
    {
      title: 'About Me',
      description: 'Personal introduction and background',
      lastUpdated: 'January 25, 2026',
      status: 'Published'
    },
    {
      title: 'Blog',
      description: 'Technical articles and thoughts',
      lastUpdated: 'January 28, 2026',
      status: 'Published'
    },
    {
      title: 'Projects Showcase',
      description: 'Portfolio of completed projects',
      lastUpdated: 'January 20, 2026',
      status: 'Published'
    },
    {
      title: 'Contact',
      description: 'Get in touch with me',
      lastUpdated: 'January 15, 2026',
      status: 'Published'
    },
    {
      title: 'Resume',
      description: 'Professional experience and skills',
      lastUpdated: 'January 30, 2026',
      status: 'Draft'
    }
  ];

  return (
    <div className="flex-1 bg-white p-12 overflow-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Personal Pages</h1>
          <p className="text-lg text-gray-600">
            Manage your personal content and pages
          </p>
        </div>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Create New Page
        </button>
      </div>

      <div className="grid gap-4">
        {pages.map((page, index) => (
          <div
            key={index}
            className="p-6 border rounded-lg hover:shadow-md transition-shadow flex items-center justify-between"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-semibold">{page.title}</h3>
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    page.status === 'Published'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {page.status}
                </span>
              </div>
              <p className="text-gray-600 mb-2">{page.description}</p>
              <p className="text-sm text-gray-500">Last updated: {page.lastUpdated}</p>
            </div>
            <div className="flex gap-3 ml-6">
              <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                Edit
              </button>
              <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors">
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-blue-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Total Pages</h3>
          <p className="text-3xl font-bold text-blue-600">{pages.length}</p>
        </div>
        <div className="p-6 bg-green-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Published</h3>
          <p className="text-3xl font-bold text-green-600">
            {pages.filter(p => p.status === 'Published').length}
          </p>
        </div>
        <div className="p-6 bg-yellow-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Drafts</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {pages.filter(p => p.status === 'Draft').length}
          </p>
        </div>
      </div>
    </div>
  );
}
