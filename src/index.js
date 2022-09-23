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
// refs.loadBtn.addEventListener('click', onLoadMore);

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
    if (newApi.length < 30) {  //   отключил кнопку
      
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

(() => {
  window.addEventListener('scroll', throttle(checkPosition, 250))
  window.addEventListener('resize', throttle(checkPosition, 250))
})()

function throttle(callee, timeout) {
  let timer = null

  return function perform(...args) {
    if (timer) return

    timer = setTimeout(() => {
      callee(...args)

      clearTimeout(timer)
      timer = null
    }, timeout)
  }
}


function checkPosition() {
  // Нам потребуется знать высоту документа и высоту экрана:
  const height = document.body.offsetHeight
  const screenHeight = window.innerHeight

  // Они могут отличаться: если на странице много контента,
  // высота документа будет больше высоты экрана (отсюда и скролл).

  // Записываем, сколько пикселей пользователь уже проскроллил:
  const scrolled = window.scrollY

  // Обозначим порог, по приближении к которому
  // будем вызывать какое-то действие.
  // В нашем случае — четверть экрана до конца страницы:
  const threshold = height - screenHeight / 4

  // Отслеживаем, где находится низ экрана относительно страницы:
  const position = scrolled + screenHeight

  if (position >= threshold) {
    onLoadMore();
    // Если мы пересекли полосу-порог, вызываем нужное действие.
  }
}
