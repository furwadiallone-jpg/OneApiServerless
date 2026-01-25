const axios = require('axios');
async function getStream(url,baseUrl) {
  const headers = {
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8,id;q=0.7',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache',
  'Priority': 'u=0, i',
  'Referer': `${baseUrl}`,
  'Sec-CH-UA': '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
  'Sec-CH-UA-Mobile': '?0',
  'Sec-CH-UA-Platform': '"Windows"',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'cross-site',
  'Sec-Fetch-User': '?1',
  'Upgrade-Insecure-Requests': '1',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
};
  try {
    const response = await axios({
      method: 'get',
      url: url,
      responseType: 'stream',  // Menggunakan stream untuk menangani file besar
      headers: headers,  // Menambahkan header di sini
    });

    // Buffer sementara untuk menampung chunk
    let dataBuffer = [];

    // Stream data ke dalam buffer
    await new Promise((resolve, reject) => {
      response.data.on('data', chunk => {
        dataBuffer.push(chunk);  // Menambahkan setiap chunk ke dalam array
      });

      response.data.on('end', () => {
        resolve();
      });

      response.data.on('error', (err) => {
        reject(err);
      });
    });

    // Menggabungkan semua chunk menjadi satu Buffer
    return Buffer.concat(dataBuffer);

  } catch (error) {
    console.error('Terjadi kesalahan saat mendownload file:', error);
    throw error;
  }
}

module.exports = getStream;
