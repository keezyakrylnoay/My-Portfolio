// This script keeps the navigation polished and the page behavior simple.

const header = document.querySelector('.site-header');
const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main section[id], main .hero[id]');
const revealItems = document.querySelectorAll('.reveal');

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
});

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
                    <p>🔍 Sample preview coming soon</p>
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

// --- IMAGE GALLERY MODAL (swipeable) ---
function openImageGallery(images, title) {
    let current = 0;

    const modalHTML = `
        <div class="modal-overlay active" id="galleryModal" onclick="closeGallery(event)">
            <div class="modal-content gallery-modal" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeGallery()">&times;</button>
                <h3>${title}</h3>
                <div class="gallery-wrapper">
                    <button class="gallery-nav gallery-prev" onclick="galleryMove(-1)">&#10094;</button>
                    <img id="galleryImage" src="${images[0]}" alt="${title}">
                    <button class="gallery-nav gallery-next" onclick="galleryMove(1)">&#10095;</button>
                </div>
                <div class="gallery-dots" id="galleryDots"></div>
                <p class="gallery-counter" id="galleryCounter">1 / ${images.length}</p>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    window.__galleryImages = images;
    window.__galleryCurrent = 0;

    const dotsContainer = document.getElementById('galleryDots');
    images.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
        dot.onclick = () => {
            window.__galleryCurrent = i;
            document.getElementById('galleryImage').src = images[i];
            document.getElementById('galleryCounter').textContent = `${i + 1} / ${images.length}`;
            updateGalleryDots();
        };
        dotsContainer.appendChild(dot);
    });

    const img = document.getElementById('galleryImage');
    let touchStartX = 0;
    img.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
    img.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            galleryMove(diff > 0 ? 1 : -1);
        }
    });
}

function galleryMove(direction) {
    const images = window.__galleryImages;
    let current = window.__galleryCurrent + direction;
    if (current < 0) current = images.length - 1;
    if (current >= images.length) current = 0;
    window.__galleryCurrent = current;

    document.getElementById('galleryImage').src = images[current];
    document.getElementById('galleryCounter').textContent = `${current + 1} / ${images.length}`;
    updateGalleryDots();
}

function updateGalleryDots() {
    document.querySelectorAll('.gallery-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === window.__galleryCurrent);
    });
}

function closeGallery() {
    document.getElementById('galleryModal')?.remove();
}

// --- VIDEO GALLERY MODAL ---
function openVideoGallery(videos, title) {
    const modalHTML = `
        <div class="modal-overlay active" id="videoModal" onclick="closeVideoGallery(event)">
            <div class="modal-content video-modal" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeVideoGallery()">&times;</button>
                <h3>${title}</h3>
                <div class="video-wrapper">
                    <video id="videoPlayer" controls autoplay playsinline>
                        <source src="${videos[0]}" type="video/mp4">
                    </video>
                </div>
                <div class="gallery-dots" id="videoDots"></div>
                <p class="gallery-counter" id="videoCounter">1 / ${videos.length}</p>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    window.__videos = videos;
    window.__videoCurrent = 0;

    const dotsContainer = document.getElementById('videoDots');
    videos.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
        dot.onclick = () => switchVideo(i);
        dotsContainer.appendChild(dot);
    });

    // Swipe support
    const player = document.getElementById('videoPlayer');
    let touchStartX = 0;
    player.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
    player.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            const next = diff > 0 ? window.__videoCurrent + 1 : window.__videoCurrent - 1;
            const wrapped = (next + videos.length) % videos.length;
            switchVideo(wrapped);
        }
    });
}

function switchVideo(index) {
    window.__videoCurrent = index;
    const player = document.getElementById('videoPlayer');
    player.src = window.__videos[index];
    player.load();
    player.play();
    document.getElementById('videoCounter').textContent = `${index + 1} / ${window.__videos.length}`;
    updateVideoDots();
}

function updateVideoDots() {
    document.querySelectorAll('#videoDots .gallery-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === window.__videoCurrent);
    });
}

function closeVideoGallery() {
    const modal = document.getElementById('videoModal');
    if (modal) {
        const video = modal.querySelector('video');
        if (video) video.pause();
        modal.remove();
    }
}

// --- YOUTUBE GALLERY MODAL ---
function openYouTubeGallery(embedUrls, title) {
    const modalHTML = `
        <div class="modal-overlay active" id="videoModal" onclick="closeYouTubeGallery(event)">
            <div class="modal-content video-modal" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeYouTubeGallery()">&times;</button>
                <h3>${title}</h3>
                <div class="video-wrapper">
                  <iframe 
                      id="videoFrame"
                      src="${embedUrls[0]}"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowfullscreen>
                  </iframe>
                <div class="gallery-dots" id="videoDots"></div>
                <p class="gallery-counter" id="videoCounter">1 / ${embedUrls.length}</p>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    window.__embedUrls = embedUrls;
    window.__videoCurrent = 0;

    const dotsContainer = document.getElementById('videoDots');
    embedUrls.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
        dot.onclick = () => switchYouTube(i);
        dotsContainer.appendChild(dot);
    });
}

function switchYouTube(index) {
    window.__videoCurrent = index;
    document.getElementById('videoFrame').src = window.__embedUrls[index];
    document.getElementById('videoCounter').textContent = `${index + 1} / ${window.__embedUrls.length}`;
    document.querySelectorAll('#videoDots .gallery-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === window.__videoCurrent);
    });
}

function closeYouTubeGallery() {
    document.getElementById('videoModal')?.remove();
}