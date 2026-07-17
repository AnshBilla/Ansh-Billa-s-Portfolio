/* --------------------------------------------------------------------------
   Portfolio interactions — no frameworks or external dependencies required.
   -------------------------------------------------------------------------- */

document.documentElement.classList.remove("no-js");
document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const header = document.querySelector(".site-header");
  const progressBar = document.querySelector(".scroll-progress span");
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".site-nav");
  const navLinks = [...document.querySelectorAll(".nav-link")];
  const themeButton = document.querySelector(".theme-toggle");
  const backToTop = document.querySelector(".back-to-top");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // Persist the user's color preference, falling back to the system theme.
  const getStoredTheme = () => {
    try { return localStorage.getItem("portfolio-theme"); } catch { return null; }
  };
  const setStoredTheme = (theme) => {
    try { localStorage.setItem("portfolio-theme", theme); } catch { /* Storage may be unavailable. */ }
  };
  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    themeButton.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} mode`);
    document.querySelector('meta[name="theme-color"]').setAttribute("content", theme === "dark" ? "#09090b" : "#fbfbfd");
  };
  const storedTheme = getStoredTheme();
  applyTheme(storedTheme || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"));
  themeButton.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    setStoredTheme(nextTheme);
  });

  // Compact mobile navigation with keyboard-friendly close behavior.
  const closeMenu = () => {
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
    document.body.classList.remove("menu-open");
  };
  menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    document.body.classList.toggle("menu-open", isOpen);
  });
  navLinks.forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navigation.classList.contains("open")) {
      closeMenu();
      menuButton.focus();
    }
  });

  // Keep anchor navigation smooth while accounting for the fixed header.
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href");
      const target = targetId && document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      const headerHeight = header.offsetHeight;
      const targetY = target.getBoundingClientRect().top + window.scrollY - headerHeight + 2;
      window.scrollTo({ top: targetY, behavior: reduceMotion ? "auto" : "smooth" });
      history.replaceState(null, "", targetId);
    });
  });

  // Header style, reading progress, active navigation, and back-to-top affordance.
  const updateScrollUI = () => {
    const scrollY = window.scrollY;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (scrollY / scrollable) * 100 : 0;
    progressBar.style.width = `${Math.min(progress, 100)}%`;
    header.classList.toggle("scrolled", scrollY > 16);
    backToTop.classList.toggle("visible", scrollY > 540);

    const marker = scrollY + window.innerHeight * 0.37;
    let currentSection = "home";
    document.querySelectorAll("main section[id]").forEach((section) => {
      if (section.offsetTop <= marker) currentSection = section.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${currentSection}`);
    });
  };
  window.addEventListener("scroll", updateScrollUI, { passive: true });
  window.addEventListener("resize", updateScrollUI, { passive: true });
  updateScrollUI();

  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

  // Pointer effects are limited to precise pointers; touch users keep the same layout.
  if (finePointer && !reduceMotion) {
    // Small magnetic drift rewards intentional pointer movement on primary CTAs.
    document.querySelectorAll("[data-magnetic]").forEach((element) => {
      element.addEventListener("pointermove", (event) => {
        const bounds = element.getBoundingClientRect();
        const x = (event.clientX - bounds.left - bounds.width / 2) * 0.12;
        const y = (event.clientY - bounds.top - bounds.height / 2) * 0.16;
        element.style.setProperty("--magnet-x", `${Math.max(-8, Math.min(8, x)).toFixed(2)}px`);
        element.style.setProperty("--magnet-y", `${Math.max(-6, Math.min(6, y)).toFixed(2)}px`);
      });
      element.addEventListener("pointerleave", () => {
        element.style.setProperty("--magnet-x", "0px");
        element.style.setProperty("--magnet-y", "0px");
      });
    });

    // Project surfaces respond to the pointer without changing document flow.
    document.querySelectorAll(".project-card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;
        card.classList.add("is-tilting");
        card.style.setProperty("--tilt-y", `${((x - 0.5) * 5).toFixed(2)}deg`);
        card.style.setProperty("--tilt-x", `${((0.5 - y) * 4).toFixed(2)}deg`);
        card.style.setProperty("--glare-x", `${(x * 100).toFixed(1)}%`);
        card.style.setProperty("--glare-y", `${(y * 100).toFixed(1)}%`);
      });
      card.addEventListener("pointerleave", () => {
        card.classList.remove("is-tilting");
        card.style.removeProperty("--tilt-x");
        card.style.removeProperty("--tilt-y");
      });
    });
  }

  // Decorative layers have a restrained scroll depth, keeping the hero alive
  // without making the page harder to read or navigate.
  const parallaxLayers = document.querySelectorAll("[data-parallax]");
  const updateParallax = () => {
    if (reduceMotion) return;
    const distance = Math.min(window.scrollY, window.innerHeight * 1.4);
    parallaxLayers.forEach((layer) => {
      const strength = Number(layer.dataset.parallax) || 0;
      layer.style.setProperty("--parallax-y", `${Math.round(distance * strength * -1)}px`);
    });
  };
  if (!reduceMotion) {
    window.addEventListener("scroll", updateParallax, { passive: true });
    updateParallax();
  }

  // Reveal elements only as they enter the viewport; show everything immediately
  // when motion is reduced or IntersectionObserver is unavailable.
  const revealElements = document.querySelectorAll(".reveal");
  const revealElement = (element) => element.classList.add("visible");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach(revealElement);
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        revealElement(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -30px" });
    revealElements.forEach((element) => revealObserver.observe(element));
  }

  // Animate fact counters once the highlights come into view.
  const counters = document.querySelectorAll("[data-counter]");
  const animateCounter = (counter) => {
    if (counter.dataset.counted) return;
    counter.dataset.counted = "true";
    const goal = Number(counter.dataset.counter);
    const suffix = counter.dataset.suffix || "";
    const duration = reduceMotion ? 0 : 1050;
    const startTime = performance.now();
    const tick = (now) => {
      const elapsed = duration === 0 ? 1 : Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      counter.textContent = `${Math.round(goal * eased)}${suffix}`;
      if (elapsed < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (reduceMotion || !("IntersectionObserver" in window)) {
    counters.forEach(animateCounter);
  } else {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.45 });
    counters.forEach((counter) => counterObserver.observe(counter));
  }

  // Animate each confidence bar exactly once, as the skills section enters view.
  const skillsSection = document.querySelector(".skills-section");
  const revealSkillMeters = () => skillsSection.classList.add("skills-animated");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealSkillMeters();
  } else {
    const skillObserver = new IntersectionObserver((entries, observer) => {
      if (!entries[0].isIntersecting) return;
      revealSkillMeters();
      observer.unobserve(entries[0].target);
    }, { threshold: 0.2 });
    skillObserver.observe(skillsSection);
  }

  // Filter the project collection without a page reload or third-party plugin.
  const filterButtons = document.querySelectorAll(".project-filter");
  const projects = document.querySelectorAll(".project-card[data-project-category]");
  const filterStatus = document.querySelector("#filter-status");
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      let visibleCount = 0;
      filterButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });
      projects.forEach((project) => {
        const categories = project.dataset.projectCategory.split(" ");
        const shouldShow = filter === "all" || categories.includes(filter);
        project.classList.toggle("is-filtered-out", !shouldShow);
        if (shouldShow) {
          visibleCount += 1;
          project.classList.remove("project-filtered-in");
          window.requestAnimationFrame(() => project.classList.add("project-filtered-in"));
        }
      });
      filterStatus.textContent = filter === "all" ? `Showing all ${visibleCount} projects` : `Showing ${visibleCount} ${filter.replace("iot", "IoT & data")} project${visibleCount === 1 ? "" : "s"}`;
    });
  });

  // Typed hero role keeps the homepage lively without a third-party library.
  const typedText = document.querySelector(".typed-text");
  const roles = ["Software Engineer", "Web Developer", "Problem Solver"];
  if (reduceMotion) {
    typedText.textContent = roles[0];
  } else {
    let roleIndex = 0;
    let characterIndex = roles[0].length;
    let deleting = false;
    const typeRole = () => {
      const role = roles[roleIndex];
      typedText.textContent = role.slice(0, characterIndex);
      let delay = deleting ? 38 : 72;
      if (!deleting && characterIndex < role.length) {
        characterIndex += 1;
      } else if (!deleting) {
        deleting = true;
        delay = 1700;
      } else if (characterIndex > 0) {
        characterIndex -= 1;
      } else {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 320;
      }
      window.setTimeout(typeRole, delay);
    };
    typeRole();
  }

  // Lightweight, accessible client-side contact validation for this static site.
  const form = document.querySelector("#contact-form");
  const status = document.querySelector("#form-status");
  const fields = ["name", "email", "subject", "message"];
  const validators = {
    name: (value) => value.trim().length >= 2 ? "" : "Please enter at least 2 characters.",
    email: (value) => /^\S+@\S+\.\S+$/.test(value.trim()) ? "" : "Enter a valid email address.",
    subject: (value) => value.trim().length >= 3 ? "" : "Please add a short subject.",
    message: (value) => value.trim().length >= 10 ? "" : "Your message should be at least 10 characters."
  };
  const validateField = (fieldName) => {
    const field = form.elements[fieldName];
    const message = validators[fieldName](field.value);
    const errorElement = document.querySelector(`#${fieldName}-error`);
    field.setAttribute("aria-invalid", String(Boolean(message)));
    errorElement.textContent = message;
    return !message;
  };
  fields.forEach((fieldName) => {
    form.elements[fieldName].addEventListener("blur", () => validateField(fieldName));
    form.elements[fieldName].addEventListener("input", () => {
      if (form.elements[fieldName].getAttribute("aria-invalid") === "true") validateField(fieldName);
    });
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const isValid = fields.map(validateField).every(Boolean);
    if (!isValid) {
      status.textContent = "Please correct the highlighted fields and try again.";
      const firstInvalid = fields.find((fieldName) => form.elements[fieldName].getAttribute("aria-invalid") === "true");
      if (firstInvalid) form.elements[firstInvalid].focus();
      return;
    }
    status.textContent = "Thanks! This static demo validated your message—please email me directly to continue the conversation.";
    form.reset();
    fields.forEach((fieldName) => form.elements[fieldName].removeAttribute("aria-invalid"));
  });

  document.querySelector("#current-year").textContent = new Date().getFullYear();
});
