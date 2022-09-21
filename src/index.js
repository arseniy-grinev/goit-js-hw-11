import './css/styles.css';

import temp from './template.hbs';
import Notiflix from 'notiflix';
import NewApi from './api';

import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadBtn: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onSubmit);
refs.loadBtn.addEventListener('click', onLoadMore);

const newApi = new NewApi();

let gallery = '';

function onSubmit(e) {
  e.preventDefault();
  refs.gallery.innerHTML = '';
  newApi.searchQuery = e.currentTarget.elements.searchQuery.value.trim();

  newApi.resetPage();
  findPictureRenderUi();
}

function renderPicture(picture) {
  refs.gallery.insertAdjacentHTML('beforeend', temp(picture));
}

function onLoadMore() {
  newApi.incrementPage();
  loadMoreRenderUi();
}

async function findPictureRenderUi() {
  try {
    const answerFromApi = await newApi.findPicture();
    console.log(newApi.length);

    if (newApi.query === '') {
      refs.loadBtn.classList.add('is-hidden');
      return Notiflix.Notify.failure(`Please enter a query`);
    }
    if (newApi.length < 40) {
      refs.loadBtn.classList.add('is-hidden');
    } else {
      refs.loadBtn.classList.remove('is-hidden');

      newApi.notifiSearch();
    }

    renderPicture(answerFromApi);
    gallery = new simpleLightbox('.gallery a');
  } catch (error) {
    console.log(error);
  }
}

async function loadMoreRenderUi() {
  try {
    const loadMoreAnswerFromApi = await newApi.findPicture();
    // if (newApi.length < 40) {
    //   refs.loadBtn.classList.add('is-hidden');
    // }
    if (newApi.length === 0) {
      refs.loadBtn.classList.add('is-hidden');
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
    renderPicture(loadMoreAnswerFromApi);
    slowScroll();
    gallery.refresh();
  } catch (error) {
    console.log(error);
  }
}

function slowScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery a')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
