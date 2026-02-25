const express = require('express');
const mysql = require('mysql2/promise');
const app = express();

// Set EJS sebagai template engine
app.set('view engine', 'ejs');
// Middleware untuk membaca data dari form
app.use(express.urlencoded({ extended: true }));

// Koneksi Database (tanpa password karena Laragon baru di-install ulang)
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'kampus'
});

// READ
app.get('/', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM mahasiswa ORDER BY id DESC');
    res.render('index', { mahasiswa: rows });
});

// CREATE
app.get('/tambah', (req, res) => res.render('tambah'));
app.post('/tambah', async (req, res) => {
    const { npm, nama, jurusan } = req.body;
    await pool.query('INSERT INTO mahasiswa (npm, nama, jurusan) VALUES (?, ?, ?)', [npm, nama, jurusan]);
    res.redirect('/');
});

// UPDATE
app.get('/edit/:id', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM mahasiswa WHERE id = ?', [req.params.id]);
    res.render('edit', { data: rows[0] });
});
app.post('/edit/:id', async (req, res) => {
    const { npm, nama, jurusan } = req.body;
    await pool.query('UPDATE mahasiswa SET npm = ?, nama = ?, jurusan = ? WHERE id = ?', [npm, nama, jurusan, req.params.id]);
    res.redirect('/');
});

// DELETE
app.get('/hapus/:id', async (req, res) => {
    await pool.query('DELETE FROM mahasiswa WHERE id = ?', [req.params.id]);
    res.redirect('/');
});

app.listen(3000, () => {
    console.log('Server berjalan di http://localhost:3000');
});