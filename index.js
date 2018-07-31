// I want to use some libraries to keep code nice and short.

// Here I am requiring (importing) a library called cheerio to help with HTML scraping and manipulation.
const cheerio = require('cheerio');


// Here I am requiring superagent, a library for making web requests.
const request = require('superagent');


// Here I am requiring fs (filesystem), which will act as our program's long term memory.
// We need this (or a similar method) to save our progress and make sure we don't claim articles that we already claimed
const fs = require('fs');


// Here I am requiring path. This is optional but it will help us build file paths such as
// C:\Users\Chris\Desktop or /home/chris/Desktop
// without them turning out all funky such as C:\\Users\\ChrisDesktop
const path = require('path');


// Here I am requiring os (operating system.) This will help our program
// know where to save things, regardless of what Operating System we may be running.
const os = require('os');




// Our dependencies are all taken care of. Let's take care of some configuration!

// Let's configure where we want to save our long-term-memory.
// We'll put it in a folder on the desktop.
const saveDirectory = path.join(
  os.homedir(),
  'Desktop',
  'paper-detector',
  'memory.txt'
);
// what we did there is simply generate a {string} file path:
// 'C:\Users\Chris\Desktop\paper-detector\memory.txt'
// we will use this file path later.

// now we will create the file and it's parent directory
// if they don't already exist
const parentDirectory = path.resolve(saveDirectory, '..');
if (!fs.existsSync(parentDirectory)) {
  fs.mkdirSync(parentDirectory); // create parent directory
}
fs.openSync(saveDirectory, 'a');





// Here I use superagent to GET the content of hackernews. I'm using Hackernews as an example,
// but dbradley77 would use something like https://scientificpapers.example.com/paperfeed/
request
  .get('https://news.ycombinator.com/')
  .end((err, res) => {

    // The request has been made at this point.
    // Now we need to handle any errors that may have occured while getting the news feed.
    if (err) {

      // This is VERY simple error handling.
      // Since this program is meant to run on a timer,
      // a better error handling would notify the human by sending an e-mail or something.
      throw err;


    }


    // the following code runs only if there was NOT an error.
    // we will call a {function} scrapeArticles(), which uses cheerio
    // to parse the HTML. We pass the {string} res.text variable to scrapeArticles
    // the res.text variable contains the response from hackernews, in our case
    // the response is just HTML.


    scrapeArticles(res.text, function(err, articles) {
      if (err) throw err; // handle errors in scraper. very rudimentary.

      // after the article links are found, time to click the links!
      clickArticles(articles, function(err) {
        if (err) throw err;
      });
    });

  });





function scrapeArticles(text, callback) {


  // In this example, we will imagine each article on hackernews is an article on scientificpapers.example.com.
  // Whatever the action to claim an article may be, we can perform that action using Javascript.
  // We will keep things simple in this example and assume that clicking an article is all it takes to claim the article.

  // Ok let's scrape some HTML and get a list of articles.
  // cheerio parses all the HTML we feed it.
  const $ = cheerio.load(text);

  // Now we can use the output of cheerio and get the data we want.
  // we can use CSS selectors with cheerio.
  // From my poking around in Firefox's Inspector, I learned that hackernews
  // articles are listed in a HTML <table>, each title existing in a <tr> with CSS
  // class "athing"
  // We use this information to build a CSS selector for cheerio.
  var itemList = $('tr.athing')
  console.log(itemList.text())

  // the titles are nice, but what we really want is the link, or the <a href...>
  var linkList = [];
  $('a.storylink')
    .toArray()
    .forEach(function(link) {
      linkList.push(link.attribs.href);
    });


  // now we have a list of links, so we can show them in the log
  console.log(linkList)


  return callback(null, linkList);

}



function clickArticles(articles, callback) {

    // now that we have our list of links, all we gotta do is click them all!
    // of course, we only want to click new links, so we memorize the links we click
    // and store them in our program's long-term-memory.

    articles.forEach(function(articleLink) {

      fs.readFile(saveDirectory, function(err, memory) {
        if (err) throw err;
        if (memory.indexOf(articleLink) == -1) {
          // only click the article if it doesn't exists in the memory.
          request
            .get(articleLink)
            .end(function(err) {
              if (err) {
                console.error(`Problem encountered while loading ${articleLink}. Skipping it for now.`)
              } else {
                fs.appendFile(saveDirectory, articleLink+'\n', function(err) {
                  if (err) throw err;
                })
              }
            })
        }
      })
    });



}
