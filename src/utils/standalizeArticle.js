// utils -> standalizeArticle

var cheerio = require('cheerio');
var sanitize = require('sanitize-html');

var config = require('../config');
var contentOnlyRule = config.article.htmlRules;

var getTimeToRead = require('./getTimeToRead');
var absolutifyURL = require('./absolutifyURL');

var standalize = (input) => {
  let {
    content: html,
    url
  } = input;

  if (html) {
    let $ = cheerio.load(html, {
      normalizeWhitespace: true,
      decodeEntities: true
    });

    $('a').each((i, elem) => {
      let href = $(elem).attr('href');
      if (href) {
        $(elem).attr('href', absolutifyURL(url, href));
        $(elem).attr('target', '_blank');
      }
    });

    $('img').each((i, elem) => {
      let src = $(elem).attr('src');
      if (src) {
        $(elem).attr('src', absolutifyURL(url, src));
      }
    });

    let content = sanitize($.html(), contentOnlyRule);
    input.content = content;
    input.duration = getTimeToRead(content);
  }
  return input;
};

module.exports = standalize;