require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const bodyParser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({extended:false}))
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const urls= {}
let id =1;

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
app.post('/api/shorturl',(req,res)=>{
  const url = req.body.url;
  let hostname;
  try{
    hostname = new URL(url).hostname;
  }
  catch(err){
    res.json({error:"invalid url"})
  }
  dns.lookup(hostname, (err) => {
    if(err){
      return res.json({error: 'invalid url'})
    }
    const shorturl = id++;
    urls[shorturl] = url; // generate unique numbers for each url
    console.log('Stored URLs:', urls);
    res.json({
      "original_url": url,
      "short_url": shorturl
    })
  })
})

app.get('/api/shorturl/:short',(req,res)=>{
  const shorturl = req.params.short;
  const original_url = urls[shorturl]
  console.log(original_url,urls,'hfoewhaofheos',req.params.short,urls[shorturl]);
  
  if(original_url){

    res.redirect(original_url)
  }
  else{
    res.json({error:"invalid url original"})
  }
})
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
