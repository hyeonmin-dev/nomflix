import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { getComingMovie, getMovie, getTopMovie, IGetMovieResult } from "../api";
import { makeImagePath } from "../utils";
import Slider from "../Components/Slider"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { selectMovieAtom } from "../atom";

const Wrapper = styled.div`
    height: 120vh;
    background-color: black;
`;
const Loading = styled.div`
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const Banner = styled.div<{ bgPhoto: string }>`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 30px;
    background-image: linear-gradient(to left, rgba(0,0,0,0), rgba(0,0,0,1)) ,url("${props => props.bgPhoto}");
    background-size: cover;
    background-position: center 25%;
`;
const Title = styled.h2`
    font-size: 50px;
    margin-bottom: 20px;
`;
const Overview = styled.p`
    font-size: 24px;
    font-weight: 300;
    width: 50%;
    line-height: 30px;
`;
const SliderWrap = styled.div`
    
`;
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;
const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
`;
const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

const rowVariant = {
    hidden: {
        x: window.outerWidth + 5,
    },
    visible: {
        x: 0,
    },
    exit: {
        x: -window.outerWidth - 5,
    }

}
const boxVariants = {
    init: {

    },
    hover: {
        y: -50,
        scale: 1.2,
        transition: {
            type: "tween",
            duration: 0.3,
            delay: 0.3,
        }
    }
}
const InfoVariants = {
    hover: {
        opacity: 1,
        transition: {
            duration: 0.3,
            delay: 0.3,
        }
    }
}

const offset = 6; // box max count
const sliderInfo = {
    "NOW": {
        index: 0,
        title: "NOW MOVIE",
        key: "NOW"
    },
    "TOP": {
        index: 0,
        title: "TOP MOVIE",
        key: "TOP",
    },
    "UP": {
        index: 0,
        title: "COMMING MOVIE",
        key: "UP",
    }
};

function Home() {
    const history = useHistory();
    const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
    const { scrollY } = useViewportScroll();
    const clickedMovie = useRecoilValue(selectMovieAtom);
    const { data: nowMovies, isLoading: nowMovieLoading } = useQuery<IGetMovieResult>(["movies", "nowPlaying"], getMovie);
    const { data: topMovies, isLoading: topMovieLoading } = useQuery<IGetMovieResult>(["movies", "topMovie"], getTopMovie);
    const { data: upMovies } = useQuery<IGetMovieResult>(["movies", "upMovie"], getComingMovie);
    const onOverlayClick = () => {
        history.push(`/`);
    }
    /*const clickedMovie = (
        bigMovieMatch?.params.movieId && nowMovies?.results.find((movie) =>
            bigMovieMatch.params.movieId == String(movie.id)
        )
    );*/

    return (
        <Wrapper>
            {
                nowMovieLoading ?
                    <Loading />
                    :
                    <>
                        <Banner bgPhoto={makeImagePath(nowMovies?.results[0].poster_path || "")}>
                            <Title>{nowMovies?.results[0].title}</Title>
                            <Overview>{nowMovies?.results[0].overview}</Overview>
                        </Banner>

                        <SliderWrap>
                            <Slider sliderInfo={sliderInfo.TOP} data={topMovies}></Slider>
                            <Slider sliderInfo={sliderInfo.NOW} data={nowMovies}></Slider>
                            <Slider sliderInfo={sliderInfo.UP} data={upMovies}></Slider>
                        </SliderWrap>

                        <AnimatePresence>
                            {bigMovieMatch ? (
                                <>
                                    <Overlay onClick={onOverlayClick} animate={{ opacity: 1 }} />
                                    <BigMovie
                                        layoutId={bigMovieMatch.params.movieId}
                                        style={{
                                            top: scrollY.get() + 100,
                                        }}
                                    >
                                        {
                                            clickedMovie && <>
                                                <BigCover
                                                    style={{
                                                        backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                                            clickedMovie.backdrop_path,
                                                            "w500"
                                                        )})`,
                                                    }}
                                                />
                                                <BigTitle>{clickedMovie.title}</BigTitle>
                                                <BigOverview>{clickedMovie.overview}</BigOverview>
                                            </>
                                        }
                                    </BigMovie>
                                </>
                            ) : null}
                        </AnimatePresence>
                    </>
            }
        </Wrapper >
    );
}

export default Home;