module.exports = (req, res) => {
  res.json({
    body: req.body,
    greeting: "Get lyrics from Genius by adding '/api/lyrics/(aristFirstName-artistLastName-SongName)' to the end of this URL",
  });
};
