// GET  /api/students            -> daftar semua siswa (terbaru dulu)
// POST /api/students  {nama, kelas} -> daftarkan siswa baru (atau kembalikan yang sudah ada)

const { sql, genId } = require('./_db');

module.exports = async function handler(req, res) {
  const db = sql();

  if (req.method === 'GET') {
    const rows = await db`SELECT * FROM students ORDER BY created_at DESC`;
    return res.status(200).json(rows.map(mapStudent));
  }

  if (req.method === 'POST') {
    const { nama, kelas } = req.body || {};
    if (!nama || !kelas) {
      return res.status(400).json({ error: 'nama dan kelas wajib diisi' });
    }
    const existing = await db`
      SELECT * FROM students
      WHERE lower(nama) = lower(${nama}) AND lower(kelas) = lower(${kelas})
      LIMIT 1
    `;
    if (existing.length) {
      return res.status(200).json(mapStudent(existing[0]));
    }
    const id = genId();
    const createdAt = Date.now();
    await db`
      INSERT INTO students (id, nama, kelas, created_at)
      VALUES (${id}, ${nama}, ${kelas}, ${createdAt})
    `;
    return res.status(201).json({ id, nama, kelas, createdAt });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};

function mapStudent(r) {
  return { id: r.id, nama: r.nama, kelas: r.kelas, createdAt: Number(r.created_at) };
}
