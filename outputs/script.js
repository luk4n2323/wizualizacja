const revealItems = document.querySelectorAll(".section-reveal");
const statNumbers = document.querySelectorAll(".stat-number");
const testimonials = document.querySelectorAll(".testimonial");
const sliderButtons = document.querySelectorAll("[data-slider]");
const tiltCards = document.querySelectorAll(".tilt-card");
const contactForm = document.querySelector(".contact-form");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let statsStarted = false;
let activeTestimonial = 0;

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const animateNumber = (node) => {
  const target = Number(node.dataset.target);
  const duration = 1300;
  const start = performance.now();

  const frame = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    node.textContent = Math.round(target * eased).toLocaleString("pl-PL");

    if (progress < 1) {
      requestAnimationFrame(frame);
    }
  };

  requestAnimationFrame(frame);
};

const statObserver = new IntersectionObserver(
  (entries) => {
    if (statsStarted) return;
    if (entries.some((entry) => entry.isIntersecting)) {
      statsStarted = true;
      statNumbers.forEach(animateNumber);
    }
  },
  { threshold: 0.35 }
);

statNumbers.forEach((stat) => statObserver.observe(stat));

const showTestimonial = (index) => {
  testimonials[activeTestimonial].classList.remove("active");
  activeTestimonial = (index + testimonials.length) % testimonials.length;
  testimonials[activeTestimonial].classList.add("active");
};

sliderButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const direction = button.dataset.slider === "next" ? 1 : -1;
    showTestimonial(activeTestimonial + direction);
  });
});

setInterval(() => {
  showTestimonial(activeTestimonial + 1);
}, 5200);

if (!reduceMotion) {
  window.addEventListener("pointermove", (event) => {
    document.body.style.setProperty("--cursor-x", `${event.clientX}px`);
    document.body.style.setProperty("--cursor-y", `${event.clientY}px`);
  });

  tiltCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `rotateX(${y * -7}deg) rotateY(${x * 9}deg) translateY(-6px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const note = contactForm.querySelector(".form-note");
    note.textContent = "Dziękujemy. W finalnej wersji ta wiadomość trafi do skrzynki lub CRM.";
  });
}
