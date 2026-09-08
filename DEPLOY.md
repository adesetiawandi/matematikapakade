# Panduan Deploy — MatematikaPakADe LMS & CBT (Neon + Vercel)

Semua kode backend sudah siap pakai. Ikuti langkah berikut di akun Neon dan
Vercel **milikmu sendiri** (saya tidak punya akses ke akun kamu, jadi bagian
ini perlu dikerjakan manual — tapi cepat, sekitar 10 menit).

## 1. Buat database di Neon

1. Buka https://neon.tech → daftar/masuk (gratis).
2. Klik **New Project**, beri nama bebas (mis. `matematikapakade`).
3. Setelah project dibuat, buka **SQL Editor** di sidebar.
4. Salin seluruh isi file `schema.sql` dari paket ini, tempel di SQL Editor,
   lalu klik **Run**. Ini akan membuat tabel `students`, `tests`, `results`.
5. Buka **Connection Details** (atau **Dashboard** → *Connection string*),
   salin **connection string**-nya. Bentuknya seperti:
   ```
   postgresql://user:password@ep-xxxxxxxx.aws.neon.tech/neondb?sslmode=require
   ```
   Simpan ini — akan dipakai sebagai `DATABASE_URL` di langkah 3.

## 2. Unggah kode ke GitHub

1. Buat repository baru di https://github.com/new (boleh privat).
2. Unggah **semua file** dari paket ini ke repo tersebut, dengan struktur folder
   tetap seperti aslinya:
   ```
   /api/_db.js
   /api/teacher-login.js
   /api/students.js
   /api/results.js
   /api/tests/index.js
   /api/tests/[id].js
   index.html
   siswa.html
   guru.html
   db.js
   questions.js
   matematikapakade-geometri.html
   package.json
   schema.sql
   .env.example
   ```
   (Cara termudah: buat repo kosong di GitHub, lalu drag-and-drop semua file
   lewat menu "Add file → Upload files" di web GitHub — tidak perlu command
   line kalau tidak familiar dengan git.)

## 3. Deploy ke Vercel

1. Buka https://vercel.com → daftar/masuk (bisa pakai akun GitHub yang sama).
2. Klik **Add New → Project**, pilih repo GitHub yang baru kamu buat tadi,
   klik **Import**.
3. Di layar konfigurasi, buka bagian **Environment Variables**, tambahkan dua
   variabel ini:
   | Name | Value |
   |---|---|
   | `DATABASE_URL` | connection string dari Neon (langkah 1.5) |
   | `TEACHER_CODE` | `akuguru2026` (atau ganti sesukamu) |
4. Klik **Deploy**. Tunggu ±1 menit sampai selesai.
5. Vercel akan memberi URL seperti `https://matematikapakade-xxxx.vercel.app`
   — itulah alamat situs LMS & CBT kamu yang sudah live dengan database
   sungguhan.

## 4. Coba

- Buka URL Vercel → pilih **Saya Guru** → masukkan kode akses → buat ujian.
- Buka URL yang sama dari HP lain / browser lain → pilih **Saya Siswa** →
  login nama & kelas → ujian yang dibuat guru langsung muncul.
- Karena datanya sekarang di Neon (server sungguhan), ini akan tetap
  tersinkron walau diakses dari perangkat yang berbeda-beda.

## Mengganti kode akses guru nanti

Buka **Vercel → Project → Settings → Environment Variables**, ubah nilai
`TEACHER_CODE`, lalu **Redeploy** (tidak perlu mengubah kode sama sekali).

## Troubleshooting singkat

- **Error "DATABASE_URL belum diset"** → pastikan Environment Variable sudah
  ditambahkan di Vercel lalu redeploy.
- **Ujian tidak muncul di siswa** → cek tab **Daftar Ujian** di Portal Guru,
  pastikan statusnya "Diterbitkan".
- **Ingin reset semua data** → jalankan `TRUNCATE students, tests, results;`
  di Neon SQL Editor.
