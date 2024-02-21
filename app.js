const express = require("express");
const path = require("path");
const NewsAPI = require("newsapi");
const app = express();
const port = 3000;
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
    const response = await newsapi.v2.topHeadlines({
      country: "in",
    });

    const articles = response.articles.map((article) => ({
      imageUrl: article.urlToImage || "https://via.placeholder.com/800x500",
      category: article.category || "General",
      date: new Date(article.publishedAt).toDateString(),
      description: truncateDescription(
        article.description || "No description available",
        8
      ),
      url: article.url,
    }));

    const breakingNews = response.articles.slice(0, 2).map((article) => ({
      title: article.title,
      url: article.url,
    }));

    const featuredNews = response.articles.map((article) => ({
      imageUrl: article.urlToImage || "https://via.placeholder.com/800x500",
      category: article.category || "Business",
      date: new Date(article.publishedAt).toDateString(),
      description: article.description || "No description available",
      url: article.url,
    }));

    const latestNews = response.articles.map((article) => ({
      imageUrl: article.urlToImage || "https://via.placeholder.com/800x500",
      category: article.category || "Sports",
      date: new Date(article.publishedAt).toDateString(),
      description: truncateDescription(
        article.description || "No description available",
        8
      ),
      title: article.title,
      url: article.url,
    }));

    const latestNews_1 = response.articles.map((article) => {
      // Function to truncate the title to 4 words
      const truncateTitle = (title, limit) => {
        const words = title.split(" ");
        if (words.length > limit) {
          return words.slice(0, limit).join(" ") + "...";
        }
        return title;
      };

      return {
        imageUrl: article.urlToImage || "https://via.placeholder.com/110x110",
        category: article.category || "Politics",
        date: new Date(article.publishedAt).toDateString(),
        title: truncateTitle(article.title, 4), // Limiting title to 4 words
        url: article.url,
      };
    });

    res.render("index", {
      articles,
      latestNews_1,
      latestNews,
      breakingNews,
      featuredNews,
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
