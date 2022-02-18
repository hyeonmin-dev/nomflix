import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { useHistory, useLocation } from "react-router-dom";
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
const List = styled(motion.div)`
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  width: 100%;
  margin-top: 20px;
`;
const Box = styled(motion.div)`
  position: relative;
  background-color: ${props => props.theme.black.darker};
  height: 300px;
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
  span {
      position: absolute;
      top: 5px;
      left: 5px;
      background-color: rgba(0,0,0,0.8);
      font-size: 10px;
      padding: 5px 7px;
      border-radius: 2px;
  }
`;
const Info = styled(motion.dl)`
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
    &:nth-child(3) {
        font-size: 12px;
    }
  }
`;
const Empty = styled.div`
  width: 100%;
  padding: 200px 0;
  text-align: center;
  font-size: 40px;
  opacity: 0.6;
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
    original_language: string,
    release_date: string,
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
    original_language: string,
    first_air_date: string,
}

const offset = 6;
function Search() {
    const location = useLocation();
    const history = useHistory();
    const keyword = new URLSearchParams(location.search).get("keyword");
    const { data: movies, isLoading: movieLoading, refetch: refetchMovie } = useQuery<IMovies>(["search", "movie"], () => searchMovie(keyword));
    const { data: tvs, isLoading: tvLoading, refetch: refetchTV } = useQuery<ITvs>(["search", "tv"], () => searchTv(keyword));
    const goOnDetail = (id: number) => {
        history.push(`/detail?id=${id}`);
    };
    useEffect(() => {
        refetchMovie();
        refetchTV();
    }, [keyword]);


    return (
        <Wrapper>
            <Keyword>
                Search Keyword : {keyword}
            </Keyword>

            {movies?.results.length == 0 && tvs?.results.length == 0 ?
                <Empty>Nothing :(</Empty>
                :
                <List>
                    <AnimatePresence initial={false}>
                        {
                            movies?.results.map(
                                (movie) =>
                                    <Box key={movie.id} onClick={() => goOnDetail(movie.id)}>
                                        <Thumbnail bgPhoto={
                                            movie.backdrop_path ? makeImagePath(movie.backdrop_path, "w500") : makeImagePath(movie.poster_path, "w500")}>
                                        </Thumbnail>

                                        <Info>
                                            <dd>{movie.original_language.toUpperCase()} <span>{movie.release_date}</span></dd>
                                            <dd>{movie.title}</dd>
                                            <dd>★ {movie.vote_average} / 10</dd>
                                        </Info>
                                    </Box>
                            )

                        }
                    </AnimatePresence>

                    <AnimatePresence initial={false}>
                        {
                            tvs?.results.map(
                                (tv) =>
                                    <Box key={tv.id} onClick={() => goOnDetail(tv.id)}>
                                        <Thumbnail bgPhoto={
                                            tv.backdrop_path ? makeImagePath(tv.backdrop_path, "w500") : makeImagePath(tv.poster_path, "w500")}>
                                            <span>TV Series</span>
                                        </Thumbnail>

                                        <Info>
                                            <dd>{tv.original_language.toUpperCase()} <span>{tv.first_air_date}</span></dd>
                                            <dd>{tv.name}</dd>
                                            <dd>★ {tv.vote_average} / 10</dd>
                                        </Info>
                                    </Box>
                            )
                        }
                    </AnimatePresence>
                </List>
            }
        </Wrapper>
    );
}

export default Search;