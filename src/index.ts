import saveMovie from "./lib/SaveMovie";
import getMovies from "./lib/getMovies";
import config from "./config";
import getMovieInfo from "./lib/getMovieInfo";
const page = process.argv[2] ||process.argv[3] || 0;//se obtiene el numero de pagina de la consola

const main = async (page: any) => {

  if(page === "0" || isNaN(page)) return console.log("No se ha especificado la pagina\nnpm start 1\nel numero de pagina debe ser mayor a 0 y se asigna luego del comando de inicio");
  
  const browser = await config.browser();
  const movies = await getMovies(page, browser); //Retorna todas las peliculas de la pagina 1  de sensacine.com excepto las de generio Erótico y Adulto
  
  //Recorre todas las peliculas de la pagina obtenidas y las guarda en la base de datos
  movies.forEach((movie, index) => {
    setTimeout(async () => {
      const movieInfo = await getMovieInfo(movie.url, browser).catch((err) => {
        console.log(err);
      });
      if (!movieInfo) return;
      saveMovie(movieInfo, config.BearerToken)
        .then(console.log)
        .catch((err) => {
          return err;
        });

      console.log(index+1 + " / " + movies.length);

      if (index === movies.length - 1) {//3 segundos despues de completar todas las peticiones se cierra el browser
      setTimeout(async () => {
        await browser.close();
      }, index * 3000);
    }
      
    }, index * 3000); //Cada 3 segundos se ejecuta una nueva peticion

    
  });
};

//ejecutar la funcion main con el numero de pagina que se desea obtener
main(page);
