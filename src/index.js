import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ImageApiService from './js/image-pixaby-api';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  captionsData: 'alt',
});

refs.form.addEventListener('submit', showGallery);
refs.loadMoreBtn.addEventListener('click', loadMore);

refs.loadMoreBtn.classList.add('is-hidden');

const newImageApiService = new ImageApiService();

async function showGallery(e) {
  e.preventDefault();
  refs.gallery.innerHTML = '';
  refs.loadMoreBtn.classList.add('is-hidden');

  newImageApiService.query = e.currentTarget.elements.searchQuery.value.trim();
  newImageApiService.resetPage();

  if (newImageApiService.query === '') {
    Notify.warning('Enter your search query');
    return;
  }
  if (newImageApiService.query !== '') {
    try {
      const response = await newImageApiService.fetchFotoUrl();
      refs.loadMoreBtn.classList.remove('is-hidden');
      createImageElement(response);
    } catch (error) {
      console.log(error);
    }
  }
}

async function loadMore() {
  try {
    refs.loadMoreBtn.classList.add('is-hidden');
    const response = await newImageApiService.fetchFotoUrl();
    refs.loadMoreBtn.classList.remove('is-hidden');
    createImageElement(response);
  } catch (error) {
    console.error(error);
  }
}

function createImageElement(images) {
  const imageArray = images.data.hits;

  if (imageArray.length === 0) {
    refs.loadMoreBtn.classList.add('is-hidden');
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again'
    );
    throw new Error(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  if (imageArray !== 0) {
    if (images.data.totalHits < newImageApiService.page * imageArray.length) {
      refs.loadMoreBtn.classList.add('is-hidden');
      Notify.info(`We're sorry, but you've reached the end of search results.`);
    }
    const markup = imageArray
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => {
          return `<div class="photo-card"><a class="gallery__item" href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
                <p class="info-item red">
                <b><span>Likes:</span> ${likes}</b>
                </p>
                <p class="info-item blue">
                <b><span>Views:</span> ${views}</b>
                </p>
                <p class="info-item violet">
                <b><span>Comments:</span> ${comments}</b>
                </p>
                <p class="info-item green">
                <b><span>Downloads:</span> ${downloads}</b>
                </p>
            </div>
            </a>
            </div>`;
        }
      )
      .join('');
    refs.gallery.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();
  } else {
    refs.loadMoreBtn.classList.add('is-hidden');
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again'
    );
  }
}
