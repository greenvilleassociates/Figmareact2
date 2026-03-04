import profileImage from 'figma:asset/dbd3e43c51c524728c9f3b4ba5ae5183ce3da707.png';

export function AboutPage() {
  return (
    <div className="flex-1 bg-white flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-3xl font-bold">About Me</h1>
        <p className="text-gray-600">Author Page</p>
      </div>
      <div className="flex-1 p-12 overflow-auto max-[999px]:text-[9pt]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-50 p-8 rounded-lg mb-8">
            <h2 className="text-2xl font-bold mb-4">AboutMe</h2>
            <div className="space-y-2 text-lg">
              <p className="font-semibold">John S. Stritzinger</p>
              <p>Graduate Assistant - University of South Carolina</p>
              <p>1800 Washington Street</p>
              <p>Columbia, South Carolina 29201</p>
            </div>
          </div>
          <div className="mb-8 flex justify-center">
            <img 
              src={profileImage} 
              alt="Lighthouse by the ocean"
              className="rounded-lg shadow-lg max-[999px]:w-[200px] max-[999px]:h-[200px] min-[1000px]:w-[400px] min-[1000px]:h-[400px] object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}