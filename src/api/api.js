import axios from "axios";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export async function getTrending(mediaType, timeWindow) {
  try {
    let endpoint;
    if (timeWindow === 'week') {
      endpoint = `/trending/${mediaType}/week`;
    } else if (timeWindow === 'year') {
      endpoint = `/${mediaType}/popular`;
    } else {
      endpoint = `/${mediaType}/top_rated`;
    }

    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      params: {
        api_key: API_KEY,
        language: 'es-ES',
        sort_by: 'vote_count.desc',
        'vote_count.gte': 15000
      }
    });

    return response.data.results || [];
  } catch (error) {
    console.error("Error al obtener contenido de TMDB:", error.response?.data || error.message);
    return [];
  }
}

export async function getTopMovies() {
  try {
    const response = await axios.get(`${BASE_URL}/discover/movie`, {
      params: {
        api_key: API_KEY,
        language: 'es-ES',
        sort_by: 'vote_count.desc',
        'vote_count.gte': 15000,
        page: 1
      },
    });

    return response.data.results || [];
  } catch (error) {
    console.error("Error al obtener películas de TMDB:", error.response?.data || error.message);
    return [];
  }
}

export async function getTopSeries() {
  try {
    const response = await axios.get(`${BASE_URL}/discover/tv`, {
      params: {
        api_key: API_KEY,
        language: 'es-ES',
        sort_by: 'vote_count.desc',
        'vote_count.gte': 15000,
        page: 1
      },
    });

    return response.data.results || [];
  } catch (error) {
    console.error("Error al obtener series de TMDB:", error.response?.data || error.message);
    return [];
  }
}

export async function getCombinedMedia() {
    const movies = await getTopMovies();
    const series = await getTopSeries();

    const combinedMedia = [];
    const maxLength = Math.max(movies.length, series.length);

    for (let i = 0; i < maxLength; i++) {
        if (movies[i]) {
            combinedMedia.push({ ...movies[i], type: 'movie' });
        }
        if (series[i]) {
            combinedMedia.push({ ...series[i], type: 'series' });
        }
    }

    for (let i = combinedMedia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [combinedMedia[i], combinedMedia[j]] = [combinedMedia[j], combinedMedia[i]];
    }

    return combinedMedia;
}



