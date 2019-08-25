const getThoseLyrics = require('../../src/getLyrics');

module.exports = async (req, res) => {
  try {
    const {
      query: { getlyrics },
    } = req;
    const artistAndSong = getlyrics;
    const lyrics = await getThoseLyrics(artistAndSong, true)
    res.send(lyrics);
    console.log('\nGot the lyrics! 🎵\n');
  } catch (err) {
    const errorMessage = `Error fetching lyrics...\n${err.message}`
    res.send(
      errorMessage
    );
    console.log(errorMessage);
  }
};
