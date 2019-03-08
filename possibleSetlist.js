const cheerio = require('cheerio');
var request = require('request');


request('https://www.setlist.fm/setlist/muse/2019/pechanga-arena-san-diego-ca-5392e381.html', function(err, resp, html) {
        if (!err){
          const $ = cheerio.load(html);

          //get setlist songs
          $('ol').find('li').find("div").find("a").map(function(i, el) {
            // const x = el.children().first()
            console.log(el.children[0].data)
          })
      }
});
