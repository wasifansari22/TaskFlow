import React from 'react'

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              TaskFlow
            </h1>

            <p className="text-xs text-slate-500">
              Project Management, Simplified.
            </p>
          </div>

          <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500">
            Get Started
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <section>
          <p className="text-sm font-medium text-blue-600">
            Welcome to TaskFlow
          </p>

          <h2 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
            Manage projects.
            <br />
            Get things done.
          </h2>

          <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600">
            Organize your projects, manage your tasks, and keep your team
            moving forward from one place.
          </p>
        </section>
      </main>
    </div>
  );
}

export default App;