const cheerio = require('cheerio');
const axios = require('axios')
const program = require('commander');
program
  .option('-a, --artist <type>', 'artist to query')

program.parse(process.argv);

const getVenues = (artist) => {
  return new Promise((resolve, reject) => {
    axios.get(`https://www.setlist.fm/search?query=${artist}`)
      .then((response) =>{
          let venues = [];
          if(response.status === 200) {
              const html = response.data;
              const $ = cheerio.load(html);

                //get setlist songs
                $('h2 a').map(function(i, el) {
                  let venueName = el.children[0].data

                  venues.push({
                      url : "https://setlist.fm/"+el.attribs.href,
                      name : venueName
                  })
                })

                resolve(venues);
          }else{
            reject(response);
          }
      })
    })
};

const getSongs = (venueURL) => {
  return new Promise((resolve, reject) => {

    let songNames = [];
    axios.get(venueURL)
    .then((response) =>{
        if(response.status === 200) {
          const html = response.data;
          const $ = cheerio.load(html);

          //get setlist songs
          $('ol li div a').map(function(i, el) {
            // const x = el.children().first()
            // console.log(el.children[0].data)
            songNames.push(el.children[0].data)
          })
          resolve(songNames)
        }else{
          reject(response)
        }
    })
    
    })
};

function countSongs(allSongsArray){
  let songsObject = {}
  allSongsArray.map(arr => {
    arr.map(song =>{
      if(songsObject.hasOwnProperty(song)){
        songsObject[song] += 1
      }else{
        songsObject[song] = 1
      }
    })
  })
  return songsObject
}

function getRatio(songsObject, totalVenues){
  let ratioArr = {}
  for (let song in songsObject) {
    if( songsObject.hasOwnProperty(song) ) {
      // ratioArr.push({
      //   song: song,
      //   ratio: songsObject[song] / totalVenues
      // })
      ratioArr[song] = songsObject[song] / totalVenues 
    }
  }

  var sortable = [];
for (var item in ratioArr) {
    sortable.push([item, ratioArr[item]]);
}

sortable.sort(function(a, b) {
    return b[1] - a[1];
});
  return sortable;
}

async function main(name) {
  // wait for all venue links
  let venues = await getVenues(name)
  
  // add all songs promises based on links
  let songsPomises = []
  venues.map((venue) => {
    songsPomises.push(getSongs(venue.url))
  }); 


  //profit
  let allSongsArray = await Promise.all(songsPomises);
  const songCounts = countSongs(allSongsArray)
  const generateRatios = getRatio(songCounts, venues.length);
  console.log(`========================================`);
  console.log(`Results for: ${name}`)
  console.log(`Total Venues: ${venues.length}\n`);
  generateRatios.map((songs) => {
    if(songs[1] * 100 > 10){
      console.log(`${songs[0]}: ${songs[1] * 100}%`) 
    }
  })
}

export function getPossibleSetlist() {
    if (program.artist){
        const a = process.argv.indexOf("-a")
        const b = process.argv.indexOf("-artist")
        if ( a || b ) {
          const flagIndex = a ? a : b;
          const fullArtistName = process.argv.slice(flagIndex+1).join(" ");
          main(fullArtistName);
        }
      }else{
        console.log("please use -a or --artist folowed by artist name")
      }
}