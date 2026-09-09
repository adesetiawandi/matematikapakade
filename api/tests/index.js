// GET  /api/tests            -> semua ujian (untuk dashboard guru)
// GET  /api/tests?published=1 -> hanya ujian yang diterbitkan (untuk siswa)
// POST /api/tests {title, duration, questionIds[]} -> buat & terbitkan ujian baru

const { sql, genId } = require('../_db');

module.exports = async function handler(req, res) {
  const db = sql();

  if (req.method === 'GET') {
    const publishedOnly = req.query.published === '1';
    const rows = publishedOnly
      ? await db`SELECT * FROM tests WHERE published = true ORDER BY created_at DESC`
      : await db`SELECT * FROM tests ORDER BY created_at DESC`;
    return res.status(200).json(rows.map(mapTest));
  }

  if (req.method === 'POST') {
    const { title, duration, questionIds } = req.body || {};
    if (!title || !Array.isArray(questionIds) || questionIds.length === 0) {
      return res.status(400).json({ error: 'title dan questionIds (minimal 1) wajib diisi' });
    }
    const id = genId();
    const createdAt = Date.now();
    const dur = Number(duration) || 30;
    await db`
      INSERT INTO tests (id, title, duration, question_ids, published, created_at)
      VALUES (${id}, ${title}, ${dur}, ${JSON.stringify(questionIds)}, true, ${createdAt})
    `;
    return res.status(201).json({ id, title, duration: dur, questionIds, published: true, createdAt });
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
