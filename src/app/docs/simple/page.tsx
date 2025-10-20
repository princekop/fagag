"use client"

export default function SimplePage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          LustNode Documentation
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          This is a simplified test page to verify routing works.
        </p>
        
        <div className="space-y-4">
          <div className="p-6 bg-white/5 rounded-lg border border-white/10">
            <h2 className="text-2xl font-bold mb-2">Route Test Successful ✅</h2>
            <p className="text-gray-400">The /docs route is working correctly.</p>
          </div>
          
          <div className="p-6 bg-white/5 rounded-lg border border-white/10">
            <h3 className="text-xl font-bold mb-2">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/docs/test" className="text-primary hover:underline">→ Test Page</a></li>
              <li><a href="/docs/showcase/dashboard" className="text-primary hover:underline">→ Dashboard Showcase</a></li>
              <li><a href="/dashboard" className="text-primary hover:underline">→ Main Dashboard</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
