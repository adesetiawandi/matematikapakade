// GET  /api/results?testId=xxx     -> hasil untuk satu ujian (dashboard guru)
// GET  /api/results?studentId=xxx  -> riwayat nilai satu siswa
// POST /api/results {...}          -> simpan hasil ujian siswa

const { sql, genId } = require('./_db');

module.exports = async function handler(req, res) {
  const db = sql();

  if (req.method === 'GET') {
    const { testId, studentId } = req.query;
    let rows;
    if (testId) {
      rows = await db`SELECT * FROM results WHERE test_id = ${testId} ORDER BY submitted_at DESC`;
    } else if (studentId) {
      rows = await db`SELECT * FROM results WHERE student_id = ${studentId} ORDER BY submitted_at DESC`;
    } else {
      rows = await db`SELECT * FROM results ORDER BY submitted_at DESC`;
    }
    return res.status(200).json(rows.map(mapResult));
  }

  if (req.method === 'POST') {
    const b = req.body || {};
    const required = ['testId', 'testTitle', 'studentId', 'studentName', 'studentClass', 'score', 'total', 'answers'];
    for (const k of required) {
      if (b[k] === undefined) return res.status(400).json({ error: `${k} wajib diisi` });
    }
    const id = genId();
    const submittedAt = Date.now();
    await db`
      INSERT INTO results
        (id, test_id, test_title, student_id, student_name, student_class, score, total, auto, answers, submitted_at)
      VALUES
        (${id}, ${b.testId}, ${b.testTitle}, ${b.studentId}, ${b.studentName}, ${b.studentClass},
         ${b.score}, ${b.total}, ${!!b.auto}, ${JSON.stringify(b.answers)}, ${submittedAt})
    `;
    return res.status(201).json({ id, submittedAt, ...b });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};

function mapResult(r) {
  return {
    id: r.id,
    testId: r.test_id,
    testTitle: r.test_title,
    studentId: r.student_id,
    studentName: r.student_name,
    studentClass: r.student_class,
    score: r.score,
    total: r.total,
    auto: r.auto,
    answers: r.answers,
    submittedAt: Number(r.submitted_at),
  };
}
