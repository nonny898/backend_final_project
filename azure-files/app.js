const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const env = require('./config');

const app = express();

app.use(
  cors({
    origin: `http://${env.CORS_ALLOW}`, // restrict calls to those this address
    methods: ['GET', 'POST'], // only allow GET, POST requests
  })
);

app.use(bodyParser.json());

function isFolder(path){
  return new Promise(function(resolve,reject) {
    fs.lstat(path,(err,stats) => {
      if(err) reject(err.message)
      else resolve(stats.isDirectory)
    })
  })
}

//TODO Handle edge cases. Folder/file with same name etc

app.get('/upload', (req, res, next) => {
  if(req.get('userId') == undefined){
    res.status(401).send('Id not specified')
    return
  }
  const userDir = path.join(process.cwd() + '/',req.get("userId") + '/')
  fs.promises.mkdir(userDir,{recursive: true}).then(() =>{
    const query = req.query.folders || ""
    const pth = userDir + query
    fs.promises.readdir(pth).then((files) => {
      console.log(files)
      Promise.all(files.map((f) => fs.promises.lstat(pth + f))).then((result) => {
        let directories = result.map((lstat) => lstat.isDirectory())
        directories.map((isdir, index) => {
          if(isdir) files[index] += '/'
        })
        res.send(files)
      }).catch((err) => res.status(500).send(err.message))
    }).catch((err) => {res.status(404).send(err)})
  })
});


app.post('/upload', (req, res, next) => {
  if(req.get('userId') == undefined){
    res.status(401).send("No id specified")
    return
  }
  const uploadPath = path.join(process.cwd() + '/',req.get("userId") + "/",req.body.uploadPath)
  console.log("File path set to " + uploadPath)
  if(req.body.type === 'folder'){
    fs.mkdir(uploadPath, {
      recursive: true,
    }, (err) => {
      if(err) res.status(400).send(err.message)
      else res.send("Ok")
    })
  }
  else if(req.body.type === 'file'){
    pth = uploadPath
    fs.writeFile(pth,req.body.data || "",(err) => {
      if(err) res.status(500).send(err.message)
      else  res.send("Ok")
    })
  }
  else{
    res.status(400).send("Invalid type")
  }
});

app.get('/download', (req, res, next) => {
  if(req.get("userId") == undefined){
    res.sendStatus(401)
  }
  else{
    const userDir = path.join(process.cwd() + '/',req.get("userId") + '/')
    const query = req.query.uploadPath || ""
    const pth = userDir + query
    fs.promises.lstat(pth).then((stat) => {
      if(stat.isFile()){
        const readStream = fs.createReadStream(pth);
        // This will wait until we know the readable stream is actually valid before piping
        readStream.on('open', () => {
          // This just pipes the read stream to the response object (which goes to the client)
          readStream.pipe(res);
        });
        // This catches any errors that happen while creating the readable stream (usually invalid names)
        readStream.on('error', err => {
          res.end(err);
        });
      }
      else res.status(400).send(req.query.uploadPath + " is a folder")
    }).catch((err) => {res.status(500).send(err.message)})
  }
});

app.get('/', (req, res) => {
  res.send('ok');
});

app.listen(4000, () => {
  console.log('listening on 4000');
});
