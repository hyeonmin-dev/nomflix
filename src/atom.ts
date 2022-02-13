import { atom } from "recoil";
import { IMovie } from "./api";

export const selectMovieAtom = atom<IMovie>({
    key: "selectData",
    default: {
        id: 0,
        backdrop_path: "",
        poster_path: "",
        title: "",
        overview: "",
    },
});