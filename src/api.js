import axios from 'axios';
import Notiflix from 'notiflix';
export default class NewApi {
  constructor() {
    this.query = '';
    this.page = 1;
    this.length = '';
    this.notifi = '';
    this.totalHits = 0;
    this.hits = '';
  }

  async findPicture() {
    const axiosApi = axios.create({
      baseURL: `https://pixabay.com/api/`,
    });
    const API_KEY = '29770442-603a95234869127783f60906d';
    const result = await axiosApi.get(
      `?key=${API_KEY}&q=${this.query}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`
    );
    console.log(result);
    if (result.data.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    this.length = result.data.hits.length;
    this.totalHits = result.data.totalHits;

    // console.log(result.data.totalHits);
    // console.log(this.totalHits);
    return result.data.hits;
  }

  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }

  notifiSearch() {
    console.log(this.totalHits);
    return Notiflix.Notify.success(`Hooray! We found ${this.totalHits}images.`);
  }

  get searchQuery() {
    return this.query;
  }
  set searchQuery(newQuery) {
    this.query = newQuery;
  }
}
