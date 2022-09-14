import Puppeteer from "puppeteer";
import { load } from "cheerio";
const BASE_URL = "https://www.sensacine.com/peliculas/todas-peliculas/"; //?page=1...2...3...4...5

const getMovies = async (pageNumber: number | string, browser: any) => {

  const page = await browser.newPage();
  await page.goto(`${BASE_URL}?page=${pageNumber}`, {
    waitUntil: "domcontentloaded",
  });

  const html = await page.content();

  const $ = load(html);
  const movies = $("li[class='mdl']");
  const moviesArray: any[] = [];
  movies.each((index, element) => {
    const bodyInfo = $(element).find("div[class='meta-body']").text();

    //excepciones de genero para las peliculas
    const exceptions = ["Erótico", "Adulto", "Romántico", "Drama"];
    if (
      exceptions.some((exception) => bodyInfo.includes(exception)) ||
      exceptions.some((exception) => bodyInfo.includes(" " + exception))
    )
      return;

    const movie = $(element);
    const url = movie.find("a[class='meta-title-link']").attr("href");
    const title = movie.find("h2.meta-title ").text().trim();
    if (!url || !title) return;
    const movieObject = {
      title,
      url: `https://www.sensacine.com${url}`,
    };
    moviesArray.push(movieObject);
  });
  //await browser.close();
  await page.close();
  return moviesArray;
};

export default getMovies;
