const cheerio = require('cheerio');
var request = require('request');
var venues = []

// get song lists
request('https://www.setlist.fm/setlist/muse/2019/pechanga-arena-san-diego-ca-5392e381.html', function(err, resp, html) {
        if (!err){
          const $ = cheerio.load(html);

          //get setlist songs
          $('ol').find('li').find("div").find("a").map(function(i, el) {
            // const x = el.children().first()
            // console.log(el.children[0].data)
          })
      }
});

// get all tour dates
request('https://www.setlist.fm/search?query=muse', function(err, resp, html) {
        if (!err){
          const $ = cheerio.load(html);

          //get setlist songs
          $('h2').find('a').map(function(i, el) {
            console.log(el.attribs.href)

            let venueName = el.children[0].data

            venues.push({
                url : "https://setlist.fm/"+el.attribs.href,
                venueName : venueName
            })
          })

          console.log(venues)
      }
});