// utils/twitter.js
const axios = require("axios");

const fetchTweets = async () => {
  try {
    const response = await axios.get(
      "https://api.twitter.com/2/tweets/search/recent?query=technology",
      {
        headers: {
          Authorization: `Bearer ${process.env.X_TOKEN}`,
        },
      }
    );
    return response?.data?.data || [];
  } catch (error) {
    console.error("Error fetching tweets:", error);
    throw error;
  }
};

module.exports = { fetchTweets };
