export default function TestPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">✅ Docs Route Works!</h1>
        <p className="text-gray-400">If you see this, the docs routing is functional.</p>
        <a href="/docs" className="inline-block mt-6 px-6 py-3 bg-primary rounded-lg hover:bg-primary/80">
          Go to Main Docs
        </a>
      </div>
    </div>
  )
}
