const axios = require('axios').default;

const API_KEY = '28059098-e25ae0e870c106014b23bb5b1';
const BASE_URL = 'https://pixabay.com/api/';

export default class ImageApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }

  async fetchFotoUrl() {
    const searchParams = new URLSearchParams({
      q: `${this.searchQuery}`,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: this.per_page,
      page: this.page,
    });
    const response = await axios.get(
      `${BASE_URL}?key=${API_KEY}&${searchParams}`
    );

    this.incrementPage();

    return await response;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
