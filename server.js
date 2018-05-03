const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const fetch = require("isomorphic-fetch");
const path = require("path");
const PORT = process.env.PORT || 3000;

var Discogs = require("disconnect").Client;

let _requestData, _accessData;

// var db = new Discogs().database();
// db.getRelease(176126, function(err, data) {
//   console.log(data);
// });

app.get("/authorize", function(req, res) {
  var oAuth = new Discogs().oauth();
  oAuth.getRequestToken(
    "ScTvSOsxTpJNiempUWhF",
    "kvDwtbQJysQWRjUOFQGvYUsXrDdELbYx",
    "http://localhost:3000/callback",
    function(err, requestData) {
      _requestData = requestData;
      // Persist "requestData" here so that the callback handler can
      // access it later after returning from the authorize url
      res.redirect(requestData.authorizeUrl);
    }
  );
});

app.get("/callback", function(req, res) {
  var oAuth = new Discogs(_requestData).oauth();
  oAuth.getAccessToken(
    req.query.oauth_verifier, // Verification code sent back by Discogs
    function(err, accessData) {
      _accessData = accessData;
      // Persist "accessData" here for following OAuth calls
      res.redirect("/identity");
    }
  );
});

app.get("/identity", function(req, res) {
  var dis = new Discogs(_accessData);
  dis.getIdentity(function(err, data) {
    res.send(data);
    console.log(_accessData);
    getDiscogSearch();
  });
});

const getDiscogSearch = () => {
  let db = new Discogs(_accessData).database();
  db.search("the strokes room on fire", (err, data) => {
    var searchResults = data.results;
    var firstFiveResults = searchResults.slice(0, 5);
    console.log(firstFiveResults);
  });
};

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});
