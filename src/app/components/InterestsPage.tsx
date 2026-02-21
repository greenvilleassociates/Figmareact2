import golfImage from './assets/d8b89db27256015cfae3bbf286057420c99688d5.png';
import './styles/themes.css';

export function InterestsPage() {
  return (
    <div className="flex-1 bg-white flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-3xl font-bold">Interests</h1>
        <p className="text-gray-600">Author Page</p>
      </div>
      <div className="flex-1 p-12 overflow-auto max-[999px]:text-[9pt]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-6">My Interests</h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <div className="space-y-2">
                <p className="font-semibold text-lg">John S. Stritzinger</p>
                <p>Graduate Assistant - University of South Carolina</p>
                <p>1800 Washington Street</p>
                <p>Columbia, South Carolina 29201</p>
              </div>
            </div>
          </div>

          <div className="mb-8 flex justify-center">
            <img 
              src={golfImage} 
              alt="Golf course clubhouse at sunset"
              className="rounded-lg shadow-lg max-[999px]:w-[200px] max-[999px]:h-[200px] min-[1000px]:w-[400px] min-[1000px]:h-[400px] object-cover"
            />
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-2xl font-semibold mb-2">Youth Soccer</h3>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-2xl font-semibold mb-2">Golf</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}