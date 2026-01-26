const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
require('./cloudflared.js')
const app = express();
const PORT = 80

// Middleware biar bisa baca req.body
app.use(express.urlencoded({ extended: true }));

// Folder upload
const uploadDir = path.join(__dirname, "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi Multer (pakai customName + batasi panjang + anti duplikat)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    let ext = ''
    try{
        ext = path.extname(file.originalname).toLowerCase()
        }catch{
           ext = ".bin"
        }
    // Ambil custom name (kalau kosong pakai nama asli tanpa ekstensi)
    let base = (req.body.customName || path.basename(file.originalname, ext)).trim();

    // Normalisasi nama biar aman di URL
    base = base
      .toLowerCase()
      .replace(/\s+/g, "_")        // spasi -> _
      .replace(/[^a-z0-9_-]/g, ""); // buang karakter nyeleneh

    if (!base) base = "file";
    if (base.length > 50) base = base.slice(0, 50);

    let finalName = base + ext;
    let i = 1;
    while (fs.existsSync(path.join(uploadDir, finalName))) {
      finalName = `${base}_${i}${ext}`;
      i++;
    }
    cb(null, finalName);
  },
});

const upload = multer({ storage });

// Middleware static
app.use(express.static(uploadDir));

// route utama -> kirim file home.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "home.html"));
});

// API daftar file
app.get("/files", (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.status(500).json({ error: "Gagal membaca folder" });

    const fileList = files.map((f) => ({
      name: f,
      url: `/${f}`,
    }));
    res.json(fileList);
  });
});

// Upload
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Tidak ada file diunggah." });
  }

  // File berhasil diunggah, kirim respons JSON
  res.status(200).json({ 
    message: "File berhasil diunggah!",
    fileName: req.file.filename,
    url: "/" + req.file.filename.replace(/\\/g, '/') // Menggunakan URL yang benar untuk front-end
  });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`✅ Server jalan di http://localhost:${PORT}`);
});

module.exports = app;
