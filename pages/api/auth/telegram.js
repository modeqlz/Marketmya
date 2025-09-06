
import { validateInitData, parseInitData } from '../../../../lib/verifyTelegramAuth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }
  try {
    const { initData } = req.body || {};
    const BOT_TOKEN = process.env.BOT_TOKEN;
    const result = validateInitData(initData, BOT_TOKEN);
    if (!result.ok) return res.status(401).json({ ok: false, error: result.reason || 'Invalid initData' });

    const parsed = parseInitData(initData);
    const user = parsed.user ? JSON.parse(parsed.user) : null;
    const profile = user ? {
      id: user.id,
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      username: user.username || '',
      photo_url: user.photo_url || ''
    } : null;

    return res.status(200).json({ ok: true, profile });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
}
