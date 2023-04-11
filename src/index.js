import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const lightbox = new SimpleLightbox('.gallery a');

import { fetchImages } from './fetchImages.js';

const inputForm = document.body.querySelector('input[type="text"]');
const searchForm = document.body.querySelector('.search-form');
const galleryCard = document.body.querySelector('.gallery');
const loadMoreButton = document.body.querySelector('.load-more');

let pageNumber = 1;

loadMoreButton.style.display = 'none';

searchForm.addEventListener('submit', event => {
  event.preventDefault();
  loadMoreButton.style.display = 'none';
  resetGallery();
  findImages();
});

const findImages = async () => {
  const trimmedValue = inputForm.value.trim();
  const images = await fetchImages(trimmedValue, pageNumber);

  if (images.hits.length > 0) {
    renderImages(images.hits);
    lightbox.refresh();
    Notify.success(`Hooray! We found ${images.totalHits} images.`);
  } else {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
};

function renderImages(images) {
  const markup = images
    .map(image => {
      return `<div class="photo-card">
            <a href="${image.largeImageURL}"><img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" width="420" height="300"/></a>
            <div class="info">
              <p class="info-item">
                <b class="info-name">Likes</b>
                <span class="info-desc">${image.likes}</span>
              </p>
              <p class="info-item">
                <b class="info-name">Views</b>
                <span class="info-desc">${image.views}</span>
              </p>
              <p class="info-item">
                <b class="info-name">Comments</b>
                <span class="info-desc">${image.comments}</span>
              </p>
              <p class="info-item">
                <b class="info-name">Downloads</b>
                <span class="info-desc">${image.downloads}</span>
              </p>
            </div>
          </div>`;
    })
    .join('');

  galleryCard.insertAdjacentHTML('beforeend', markup);

  loadMoreButton.style.display = 'block';

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function resetGallery() {
  pageNumber = 1;
  galleryCard.innerHTML = '';
}

loadMoreButton.addEventListener('click', event => {
  event.preventDefault();
  onLoadMore();
});

async function onLoadMore() {
  pageNumber++;
  const trimmedValue = inputForm.value.trim();
  const images = await fetchImages(trimmedValue, pageNumber);
  renderImages(images.hits);
  lightbox.refresh();

  const imagesValue = document.body.querySelectorAll('.photo-card');
  if (images.totalHits === imagesValue.length) {
    loadMoreButton.style.display = 'none';
  } else if (images.totalHits < imagesValue.length) {
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
    loadMoreButton.style.display = 'none';
  }
  }
