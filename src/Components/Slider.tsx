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

const SliderWrap = styled.div`
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
const NextBtn = styled.button`
  position: absolute;
  right: 20;
  background-image: url("../image/next-arrow.svg");
  background-position: center center;
  background-color: transparent;
  background-size: 100%;
  width: 50px;
  height: 50px;
  border: 0;
  padding: 0;
  z-index: 1;
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

interface ISlider {
    data?: IGetMovieResult,
}

function Slider({ data }: ISlider) {
    const history = useHistory();
    const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
    const { scrollY } = useViewportScroll();
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const setClickedMovie = useSetRecoilState(selectMovieAtom);
    //const { data, isLoading } = useQuery<IGetMovieResult>(["movies", "nowPlaying"], getMovie);
    const increaseIndex = () => {
        if (data) {
            if (leaving) return;
            setLeaving(true);

            const totalMovies = data.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;

            setIndex(index == maxIndex ? 0 : index + 1);
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
    const onOverlayClick = () => {
        history.push(`/`);
    }

    return (
        <>
            <SliderWrap>
                <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                    <Row
                        key={index}
                        variants={rowVariant}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ type: "tween", duration: 1 }}
                    >
                        {data?.results
                            .slice(1)
                            .slice(offset * index, offset * index + offset)
                            .map((movie) => (
                                <Box
                                    layoutId={movie.id + ""}
                                    variants={boxVariants}
                                    initial="init"
                                    whileHover="hover"
                                    transition={{ type: "tween" }}
                                    key={movie.id}
                                    onClick={() => onBoxClick(movie.id)}
                                >
                                    <Thumbnail bgPhoto={makeImagePath(movie.backdrop_path, "w500")}></Thumbnail>
                                    <Info variants={InfoVariants}>
                                        <h4>{movie.title}</h4>
                                    </Info>
                                </Box>
                            ))}
                    </Row>

                    <NextBtn></NextBtn>
                </AnimatePresence>
            </SliderWrap>
        </>
    );
}

export default Slider;