import Link from 'next/link';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-train-primary to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              🚂 Is your train on time?
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Find travel partners, check live status, and make your journey memorable
            </p>
            <div className="space-x-4">
              <Link href="/search" className="bg-white text-train-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block">
                Search Train
              </Link>
              <Link href="/login" className="bg-train-secondary text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-600 transition inline-block">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How Trainil Undo? Helps You</h2>
        <div className="grid md:grid-cols-3 gap-8">
          
          <div className="card text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Live Train Status</h3>
            <p className="text-gray-600">Real-time location, delays, and arrival times for any train</p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-2">Find Travel Partners</h3>
            <p className="text-gray-600">Connect with fellow passengers on the same journey</p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-2">Safe Chat</h3>
            <p className="text-gray-600">Discuss and coordinate with verified co-travelers</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Ready for a better journey?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of travelers who've found amazing company on their train journeys
          </p>
          <Link href="/login" className="btn-primary inline-block">
            Start Your Journey →
          </Link>
        </div>
      </section>
    </div>
  );
}