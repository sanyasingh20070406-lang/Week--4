const articleContainer = document.getElementById("articleContainer");
const articleStatus = document.getElementById("articleStatus");

// Get blog ID from URL
const params = new URLSearchParams(window.location.search);
const blogId = params.get("id");

// Load selected article
async function loadArticle() {
    articleStatus.textContent = "Loading article...";

    if (!blogId) {
        showError("No article selected. Please choose a blog from the homepage.");
        return;
    }

    try {
        const response = await fetch("./blogs.json");

        if (!response.ok) {
            throw new Error("Unable to load articles.");
        }

        const blogs = await response.json();

        const blog = blogs.find(item => String(item.id) === blogId);

        if (!blog) {
            showError("Sorry! This article could not be found.");
            return;
        }

        displayArticle(blog);

        articleStatus.textContent = "Article loaded successfully.";

    } catch (error) {
        console.error("Article loading error:", error);

        showError("Unable to load this article. Please check your connection and blogs.json.");
    }
}

// Show error message
function showError(message) {
    articleStatus.textContent = message;
    articleStatus.classList.add("error");
    articleContainer.innerHTML = "";
}

// Display article details
function displayArticle(blog) {
    articleContainer.innerHTML = "";

    const category = document.createElement("span");
    category.className = "category article-category";
    category.textContent = blog.category;

    const title = document.createElement("h1");
    title.className = "article-title";
    title.textContent = blog.title;

    const meta = document.createElement("p");
    meta.className = "article-meta";
    meta.textContent =
        `By ${blog.author} • ${blog.date} • ${blog.readTime}`;

    const image = document.createElement("img");
    image.className = "article-image";
    image.src = blog.image;
    image.alt = blog.title;

    const body = document.createElement("div");
    body.className = "article-body";

    // Render article paragraphs and headings
    blog.content.forEach((paragraph, index) => {
        const element = document.createElement(
            index > 0 && index % 2 === 1 ? "h2" : "p"
        );

        element.textContent = paragraph;
        body.appendChild(element);
    });

    articleContainer.append(
        category,
        title,
        meta,
        image,
        body
    );

    document.title = `${blog.title} | BlogSpace`;
}

// Start application
loadArticle();