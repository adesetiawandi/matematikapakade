// POST /api/teacher-login  body: { code: string }  ->  { ok: boolean }
// Kode akses dicek di server (bukan di JS frontend) agar lebih aman.
// Bisa diganti tanpa redeploy kode: cukup ubah Environment Variable TEACHER_CODE.

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { code } = req.body || {};
  const TEACHER_CODE = process.env.TEACHER_CODE || 'akuguru2026';
  const ok = typeof code === 'string' && code === TEACHER_CODE;
  return res.status(200).json({ ok });
};
