const endpoints = [
  { method: 'GET', path: '/api/pizzas', auth: false, desc: 'Lista todas las pizzas' },
  {
    method: 'GET',
    path: '/api/pizzas/search?name=carbonara',
    auth: false,
    desc: 'Busca una pizza por nombre',
  },
  { method: 'POST', path: '/api/auth/login', auth: false, desc: 'Devuelve un bearer token (12h)' },
  { method: 'POST', path: '/api/auth/register', auth: false, desc: 'Crea un usuario' },
  { method: 'POST', path: '/api/pizzas/new', auth: true, desc: 'Crea una pizza' },
  { method: 'PUT', path: '/api/pizzas/{pizzaId}', auth: true, desc: 'Reemplaza una pizza' },
  { method: 'PATCH', path: '/api/pizzas/{pizzaId}', auth: true, desc: 'Modifica campos de una pizza' },
  { method: 'DELETE', path: '/api/pizzas/{pizzaId}', auth: true, desc: 'Elimina una pizza' },
];

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <span className="badge">Curso de testing con Bruno</span>
        <h1>Pizza Mock API</h1>
        <p>
          Una API en memoria que simula la gestión de un catálogo de pizzas con autenticación y
          roles. Úsala para practicar peticiones y tests con Bruno.
        </p>
        <a className="cta" href="/docs">
          Abrir API Reference
        </a>
      </section>

      <section>
        <h2>Endpoints</h2>
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Método</th>
                <th>Ruta</th>
                <th>Auth</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              {endpoints.map((endpoint) => (
                <tr key={`${endpoint.method}-${endpoint.path}`}>
                  <td className="method">{endpoint.method}</td>
                  <td>
                    <code>{endpoint.path}</code>
                  </td>
                  <td>{endpoint.auth ? '🔒' : '—'}</td>
                  <td>{endpoint.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Usuarios de ejemplo</h2>
        <div className="card">
          <p>
            Credenciales semilla (se recrean en cada arranque):
            <br />
            <code>admin / admin123</code> — rol <strong>admin</strong> (puede editar cualquier pizza)
            <br />
            <code>user / user123</code> — rol <strong>user</strong> (solo sus propias pizzas)
          </p>
          <p>
            Obtén un token con <code>POST /api/auth/login</code> y envíalo como{' '}
            <code>Authorization: Bearer &lt;token&gt;</code>.
          </p>
        </div>
      </section>
    </>
  );
}
