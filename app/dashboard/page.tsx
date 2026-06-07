export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">My Journeys</h2>
          <p className="text-gray-600">No active journeys. Search for a train to get started!</p>
          <button className="btn-primary mt-4">Create Journey</button>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Travel Partners</h2>
          <p className="text-gray-600">You'll see co-travelers here once you join a journey</p>
        </div>
      </div>
    </div>
  );
}