import { useState } from 'react';

const features = [
  'Vite dev server with React',
  'File structure for assets/components/pages/services/utils',
  'Ready for API integration via backend',
];

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <main style={{ padding: '2rem', maxWidth: '720px', margin: '0 auto' }}>
      <header style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.9rem', letterSpacing: '0.08em', color: '#475569' }}>
          React + Vite
        </p>
        <h1 style={{ margin: '0.2rem 0', fontSize: '2.4rem', color: '#0f172a' }}>
          Frontend starter
        </h1>
        <p style={{ color: '#334155', margin: 0 }}>
          Build your UI in the components/pages folders and wire services to the backend.
        </p>
      </header>

      <section style={{ display: 'grid', gap: '1rem' }}>
        <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.75rem', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => setCount((c) => c + 1)}
              style={{
                padding: '0.6rem 1rem',
                borderRadius: '0.6rem',
                border: '1px solid #cbd5e1',
                background: '#0ea5e9',
                color: '#ffffff',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Count: {count}
            </button>
            <span style={{ color: '#334155' }}>Edit src/App.jsx to start building.</span>
          </div>
        </div>

        <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.75rem', background: '#ffffff' }}>
          <h2 style={{ margin: '0 0 0.5rem 0', color: '#0f172a' }}>Included</h2>
          <ul style={{ margin: 0, paddingLeft: '1.1rem', color: '#475569' }}>
            {features.map((item) => (
              <li key={item} style={{ marginBottom: '0.3rem' }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
