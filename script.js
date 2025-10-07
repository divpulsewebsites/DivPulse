// ======================
// Dropdown Menu Handling
// ======================
function isMobile() {
  return window.innerWidth <= 768;
}

function setupDropdownBehavior() {
  const dropdown = document.querySelector(".dropdown");
  const dropbtn = document.querySelector(".dropbtn");

  if (!dropdown || !dropbtn) return;

  // Clear old listeners to avoid duplicates
  dropdown.replaceWith(dropdown.cloneNode(true));
  const newDropdown = document.querySelector(".dropdown");
  const newDropbtn = newDropdown.querySelector(".dropbtn");

  if (!isMobile()) {
    // Desktop: open on hover
    newDropdown.addEventListener("mouseenter", () => {
      newDropdown.classList.add("show");
    });
    newDropdown.addEventListener("mouseleave", () => {
      newDropdown.classList.remove("show");
    });
  } else {
    // Mobile: open on click
    document.addEventListener("click", function (e) {
      const isDropdownLink = e.target.closest(".dropdown a");
      if (e.target === newDropbtn) {
        newDropdown.classList.toggle("show");
        return;
      }
      if (isDropdownLink || !newDropdown.contains(e.target)) {
        newDropdown.classList.remove("show");
      }
    });
  }
}
setupDropdownBehavior();

// ======================
// Navbar Shrink on Scroll
// ======================
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("shrink");
  } else {
    navbar.classList.remove("shrink");
  }
});

// ======================
// Neuron Canvas Animation
// ======================
const canvas = document.getElementById("neuronCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 60;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Fewer nodes on mobile
const nodeCount = isMobile() ? 25 : 60;
const maxDistance = isMobile() ? 120 : 180;

let nodes = [];
for (let i = 0; i < nodeCount; i++) {
  nodes.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    radius: Math.random() * 2 + 1,
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Connections
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDistance) {
        ctx.strokeStyle = `rgba(0,191,255,${1 - dist / maxDistance})`;
        ctx.lineWidth = 1;
        if (!isMobile()) {
          ctx.shadowColor = "#00bfff";
          ctx.shadowBlur = 5;
        }
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }

  // Draw nodes
  nodes.forEach((node) => {
    ctx.fillStyle = "#00bfff";
    if (!isMobile()) {
      ctx.shadowColor = "#00bfff";
      ctx.shadowBlur = 10;
    } else {
      ctx.shadowBlur = 0;
    }
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
    ctx.fill();

    node.x += node.vx;
    node.y += node.vy;
    if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
    if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
  });

  requestAnimationFrame(animate);
}
animate();

// ======================
// Fade-In Animation
// ======================
const fadeSections = document.querySelectorAll(
  ".about, .us, .services, .service, .contacts, .card"
);

if (!isMobile()) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  fadeSections.forEach((section) => observer.observe(section));
} else {
  // Instantly visible on mobile (no lag from fade)
  fadeSections.forEach((el) => el.classList.add("visible"));
}

// ======================
// Scroll Reset on Reload
// ======================
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};
