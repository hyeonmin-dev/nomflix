import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovie, IGetMovieResult } from "../api";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
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
const Slider = styled.div`
  position: relative;
  top: -100px;
`;
const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;
const Box = styled(motion.div) <{ bgPhoto: string }>`
  background-color: white;
  height: 200px;
  color: red;
  font-size: 66px;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
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

const offset = 6; // box max count

function Home() {
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const { data, isLoading } = useQuery<IGetMovieResult>(["movies", "nowPlaying"], getMovie);
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
    return (
        <Wrapper>
            {
                isLoading ?
                    <Loading />
                    :
                    <>
                        <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")} onClick={increaseIndex}>
                            <Title>{data?.results[0].title}</Title>
                            <Overview>{data?.results[0].overview}</Overview>
                        </Banner>

                        <Slider>
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
                                                key={movie.id}
                                                bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                                            />
                                        ))}
                                </Row>
                            </AnimatePresence>
                        </Slider>
                    </>
            }
        </Wrapper>
    );
}

export default Home;