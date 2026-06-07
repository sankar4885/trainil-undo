export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="card">
        <h1 className="text-2xl font-bold text-center mb-6">Welcome Back</h1>
        <p className="text-center text-gray-600 mb-8">
          Sign in with Google to continue
        </p>
        <button className="w-full btn-primary flex items-center justify-center gap-2">
          <span>🚀</span> Sign in with Google
        </button>
        <p className="text-xs text-center text-gray-500 mt-6">
          We'll never share your information without consent
        </p>
      </div>
    </div>
  );
}