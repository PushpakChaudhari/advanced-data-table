// Import the Table component
import Table from "../components/table";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4">Data Table</h1>
        <Table />
      </div>
    </div>
  );
}
