import { load } from "cheerio";
import { Movie } from "../types/movie.types";

const getMovieInfo = async (
  url: string,
  browser: any
): Promise<Movie | undefined> => {
  if (!url) return;
  const page = await browser.newPage();
  await page
    .goto(url, { waitUntil: "domcontentloaded" })
    .catch(async (err: any) => {
      console.log("error en la peticion", url);
      await page.close();
      return;
    });
  const html = await page.content();
  const $ = load(html);
  let movie: Movie = {} as Movie;
  // get movie info
  movie.nombre = $("div[class='titlebar-title titlebar-title-lg']")
    .text()
    .trim();
  movie.portada = $("meta[property='og:image']").attr("content")!;
  movie.estreno = $("div[class='meta-body-item meta-body-info']")
    .text()
    .trim()
    .split("/")[0]
    .trim()
    .replace("\n\nen Netflix", "")
    .replace("\n\n\nen Amazon Prime Video", "")
    .replace("\n\nen HBO", "")
    .replace("\n\nen Disney +", "")
    .replace("\n\nen Amazon Prime Video", "")
    .replace("\n\na VOD", "")
    .replace("\n\n\nen cines", "")
    .trim();
  movie.director = $("div[class='meta-body-item meta-body-direction']")
    .find("a")
    .first()
    .text()
    .trim();
  movie.sinopsis = $(
    "section[id='synopsis-details'] > div[class='content-txt ']"
  )
    .text()
    .trim();
  movie.genero = $("div[class='meta-body-item meta-body-info']")
    .text()
    .trim()
    ?.split("/")[2]
    ?.split(",")[0]
    ?.trim();
  if (!movie.genero) return;
  movie.duración = $("div[class='meta-body-item meta-body-info']")
    .text()
    .trim()
    .split("/")[1]
    .trim();
  // go to trailer page and get the url
  const trailer = $("a[class='trailer item']").attr("href");
  //const trailerButton = buttonsSection.find("a").first().attr("href");
  if (!trailer) return;
  await page.goto(`https://www.sensacine.com${trailer}`, {
    waitUntil: "domcontentloaded",
  });
  const html2 = await page.content();
  const $$ = load(html2);
  movie.trailer = $$("meta[name='og:video:secure_url']").attr("content")!;
  await page.close();
  //await browser.close();
  return movie;
};

export default getMovieInfo;
