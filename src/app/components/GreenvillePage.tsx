import './styles/themes.css';

export function GreenvillePage() {
  return (
    <div className="flex-1 bg-white flex flex-col max-[999px]:text-[9pt]">
      <div className="p-6 border-b">
        <h1 className="text-3xl font-bold">Greenville</h1>
        <p className="text-gray-600">Corporate Page</p>
      </div>
      <div className="flex-1">
        <iframe
          src="https://greenvilleassociates.com"
          className="w-full h-full border-0"
          title="Greenville Associates"
        />
      </div>
    </div>
  );
}