const axios = require("axios");
const fetchRedditPosts = async () => {
  try {
    const response = await axios.get(
      "https://www.reddit.com/r/all/new.json?limit=10"
    );

    const posts = response.data.data.children.map((post) => {
      return {
        title: post?.data?.title,
        author: post?.data?.author,
        thumbnail:
          post?.data?.thumbnail !== "self" ? post?.data?.thumbnail : null,
        permalink: post?.data?.permalink,
        text: post?.data?.text,
        saved: 0,
        reported: 0,
      };
    });

    return posts;
  } catch (error) {
    console.error("Error fetching Reddit posts:", error);
    throw error;
  }
};

module.exports = { fetchRedditPosts };
