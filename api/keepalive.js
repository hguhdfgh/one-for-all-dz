// Daily ping so the free Supabase project never pauses for inactivity.
export default async function handler(req, res) {
  try {
    const r = await fetch('https://fvuowkqyrugygcrvkwwp.supabase.co/rest/v1/settings?select=key&is_public=eq.true&limit=1', {
      headers: { apikey: 'sb_publishable_iBRUEPugJshK4s5fytF7Tg_AUry3L7Z' },
    });
    res.status(200).json({ ok: r.ok, status: r.status, at: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
}
