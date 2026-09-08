/*
  MatematikaPakADe — db.js (versi backend sungguhan)
  ---------------------------------------------------
  Versi ini memanggil API serverless di /api/* (dijalankan di Vercel),
  yang tersambung ke database Postgres di Neon. Data siswa, ujian, dan
  hasil kini tersimpan di server sungguhan — bukan lagi di localStorage
  browser — sehingga guru dan siswa bisa saling melihat data yang sama
  dari perangkat mana pun, selama mengakses domain Vercel yang sama.

  Nama & bentuk setiap fungsi di sini SAMA PERSIS dengan versi
  sebelumnya, jadi siswa.html dan guru.html tidak perlu diubah sama
  sekali.
*/

const DB = (() => {
  async function api(path, opts = {}) {
    const res = await fetch('/api/' + path, {
      headers: { 'Content-Type': 'application/json' },
      ...opts,
    });
    if (!res.ok) {
      let message = 'Permintaan gagal (' + res.status + ')';
      try {
        const body = await res.json();
        if (body && body.error) message = body.error;
      } catch (e) {}
      throw new Error(message);
    }
    if (res.status === 204) return null;
    return res.json();
  }

  return {
    // ---------------- Guru (Teacher) auth ----------------
    async teacherLogin(code) {
      const { ok } = await api('teacher-login', {
        method: 'POST',
        body: JSON.stringify({ code }),
      });
      if (ok) sessionStorage.setItem('mpa_teacher', '1');
      return ok;
    },
    isTeacher() {
      return sessionStorage.getItem('mpa_teacher') === '1';
    },
    teacherLogout() {
      sessionStorage.removeItem('mpa_teacher');
    },

    // ---------------- Siswa (Student) ----------------
    async registerStudent(nama, kelas) {
      const student = await api('students', {
        method: 'POST',
        body: JSON.stringify({ nama, kelas }),
      });
      sessionStorage.setItem('mpa_student', JSON.stringify(student));
      return student;
    },
    currentStudent() {
      const raw = sessionStorage.getItem('mpa_student');
      return raw ? JSON.parse(raw) : null;
    },
    studentLogout() {
      sessionStorage.removeItem('mpa_student');
    },
    async getStudents() {
      return api('students');
    },

    // ---------------- Ujian / CBT (Tests) ----------------
    async createTest(test) {
      return api('tests', { method: 'POST', body: JSON.stringify(test) });
    },
    async getPublishedTests() {
      return api('tests?published=1');
    },
    async getAllTests() {
      return api('tests');
    },
    async getTestById(id) {
      return api('tests/' + encodeURIComponent(id));
    },
    async deleteTest(id) {
      return api('tests/' + encodeURIComponent(id), { method: 'DELETE' });
    },
    async setTestPublished(id, published) {
      return api('tests/' + encodeURIComponent(id), {
        method: 'PATCH',
        body: JSON.stringify({ published }),
      });
    },

    // ---------------- Hasil Ujian (Results) ----------------
    async saveResult(result) {
      return api('results', { method: 'POST', body: JSON.stringify(result) });
    },
    async getResultsForTest(testId) {
      return api('results?testId=' + encodeURIComponent(testId));
    },
    async getResultsForStudent(studentId) {
      return api('results?studentId=' + encodeURIComponent(studentId));
    },
    async getAllResults() {
      return api('results');
    },
  };
})();
