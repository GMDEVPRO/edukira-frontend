import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import useAuthStore from '../../store/authStore';

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [form, setForm] = useState({ email: '', password: '', schoolId: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const fillDemo = () => setForm({
    email: 'admin@ltdakar.sn',
    password: 'Admin1234',
    schoolId: '97c55f47-71e1-443d-93b8-b2bab00300e2',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/v1/auth/login', form);
      if (data.success) {
        localStorage.setItem('edukira_token', data.data.accessToken);
        login(data.data);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  // ── styles reutilizáveis ──
  const inputStyle = (dark) => ({
    width: '100%',
    padding: '11px 14px',
    borderRadius: 10,
    border: dark ? '0.5px solid rgba(255,255,255,.12)' : '1px solid #E5EDE9',
    background: dark ? 'rgba(255,255,255,.06)' : '#F9FBFA',
    color: dark ? '#fff' : '#111827',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'DM Sans, sans-serif',
    WebkitAppearance: 'none',
  });

  const labelStyle = (dark) => ({
    fontSize: 11,
    fontWeight: 600,
    color: dark ? 'rgba(255,255,255,.45)' : '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: '.5px',
    marginBottom: 5,
    display: 'block',
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ════ MOBILE & TABLET — só formulário ════ */}
      <style>{`
        .login-left { display: none; }
        .login-right { flex: 1; }

        @media (min-width: 768px) {
          .login-wrapper { flex-direction: row !important; }
          .login-left {
            display: flex !important;
            width: 45%;
            flex-direction: column;
            justify-content: space-between;
            padding: 36px;
            background: linear-gradient(135deg, #f0faf5 0%, #ffffff 60%, #f0f4ff 100%);
            position: relative;
            overflow: hidden;
          }
          .login-right {
            flex: 1 !important;
            padding: 40px !important;
          }
        }

        @media (min-width: 1024px) {
          .login-left { width: 48%; padding: 48px; }
          .login-right { padding: 56px !important; }
        }

        input::placeholder { color: rgba(255,255,255,.25); }
        .input-light::placeholder { color: #9CA3AF !important; }

        .login-btn:hover { opacity: .9; }
        .login-btn:active { transform: scale(.98); }
      `}</style>

      <div className="login-wrapper" style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}>

        {/* ── LADO ESQUERDO (tablet+desktop) ── */}
        <div className="login-left">
          {/* padrão pontos */}
          <div style={{
            position: 'absolute', inset: 0, opacity: .04,
            backgroundImage: 'radial-gradient(circle, #1D9E75 1px, transparent 1px)',
            backgroundSize: '24px 24px', pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', width: 320, height: 320, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(29,158,117,.12), transparent 70%)',
            top: -80, right: -80, pointerEvents: 'none',
          }} />

          {/* logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: '#1D9E75',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
            }}>🎓</div>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#111827', fontFamily: 'Syne, sans-serif' }}>
              Edukira<span style={{ color: '#1D9E75' }}>.</span>
            </span>
          </div>

          {/* texto + stats + mini dashboard */}
          <div style={{ position: 'relative' }}>
            <h1 style={{
              fontSize: 28, fontWeight: 800, color: '#111827',
              lineHeight: 1.2, marginBottom: 12, fontFamily: 'Syne, sans-serif',
            }}>
              Gérez votre école<br />
              <span style={{ color: '#1D9E75' }}>en toute simplicité.</span>
            </h1>
            <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7, marginBottom: 24 }}>
              Élèves, notes, présences et paiements<br />dans une seule plateforme.
            </p>

            {/* stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
              {[
                { val: '10', lbl: 'Pays africains' },
                { val: '3', lbl: 'Langues' },
                { val: 'Wave', lbl: 'Orange · MTN', green: true },
              ].map((s) => (
                <div key={s.val} style={{
                  background: '#fff', border: '0.5px solid #E5EDE9',
                  borderRadius: 10, padding: 12,
                }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: s.green ? '#1D9E75' : '#111827' }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: '#6B7280', marginTop: 2 }}>{s.lbl}</div>
                </div>
              ))}
            </div>

            {/* mini dashboard */}
            <div style={{ background: '#fff', borderRadius: 12, border: '0.5px solid #E5EDE9', overflow: 'hidden' }}>
              <div style={{ background: '#0B1E42', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: 6, background: '#1D9E75',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10,
                }}>🎓</div>
                <span style={{ color: '#fff', fontSize: 10, fontWeight: 600 }}>Lycée Technique de Dakar</span>
              </div>
              <div style={{ padding: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {[
                  { bg: '#F0F4FB', border: '#1249A0', lbl: 'Élèves', val: '247', color: '#1249A0' },
                  { bg: '#F0FDF4', border: '#059669', lbl: 'Revenus', val: '3,2M', color: '#059669' },
                  { bg: '#FFFBEB', border: '#F59E0B', lbl: 'Moyenne', val: '13,4', color: '#F59E0B' },
                  { bg: '#FEF2F2', border: '#DC2626', lbl: 'Impayés', val: '18', color: '#DC2626' },
                ].map((s) => (
                  <div key={s.lbl} style={{
                    background: s.bg, borderRadius: 7, padding: 8,
                    borderLeft: `3px solid ${s.border}`,
                  }}>
                    <div style={{ fontSize: 9, color: '#888' }}>{s.lbl}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: s.color }}>{s.val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p style={{ fontSize: 11, color: '#9CA3AF', position: 'relative' }}>
            © 2026 Edukira · Smart School Management
          </p>
        </div>

        {/* ── LADO DIREITO — formulário ── */}
        <div className="login-right" style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '32px 24px',
          background: 'linear-gradient(145deg, #071430 0%, #0B2254 50%, #0E1B3D 100%)',
          position: 'relative', overflow: 'hidden', minHeight: '100vh',
        }}>
          {/* padrão pontos */}
          <div style={{
            position: 'absolute', inset: 0, opacity: .03,
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '24px 24px', pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', width: 220, height: 220, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(29,158,117,.1), transparent 70%)',
            bottom: -40, left: -40, pointerEvents: 'none',
          }} />

          <div style={{ maxWidth: 380, width: '100%', margin: '0 auto', position: 'relative' }}>

            {/* logo mobile only */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}
              className="mobile-logo-show">
              <div style={{
                width: 34, height: 34, borderRadius: 10, background: '#1D9E75',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17,
              }}>🎓</div>
              <span style={{ fontSize: 17, fontWeight: 700, color: '#fff', fontFamily: 'Syne, sans-serif' }}>
                Edukira<span style={{ color: '#1D9E75' }}>.</span>
              </span>
            </div>

            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
              Bon retour 👋
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,.5)', marginBottom: 28 }}>
              Connectez-vous à votre espace école
            </p>

            {/* erro */}
            {error && (
              <div style={{
                marginBottom: 16, padding: '12px 14px', borderRadius: 10,
                background: 'rgba(220,38,38,.15)', border: '0.5px solid rgba(220,38,38,.3)',
                color: '#FCA5A5', fontSize: 14,
              }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              <div>
                <label style={labelStyle(true)}>Email</label>
                <input
                  type="email" name="email"
                  value={form.email} onChange={handleChange}
                  placeholder="directeur@ecole.sn"
                  required style={inputStyle(true)}
                />
              </div>

              <div>
                <label style={labelStyle(true)}>Mot de passe</label>
                <input
                  type="password" name="password"
                  value={form.password} onChange={handleChange}
                  placeholder="••••••••"
                  required style={inputStyle(true)}
                />
              </div>

              <div>
                <label style={labelStyle(true)}>ID de l'école</label>
                <input
                  type="text" name="schoolId"
                  value={form.schoolId} onChange={handleChange}
                  placeholder="97c55f47-71e1-443d-..."
                  required
                  style={{ ...inputStyle(true), fontFamily: 'monospace', fontSize: 12 }}
                />
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,.25)', marginTop: 5 }}>
                  Disponible dans votre email d'activation
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="login-btn"
                style={{
                  width: '100%', padding: 14, borderRadius: 10, border: 'none',
                  background: loading ? '#6B7280' : '#1D9E75',
                  color: '#fff', fontSize: 15, fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all .2s', fontFamily: 'DM Sans, sans-serif',
                  marginTop: 4,
                }}>
                {loading ? '⏳ Connexion...' : '🔐 Se connecter'}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,.4)', marginTop: 24 }}>
              Pas encore de compte ?{' '}
              <Link to="/register"
                style={{ color: '#1D9E75', fontWeight: 600, textDecoration: 'none' }}>
                Inscrire votre école →
              </Link>
            </p>

            {/* demo */}
            <div style={{
              marginTop: 16, padding: 14, borderRadius: 10,
              background: 'rgba(29,158,117,.12)', border: '0.5px solid rgba(29,158,117,.3)',
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#5DCAA5', marginBottom: 4 }}>
                Compte de test
              </div>
              <button onClick={fillDemo} style={{
                fontSize: 12, color: 'rgba(93,202,165,.8)', background: 'none',
                border: 'none', cursor: 'pointer', textDecoration: 'underline',
                padding: 0, fontFamily: 'DM Sans, sans-serif',
              }}>
                Remplir automatiquement →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}