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
  const [mobileStep, setMobileStep] = useState('welcome');
  const [schoolType, setSchoolType] = useState('');
  const [countrySearch, setCountrySearch] = useState('');
  const [language, setLanguage] = useState('fr');

  const schoolTypes = [
    { val: 'LYCEE', icon: '🏫', label: 'Lycée / Collège' },
    { val: 'PRIMAIRE', icon: '📚', label: 'École Primaire' },
    { val: 'MADRASA', icon: '🕌', label: 'Madrasa' },
    { val: 'UNIVERSITE', icon: '🎓', label: 'Université' },
  ];

  const languages = [
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' },
  ];

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

  const inputStyle = (dark) => ({
    width: '100%', padding: '11px 14px', borderRadius: 10,
    border: dark ? '0.5px solid rgba(255,255,255,.12)' : '1px solid #E5EDE9',
    background: dark ? 'rgba(255,255,255,.06)' : '#F9FBFA',
    color: dark ? '#fff' : '#111827',
    fontSize: 14, outline: 'none', boxSizing: 'border-box',
    fontFamily: 'DM Sans, sans-serif', WebkitAppearance: 'none',
  });

  const labelStyle = (dark) => ({
    fontSize: 11, fontWeight: 600,
    color: dark ? 'rgba(255,255,255,.45)' : '#6B7280',
    textTransform: 'uppercase', letterSpacing: '.5px',
    marginBottom: 6, display: 'block',
  });

  // ── MOBILE WELCOME ──
  const MobileWelcome = () => (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(135deg, #f0faf5 0%, #ffffff 60%, #f0f4ff 100%)',
      padding: '28px 22px', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0, opacity: .04,
        backgroundImage: 'radial-gradient(circle, #1D9E75 1px, transparent 1px)',
        backgroundSize: '24px 24px', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 220, height: 220, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(29,158,117,.12), transparent 70%)',
        top: -50, right: -50, pointerEvents: 'none',
      }} />

      {/* logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, position: 'relative' }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9, background: '#1D9E75',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
        }}>🎓</div>
        <span style={{ fontSize: 16, fontWeight: 700, color: '#111827', fontFamily: 'Syne, sans-serif' }}>
          Edukira<span style={{ color: '#1D9E75' }}>.</span>
        </span>
      </div>

      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h1 style={{
          fontSize: 22, fontWeight: 800, color: '#111827',
          lineHeight: 1.25, marginBottom: 6, fontFamily: 'Syne, sans-serif',
        }}>
          Votre école digitalisée.<br />
          <span style={{ color: '#1D9E75' }}>Zéro papier. Zéro stress.</span>
        </h1>
        <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 18, lineHeight: 1.5 }}>
          Choisissez votre profil pour commencer
        </p>

        {/* tipo escola */}
        <label style={labelStyle(false)}>Type d'établissement</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
          {schoolTypes.map((t) => (
            <button key={t.val} onClick={() => setSchoolType(t.val)} style={{
              padding: '11px 8px', borderRadius: 10, cursor: 'pointer',
              border: schoolType === t.val ? '2px solid #1D9E75' : '1px solid #E5EDE9',
              background: schoolType === t.val ? '#E1F5EE' : '#fff',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
              transition: 'all .2s',
            }}>
              <span style={{ fontSize: 20 }}>{t.icon}</span>
              <span style={{
                fontSize: 11, textAlign: 'center', lineHeight: 1.2,
                fontWeight: schoolType === t.val ? 700 : 400,
                color: schoolType === t.val ? '#0F6E56' : '#9CA3AF',
              }}>{t.label}</span>
            </button>
          ))}
        </div>

        {/* país */}
        <label style={labelStyle(false)}>Votre pays</label>
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <span style={{
            position: 'absolute', left: 12, top: '50%',
            transform: 'translateY(-50%)', fontSize: 14,
          }}>🔍</span>
          <input
            type="text"
            value={countrySearch}
            onChange={(e) => setCountrySearch(e.target.value)}
            placeholder="Rechercher votre pays..."
            style={{
              width: '100%', padding: '11px 14px 11px 36px',
              borderRadius: 10, border: '1px solid #E5EDE9',
              background: '#F9FBFA', color: '#111827',
              fontSize: 13, outline: 'none', boxSizing: 'border-box',
              fontFamily: 'DM Sans, sans-serif',
            }}
          />
        </div>

        {/* língua */}
        <label style={labelStyle(false)}>Langue préférée</label>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {languages.map((l) => (
            <button key={l.code} onClick={() => setLanguage(l.code)} style={{
              flex: 1, padding: '10px 4px', borderRadius: 9, cursor: 'pointer',
              border: language === l.code ? '2px solid #1D9E75' : '1px solid #E5EDE9',
              background: language === l.code ? '#E1F5EE' : '#fff',
              fontSize: 12, fontWeight: language === l.code ? 700 : 400,
              color: language === l.code ? '#0F6E56' : '#9CA3AF',
              fontFamily: l.code === 'ar' ? 'Arial' : 'DM Sans, sans-serif',
              transition: 'all .2s',
            }}>
              {l.label}
            </button>
          ))}
        </div>

        {/* continuar */}
        <button
          onClick={() => setMobileStep('form')}
          disabled={!schoolType}
          style={{
            width: '100%', padding: 14, borderRadius: 12, border: 'none',
            background: schoolType ? '#1D9E75' : '#E5EDE9',
            color: schoolType ? '#fff' : '#9CA3AF',
            fontSize: 15, fontWeight: 600,
            cursor: schoolType ? 'pointer' : 'not-allowed',
            fontFamily: 'DM Sans, sans-serif', transition: 'all .2s',
          }}>
          Continuer →
        </button>

        <p style={{ textAlign: 'center', fontSize: 13, color: '#9CA3AF', marginTop: 14 }}>
          Pas encore de compte ?{' '}
          <Link to="/register" style={{ color: '#1D9E75', fontWeight: 600, textDecoration: 'none' }}>
            Inscrire votre école →
          </Link>
        </p>
      </div>
    </div>
  );

  // ── MOBILE FORM ──
  const MobileForm = () => (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(145deg, #071430 0%, #0B2254 50%, #0E1B3D 100%)',
      padding: '36px 22px', position: 'relative', overflow: 'hidden',
    }}>
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

      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, position: 'relative' }}>
        <button onClick={() => setMobileStep('welcome')} style={{
          width: 34, height: 34, borderRadius: 9,
          background: 'rgba(255,255,255,.08)', border: 'none',
          color: '#fff', fontSize: 16, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>←</button>
        <div style={{
          width: 28, height: 28, borderRadius: 8, background: '#1D9E75',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
        }}>🎓</div>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#fff', fontFamily: 'Syne, sans-serif' }}>
          Edukira<span style={{ color: '#1D9E75' }}>.</span>
        </span>
      </div>

      <div style={{ position: 'relative', flex: 1 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
          Bon retour 👋
        </h2>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,.5)', marginBottom: 26 }}>
          Connectez-vous à votre espace école
        </p>

        {error && (
          <div style={{
            marginBottom: 16, padding: '12px 14px', borderRadius: 10,
            background: 'rgba(220,38,38,.15)', border: '0.5px solid rgba(220,38,38,.3)',
            color: '#FCA5A5', fontSize: 13,
          }}>⚠️ {error}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={labelStyle(true)}>Email</label>
            <input type="email" name="email" value={form.email}
              onChange={handleChange} placeholder="directeur@ecole.sn"
              required style={inputStyle(true)} />
          </div>
          <div>
            <label style={labelStyle(true)}>Mot de passe</label>
            <input type="password" name="password" value={form.password}
              onChange={handleChange} placeholder="••••••••"
              required style={inputStyle(true)} />
          </div>
          <div>
            <label style={labelStyle(true)}>ID de l'école</label>
            <input type="text" name="schoolId" value={form.schoolId}
              onChange={handleChange} placeholder="97c55f47-71e1-443d-..."
              required style={{ ...inputStyle(true), fontFamily: 'monospace', fontSize: 12 }} />
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,.25)', marginTop: 5 }}>
              Disponible dans votre email d'activation
            </p>
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: 14, borderRadius: 12, border: 'none',
            background: loading ? '#6B7280' : '#1D9E75',
            color: '#fff', fontSize: 15, fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'DM Sans, sans-serif', marginTop: 4,
          }}>
            {loading ? '⏳ Connexion...' : '🔐 Se connecter'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,.4)', marginTop: 22 }}>
          Pas encore de compte ?{' '}
          <Link to="/register" style={{ color: '#1D9E75', fontWeight: 600, textDecoration: 'none' }}>
            Inscrire votre école →
          </Link>
        </p>

        <div style={{
          marginTop: 14, padding: 14, borderRadius: 10,
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
  );

  return (
    <div style={{ minHeight: '100vh' }}>
      <style>{`
        .mobile-only { display: block; }
        .desktop-layout { display: none !important; }

        @media (min-width: 768px) {
          .mobile-only { display: none !important; }
          .desktop-layout { display: flex !important; }
          .login-left {
            width: 42%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 40px;
            background: linear-gradient(135deg, #f0faf5 0%, #ffffff 60%, #f0f4ff 100%);
            position: relative;
            overflow: hidden;
          }
          .login-right { padding: 48px !important; }
        }

        @media (min-width: 1024px) {
          .login-left { width: 40%; padding: 56px; }
          .login-right { padding: 64px !important; }
        }

        input::placeholder { color: rgba(255,255,255,.25); }
        .input-light::placeholder { color: #9CA3AF !important; }
        .login-btn:hover { opacity: .9; }
        .login-btn:active { transform: scale(.98); }
      `}</style>

      {/* ── MOBILE ── */}
      <div className="mobile-only">
        {mobileStep === 'welcome' ? <MobileWelcome /> : <MobileForm />}
      </div>

      {/* ── TABLET + DESKTOP ── */}
      <div className="desktop-layout" style={{
        flexDirection: 'row', minHeight: '100vh',
      }}>
        {/* LADO ESQUERDO */}
        <div className="login-left">
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

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: '#1D9E75',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
            }}>🎓</div>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#111827', fontFamily: 'Syne, sans-serif' }}>
              Edukira<span style={{ color: '#1D9E75' }}>.</span>
            </span>
          </div>

          <div style={{ position: 'relative' }}>
            <h1 style={{
              fontSize: 30, fontWeight: 800, color: '#111827',
              lineHeight: 1.2, marginBottom: 12, fontFamily: 'Syne, sans-serif',
            }}>
              Votre école digitalisée.<br />
              <span style={{ color: '#1D9E75' }}>Zéro papier. Zéro stress.</span>
            </h1>
            <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7, marginBottom: 24 }}>
              Élèves, notes, présences et paiements<br />dans une seule plateforme.
            </p>

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

        {/* LADO DIREITO */}
        <div className="login-right" style={{
          flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '40px',
          background: 'linear-gradient(145deg, #071430 0%, #0B2254 50%, #0E1B3D 100%)',
          position: 'relative', overflow: 'hidden',
        }}>
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

          <div style={{ maxWidth: 400, width: '100%', margin: '0 auto', position: 'relative' }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
              Bon retour 👋
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,.5)', marginBottom: 32 }}>
              Connectez-vous à votre espace école
            </p>

            {error && (
              <div style={{
                marginBottom: 16, padding: '12px 14px', borderRadius: 10,
                background: 'rgba(220,38,38,.15)', border: '0.5px solid rgba(220,38,38,.3)',
                color: '#FCA5A5', fontSize: 14,
              }}>⚠️ {error}</div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={labelStyle(true)}>Email</label>
                <input type="email" name="email" value={form.email}
                  onChange={handleChange} placeholder="directeur@ecole.sn"
                  required style={inputStyle(true)} />
              </div>
              <div>
                <label style={labelStyle(true)}>Mot de passe</label>
                <input type="password" name="password" value={form.password}
                  onChange={handleChange} placeholder="••••••••"
                  required style={inputStyle(true)} />
              </div>
              <div>
                <label style={labelStyle(true)}>ID de l'école</label>
                <input type="text" name="schoolId" value={form.schoolId}
                  onChange={handleChange} placeholder="97c55f47-71e1-443d-..."
                  required style={{ ...inputStyle(true), fontFamily: 'monospace', fontSize: 12 }} />
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,.25)', marginTop: 5 }}>
                  Disponible dans votre email d'activation
                </p>
              </div>

              <button type="submit" disabled={loading} className="login-btn" style={{
                width: '100%', padding: 15, borderRadius: 12, border: 'none',
                background: loading ? '#6B7280' : '#1D9E75',
                color: '#fff', fontSize: 16, fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all .2s', fontFamily: 'DM Sans, sans-serif', marginTop: 4,
              }}>
                {loading ? '⏳ Connexion...' : '🔐 Se connecter'}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,.4)', marginTop: 24 }}>
              Pas encore de compte ?{' '}
              <Link to="/register" style={{ color: '#1D9E75', fontWeight: 600, textDecoration: 'none' }}>
                Inscrire votre école →
              </Link>
            </p>

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