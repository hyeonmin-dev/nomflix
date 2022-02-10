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
interface IMovie {
    id: number,
    backdrop_path: string,
    poster_path: string,
    title: string,
    overview: string,
}
export function getMovie() {
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
        (response) => response.json()
    );
}