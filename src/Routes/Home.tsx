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
    background-image: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1)) ,url("${props => props.bgPhoto}");
    background-size: 
`;
const Title = styled.h2`
    font-size: 50px;
    margin-bottom: 20px;
`;
const Overview = styled.p`
    font-size: 24px;
    width: 50%;
`;
const SliderBox = styled.div`
  position: relative;
  top: -100px;
  height: 250px;
`;
const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;
const Box = styled(motion.div)`
  background-color: white;
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
const Thumbnail = styled.div<{ bgPhoto: string }>`
  height: 100%;
  background-image: url("${props => props.bgPhoto}");
  background-size: cover;
  background-position: center center;
`;
const Info = styled(motion.div)`
  opacity: 0;
  padding: 5px;
  background-color: ${props => props.theme.black.lighter};
  h4 {
      font-size: 18px;
      text-align: center;      
  }
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

function Home() {
    const history = useHistory();
    const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
    const { scrollY } = useViewportScroll();
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
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
                        <Banner bgPhoto={makeImagePath(nowMovies?.results[0].backdrop_path || "")}>
                            <Title>{nowMovies?.results[0].title}</Title>
                            <Overview>{nowMovies?.results[0].overview}</Overview>
                        </Banner>

                        <Slider data={nowMovies}></Slider>
                        <Slider data={topMovies}></Slider>
                        <Slider data={upMovies}></Slider>

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
        </Wrapper>
    );
}

export default Home;