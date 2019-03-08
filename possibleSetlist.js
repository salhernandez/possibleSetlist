const cheerio = require('cheerio');
var request = require('request');


request('https://www.setlist.fm/setlist/muse/2019/pechanga-arena-san-diego-ca-5392e381.html', function(err, resp, html) {
        if (!err){
          const $ = cheerio.load(html);

          //get setlist items
          $('ol').find('li').map(function(i, el) {
            console.log({el})
          })
      }
});
