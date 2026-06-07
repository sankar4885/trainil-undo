export default function GuidelinesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Community Guidelines</h1>
      
      <div className="card space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">🤝 Be Respectful</h2>
          <p>Treat fellow travelers with kindness and respect. Harassment, hate speech, or bullying will not be tolerated.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">🔒 Protect Privacy</h2>
          <p>Don't share personal information like phone numbers or addresses in public chats. Use private channels when needed.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">🚫 No Spam</h2>
          <p>Don't post promotional content, advertisements, or repeated messages.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">✅ Report Issues</h2>
          <p>Use the report button to flag inappropriate behavior. Our team reviews all reports within 24 hours.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">💡 Be Helpful</h2>
          <p>Share useful information about train journeys, stations, and travel tips with your co-travelers.</p>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg mt-4">
          <p className="text-yellow-800 text-sm">
            ⚠️ Violations may result in temporary suspension or permanent ban from Trainil Undo?
          </p>
        </div>
      </div>
    </div>
  );
}