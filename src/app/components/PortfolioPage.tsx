import cg2ReactImage from './assets/1adaebb429dea844c383a809ddc9933815950938.png';
import myLinkImage from './assets/d3c977461892fe88a85a7a56577a399e87336077.png';
import webmasterImage from './assets/a9f549a53dec630eac0ee12616909b57e2eeafb6.png';

export function PortfolioPage() {
  return (
    <div className="flex-1 bg-white flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-3xl font-bold">Portfolio</h1>
        <p className="text-gray-600">Author Page</p>
      </div>
      <div className="flex-1 p-12 overflow-auto max-[999px]:text-[9pt]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-6">Portfolio</h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <div className="space-y-2">
                <p className="font-semibold text-lg">John S. Stritzinger</p>
                <p className="text-red-700 font-medium">Global Tech Executive</p>
                <p>Graduate Assistant - University of South Carolina</p>
                <p>1800 Washington Street</p>
                <p>Columbia, South Carolina 29201</p>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-4">Portfolio</h3>
            <p className="text-gray-700 leading-relaxed">
              This portfolio highlights my work across web development, research, and enterprise systems. 
              It includes links to my professional sites, academic assignments, and ongoing research interests. 
              Each section reflects my commitment to technology leadership, innovation, and continuous learning.
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="text-xl font-semibold mb-4">CG2 React Tools</h4>
              <div className="flex justify-center">
                <img 
                  src={cg2ReactImage} 
                  alt="CG2 React Tools - Motocross park booking platform"
                  className="rounded-lg shadow-lg max-[999px]:w-[200px] max-[999px]:h-[200px] min-[1000px]:w-[400px] min-[1000px]:h-[400px] object-cover"
                />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="text-xl font-semibold mb-4">Webmaster Links</h4>
              <div className="flex justify-center">
                <img 
                  src={webmasterImage} 
                  alt="Webmaster Links - GBK Castries web platform"
                  className="rounded-lg shadow-lg max-[999px]:w-[200px] max-[999px]:h-[200px] min-[1000px]:w-[400px] min-[1000px]:h-[400px] object-cover"
                />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="text-xl font-semibold mb-4">MyLinkV3</h4>
              <div className="flex justify-center">
                <img 
                  src={myLinkImage} 
                  alt="MyLinkV3 - Motocross camping and outdoor recreation platform"
                  className="rounded-lg shadow-lg max-[999px]:w-[200px] max-[999px]:h-[200px] min-[1000px]:w-[400px] min-[1000px]:h-[400px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}