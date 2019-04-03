const rp = require('request-promise');
const $ = require('cheerio');
url = "https://www.education.com/science-fair/fifth-grade/chemistry/?sort=weightedRating"

rp(url)
.then(function(html){
	console.log($(".results-list"));
});
