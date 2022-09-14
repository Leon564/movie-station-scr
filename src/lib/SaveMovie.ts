import axios from "axios";
import { Movie } from "../types/movie.types";

const saveMovie = async (movie:Movie, token:string) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const response = await axios.post(
    "https://movie-station.onrender.com/peliculas/create",
    movie,
    config
  ).catch((err) => {
    return err;
  });
  return response.data;
};

export default saveMovie;
