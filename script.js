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
