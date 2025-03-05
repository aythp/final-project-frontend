import axios from "axios";

const API_KEY = "4c2b98d248efaa8035b951b8303b65e7";
const BASE_URL = "https://api.themoviedb.org/3";

export async function getTopMovies() {
  try {
    const response = await axios.get(`${BASE_URL}trending/movie/week`, {
      params: {
        api_key: API_KEY,
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
    const response = await axios.get(`${BASE_URL}/trending/tv/week`, {
      params: {
        api_key: API_KEY,
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