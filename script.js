const galleryGrid = document.getElementById('gallery-grid');
const loadMoreBtn = document.getElementById('load-more');
const searchInput = document.getElementById('search-input');

const UNSPLASH_ACCESS_KEY = 'ZFG6nWiNTUBHJpXJX4L0Jl6pCS5ztfRqacT4ZTKmno4'; // Replace with your API key
let currentPage = 1;
const perPage = 12;

async function fetchImages(query = '', page = 1) {
    const url = query 
        ? `https://api.unsplash.com/search/photos?query=${query}&page=${page}&per_page=${perPage}`
        : `https://api.unsplash.com/photos?page=${page}&per_page=${perPage}`;

    const response = await fetch(url, {
        headers: {
            'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch images from Unsplash');
    }

    const data = await response.json();
    return query ? data.results : data;
}

function displayImages(images) {
    const fragment = document.createDocumentFragment();

    images.forEach(image => {
        const galleryItem = document.createElement('div');
        galleryItem.classList.add('gallery-item');
        galleryItem.innerHTML = `
            <img src="${image.urls.small}" alt="${image.alt_description || 'Unsplash Image'}">
            <div class="gallery-item-info">
                <h3>${image.description || 'Untitled'}</h3>
                <p>Photo by ${image.user.name} on Unsplash</p>
            </div>
        `;
        galleryItem.addEventListener('click', () => openLightbox(image.urls.regular, image.description || 'Untitled', `Photo by ${image.user.name} on Unsplash`));
        fragment.appendChild(galleryItem);
    });

    galleryGrid.appendChild(fragment);
}

async function loadImages() {
    try {
        const query = searchInput.value.trim();
        const images = await fetchImages(query, currentPage);
        displayImages(images);
        currentPage++;

        if (images.length < perPage) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading images:', error);
        alert('Failed to load images. Please try again.');
    }
}

function resetGallery() {
    galleryGrid.innerHTML = '';
    currentPage = 1;
    loadMoreBtn.style.display = 'block';
}

searchInput.addEventListener('input', debounce(() => {
    resetGallery();
    loadImages();
}, 300));

loadMoreBtn.addEventListener('click', loadImages);

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}


loadImages();
