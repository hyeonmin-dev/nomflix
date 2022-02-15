const API_KEY = "4d3fc893db8585a48ee656d5e46dfe97";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IGetMovieResult {
    dates: {
        maximum: string,
        minimum: string
    },
    page: number,
    results: IMovie[],
    total_pages: number,
    total_results: number,
}
export interface IMovie {
    id: number,
    backdrop_path: string,
    poster_path: string,
    title: string,
    overview: string,
    vote_average: number,
}

export function getMovie() {
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
        (response) => response.json()
    );
}

export function getTopMovie() {
    return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then(
        (response) => response.json()
    );
}

export function getComingMovie() {
    return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(
        (response) => response.json()
    );
}

export function getMovieDetail(movieId: number) {
    return fetch(`${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}`).then(
        (response) => response.json()
    );
}

export function searchMovie(keyword: string | null) {
    return fetch(`${BASE_PATH}/search/movie/?api_key=${API_KEY}&query=${keyword}`).then(
        (response) => response.json()
    );
}

export function searchTv(keyword: string | null) {
    return fetch(`${BASE_PATH}/search/tv/?api_key=${API_KEY}&query=${keyword}`).then(
        (response) => response.json()
    );
}