/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  let input = await axios.get(query);
  // console.log(input);
  shows = input.data;
  const showArray = [];
  for (let i = 0; i < shows.length; i++) {
    showArray[i] = {
      id: shows[i].show.id,
      name: shows[i].show.name,
      summary: shows[i].show.summary,
      image: shows[i].show.image,
    };
  }
  // console.log(showArray);
  return showArray;
  // return [{id:}]
}

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();
  // console.log(shows);
  let i = 0;
  for (let show of shows) {
    i++;
    let image;
    let summary;
    if (show.image === null) {
      image = "https://tinyurl.com/tv-missing";
    } else {
      image = show.image.original;
    }
    if (show.summary === null) {
      summary = "N/A";
    } else {
      summary = show.summary;
    }

    let $item = $(
      `<div class="col-md-6 col-lg-3" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body d-flex flex-column justify-content-between">
             <img class="card-img-top" src=${image}>
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${summary}</p>
             <button type ="button"  class="btn btn-success">Episodes</button>
           </div>
         </div>
       </div>
      `
    );

    $showsList.append($item);
  }
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  // $("#episodes-area").hide();

  let shows = await searchShows(
    `http://api.tvmaze.com/search/shows?q=${query}`
  );
  // console.log(shows);
  populateShows(shows);
  createButtons(shows);
});

function createButtons(shows) {
  const getButton = document.getElementsByClassName("btn-success");
  for (let i = 0; i < getButton.length; i++) {
    getButton[i].setAttribute("id", `${i}`);
    getButton[i].addEventListener("click", function () {
      let index = this.getAttribute("id");
      getEpisodes(shows[index].id);
    });
  }
}

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  const episodeData = await axios.get(
    `http://api.tvmaze.com/shows/${id}/episodes?specials=1`
  );

  populateEpisodes(episodeData);

  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
  // TODO: return array-of-episode-info, as described in docstring above
}

let counter = 0;
function populateEpisodes(episodeData) {
  let theEpisodes = episodeData.data;
  // console.log(theEpisodes);
  let episodesArray = [];

  for (let i = 0; i < theEpisodes.length; i++) {
    aEpisode = document.createElement("li");
    episodesArray[i] = {
      id: theEpisodes[i].id,
      name: theEpisodes[i].name,
      season: theEpisodes[i].season,
      number: theEpisodes[i].number,
    };
    let episodeInfo = Object.values(episodesArray[i]);
    aEpisode.innerText = `${episodeInfo[1]} (season ${episodeInfo[2]}, episode ${episodeInfo[3]})`;
    // console.log(aEpisode);
    const theUL = document.getElementById("episodes-list");
    if (counter > 0) {
      for (let li of Array.from(theUL.children)) {
        li.remove();
      }
      counter--;
    }
    theUL.append(aEpisode);
  }
  counter++;
  // return episodesArray;
}
