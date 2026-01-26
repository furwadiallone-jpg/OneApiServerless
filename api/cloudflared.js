const { spawn } = require("child_process");
const fs = require("fs");
const https = require("https");
const url = require("url");
const APP_PORT = process.env.SERVER_PORT || 80;

const CLOUDFLARED_BIN = "./cloudflared";
const CLOUDFLARED_URL =
  "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64";

// Fungsi download dengan support redirect
function downloadFile(fileUrl, output, cb) {
  const options = url.parse(fileUrl);

  https.get(options, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      return downloadFile(res.headers.location, output, cb);
    }

    if (res.statusCode !== 200) {
      console.error("[ERROR] Gagal download, status code:", res.statusCode);
      process.exit(1);
    }

    const file = fs.createWriteStream(output);
    res.pipe(file);

    file.on("finish", () => {
      file.close(() => cb());
    });
  }).on("error", (err) => {
    console.error("[ERROR] Download error:", err.message);
    process.exit(1);
  });
}

// Fungsi download cloudflared kalau belum ada
function downloadCloudflared(cb) {
  if (fs.existsSync(CLOUDFLARED_BIN)) {
    return cb();
  }
  console.log("[INFO] Mengunduh cloudflared...");
  downloadFile(CLOUDFLARED_URL, CLOUDFLARED_BIN, () => {
    fs.chmodSync(CLOUDFLARED_BIN, 0o755);
    console.log("[INFO] cloudflared berhasil diunduh ✅");
    cb();
  });
}

function checkLine(text) {
  // Tangkap konfigurasi dan ambil hostname
  if (text.includes('ingress')) {
    let match = text.split(':[');

    if (match.length > 1) match = match[1].split(', {')[0];
    if (typeof match === 'string') {
      // remove escape slashes and try to extract a JSON object {...}
      const clean = match.replace(/\\/g, '').trim();
      const jsonMatch = clean.match(/\{[\s\S]*?\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed && parsed.hostname) {
            console.log(`[INFO] Web Sudah Online https://${parsed.hostname}`);
          }
        } catch (err) {
          console.error("[WARN] Gagal parse JSON hostname:", err.message);
        }
      }
    }
  }
  // Tangkap lokasi koneksi tunnel
  const tunnelRegex = /Registered tunnel connection.*location=([a-z0-9]+)/;
  const tunnelMatch = text.match(tunnelRegex);
  if (tunnelMatch) {
    const location = tunnelMatch[1];
    const message = `[SUCCESS] Tunnel aktif di lokasi: ${location}`;
    console.log(message);
  }
  
}

// Fungsi jalankan cloudflared (ambil link dari stdout + stderr)
function runCloudflared() {
  const cloudflared = spawn(CLOUDFLARED_BIN, [
    "tunnel",
    "run",
    "--token",
    "eyJhIjoiMmRhODIzODc4MTYwMzQzNWY2MzllMDgxMjQ3NGVmZWYiLCJ0IjoiMWZjNzM1Y2QtYjM2ZS00YWUyLWFjNjctMTcwNGU0MTQ0MmM5IiwicyI6Ik1HTTVaRGc1WlRBdFptSmpOQzAwWldaaExUaGpNR1F0TVdWa05UVmxZVFpqWkdZMiJ9"
  ]);

  cloudflared.stdout.on("data", (data) => {
   // console.log(data.toString());
    checkLine(data.toString());
  });

  cloudflared.stderr.on("data", (data) => {
    //console.log(data.toString());
    checkLine(data.toString());
  });
}

// Jalankan aplikasi Node.js sederhana
function runApp() {
  const http = require("http");
  const server = http.createServer((req, res) => {
    res.end("Halo dari aplikasi Node.js (port 80) + Cloudflared!");
  });

  server.listen(APP_PORT, () => {
    console.log(`[INFO] Aplikasi Node.js jalan di http://localhost:${APP_PORT}`);
  });
}
// Main
downloadCloudflared(() => {
  //runApp();
  runCloudflared();
});

