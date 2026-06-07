export default function SearchPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Search Trains</h1>
      <div className="card">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Train Number</label>
            <input 
              type="text" 
              placeholder="e.g., 12627" 
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Journey Date</label>
            <input 
              type="date" 
              className="input-field"
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            Check Status
          </button>
        </form>
      </div>
    </div>
  );
}