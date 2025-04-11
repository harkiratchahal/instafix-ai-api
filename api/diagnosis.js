const diagnoses = {
  0: {
    name: "Broken Tap",
    cost: 1200,
    handymanFee: 500,
    keyword: "fix broken tap",
  },
  1: {
    name: "Leaking AC",
    cost: 1800,
    handymanFee: 600,
    keyword: "ac leak fix",
  },
  2: {
    name: "Faulty Switch",
    cost: 300,
    handymanFee: 200,
    keyword: "replace electric switch",
  },
};

const fetch = require("node-fetch");

module.exports = async (req, res) => {
  const { classId, confidence } = req.body;

  const info = diagnoses[classId];
  if (!info) return res.status(400).json({ error: "Invalid class ID" });

  const YOUTUBE_API_KEY = "YOUR_YOUTUBE_API_KEY"; // Replace with your actual key
  const query = encodeURIComponent(info.keyword);
  const videoRes = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${YOUTUBE_API_KEY}&maxResults=1&type=video`
  );
  const videoJson = await videoRes.json();

  const videoLink = `https://www.youtube.com/watch?v=${videoJson.items[0].id.videoId}`;

  res.status(200).json({
    diagnosis: info.name,
    confidence,
    repairCost: info.cost,
    handymanFee: info.handymanFee,
    totalCost: info.cost + info.handymanFee,
    videoLink,
  });
};
