import { useEffect, useState } from 'react';
import Head from 'next/head';
import LoadingCard from '../components/LoadingCard'; // ⬅ добавили лоадер

export default function IndexPage() {
  const [insideTelegram, setInsideTelegram] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const tg = typeof window !== 'undefined' ? window.Telegram?.WebApp : null;
    if (tg) {
      setInsideTelegram(true);
      tg.ready();
      tg.expand();
    }
  }, []);

  // обработчик кнопки
  async function handleContinue() {
    setError(null);
    setBusy(true);
    try {
      const tg = window.Telegram?.WebApp;

      // 1) Не мини-апка
      if (!tg) {
        setError('Открой мини-апку из Telegram (кнопка «Открыть» в чате бота).');
        return;
      }

      // 2) Нет initData
      const initData = tg.initData || '';
      if (!initData) {
        setError('Telegram не передал initData. Нажми ⋯ и выбери «Обновить страницу», затем попробуй снова.');
        return;
      }

      // 3) Верификация на сервере
      const res = await fetch('/api/auth/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData })
      }).then(r => r.json());

      if (res.ok) {
        sessionStorage.setItem('profile', JSON.stringify(res.profile || null));
        window.location.href = '/profile';
      } else {
        setError(res.error || 'Не удалось пройти проверку Telegram.');
      }
    } catch {
      setError('Сетевая ошибка. Проверь соединение и попробуй снова.');
    } finally {
      setBusy(false); // лоадер скрываем после завершения
    }
  }

  return (
    <>
      <Head><title>Spectra Market — Вход через Telegram</title></Head>
      <div className="container">
        <div className="hero">
          <div className="brand">
            <img src="/plane.svg" alt="" width="18" height="18" />
            <span>Spectra Market</span>
          </div>

          <h1 className="h1">Заходи через Telegram</h1>
          <p className="lead">
            Моментальная авторизация без паролей. Мы получим только твои публичные данные Telegram
            (имя, юзернейм, аватар) — и создадим профиль.
          </p>

          <div className="row">
            <button className="btn btn-primary" onClick={handleContinue} disabled={busy}>
              <img src="/plane.svg" alt="" width="18" height="18" />
              {busy ? 'Проверяем…' : 'Continue'}
            </button>

            <a className="btn" href="https://t.me/" target="_blank" rel="noreferrer">
              Join our Telegram Community
            </a>
          </div>

          {/* Лоадер во время проверки */}
          {busy && (
            <div style={{ marginTop: 16 }}>
              <LoadingCard
                messages={[
                  'Считываем данные Telegram…',
                  'Проверяем подпись WebApp…',
                  'Создаём профиль…',
                  'Подгружаем аватар…'
                ]}
                intervalMs={900}
              />
            </div>
          )}

          <div className="foot">
            Продолжая, вы соглашаетесь с{' '}
            <a href="#" onClick={(e)=>e.preventDefault()}>Политикой конфиденциальности</a> и{' '}
            <a href="#" onClick={(e)=>e.preventDefault()}>Условиями сервиса</a>.
          </div>

          {error && <div className="foot" style={{ color: '#ffb4b4' }}>Ошибка: {error}</div>}
        </div>
      </div>
    </>
  );
}
