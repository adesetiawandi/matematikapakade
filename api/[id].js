// GET    /api/tests/:id            -> detail satu ujian
// PATCH  /api/tests/:id {published} -> terbitkan / sembunyikan ujian
// DELETE /api/tests/:id             -> hapus ujian

const { sql } = require('../_db');

module.exports = async function handler(req, res) {
  const db = sql();
  const { id } = req.query;

  if (req.method === 'GET') {
    const rows = await db`SELECT * FROM tests WHERE id = ${id} LIMIT 1`;
    if (!rows.length) return res.status(404).json({ error: 'Ujian tidak ditemukan' });
    return res.status(200).json(mapTest(rows[0]));
  }

  if (req.method === 'PATCH') {
    const { published } = req.body || {};
    await db`UPDATE tests SET published = ${!!published} WHERE id = ${id}`;
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'DELETE') {
    await db`DELETE FROM tests WHERE id = ${id}`;
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};

function mapTest(r) {
  return {
    id: r.id,
    title: r.title,
    duration: r.duration,
    questionIds: r.question_ids,
    published: r.published,
    createdAt: Number(r.created_at),
  };
}
