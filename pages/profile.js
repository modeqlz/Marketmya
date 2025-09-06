import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function ProfilePage() {
  const [p, setP] = useState(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get('demo')) {
      setP({
        id: 123456,
        first_name: 'Spectra',
        last_name: 'User',
        username: 'spectra_demo',
        photo_url: '/placeholder.png'
      });
      return;
    }
    try {
      // 👉 читаем из localStorage
      const stored = localStorage.getItem('profile');
      if (stored) {
        setP(JSON.parse(stored));
      } else {
        // если профиля нет — уводим на главную
        window.location.replace('/');
      }
    } catch {
      window.location.replace('/');
    }
  }, []);

  function handleLogout() {
    try {
      localStorage.removeItem('profile');
      sessionStorage.removeItem('profile'); // на всякий случай
    } catch {}
    // можно закрыть мини-апку или просто вернуться на главную
    const tg = window.Telegram?.WebApp;
    if (tg && tg.close) {
      // если хочешь полностью закрыть мини-апку:
      // tg.close();
      // но обычно лучше вернуться на старт
      window.location.href = '/';
    } else {
      window.location.href = '/';
    }
  }

  if (!p) {
    return (
      <div className="container">
        <div className="card">Загружаем профиль…</div>
      </div>
    );
  }

  const name = [p.first_name, p.last_name].filter(Boolean).join(' ') || 'Без имени';
  const at = p.username ? '@' + p.username : 'без username';
  const avatar = p.photo_url || '/placeholder.png';

  return (
    <>
      <Head><title>Профиль — Spectra Market</title></Head>
      <div className="container">
        <div className="card" style={{maxWidth: 560}}>
          <div className="header" style={{justifyContent:'space-between'}}>
            <div style={{display:'flex', alignItems:'center', gap:14}}>
              <img className="avatar" src={avatar} alt="avatar" />
              <div>
                <h2 className="title">{name}</h2>
                <div className="subtitle">{at}</div>
              </div>
            </div>
            {/* Кнопка выхода в стиле UI */}
            <button
              className="btn"
              onClick={handleLogout}
              style={{
                background:'rgba(255,255,255,.02)',
                border:'1px solid rgba(255,255,255,.14)',
                padding:'10px 14px',
                borderRadius:12,
                fontWeight:800
              }}
              aria-label="Выйти из учётной записи"
            >
              Выйти
            </button>
          </div>

          <div style={{marginTop:16, opacity:.85, fontSize:14}}>
            <div><b>ID:</b> {p.id}</div>
            <div><b>Источник:</b> Telegram WebApp</div>
          </div>
        </div>
      </div>
    </>
  );
}
