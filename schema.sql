-- Jalankan seluruh isi file ini SATU KALI di Neon SQL Editor
-- (Neon Console -> project kamu -> "SQL Editor") sebelum deploy ke Vercel.

CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  nama TEXT NOT NULL,
  kelas TEXT NOT NULL,
  created_at BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS tests (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  duration INT NOT NULL,
  question_ids JSONB NOT NULL,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS results (
  id TEXT PRIMARY KEY,
  test_id TEXT NOT NULL,
  test_title TEXT NOT NULL,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  student_class TEXT NOT NULL,
  score INT NOT NULL,
  total INT NOT NULL,
  auto BOOLEAN NOT NULL DEFAULT false,
  answers JSONB NOT NULL,
  submitted_at BIGINT NOT NULL
);

-- Index bantu supaya query dashboard guru & riwayat siswa lebih cepat
CREATE INDEX IF NOT EXISTS idx_results_test_id ON results (test_id);
CREATE INDEX IF NOT EXISTS idx_results_student_id ON results (student_id);
