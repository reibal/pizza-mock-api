export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="page">
      <header className="header">
        <div className="brand">
          <span className="logo">🍕</span>
          <span>Pizza Mock API</span>
        </div>
        <nav className="nav">
          <a href="/docs">API Reference</a>
        </nav>
      </header>

      <main className="content">{children}</main>

      <footer className="footer">
        API mock para el curso de testing con Bruno. Los datos viven en memoria y se reinician en
        cada arranque.
      </footer>
    </div>
  );
}
