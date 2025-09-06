
import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function ProfilePage() {
  const [p, setP] = useState(null);
  const [demo, setDemo] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get('demo')) {
      setDemo(true);
      setP({
        id: 123456,
        first_name: 'Spectra',
        last_name: 'User',
        username: 'spectra_demo',
        photo_url: '/placeholder.png'
      });
      return;
    }
    const stored = sessionStorage.getItem('profile');
    if (stored) setP(JSON.parse(stored));
  }, []);

  if (!p) {
    return (
      <div className="container">
        <div className="card">
          <div>Нет данных профиля. Вернитесь на главную.</div>
        </div>
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
        <div className="card">
          <div className="header">
            <img className="avatar" src={avatar} alt="avatar" />
            <div>
              <h2 className="title">{name}</h2>
              <div className="subtitle">{at}</div>
            </div>
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
