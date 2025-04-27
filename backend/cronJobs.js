const cron = require("node-cron");
const { fetchTweets } = require("./utils/twitter");
const { fetchRedditPosts } = require("./utils/reddit");
const Post = require("./models/Post");
cron.schedule("0 0 * * *", async () => {
  console.log("Fetching new posts...");

  try {
    const tweets = await fetchTweets();
    await Post.insertMany(
      tweets.map((tweet) => ({
        source: "twitter",
        data: tweet,
      }))
    );
    const redditPosts = await fetchRedditPosts();
    await Post.insertMany(
      redditPosts.data.children.map((post) => ({
        source: "reddit",
        data: post.data,
      }))
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
});
