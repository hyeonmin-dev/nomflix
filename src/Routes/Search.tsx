import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { searchMovie, searchTv } from "../api";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
    margin: 80px 0;
    padding: 0 60px;
`;
const Keyword = styled.div`
    padding: 20px 0;
    font-size: 24px;
    color: rgba(255,255,255,0.6);
`;
const Slider = styled.div`
  position: relative;
  margin: 30px 0 0;
  height: 250px;
`;
const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
  margin-top: 20px;
`;
const Box = styled(motion.div)`
  position: relative;
  background-color: ${props => props.theme.black.darker};
  height: 200px;
  font-size: 66px;
  background-size: cover;
  background-position: center center;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;
const Title = styled.h3`
  font-size: px;
`;
const Thumbnail = styled.div<{ bgPhoto: string }>`
  height: 100%;
  background-image: url("${props => props.bgPhoto}");
  background-size: cover;
  background-position: center center;
`;
const Info = styled(motion.div) <{ nothumb: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;  
  background-color: rgba(0,0,0,0);
  font-size:16px;
  text-align: center;
  opacity: ${props => props.nothumb};
  &:hover {
      opacity: 1;
      background-color: rgba(0,0,0,0.8);
      transition: all 0.2s ease;
  }
`;


interface IMovies {
    page: number,
    results: IMovie[],
    total_pages: number,
    total_results: number,
}

interface IMovie {
    id: number,
    poster_path: string,
    backdrop_path: string,
    title: string,
    overview: string,
    vote_average: string,
}

interface ITvs {
    page: number,
    results: ITv[],
    total_pages: number,
    total_results: number,
}

interface ITv {
    id: number,
    poster_path: string,
    backdrop_path: string,
    name: string,
    overview: string,
    vote_average: string,
}

const rowVariants = {
    start: {
        x: window.outerWidth,
    },
    animate: {
        x: 0,
    },
    exit: {
        x: -window.outerWidth,
    }
}

const offset = 6;

function Search() {
    const location = useLocation();
    const keyword = new URLSearchParams(location.search).get("keyword");
    const { data: movies, isLoading: movieLoading } = useQuery<IMovies>(["search", "movie"], () => searchMovie(keyword));
    const { data: tvs, isLoading: tvLoading } = useQuery<ITvs>(["search", "tv"], () => searchTv(keyword));
    const [movieIdx, setMovieIdx] = useState(0);
    const [movieLeaving, setMovieLeaving] = useState(false);
    const nextMovieIdx = () => {
        if (!movies) return;
        if (movieLeaving) return;
        setMovieLeaving(true);

        const totalMovies = movies.results.length - 1;
        const maxIndex = Math.floor(totalMovies / offset) - 1;
        setMovieIdx(movieIdx == maxIndex ? 0 : movieIdx + 1);
    };
    const toggleLeaving = () => setMovieLeaving(false);

    console.log(tvs);
    return (
        <Wrapper>
            <Keyword>
                Search Keyword : {keyword}
            </Keyword>

            <Slider>
                <Title>⭐️MOVIE</Title>
                <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                    <Row
                        key={movieIdx}
                        variants={rowVariants}
                        initial="start"
                        animate="animate"
                        exit="exit"
                        transition={{ type: "tween", duration: 1 }} >
                        {
                            movies?.results.slice(movieIdx * offset, movieIdx * offset + offset).map(
                                (movie) =>
                                    <Box key={movie.id}>
                                        <Thumbnail bgPhoto={
                                            movie.backdrop_path ? makeImagePath(movie.backdrop_path, "w500") : makeImagePath(movie.poster_path, "w500")}>
                                        </Thumbnail>

                                        <Info nothumb={!movie.backdrop_path && !movie.poster_path ? 1 : 0}>
                                            {movie.title}
                                        </Info>
                                    </Box>
                            )

                        }
                    </Row>
                </AnimatePresence>

                <button>&lt;</button>
                <button onClick={nextMovieIdx}>&gt;</button>
            </Slider>

            <Slider>
                <Title>⭐️TV</Title>
                <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                    <Row
                        key={movieIdx}
                        variants={rowVariants}
                        initial="start"
                        animate="animate"
                        exit="exit"
                        transition={{ type: "tween", duration: 1 }} >
                        {
                            tvs?.results.slice(movieIdx * offset, movieIdx * offset + offset).map(
                                (tv) =>
                                    <Box key={tv.id}>
                                        <Thumbnail bgPhoto={
                                            tv.backdrop_path ? makeImagePath(tv.backdrop_path, "w500") : makeImagePath(tv.poster_path, "w500")}>
                                        </Thumbnail>

                                        <Info nothumb={!tv.backdrop_path && !tv.poster_path ? 1 : 0}>
                                            {tv.name}
                                        </Info>
                                    </Box>
                            )

                        }
                    </Row>
                </AnimatePresence>
            </Slider>
        </Wrapper>
    );
}

export default Search;