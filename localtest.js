const http = require('http');
const getThoseLyrics = require('./src/getLyrics');
require('dotenv').config();

const hostname = '127.0.0.1';
const port = 5555;

const server = http.createServer(async (req, res) => {
  try {
    const artistAndSong = 'frankie-laine-rawhide';
    const lyrics = await getThoseLyrics(artistAndSong, false);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(lyrics);
    console.log('\nGot the lyrics! 🎵\n');
  } catch (err) {
    errorMessage = `Error getting lyrics:\n\n${err.message}\n\n`;
    console.log(errorMessage);
    res.end(errorMessage);
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
