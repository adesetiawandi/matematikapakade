// Lapisan koneksi database bersama untuk semua route di /api.
// Menggunakan driver @neondatabase/serverless (HTTP-based, cocok untuk
// serverless function Vercel — tidak perlu connection pooling manual).

const { neon } = require('@neondatabase/serverless');

let client;

function sql() {
  if (!client) {
    if (!process.env.DATABASE_URL) {
      throw new Error(
        'DATABASE_URL belum diset. Tambahkan Environment Variable DATABASE_URL ' +
        '(connection string dari Neon) di pengaturan project Vercel.'
      );
    }
    client = neon(process.env.DATABASE_URL);
  }
  return client;
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

module.exports = { sql, genId };
