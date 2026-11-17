const blogContainer = document.getElementById("blogContainer");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const statusMessage = document.getElementById("statusMessage");

let allBlogs = [];

// Load blog data from JSON
async function loadBlogs() {
    statusMessage.textContent = "Loading articles...";

    try {
        const response = await fetch("./blogs.json");

        if (!response.ok) {
            throw new Error("Unable to load blog data.");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("Invalid blog data format.");
        }

        allBlogs = data;

        statusMessage.textContent = `Successfully loaded ${allBlogs.length} articles.`;
        statusMessage.classList.remove("error");

        displayBlogs(allBlogs);

    } catch (error) {
        console.error("Blog loading error:", error);

        statusMessage.textContent =
            "Unable to load articles. Please run the project using Live Server and check blogs.json.";

        statusMessage.classList.add("error");
    }
}

// Display blog cards
function displayBlogs(blogs) {
    blogContainer.innerHTML = "";

    if (blogs.length === 0) {
        blogContainer.innerHTML = `
            <div class="no-results">
                <h3>No articles found!</h3>
                <p>Try another search or category.</p>
            </div>
        `;

        return;
    }

    blogs.forEach(blog => {
        const card = document.createElement("article");
        card.className = "blog-card";

        const link = document.createElement("a");
        link.href = `blog.html?id=${encodeURIComponent(blog.id)}`;
        link.setAttribute("aria-label", `Read ${blog.title}`);

        const image = document.createElement("img");
        image.className = "card-image";
        image.src = blog.image;
        image.alt = blog.title;
        image.loading = "lazy";

        const content = document.createElement("div");
        content.className = "card-content";

        const category = document.createElement("span");
        category.className = "category";
        category.textContent = blog.category;

        const title = document.createElement("h3");
        title.textContent = blog.title;

        const excerpt = document.createElement("p");
        excerpt.textContent = blog.excerpt;

        const meta = document.createElement("div");
        meta.className = "card-meta";

        const date = document.createElement("span");
        date.textContent = blog.date;

        const readMore = document.createElement("span");
        readMore.className = "read-more";
        readMore.textContent = "Read More →";

        meta.append(date, readMore);
        content.append(category, title, excerpt, meta);
        link.append(image, content);
        card.append(link);

        blogContainer.appendChild(card);
    });
}

// Search and category filtering
function filterBlogs() {
    const searchText = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;

    const filteredBlogs = allBlogs.filter(blog => {
        const matchesSearch =
            blog.title.toLowerCase().includes(searchText) ||
            blog.category.toLowerCase().includes(searchText) ||
            blog.author.toLowerCase().includes(searchText) ||
            blog.excerpt.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "All" ||
            blog.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    displayBlogs(filteredBlogs);

    statusMessage.textContent =
        `Showing ${filteredBlogs.length} of ${allBlogs.length} articles.`;
}

searchInput.addEventListener("input", filterBlogs);
categoryFilter.addEventListener("change", filterBlogs);

// Start application
loadBlogs();