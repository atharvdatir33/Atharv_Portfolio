(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Mobile nav toggle
  const navToggle = document.getElementById("navToggle");
  const siteNav = document.getElementById("siteNav");
  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });

    // Close menu when a link is clicked (mobile)
    siteNav.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        siteNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open navigation");
      });
    });
  }

  // Reveal on scroll
  const revealEls = document.querySelectorAll(".reveal");
  const reveal = (el) => el.classList.add("is-visible");

  if (!reduceMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) reveal(e.target);
      });
    }, { threshold: 0.10 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(reveal);
  }

  // Active nav link
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = [...document.querySelectorAll("section[id]")];

  function setActive(id) {
    navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${id}`));
  }

  if ("IntersectionObserver" in window) {
    const sectionIO = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) setActive(e.target.id);
      });
    }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });
    sections.forEach(s => sectionIO.observe(s));
  }

  // Typing effect
  const typingEl = document.getElementById("typing");
  const lines = [
    "Full Stack Developer (Aspiring) • React • Firebase",
    "Flutter App Development • Clean UI • Real Projects",
    "Python & Java • MySQL • GitHub"
  ];

  if (typingEl) {
    if (reduceMotion) {
      typingEl.textContent = lines[0];
    } else {
      let i = 0, j = 0, forward = true;
      function tick() {
        const text = lines[i];
        typingEl.textContent = text.slice(0, j);

        if (forward) {
          j++;
          if (j > text.length + 10) forward = false;
        } else {
          j--;
          if (j < 0) { forward = true; i = (i + 1) % lines.length; }
        }
        setTimeout(tick, forward ? 40 : 20);
      }
      tick();
    }
  }

  // Copy email
  const copyBtn = document.getElementById("copyEmail");
  const hint = document.getElementById("copyHint");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const email = copyBtn.getAttribute("data-email") || "";
      try {
        await navigator.clipboard.writeText(email);
        if (hint) hint.textContent = "Copied!";
        setTimeout(() => { if (hint) hint.textContent = ""; }, 1200);
      } catch {
        if (hint) hint.textContent = "Copy failed — please select and copy manually.";
      }
    });
  }

  // Hero canvas particles (lightweight)
  const canvas = document.getElementById("heroCanvas");
  if (!canvas || reduceMotion) return;

  const ctx = canvas.getContext("2d");
  let w = 0, h = 0, dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  let particles = [];

  function resize() {
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.floor(Math.min(80, (w * h) / 18000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 1 + Math.random() * 2.2,
      vx: (-0.2 + Math.random() * 0.4),
      vy: (-0.15 + Math.random() * 0.3),
      a: 0.08 + Math.random() * 0.18
    }));
  }

  function step() {
    ctx.clearRect(0, 0, w, h);

    // glow dots
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -20) p.x = w + 20;
      if (p.x > w + 20) p.x = -20;
      if (p.y < -20) p.y = h + 20;
      if (p.y > h + 20) p.y = -20;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56,189,248,${p.a})`;
      ctx.fill();
    }

    requestAnimationFrame(step);
  }

  window.addEventListener("resize", resize, { passive: true });
  resize();
  step();
})();
