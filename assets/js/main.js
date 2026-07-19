/*==================== THROTTLE FUNCTION ====================*/
function throttle(fn, wait) {
  let time = Date.now();
  return function () {
    if (time + wait - Date.now() < 0) {
      fn();
      time = Date.now();
    }
  };
}

/*==================== DOM READY ====================*/
document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loaded");

  /*==================== MENU SHOW & HIDE ====================*/
  const navMenu = document.getElementById("nav-menu");
  const navToggle = document.getElementById("nav-toggle");
  const navClose = document.getElementById("nav-close");
  const navLinks = document.querySelectorAll(".nav__link");

  navToggle?.addEventListener("click", () =>
    navMenu.classList.add("show-menu"),
  );

  navClose?.addEventListener("click", () =>
    navMenu.classList.remove("show-menu"),
  );

  navLinks.forEach((link) =>
    link.addEventListener("click", () => navMenu.classList.remove("show-menu")),
  );

  /*==================== ACCORDION SKILLS ====================*/
  const skillsContents = document.querySelectorAll(".skills__content");
  const skillsHeaders = document.querySelectorAll(".skills__header");

  skillsHeaders.forEach((header) => {
    header.addEventListener("click", function () {
      // 1. Check if the section we just clicked is already open
      const isOpen = this.parentNode.classList.contains("skills__open");

      // 2. Close ALL sections by resetting their classes
      skillsContents.forEach((content) => {
        content.classList.remove("skills__open");
        content.classList.add("skills__close");
      });

      // 3. If the section we clicked was NOT open before, open it now
      if (!isOpen) {
        this.parentNode.classList.remove("skills__close");
        this.parentNode.classList.add("skills__open");
      }
    });
  });
  /*==================== QUALIFICATION TABS ====================*/
  const tabs = document.querySelectorAll("[data-target]");
  const tabContents = document.querySelectorAll("[data-content]");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = document.querySelector(tab.dataset.target);

      tabContents.forEach((content) =>
        content.classList.remove("qualification__active"),
      );
      target?.classList.add("qualification__active");

      tabs.forEach((t) => t.classList.remove("qualification__active"));
      tab.classList.add("qualification__active");
    });
  });

  /*==================== LOAD MORE PROJECTS ====================*/
  const projects = document.querySelectorAll(
    ".portfolio__container .project-card",
  );
  const loadMoreBtn = document.getElementById("load-more-btn");
  let visibleItems = 2;

  projects.forEach((project, index) => {
    if (index >= visibleItems) {
      project.classList.add("hidden");
    }
  });

  if (projects.length <= visibleItems) {
    loadMoreBtn.style.display = "none";
  }

  loadMoreBtn?.addEventListener("click", () => {
    const nextItems = visibleItems + 2;

    for (let i = visibleItems; i < nextItems; i++) {
      if (projects[i]) {
        projects[i].classList.remove("hidden");
      }
    }

    visibleItems = nextItems;

    if (visibleItems >= projects.length) {
      loadMoreBtn.style.display = "none";
    }
  });

  /*==================== SECTION ANIMATION ====================*/
  const animatedSections = document.querySelectorAll(".section");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("show", entry.isIntersecting);
      });
    },
    { threshold: 0.2 },
  );

  animatedSections.forEach((section) => observer.observe(section));

  /*==================== SCROLL HANDLER ====================*/
  const header = document.getElementById("header");
  const scrollUp = document.getElementById("scroll-up");
  const sections = document.querySelectorAll("section[id]");

  function handleScroll() {
    const scrollY = window.pageYOffset;

    // Header background
    header.classList.toggle("scroll-header", scrollY >= 80);

    // Scroll up button
    scrollUp.classList.toggle("show-scroll", scrollY >= 560);

    // Active nav link
    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 50;
      const sectionId = section.getAttribute("id");

      const link = document.querySelector(`.nav__menu a[href*=${sectionId}]`);

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        link?.classList.add("active-link");
      } else {
        link?.classList.remove("active-link");
      }
    });
  }

  window.addEventListener("scroll", throttle(handleScroll, 100), {
    passive: true,
  });

  /*==================== DARK / LIGHT THEME ====================*/
  const themeButton = document.getElementById("theme-button");
  const darkTheme = "dark-theme";
  const iconTheme = "uil-sun";

  const selectedTheme = localStorage.getItem("selected-theme");
  const selectedIcon = localStorage.getItem("selected-icon");

  const getCurrentTheme = () =>
    document.body.classList.contains(darkTheme) ? "dark" : "light";

  const getCurrentIcon = () =>
    themeButton.classList.contains(iconTheme) ? "uil-moon" : "uil-sun";

  if (selectedTheme) {
    document.body.classList.toggle(darkTheme, selectedTheme === "dark");

    themeButton.classList.toggle(iconTheme, selectedIcon === "uil-moon");
  }

  themeButton?.addEventListener("click", () => {
    document.body.classList.toggle(darkTheme);
    themeButton.classList.toggle(iconTheme);

    localStorage.setItem("selected-theme", getCurrentTheme());
    localStorage.setItem("selected-icon", getCurrentIcon());
  });
});

/*==================== EMAIL JS (LAZY LOAD) ====================*/
function loadEmailJS() {
  return new Promise((resolve) => {
    if (window.emailjs) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
    script.onload = resolve;
    document.body.appendChild(script);
  });
}

async function sendMail() {
  await loadEmailJS();

  emailjs.init("LO_YjdLuLYsZNvIbw");

  const params = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    message: document.getElementById("message").value,
  };

  try {
    await emailjs.send("service_ind2tmx", "template_wl60pdg", params);

    alert("Message sent successfully!");
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("message").value = "";
  } catch (error) {
    alert("Something went wrong. Please try again.");
  }
}
