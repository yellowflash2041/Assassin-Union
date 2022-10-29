var express = require('express');
const mongoose = require('mongoose');
const Search = require('bing.search');
var router = express.Router();
const Schema = mongoose.Schema;

const History = mongoose.model('History', new Schema({
  term: String,
  when: String
}));

const save = obj => {
  // Save object into db.
  const history = new History(obj);
  history.save((err, history) => {
    if (err) {
      throw err;
    }
  });
};

const makeList = img => {
  // Construct object from the json result
  return {
    'url': img.url,
    'snippet': img.title,
    'thumbnail': img.thumbnail.url,
    'context': img.sourceUrl
  };
};

router.get('/latest', function(req, res, next) {
  History.find({}, null, {
    'limit': 10,
    'sort': {
      "when": -1
    }
  }, (err, history) => {
    if (err) {
      return console.error(err);
    }
    res.send(history.map(arg => {
      // Displays only the field we need to show.
      return {
        term: arg.term,
        when: arg.when
      };
    }));
  });
});

router.get('/:query', function(req, res, next) {
  // Get images and save query and date.
  const query = req.params.query;
  const size = req.query.offset || 10; // Number specified or 10
  const search = new Search(process.env.API_KEY);
  const history = {
    'term': query,
    'when': new Date().toLocaleString()
  };
  // Save query and time to the database
  if (query !== 'favicon.ico') {
    save(history);
  }

  // Query the image and populate results
  search.images(query, {
    top: size
  },
  (err, results) => {
    if (err) {
      throw err;
    }
    res.send(results.map(makeList));
  });
});

module.exports = router;
