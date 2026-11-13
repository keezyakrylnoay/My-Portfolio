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

// --- VIDEO CATEGORY GALLERY ---
// Data for the videos
// --- VIDEO GALLERY (Grid with inline player) ---
const videoData = [
    { id: 'V7hw62jBYhA', title: 'Facing Giants', desc: 'Documentary-style kinetic typography & B-roll edit' },
    { id: 'YEcuYZU6I8c', title: 'Drone Showcase 1', desc: 'Speed-ramped aerial view' },
    { id: 'OfZtgRnYhSI', title: 'Drone Showcase 2', desc: 'Smooth drone presentation' },
    { id: 'evBot6B2Bt0', title: 'Faith & Community', desc: 'Reflective short film' },
    { id: 'iUWOZD4MbIo', title: 'Demon Slayer AU', desc: 'Humorous Discord story' }
];

function openVideoGallery() {
    let gridHTML = '';
    videoData.forEach((video, index) => {
        gridHTML += `
            <div class="video-item">
                <div class="video-thumbnail" id="thumb-${index}">
                    <img src="https://img.youtube.com/vi/${video.id}/hqdefault.jpg" alt="${video.title}">
                    <button class="play-btn" onclick="openBigVideo(${index})">▶ Play Video</button>                </div>
                <div class="video-player-container" id="player-${index}" style="display: none;">
                    <iframe id="iframe-${index}" src="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
                <h4>${video.title}</h4>
                <p>${video.desc}</p>
            </div>
        `;
    });

    const modalHTML = `
        <div class="modal-overlay active" id="videoModal" onclick="closeVideoGallery(event)">
            <div class="modal-content wide-video-modal" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeVideoGallery()">&times;</button>
                <h3>Video Editing Portfolio</h3>
                <p class="portfolio-hint">Click "Play Video" to watch.</p>
                <div class="video-grid-wide">
                    ${gridHTML}
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// --- BIG POPUP VIDEO PLAYER ---
function openBigVideo(index) {
    // These parameters hide the YouTube titles, logos, and related videos as much as possible
    const videoUrl = `https://www.youtube.com/embed/${videoData[index].id}?autoplay=1&modestbranding=1&rel=0&showinfo=0&controls=1&iv_load_policy=3`;
    
    const modalHTML = `
        <div class="modal-overlay active" id="bigVideoModal" onclick="closeBigVideo(event)">
            <div class="modal-content big-video-modal" onclick="event.stopPropagation()">
                
                <!-- This creates the white space above the video for the X button -->
                <div class="video-modal-header">
                    <button class="modal-close-btn" onclick="closeBigVideo()">&times;</button>
                </div>
                
                <div class="big-video-wrapper">
                    <iframe src="${videoUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>

            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeBigVideo() {
    document.getElementById('bigVideoModal')?.remove();
}

function closeVideoGallery() {
    document.getElementById('videoModal')?.remove();
}

// --- CLEAN VIDEO PLAYER ---
function openVideoPlayer(startIndex, title) {
    let current = startIndex;

    const modalHTML = `
        <div class="modal-overlay active" id="videoPlayerModal" onclick="closeVideoPlayer(event)">
            <div class="modal-content player-modal" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeVideoPlayer()">&times;</button>
                <h3>${title}</h3>
                
                <div class="player-container">
                    <!-- Arrows are outside the video-wrapper -->
                    <button class="player-nav player-prev" onclick="changeVideo(-1)">&#10094;</button>
                    
                    <div class="video-wrapper">
                        <iframe 
                            id="videoFrame"
                            src="https://www.youtube.com/embed/${videoData[startIndex].id}?modestbranding=1&rel=0&showinfo=0&controls=1&autoplay=1"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen>
                        </iframe>
                    </div>
                    
                    <button class="player-nav player-next" onclick="changeVideo(1)">&#10095;</button>
                </div>
                
                <div class="gallery-dots" id="videoDots"></div>
                <p class="gallery-counter" id="videoCounter">${current + 1} / ${videoData.length}</p>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    window.__currentVideoIndex = current;

    // Build dots
    const dotsContainer = document.getElementById('videoDots');
    videoData.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'gallery-dot' + (i === current ? ' active' : '');
        dot.onclick = () => jumpToVideo(i);
        dotsContainer.appendChild(dot);
    });
}

function changeVideo(direction) {
    let newIndex = window.__currentVideoIndex + direction;
    if (newIndex < 0) newIndex = videoData.length - 1;
    if (newIndex >= videoData.length) newIndex = 0;
    jumpToVideo(newIndex);
}

function jumpToVideo(index) {
    window.__currentVideoIndex = index;
    document.getElementById('videoFrame').src = `https://www.youtube.com/embed/${videoData[index].id}?modestbranding=1&rel=0&showinfo=0&controls=1&autoplay=1`;
    document.getElementById('videoCounter').textContent = `${index + 1} / ${videoData.length}`;
    document.querySelectorAll('#videoDots .gallery-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function closeVideoPlayer() {
    document.getElementById('videoPlayerModal')?.remove();
}

// --- YOUTUBE GALLERY MODAL ---
function openYouTubeGallery(embedUrls, title) {
    const modalHTML = `
        <div class="modal-overlay active" id="videoModal" onclick="closeYouTubeGallery(event)">
            <div class="modal-content video-modal" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeYouTubeGallery()">&times;</button>
                <h3>${title}</h3>
                <div class="video-wrapper">
                    <!-- LEFT ARROW -->
                    <button class="gallery-nav gallery-prev" onclick="switchYouTube(window.__videoCurrent - 1)">&#10094;</button>
                    
                    <iframe 
                        id="videoFrame"
                        src="${embedUrls[0]}?modestbranding=1&rel=0&showinfo=0&controls=1"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen>
                    </iframe>
                    
                    <!-- RIGHT ARROW -->
                    <button class="gallery-nav gallery-next" onclick="switchYouTube(window.__videoCurrent + 1)">&#10095;</button>
                </div>
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

// Updated switch function to handle wrap-around (clicking left on the first video goes to the last video)
function switchYouTube(index) {
    const total = window.__embedUrls.length;
    if (index < 0) index = total - 1;
    if (index >= total) index = 0;
    
    window.__videoCurrent = index;
    document.getElementById('videoFrame').src = window.__embedUrls[index];
    document.getElementById('videoCounter').textContent = `${index + 1} / ${total}`;
    
    document.querySelectorAll('#videoDots .gallery-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === window.__videoCurrent);
    });
}

function closeYouTubeGallery() {
    document.getElementById('videoModal')?.remove();
}

// --- WIDE CLICK MODAL FOR EXPERIENCE ---
function openExpModal(title, description) {
    if (document.getElementById('expModal')) return;

    const modalHTML = `
        <div class="modal-overlay active" id="expModal" onclick="closeExpModal()">
            <div class="modal-content wide-exp-modal" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeExpModal()">&times;</button>
                <h3>${title}</h3>
                <p>${description}</p>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeExpModal() {
    document.getElementById('expModal')?.remove();
}

// Automatically close the popup when the user scrolls down
window.addEventListener('scroll', () => {
    closeExpModal();
});