// This script keeps the navigation polished and the page behavior simple.

const header = document.querySelector('.site-header');
const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main section[id], main .hero[id]');
const revealItems = document.querySelectorAll('.reveal');

function updateActiveLink() {
  const scrollPosition = window.scrollY + 150;

  sections.forEach((section) => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;

    if (scrollPosition >= top && scrollPosition < bottom) {
      navLinks.forEach((link) => link.classList.remove('active'));
      const activeLink = document.querySelector(`.nav-link[href="#${section.id}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
      }
    }
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.forEach((item) => item.classList.remove('active'));
    link.classList.add('active');
    if (nav) {
      nav.classList.remove('nav-open');
    }
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav?.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(Boolean(isOpen)));
  });
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

window.addEventListener('scroll', () => {
  if (header) {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }
  updateActiveLink();
});

// Initial call to set the active link on page load
updateActiveLink();

// --- MODAL (POPUP) SYSTEM FOR WORK SAMPLES ---
function openModal(title, description) {
    // Create the modal HTML dynamically
    const modalHTML = `
        <div class="modal-overlay active" id="workModal" onclick="closeModal(event)">
            <div class="modal-content" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <h3>${title}</h3>
                <p>${description}</p>
                <div style="background: #f6f8fb; padding: 2rem; border-radius: 1rem; text-align: center; color: #5e6875;">
                    <p>🔍 Preview coming soon</p>
                    <p style="font-size: 0.85rem; margin-top: 0.5rem;">Your actual image, video, or PDF link will go here.</p>
                </div>
            </div>
        </div>
    `;
    
    // Append it to the body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeModal(event) {
    // If clicking the background or the close button
    const modal = document.getElementById('workModal');
    if (modal) {
        modal.remove(); // Remove it from the DOM entirely
    }
}

// Close modal if user presses ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});