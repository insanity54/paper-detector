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
const saveDirectory = path.join(os.homedir(), 'Desktop', 'paper-detector', 'memory.txt');
// what we did there is simply generate a {string} file path, example: 'C:\Users\Chris\Desktop\paper-detector\memory.txt'
// we will use this file path later.






// Here I use superagent to GET the content of hackernews. I'm using Hackernews as an example,
// but dbradley77 would use something like https://scientificpapers.example.com/paperfeed/
request
  .get('https://news.ycombinator.com/')
  .end((err, res) => {
  
    // The request has been made at this point.
    // Now we need to handle any errors that may have occured while getting the news feed.
    if (err) {
    
      // this is VERY simple error handling. Better error handling would notify the human by sending an e-mail or something.
      return console.log(err);
      
    }
    
    
    // the res variable holds the response we received from GETting hackernews.
    // In this case, it's HTML, which we want to scrape through using cheerio.
    // In this example, we will imagine each article on hackernews is an article on scientificpapers.example.com.
    // Whatever the action to claim an article may be, we can perform that action using Javascript.
    // We will keep things simple in this example and assume that clicking an article is all it takes to claim the article.
    
    // Ok let's scrape some HTML and get a list of articles.
    cheerio
    
  });
