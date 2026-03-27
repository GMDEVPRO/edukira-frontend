import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import useAuthStore from '../../store/authStore';

export default function Dashboard() {
  const navigate = useNavigate();
  const { school, user, logout } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/v1/dashboard')
      .then(({ data }) => setStats(data.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  const statCards = [
    { icon: '👨‍🎓', val: stats?.schoolStats?.totalStudents ?? 0,    lbl: 'Élèves actifs',    trend: '+12 ce mois', trendUp: true,  bg: '#EBF2FF' },
    { icon: '💰',   val: stats?.financialStats?.monthlyRevenue ?? 0, lbl: 'Revenus (FCFA)',   trend: '87% collecté', trendUp: true,  bg: '#E1F5EE' },
    { icon: '📝',   val: stats?.academicStats?.averageGrade ?? 0,    lbl: 'Moyenne générale', trend: '+0,3 bim.1',  trendUp: true,  bg: '#FEF3C7' },
    { icon: '⚠️',   val: stats?.financialStats?.overdueCount ?? 0,   lbl: 'Impayés',          trend: '7% en retard', trendUp: false, bg: '#FEE2E2' },
  ];

  const navItems = [
    { icon: '📊', label: 'Dashboard',   path: '/dashboard' },
    { icon: '👨‍🎓', label: 'Élèves',     path: '/students' },
    { icon: '✅', label: 'Présences',   path: '/attendance' },
    { icon: '📝', label: 'Notes',       path: '/grades' },
    { icon: '💳', label: 'Paiements',   path: '/payments' },
    { icon: '💬', label: 'Messages',    path: '/messages' },
    { icon: '🛒', label: 'Marketplace', path: '/marketplace' },
    { icon: '🏆', label: 'Classement',  path: '/rankings' },
  ];

  const bottomNav = [
    { icon: '📊', label: 'Dashboard',  path: '/dashboard' },
    { icon: '👨‍🎓', label: 'Élèves',    path: '/students' },
    { icon: '💳', label: 'Paiements',  path: '/payments' },
    { icon: '📝', label: 'Notes',      path: '/grades' },
    { icon: '⋯',  label: 'Plus',       path: '/more' },
  ];

  const recentPayments = [
    { name: 'Aminata Diallo', amount: '25 000 FCFA', method: 'Wave',   status: 'PAID' },
    { name: 'Moussa Traoré',  amount: '25 000 FCFA', method: 'Orange', status: 'PENDING' },
    { name: 'Fatou Konaté',   amount: '25 000 FCFA', method: 'Manuel', status: 'OVERDUE' },
    { name: 'Ibrahim Sow',    amount: '25 000 FCFA', method: 'Wave',   status: 'PAID' },
  ];

  const statusBadge = (s) => {
    const map = {
      PAID:    { bg: '#E1F5EE', color: '#065F46', label: 'Payé' },
      PENDING: { bg: '#FEF3C7', color: '#92400E', label: 'Attente' },
      OVERDUE: { bg: '#FEE2E2', color: '#991B1B', label: 'Retard' },
    };
    const b = map[s] || map.PENDING;
    return <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 600, background: b.bg, color: b.color }}>{b.label}</span>;
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'DM Sans, sans-serif' }}>
      <style>{`
        .dash-sidebar { display: none; }
        .dash-sidebar-icons { display: none; }
        .dash-bottomnav { display: flex; }

        @media (min-width: 768px) {
          .dash-sidebar-icons {
            display: flex !important;
            flex-direction: column;
            align-items: center;
            width: 72px;
            background: #0B1E42;
            padding: 14px 0;
            gap: 6px;
          }
          .dash-bottomnav { display: none !important; }
        }

        @media (min-width: 1024px) {
          .dash-sidebar { display: flex !important; }
          .dash-sidebar-icons { display: none !important; }
        }

        .nav-item-desk:hover { background: rgba(255,255,255,.08) !important; }
        .stat-card:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,.06); }
        .stat-card { transition: all .2s; }
      `}</style>

      {/* ════════════════════
          SIDEBAR — desktop
      ════════════════════ */}
      <div className="dash-sidebar" style={{
        width: 240, background: '#0B1E42', flexDirection: 'column',
        padding: 20, gap: 4, position: 'fixed', top: 0, left: 0,
        height: '100vh', zIndex: 100,
      }}>
        {/* logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0 24px' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#1D9E75', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>🎓</div>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>Edukira<span style={{ color: '#1D9E75' }}>.</span></span>
        </div>

        {/* nav items */}
        {navItems.map((item) => (
          <Link key={item.path} to={item.path} className="nav-item-desk" style={{
            display: 'flex', alignItems: 'center', gap: 11, padding: '11px 12px',
            borderRadius: 10, textDecoration: 'none',
            background: item.path === '/dashboard' ? '#1D9E75' : 'transparent',
          }}>
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            <span style={{ fontSize: 13, color: item.path === '/dashboard' ? '#fff' : 'rgba(255,255,255,.6)', fontWeight: item.path === '/dashboard' ? 600 : 500 }}>
              {item.label}
            </span>
          </Link>
        ))}

        {/* escola */}
        <div style={{ marginTop: 'auto', background: 'rgba(255,255,255,.06)', borderRadius: 10, padding: 12 }}>
          <div style={{ fontSize: 11, color: '#fff', fontWeight: 600, marginBottom: 3 }}>
            {school?.name || 'Escola'}
          </div>
          <div style={{ fontSize: 10, color: '#1D9E75' }}>✦ Plan Pro · {school?.country || 'SEN'}</div>
        </div>

        {/* logout */}
        <button onClick={handleLogout} style={{
          marginTop: 10, width: '100%', padding: '10px', borderRadius: 10,
          background: 'rgba(220,38,38,.15)', border: '0.5px solid rgba(220,38,38,.3)',
          color: '#FCA5A5', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          fontFamily: 'DM Sans, sans-serif',
        }}>
          🚪 Se déconnecter
        </button>
      </div>

      {/* ════════════════════
          SIDEBAR ICONS — tablet
      ════════════════════ */}
      <div className="dash-sidebar-icons" style={{ position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: '#1D9E75', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, marginBottom: 14 }}>🎓</div>
        {navItems.map((item) => (
          <Link key={item.path} to={item.path} style={{
            width: 44, height: 44, borderRadius: 10, display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: 18,
            background: item.path === '/dashboard' ? '#1D9E75' : 'transparent',
            textDecoration: 'none',
          }}>
            {item.icon}
          </Link>
        ))}
        <button onClick={handleLogout} style={{
          marginTop: 'auto', marginBottom: 14, width: 44, height: 44,
          borderRadius: 10, background: 'rgba(220,38,38,.15)',
          border: 'none', cursor: 'pointer', fontSize: 18,
        }}>🚪</button>
      </div>

      {/* ════════════════════
          MAIN CONTENT
      ════════════════════ */}
      <div className="dash-main" style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        marginLeft: 0, paddingBottom: 70,
        background: '#F4F7F5',
      }}>
        <style>{`
          @media (min-width: 768px) { .dash-main { margin-left: 72px !important; padding-bottom: 0 !important; } }
          @media (min-width: 1024px) { .dash-main { margin-left: 240px !important; } }
        `}</style>

        {/* ── TOPBAR ── */}
        <div style={{
          background: '#fff', padding: '14px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '0.5px solid #E5EDE9', position: 'sticky', top: 0, zIndex: 50,
        }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>
              Bonjour, {user?.role === 'SCHOOL_ADMIN' ? 'Directeur' : 'Professeur'} 👋
            </div>
            <div style={{ fontSize: 12, color: '#6B7280', textTransform: 'capitalize' }}>{today}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: '#F4F7F5', border: '0.5px solid #E5EDE9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🔔</div>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: '#F4F7F5', border: '0.5px solid #E5EDE9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>⚙️</div>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1D9E75', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#fff', fontWeight: 700 }}>
              {school?.name?.[0] || 'E'}
            </div>
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div style={{ padding: '20px 24px', flex: 1 }}>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 60, color: '#6B7280' }}>
              ⏳ Chargement...
            </div>
          ) : (
            <>
              {/* ── STAT CARDS ── */}
              <div style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 14 }}>
                Vue d'ensemble
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginBottom: 22 }}>
                <style>{`
                  @media (min-width: 1024px) {
                    .stats-grid { grid-template-columns: repeat(4, 1fr) !important; }
                  }
                `}</style>
                {statCards.map((s) => (
                  <div key={s.lbl} className="stat-card" style={{
                    background: '#fff', borderRadius: 14, padding: 18,
                    border: '0.5px solid #E5EDE9',
                  }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, marginBottom: 12 }}>
                      {s.icon}
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 700, color: '#111827', marginBottom: 3 }}>{s.val}</div>
                    <div style={{ fontSize: 12, color: '#6B7280' }}>{s.lbl}</div>
                    <div style={{ fontSize: 12, marginTop: 7, fontWeight: 600, color: s.trendUp ? '#059669' : '#DC2626' }}>
                      {s.trendUp ? '↑' : '↓'} {s.trend}
                    </div>
                  </div>
                ))}
              </div>

              {/* ── GRÁFICOS — desktop ── */}
              <style>{`
                .charts-row { display: none; }
                @media (min-width: 1024px) { .charts-row { display: grid !important; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 22px; } }
              `}</style>
              <div className="charts-row">
                <div style={{ background: '#fff', borderRadius: 14, padding: 18, border: '0.5px solid #E5EDE9' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 16 }}>Paiements par mois (FCFA ×1000)</div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 7, height: 100 }}>
                    {[
                      { h: 50, lbl: 'Oct' }, { h: 65, lbl: 'Nov' }, { h: 45, lbl: 'Déc' },
                      { h: 75, lbl: 'Jan' }, { h: 60, lbl: 'Fév' }, { h: 100, lbl: 'Mar', active: true },
                    ].map((b) => (
                      <div key={b.lbl} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                        <div style={{ width: '100%', height: b.h, borderRadius: '5px 5px 0 0', background: b.active ? '#0B1E42' : '#1D9E75', opacity: b.active ? 1 : 0.6 }} />
                        <span style={{ fontSize: 10, color: '#9CA3AF' }}>{b.lbl}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ background: '#fff', borderRadius: 14, padding: 18, border: '0.5px solid #E5EDE9' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 16 }}>Taux de présence aujourd'hui</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'conic-gradient(#1D9E75 0deg 230deg, #E5EDE9 230deg 360deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', flexShrink: 0 }}>
                      <div style={{ position: 'absolute', width: 62, height: 62, borderRadius: '50%', background: '#fff' }} />
                      <span style={{ fontSize: 15, fontWeight: 700, color: '#111827', position: 'relative', zIndex: 1 }}>
                        {stats?.attendanceStats?.todayRate ?? 64}%
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {[
                        { color: '#1D9E75', label: 'Présents',  val: 158 },
                        { color: '#E5EDE9', label: 'Absents',   val: stats?.attendanceStats?.absentToday ?? 89 },
                        { color: '#F59E0B', label: 'En retard', val: 12 },
                      ].map((d) => (
                        <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                          <div style={{ width: 9, height: 9, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                          <span style={{ fontSize: 13, color: '#6B7280' }}>{d.label} — {d.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── TABELA ── */}
              <div style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 12 }}>
                Derniers paiements
              </div>

              <style>{`
                .payments-mobile { display: flex; flex-direction: column; gap: 9px; }
                .payments-table  { display: none; }
                @media (min-width: 768px) {
                  .payments-mobile { display: none !important; }
                  .payments-table  { display: block !important; }
                }
              `}</style>

              <div className="payments-mobile">
                {recentPayments.map((p) => (
                  <div key={p.name} style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', border: '0.5px solid #E5EDE9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 3 }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: '#6B7280' }}>{p.amount} · {p.method}</div>
                    </div>
                    {statusBadge(p.status)}
                  </div>
                ))}
              </div>

              <div className="payments-table" style={{ background: '#fff', borderRadius: 14, border: '0.5px solid #E5EDE9', overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '0.5px solid #F0F0F0' }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Derniers paiements</span>
                  <span style={{ fontSize: 13, color: '#1D9E75', fontWeight: 500, cursor: 'pointer' }}>Voir tout →</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '9px 20px', background: '#F9FBFA' }}>
                  {['ÉLÈVE', 'MONTANT', 'MÉTHODE', 'STATUT'].map((h) => (
                    <span key={h} style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.3px' }}>{h}</span>
                  ))}
                </div>
                {recentPayments.map((p) => (
                  <div key={p.name} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '12px 20px', borderBottom: '0.5px solid #F9F9F9', alignItems: 'center' }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{p.name}</span>
                    <span style={{ fontSize: 13, color: '#6B7280' }}>{p.amount}</span>
                    <span style={{ fontSize: 13, color: '#6B7280' }}>{p.method}</span>
                    {statusBadge(p.status)}
                  </div>
                ))}
              </div>

              {/* ── ALERTAS ── */}
              <style>{`
                .alerts-row { display: flex; flex-direction: column; gap: 10px; margin-top: 18px; }
                @media (min-width: 768px) { .alerts-row { flex-direction: row !important; } }
              `}</style>
              <div className="alerts-row">
                <div style={{ flex: 1, background: '#FEF3C7', border: '0.5px solid #FDE68A', borderRadius: 12, padding: '14px 16px', display: 'flex', gap: 12 }}>
                  <span style={{ fontSize: 20 }}>⚠️</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#92400E', marginBottom: 3 }}>
                      {stats?.financialStats?.overdueCount ?? 18} paiements en retard
                    </div>
                    <div style={{ fontSize: 12, color: '#92400E', opacity: .7 }}>Envoyer rappel par SMS/WhatsApp</div>
                  </div>
                </div>
                <div style={{ flex: 1, background: '#EBF2FF', border: '0.5px solid #BFDBFE', borderRadius: 12, padding: '14px 16px', display: 'flex', gap: 12 }}>
                  <span style={{ fontSize: 20 }}>🏆</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1E40AF', marginBottom: 3 }}>Classement national mis à jour</div>
                    <div style={{ fontSize: 12, color: '#1E40AF', opacity: .7 }}>Votre école est #12 au Sénégal</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ════════════════════
          BOTTOM NAV — mobile
      ════════════════════ */}
      <div className="dash-bottomnav" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#fff', borderTop: '0.5px solid #E5EDE9',
        justifyContent: 'space-around', padding: '10px 0', zIndex: 100,
      }}>
        {bottomNav.map((item) => (
          <Link key={item.path} to={item.path} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 3, textDecoration: 'none',
          }}>
            <span style={{ fontSize: 22 }}>{item.icon}</span>
            <span style={{ fontSize: 10, color: item.path === '/dashboard' ? '#1D9E75' : '#9CA3AF', fontWeight: item.path === '/dashboard' ? 600 : 400 }}>
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
