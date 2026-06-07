export default function ProfilePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      <div className="card">
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-3xl">
              👤
            </div>
            <div>
              <h2 className="text-xl font-semibold">Traveler Name</h2>
              <p className="text-gray-600">email@example.com</p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Interests</label>
            <div className="flex flex-wrap gap-2">
              {['Books', 'Music', 'Food', 'Travel'].map(interest => (
                <span key={interest} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                  {interest}
                </span>
              ))}
            </div>
          </div>
          
          <button className="btn-secondary w-full">Edit Profile</button>
        </div>
      </div>
    </div>
  );
}