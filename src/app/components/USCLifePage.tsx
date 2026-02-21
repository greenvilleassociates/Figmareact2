import campusGatesImage from './assets/8084a8306ae2e8c0d78ac2ac990f1914811e0108.png';
import arenaImage from './assets/221e4451f2eb1c2628c17d60546e60d99c28da47.png';
import './styles/themes.css';

export function USCLifePage() {
  return (
    <div className="flex-1 bg-white flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-3xl font-bold">USC Life</h1>
        <p className="text-gray-600">Author Page</p>
      </div>
      <div className="flex-1 p-12 overflow-auto max-[999px]:text-[9pt]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-6">Life at USC</h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <div className="space-y-2">
                <p className="font-semibold text-lg">John S. Stritzinger</p>
                <p>Graduate Assistant - University of South Carolina</p>
                <p>1800 Washington Street</p>
                <p>Columbia, South Carolina 29201</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-red-700">USC Sports</h3>
              <div className="flex justify-center">
                <img 
                  src={arenaImage} 
                  alt="Colonial Life Arena during a basketball game"
                  className="rounded-lg shadow-lg max-[999px]:w-[200px] max-[999px]:h-[200px] min-[1000px]:w-[400px] min-[1000px]:h-[400px] object-cover"
                />
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4 text-red-700">Campus Views</h3>
              <div className="flex justify-center">
                <img 
                  src={campusGatesImage} 
                  alt="University of South Carolina campus entrance gates"
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