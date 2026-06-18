const weddingDate = new Date("2028-03-10T15:00:00+11:00");
const countdownStart = new Date("2026-06-18T00:00:00+10:00");

const fields = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
  progress: document.getElementById("countdownProgress"),
  countdown: document.getElementById("countdown"),
};

let lastDisplay = "";

function setText(element, value) {
  if (element && element.textContent !== value) {
    element.textContent = value;
  }
}

function updateCountdown() {
  const now = new Date();
  const diff = weddingDate.getTime() - now.getTime();

  if (diff <= 0) {
    setText(fields.days, "0");
    setText(fields.hours, "00");
    setText(fields.minutes, "00");
    setText(fields.seconds, "00");
    if (fields.progress) fields.progress.style.width = "100%";
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const display = `${days}-${hours}-${minutes}-${seconds}`;
  if (lastDisplay && lastDisplay !== display && fields.countdown) {
    fields.countdown.classList.remove("changed");
    void fields.countdown.offsetWidth;
    fields.countdown.classList.add("changed");
    window.setTimeout(function () {
      fields.countdown.classList.remove("changed");
    }, 560);
  }
  lastDisplay = display;

  setText(fields.days, days.toLocaleString());
  setText(fields.hours, String(hours).padStart(2, "0"));
  setText(fields.minutes, String(minutes).padStart(2, "0"));
  setText(fields.seconds, String(seconds).padStart(2, "0"));

  if (fields.progress) {
    const start = countdownStart.getTime();
    const end = weddingDate.getTime();
    const elapsed = Math.max(0, Math.min(now.getTime() - start, end - start));
    const progress = Math.round((elapsed / (end - start)) * 1000) / 10;
    fields.progress.style.width = progress + "%";
  }
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
