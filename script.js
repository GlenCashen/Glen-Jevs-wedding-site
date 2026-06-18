const weddingDate = new Date("2028-03-10T15:00:00+11:00");

const fields = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
};

function updateCountdown() {
  const now = new Date();
  const diff = weddingDate.getTime() - now.getTime();

  if (diff <= 0) {
    fields.days.textContent = "0";
    fields.hours.textContent = "00";
    fields.minutes.textContent = "00";
    fields.seconds.textContent = "00";
    return;
  }

  const seconds = Math.floor(diff / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  fields.days.textContent = days.toLocaleString();
  fields.hours.textContent = String(hours).padStart(2, "0");
  fields.minutes.textContent = String(minutes).padStart(2, "0");
  fields.seconds.textContent = String(remainingSeconds).padStart(2, "0");
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
      const src = trigger.getAttribute("data-full") || trigger.querySelector("img")?.src;
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

updateCountdown();
setInterval(updateCountdown, 1000);
revealSections();
setupNav();
setupLightbox();
setupParallax();
window.addEventListener("load", showPage);
