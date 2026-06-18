const weddingDate = new Date("2028-03-10T15:00:00+11:00");

const fields = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
};

const previousValues = {};

function setField(name, value) {
  const field = fields[name];
  if (!field) return;

  if (previousValues[name] !== undefined && previousValues[name] !== value) {
    const card = field.closest(".flip-card");
    if (card) {
      card.classList.remove("is-flipping");
      void card.offsetWidth;
      card.classList.add("is-flipping");
      window.setTimeout(function () {
        card.classList.remove("is-flipping");
      }, 560);
    }
  }

  field.textContent = value;
  previousValues[name] = value;
}

function updateCountdown() {
  const now = new Date();
  const diff = weddingDate.getTime() - now.getTime();

  if (diff <= 0) {
    setField("days", "0");
    setField("hours", "00");
    setField("minutes", "00");
    setField("seconds", "00");
    return;
  }

  const seconds = Math.floor(diff / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  setField("days", days.toLocaleString());
  setField("hours", String(hours).padStart(2, "0"));
  setField("minutes", String(minutes).padStart(2, "0"));
  setField("seconds", String(remainingSeconds).padStart(2, "0"));
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
      const imageElement = trigger.querySelector("img");
      const src = trigger.getAttribute("data-full") || (imageElement ? imageElement.src : "");
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
      item.style.backgroundPosition = `center calc(50% + ${offset}px)`;
    });
  }

  updateParallax();
  window.addEventListener("scroll", updateParallax, { passive: true });
  window.addEventListener("resize", updateParallax);
}

function setupCursor() {
  const cursor = document.getElementById("customCursor");
  if (!cursor || window.matchMedia("(pointer: coarse)").matches) return;

  document.addEventListener("mousemove", function (event) {
    cursor.classList.add("is-visible");
    cursor.style.left = event.clientX + "px";
    cursor.style.top = event.clientY + "px";
  });

  document.querySelectorAll("a, button, .lightbox-trigger").forEach(function (item) {
    item.addEventListener("mouseenter", function () {
      cursor.classList.add("is-active");
    });
    item.addEventListener("mouseleave", function () {
      cursor.classList.remove("is-active");
    });
  });
}

function setupPetals() {
  const petals = document.getElementById("petals");
  if (!petals || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  function createPetal() {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.left = Math.random() * 100 + "vw";
    petal.style.opacity = String(0.35 + Math.random() * 0.45);
    petal.style.animationDuration = 7 + Math.random() * 8 + "s";
    petal.style.setProperty("--drift", (Math.random() * 180 - 90) + "px");
    petals.appendChild(petal);
    window.setTimeout(function () {
      petal.remove();
    }, 16000);
  }

  for (let i = 0; i < 14; i += 1) {
    window.setTimeout(createPetal, i * 260);
  }

  window.setInterval(createPetal, 900);
}

updateCountdown();
setInterval(updateCountdown, 1000);
revealSections();
setupNav();
setupLightbox();
setupParallax();
setupCursor();
setupPetals();
window.addEventListener("load", showPage);
