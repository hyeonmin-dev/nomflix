import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { getMovie, IGetMovieResult } from "../api";
import { selectMovieAtom } from "../atom";
import { makeImagePath } from "../utils";

const FlixSlider = styled.div`
  position: relative;
  padding: 0 0 200px;
  margin: 0 30px;
  top: -100px;
  overflow:hidden;
`;
const FlixTitle = styled.h3`
    font-size: 24px;
    padding: 50px 0 20px;
`;
const Row = styled(motion.div)`
  position: absolute;
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  width: 100%;
  &:first-child {
    y: -100;
  }
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
  position: absolute;
  bottom: 0;
  left: 0;
  opacity: 0;
  padding: 5px;
  background-image: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.6));
  h4 {
      font-size: 18px;
  }
`;
const Rate = styled(motion.span)`
  position: absolute;
  opacity: 0;
  top: 10px;
  right: 10px;
  font-size: 14px;
  i {
      display: inline-block;
      margin-bottom: 5px;
      font-size: 10px;
      vertical-align: middle;
  }
`;

const SliderButton = styled.button`
  position: absolute;
  bottom: 0;
  background-color: transparent;
  background-position: center center;
  background-size: 100%;
  background-repeat: no-repeat;
  width: 50px;
  height: 200px;
  border: 0;
  padding: 0;   
  cursor: pointer;
  img {
      width: 30px;
      opacity: 0.8;
  }
`;
const NextBtn = styled(SliderButton)`
  text-align: right;
  right: 0;
`;
const PrevBtn = styled(SliderButton)`
  text-align: left;
  left: 0;
`;


const rowVariant = {
    hidden: (isBack: boolean) => ({
        x: isBack ? - window.outerWidth - 5 : window.outerWidth + 5,
    }),
    visible: {
        x: 0,
    },
    exit: (isBack: boolean) => ({
        x: isBack ? window.outerWidth + 5 : -window.outerWidth - 5,
    })

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

interface ISlider {
    sliderInfo: {
        index: number,
        title: string,
        key: string,
    },
    data?: IGetMovieResult,
}

function Slider({ sliderInfo, data }: ISlider) {
    const history = useHistory();
    const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
    const [back, setBack] = useState(false);
    const [leaving, setLeaving] = useState(false);
    const setClickedMovie = useSetRecoilState(selectMovieAtom);
    //const { data, isLoading } = useQuery<IGetMovieResult>(["movies", "nowPlaying"], getMovie);
    const increaseIndex = () => {
        if (data) {
            if (leaving) return;
            setBack(false);
            setLeaving(true);

            const totalMovies = data.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            sliderInfo.index = sliderInfo.index == maxIndex ? 0 : sliderInfo.index + 1;
        }
    };
    const decreaseIndex = () => {
        if (data) {
            if (leaving) return;
            setBack(true);
            setLeaving(true);

            const totalMovies = data.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            sliderInfo.index = sliderInfo.index == 0 ? maxIndex : sliderInfo.index - 1;
        }
    };
    const toggleLeaving = () => setLeaving(false);
    const onBoxClick = (movieId: number) => {
        var clickedMovie = movieId && data?.results.find((movie) =>
            movieId == movie.id
        )
        if (clickedMovie) {
            setClickedMovie(clickedMovie);
        }

        history.push(`/movies/${movieId}`);
    };

    return (
        <>
            <FlixSlider>
                <FlixTitle>{sliderInfo.title}.</FlixTitle>
                <AnimatePresence custom={back} initial={false} onExitComplete={toggleLeaving}>
                    <Row
                        key={`${sliderInfo.key}${sliderInfo.index}`}
                        variants={rowVariant}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ type: "tween", duration: 1 }}
                        custom={back}
                    >
                        {data?.results
                            .slice(1)
                            .slice(offset * sliderInfo.index, offset * sliderInfo.index + offset)
                            .map((movie) => (
                                <Box
                                    layoutId={`${sliderInfo.key}${movie.id}`}
                                    variants={boxVariants}
                                    initial="init"
                                    whileHover="hover"
                                    transition={{ type: "tween" }}
                                    key={`${sliderInfo.key}${movie.id}`}
                                    onClick={() => onBoxClick(movie.id)}
                                >
                                    <Thumbnail bgPhoto={makeImagePath(movie.backdrop_path, "w500")}></Thumbnail>
                                    <Info variants={InfoVariants}>
                                        <h4>{movie.title}</h4>
                                    </Info>
                                    <Rate variants={InfoVariants}>
                                        <i>⭐️</i> {movie.vote_average}
                                    </Rate>
                                </Box>
                            ))}
                    </Row>
                </AnimatePresence>

                <NextBtn key={`${sliderInfo.key}next`} onClick={increaseIndex}><img src={require("../image/right-arrow.png")} /></NextBtn>
                <PrevBtn key={`${sliderInfo.key}prev`} onClick={decreaseIndex}><img src={require("../image/left-arrow.png")} /></PrevBtn>
            </FlixSlider>
        </>
    );
}

export default Slider;