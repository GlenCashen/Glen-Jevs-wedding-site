const weddingDate = new Date("2028-03-10T15:00:00+11:00");

const fields = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
};

const previousValues = {};

function setFlipValue(key, value) {
  const field = fields[key];
  if (!field) return;

  if (previousValues[key] !== undefined && previousValues[key] !== value) {
    const card = field.closest(".flip-card");
    if (card) {
      card.classList.remove("is-flipping");
      void card.offsetWidth;
      card.classList.add("is-flipping");
      setTimeout(function () {
        card.classList.remove("is-flipping");
      }, 360);
    }
  }

  field.textContent = value;
  previousValues[key] = value;
}

function updateCountdown() {
  const now = new Date();
  const diff = weddingDate.getTime() - now.getTime();

  if (diff <= 0) {
    setFlipValue("days", "0");
    setFlipValue("hours", "00");
    setFlipValue("minutes", "00");
    setFlipValue("seconds", "00");
    return;
  }

  const seconds = Math.floor(diff / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  setFlipValue("days", days.toLocaleString());
  setFlipValue("hours", String(hours).padStart(2, "0"));
  setFlipValue("minutes", String(minutes).padStart(2, "0"));
  setFlipValue("seconds", String(remainingSeconds).padStart(2, "0"));
}

function showPage() {
  const loader = document.getElementById("loader");
  if (loader) {
    setTimeout(function () {
      loader.classList.add("is-hidden");
    }, 1300);
  }
}

function revealSections() {
  const items = document.querySelectorAll(".reveal");

  if (!window.IntersectionObserver) {
    items.forEach(function (item) {
      item.classList.add("is-visible");
    });
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  items.forEach(function (item) {
    observer.observe(item);
  });
}

function setupNav() {
  const nav = document.getElementById("nav");
  if (!nav) return;

  function updateNav() {
    nav.classList.toggle("is-scrolled", window.scrollY > 80);
  }

  updateNav();
  window.addEventListener("scroll", updateNav, { passive: true });
}

function setupLightbox() {
  const lightbox = document.getElementById("lightbox");
  const image = document.getElementById("lightboxImage");
  const close = document.querySelector(".lightbox-close");
  const triggers = document.querySelectorAll(".lightbox-trigger");

  if (!lightbox || !image || !close) return;

  function openLightbox(src) {
    image.src = src;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
    setTimeout(function () {
      image.src = "";
    }, 250);
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      const fallbackImage = trigger.querySelector("img");
      const src = trigger.getAttribute("data-full") || (fallbackImage ? fallbackImage.src : "");
      if (src) openLightbox(src);
    });
  });

  close.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) closeLightbox();
  });
}

function setupParallax() {
  const items = document.querySelectorAll("[data-parallax]");
  if (!items.length) return;

  function updateParallax() {
    items.forEach(function (item) {
      const speed = Number(item.getAttribute("data-parallax")) || 0.1;
      const rect = item.getBoundingClientRect();
      const offset = rect.top * speed;
      item.style.backgroundPosition = "center calc(50% + " + offset + "px)";
    });
  }

  updateParallax();
  window.addEventListener("scroll", updateParallax, { passive: true });
  window.addEventListener("resize", updateParallax);
}

function setupPetals() {
  const container = document.getElementById("petals");
  if (!container || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  for (let index = 0; index < 26; index += 1) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.left = Math.random() * 100 + "vw";
    petal.style.animationDuration = 7 + Math.random() * 9 + "s";
    petal.style.animationDelay = Math.random() * 8 + "s";
    petal.style.opacity = String(0.28 + Math.random() * 0.52);
    petal.style.setProperty("--drift", (Math.random() * 180 - 90) + "px");
    container.appendChild(petal);
  }
}

function setupCursor() {
  const cursor = document.getElementById("customCursor");
  if (!cursor || window.matchMedia("(max-width: 760px)").matches) return;

  document.addEventListener("mousemove", function (event) {
    cursor.style.left = event.clientX + "px";
    cursor.style.top = event.clientY + "px";
  });

  const hoverTargets = document.querySelectorAll("a, button, .lightbox-trigger, .detail-card, .party-grid article, .travel-grid article");
  hoverTargets.forEach(function (target) {
    target.addEventListener("mouseenter", function () {
      cursor.classList.add("is-hovering");
    });
    target.addEventListener("mouseleave", function () {
      cursor.classList.remove("is-hovering");
    });
  });
}

updateCountdown();
setInterval(updateCountdown, 1000);
revealSections();
setupNav();
setupLightbox();
setupParallax();
setupPetals();
setupCursor();
window.addEventListener("load", showPage);
