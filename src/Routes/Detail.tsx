import { useQuery } from "react-query";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import { getMovieDetail, getRecommendMovie } from "../api";
import { makeImagePath } from "../utils";

const Wrapper = styled.div``;
const Banner = styled.div<{ bgPhoto: string }>`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 30px;
    background-image: linear-gradient(to left, rgba(0,0,0,0), rgba(0,0,0,1)) ,url("${props => props.bgPhoto}");
    background-size: cover;
    background-position: center 25%;
    opacity: 0.4;
`;
const MovieBox = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    height: 100vh;
    padding: 100px;
    flex-direction: column;
`;
const Movie = styled.div`
   display: flex;
`;
const Poster = styled.div<{ bgPhoto: string }>`
  width: 230px;
  height: 300px;
  background-image: url("${props => props.bgPhoto}");
  background-size: cover;
  background-position: center center;
  border-radius: 10px;
`;
const Desc = styled.div`
    position: relative;
    width: calc(100% - 230px);
    padding-left: 40px;
`;
const Title = styled.h2`
    font-size: 30px;
    margin-bottom: 20px;
`;
const Overview = styled.p`
    font-size: 16px;
    font-weight: 300;
    width: 50%;
    min-height: 90px;
    line-height: 30px;
`;
const Genres = styled.ul`
    font-size: 12px;
    opacity: 0.6;
    margin-bottom: 10px;
    li {
        float: left;
        font-weight: 300;
        &:nth-child(n+2) {
            &:before {
                content: "|";
                display: inline-block;
                padding: 0 5px;
            }
        }
    }
    &:after {
        content: "";
        clear: both;
        display: block;
    }
`;
const Rate = styled.div`
    position: absolute;
    top: 10px;
    right: 30px;
    text-align: right;
    font-size: 24px;
    font-weight: 300;
    p {
        font-size: 12px;
        color: ${props => props.theme.emp};
        margin-top: 5px;
    }
`;
const Link = styled.a`
    display: flex;
    background-color: ${props => props.theme.black.lighter};
    font-weight: 300;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    img {
        width: 20px;
    }
`;
const Recommends = styled.div`
    display: grid;
    gap: 20px;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    width: 100%;
    margin-top: 50px;
    padding: 0 80px;
`;
const Box = styled.div`
  position: relative;
  background-color: ${props => props.theme.black.darker};
  height: 230px;
  font-size: 66px;
  background-size: cover;
  background-position: center center;
  border-radius: 5px;
  overflow: hidden;
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
const Info = styled.dl`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  font-size:16px;
  padding: 10px;
  background-color: rgba(0,0,0,0.6);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  dd {
    width: 100%;
    margin-bottom: 5px;
    &:nth-child(1) {
        font-size: 12px;
        color: #aaa;
        span {
            margin-left: 10px;
            color: ${props => props.theme.emp};
        }
    }
    &:nth-child(2) {
        height: 40px;
        line-height: 20px;
    }
  }
`;

interface IDetail {
    id: number,
    backdrop_path: string,
    poster_path: string,
    genres: [{
        id: number,
        name: string,
    }],
    title: string,
    overview: string,
    video: boolean,
    vote_average: number,
    vote_count: number,
    release_date: string,
    runtime: number,
    homepage: string,
}

interface IRecommends {
    page: number,
    results: IRecommend[],
    total_pages: number,
    total_results: number,
}

interface IRecommend {
    id: number,
    poster_path: string,
    backdrop_path: string,
    title: string,
    overview: string,
    vote_average: string,
    original_language: string,
    first_air_date: string,
}

function Detail() {
    const location = useLocation();
    const history = useHistory();
    const id = Number(new URLSearchParams(location.search).get("id"));
    const { data: movie, isLoading } = useQuery<IDetail>(["movie", id], () => getMovieDetail(id));
    const { data: recommends } = useQuery<IRecommends>(["movie", "recommend", id], () => getRecommendMovie(id));
    const goOnDetail = (id: number) => {
        history.push(`/detail?id=${id}`);
    };

    return (
        <Wrapper>
            <Banner bgPhoto={makeImagePath(movie?.poster_path || "")}></Banner>
            <MovieBox>
                <Movie>
                    <Poster bgPhoto={makeImagePath(movie?.backdrop_path || "")}></Poster>
                    <Desc>
                        <Title>{movie?.title} ({movie?.release_date.substring(0, 4)})</Title>
                        <Genres>
                            {movie?.genres.map((i) => {
                                return <li key={i.id}>{i.name}</li>;
                            })}
                        </Genres>
                        <Overview>{movie?.overview}</Overview>
                        {movie?.homepage ? <Link href={movie?.homepage} target="_blank"><img src={require("../image/homepage.png")} /></Link> : ""}

                        <Rate>
                            {movie?.vote_average} / 10
                            <p>
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
                                    if (!movie) {
                                        return "☆";
                                    }
                                    if (i > movie?.vote_average) {
                                        return "☆";
                                    } else {
                                        return "★";
                                    }
                                })}
                            </p>
                        </Rate>
                    </Desc>
                </Movie>
                <Recommends>
                    {
                        recommends?.results.slice(0, 5).map(
                            (recommend) =>
                                <Box key={recommend.id} onClick={() => goOnDetail(recommend.id)}>
                                    <Thumbnail bgPhoto={
                                        recommend.backdrop_path ? makeImagePath(recommend.backdrop_path, "w500") : makeImagePath(recommend.poster_path, "w500")}>
                                    </Thumbnail>

                                    <Info>
                                        <dd>{recommend.original_language.toUpperCase()} <span>{recommend.first_air_date}</span></dd>
                                        <dd>{recommend.title}</dd>
                                    </Info>
                                </Box>
                        )
                    }
                </Recommends>
            </MovieBox>
        </Wrapper>
    );
}

export default Detail;