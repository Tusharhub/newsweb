const express = require("express");
const path = require("path");
const NewsAPI = require("newsapi");
const app = express();
const port = process.env.PORT || 3000;
const newsapi = new NewsAPI("b8acf9890d294e40ad5eec0d0c0e925f");

// Set EJS as the view engine
app.set("view engine", "ejs");

// Set the views directory
app.set("views", path.join(__dirname, "views"));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

const truncateDescription = (description, limit) => {
  const words = description.split(" ");
  if (words.length > limit) {
    return words.slice(0, limit).join(" ") + "...";
  }
  return description;
};

app.get("/", async (req, res) => {
  try {
    const justiceResponse = await newsapi.v2.topHeadlines({
      country: "in",
      category: "science",
    });
    // Fetch news articles for business category
    const businessResponse = await newsapi.v2.topHeadlines({
      country: "in",
      category: "business",
    });

    // Fetch news articles for sports category
    const sportsResponse = await newsapi.v2.topHeadlines({
      country: "in",
      category: "sports",
    });

    const generalResponse = await newsapi.v2.topHeadlines({
      country: "in",
      category: "general",
    });

    const politicsResponse = await newsapi.v2.topHeadlines({
      country: "in",
      category: "politics",
    });
    const technologyResponse = await newsapi.v2.topHeadlines({
      country: "in",
      category: "technology",
    });

    const treandingResponse = await newsapi.v2.topHeadlines({
      country: "in",
      category: "Entertainment",
    });
    // Extract necessary data from the API responses
    const justiceArticles = justiceResponse.articles.map((article) => ({
      imageUrl: article.urlToImage || "https://via.placeholder.com/800x500",
      category: "scienc",
      date: new Date(article.publishedAt).toDateString(),
      description: truncateDescription(
        article.description || "No description available",
        8
      ),
      url: article.url,
    }));

    const businessArticles = businessResponse.articles.map((article) => ({
      imageUrl: article.urlToImage || "https://via.placeholder.com/800x500",
      category: "Business",
      date: new Date(article.publishedAt).toDateString(),
      description: truncateDescription(
        article.description || "No description available",
        8
      ),
      url: article.url,
      title: article.title,
    }));

    const sportsArticles = sportsResponse.articles.map((article) => ({
      imageUrl: article.urlToImage || "https://via.placeholder.com/800x500",
      category: "Sports",
      date: new Date(article.publishedAt).toDateString(),
      description: truncateDescription(
        article.description || "No description available",
        8
      ),
      url: article.url,
      title: article.title,
    }));

    const breakingNews = generalResponse.articles
      .slice(0, 2)
      .map((article) => ({
        title: article.title,
        url: article.url,
      }));

    const politicsArticles = politicsResponse.articles.map((article) => ({
      imageUrl: article.urlToImage || "https://via.placeholder.com/800x500",
      category: article.category || "Politics",
      date: new Date(article.publishedAt).toDateString(),
      description: article.description || "No description available",
      url: article.url,
      title: article.title,
    }));

    const technologyArticles = technologyResponse.articles.map((article) => ({
      imageUrl: article.urlToImage || "https://via.placeholder.com/800x500",
      category: article.category || "Technology",
      date: new Date(article.publishedAt).toDateString(),
      description: truncateDescription(
        article.description || "No description available",
        8
      ),
      title: article.title,
      url: article.url,
    }));

    const treandingArticles = treandingResponse.articles.map((article) => ({
      imageUrl: article.urlToImage || "https://via.placeholder.com/110x110",
      category: article.category || "Entertainment",
      date: new Date(article.publishedAt).toDateString(),
      description: truncateDescription(
        article.description || "No description available",
        8
      ),
      title: article.title,
      url: article.url,
    }));

    // Render index.ejs with news data
    res.render("index", {
      justiceArticles,
      businessArticles,
      sportsArticles,
      breakingNews,
      politicsArticles,
      technologyArticles,
      treandingArticles,
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
