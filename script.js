const STORAGE_KEY = "janvoice_v01";

/* ---------------------------
   Starter Data
--------------------------- */

const starterPosts = [
  {
    id: 1,
    type: "problem",
    title: "Water Shortage in Ward 4",
    area: "Ward 4",
    description:
      "Residents are experiencing water supply interruptions during morning hours.",
    supports: 24,
    createdAt: Date.now() - 50000
  },
  {
    id: 2,
    type: "idea",
    title: "Public Study Library",
    area: "Central Area",
    description:
      "Create a free study library for students preparing for competitive exams.",
    supports: 18,
    createdAt: Date.now() - 40000
  },
  {
    id: 3,
    type: "poll",
    title: "Should Market Road Be Expanded?",
    area: "Market Area",
    description:
      "Vote through support count for the proposal and show public interest.",
    supports: 31,
    createdAt: Date.now() - 30000
  }
];

/* ---------------------------
   State
--------------------------- */

let posts = loadPosts();
let currentFilter = "all";

/* ---------------------------
   Elements
--------------------------- */

const feed = document.getElementById("feed");

const titleInput =
  document.getElementById("title");

const areaInput =
  document.getElementById("area");

const descriptionInput =
  document.getElementById(
    "description"
  );

const typeInput =
  document.getElementById("postType");

const createBtn =
  document.getElementById(
    "createBtn"
  );

const totalPostsEl =
  document.getElementById(
    "totalPosts"
  );

const totalSupportersEl =
  document.getElementById(
    "totalSupporters"
  );

/* ---------------------------
   Storage
--------------------------- */

function loadPosts() {
  const saved =
    localStorage.getItem(
      STORAGE_KEY
    );

  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }

  return starterPosts;
}

function savePosts() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(posts)
  );
}

/* ---------------------------
   Dashboard
--------------------------- */

function updateStats() {
  totalPostsEl.textContent =
    posts.length;

  const totalSupports =
    posts.reduce(
      (sum, post) =>
        sum + post.supports,
      0
    );

  totalSupportersEl.textContent =
    totalSupports;
}

/* ---------------------------
   Type Badge
--------------------------- */

function getTypeLabel(type) {
  if (type === "problem")
    return "🚨 Problem";

  if (type === "idea")
    return "💡 Idea";

  return "🗳 Poll";
}

/* ---------------------------
   Render Feed
--------------------------- */

function renderFeed() {
  feed.innerHTML = "";

  let filtered = posts;

  if (currentFilter !== "all") {
    filtered = posts.filter(
      (post) =>
        post.type === currentFilter
    );
  }

  filtered.sort(
    (a, b) =>
      b.supports - a.supports
  );

  filtered.forEach((post) => {
    const card =
      document.createElement("div");

    card.className = "post-card";

    card.innerHTML = `
      <div class="post-top">

        <div>
          <span class="post-type ${post.type}">
            ${getTypeLabel(post.type)}
          </span>

          <h3>${escapeHtml(
            post.title
          )}</h3>
        </div>

      </div>

      <p>
        ${escapeHtml(
          post.description
        )}
      </p>

      <div class="meta">
        📍 ${escapeHtml(post.area)}
      </div>

      <div class="support-row">

        <strong>
          👍 ${post.supports} Supporters
        </strong>

        <button
          class="support-btn"
          data-id="${post.id}"
        >
          I Support This
        </button>

      </div>
    `;

    feed.appendChild(card);
  });

  attachSupportEvents();

  updateStats();
}

/* ---------------------------
   Support Logic
--------------------------- */

function attachSupportEvents() {
  const buttons =
    document.querySelectorAll(
      ".support-btn"
    );

  buttons.forEach((button) => {
    button.addEventListener(
      "click",
      () => {
        const id = Number(
          button.dataset.id
        );

        const supportKey =
          `supported_${id}`;

        if (
          localStorage.getItem(
            supportKey
          )
        ) {
          alert(
            "You already supported this post."
          );
          return;
        }

        const post =
          posts.find(
            (p) => p.id === id
          );

        if (!post) return;

        post.supports++;

        localStorage.setItem(
          supportKey,
          "true"
        );

        savePosts();

        renderFeed();
      }
    );
  });
}

/* ---------------------------
   Create Post
--------------------------- */

createBtn.addEventListener(
  "click",
  () => {
    const title =
      titleInput.value.trim();

    const area =
      areaInput.value.trim();

    const description =
      descriptionInput.value.trim();

    const type =
      typeInput.value;

    if (
      !title ||
      !area ||
      !description
    ) {
      alert(
        "Please complete all fields."
      );
      return;
    }

    const newPost = {
      id: Date.now(),
      title,
      area,
      description,
      type,
      supports: 0,
      createdAt: Date.now()
    };

    posts.unshift(newPost);

    savePosts();

    titleInput.value = "";
    areaInput.value = "";
    descriptionInput.value = "";

    renderFeed();

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth"
    });
  }
);

/* ---------------------------
   Filters
--------------------------- */

document
  .querySelectorAll(".filter")
  .forEach((filter) => {
    filter.addEventListener(
      "click",
      () => {
        document
          .querySelectorAll(
            ".filter"
          )
          .forEach((btn) =>
            btn.classList.remove(
              "active"
            )
          );

        filter.classList.add(
          "active"
        );

        currentFilter =
          filter.dataset.filter;

        renderFeed();
      }
    );
  });

/* ---------------------------
   Security
--------------------------- */

function escapeHtml(text) {
  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}

/* ---------------------------
   Init
--------------------------- */

renderFeed();
