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

if (!fs.existsSync(path.join(process.cwd(), 'uploads'))) {
  fs.mkdirSync(path.join(process.cwd(), 'uploads'));
}

app.get('/upload', (req, res, next) => {
  if (req.query.folders) {
    const folders = req.query.folders.split('/');
    fs.readdir(
      path.join(process.cwd(), 'uploads', ...folders),
      (err, files) => {
        if (err) {
          res.status(404).end();
        }
        res.send(files);
      }
    );
  } else {
    fs.readdir(path.join(process.cwd(), 'uploads'), (err, files) => {
      if (err) {
        res.status(404).end();
      }
      res.send(files);
    });
  }
});

app.post('/upload', (req, res, next) => {
  if (!req.body.uploadPath.includes('/')) {
    const filename = req.body.uploadPath;
    fs.writeFile(
      path.join(process.cwd(), 'uploads', filename),
      req.body.data,
      () => {
        res.end();
      }
    );
  } else {
    const uploadPath = req.body.uploadPath.split('/');
    const filename = uploadPath.pop();
    const folders = Array.from(uploadPath);
    if (!fs.existsSync(path.join(process.cwd(), 'uploads', ...folders))) {
      fs.mkdirSync(path.join(process.cwd(), 'uploads', ...folders), {
        recursive: true,
      });
    }
    fs.writeFile(
      path.join(process.cwd(), 'uploads', ...folders, filename),
      req.body.data,
      () => {
        res.end();
      }
    );
  }
});

app.get('/download', (req, res, next) => {
  const uploadPath = req.query.uploadPath.split('/');
  const pathToFile = path.join(process.cwd(), 'uploads', ...uploadPath);
  const readStream = fs.createReadStream(pathToFile);
  // This will wait until we know the readable stream is actually valid before piping
  readStream.on('open', () => {
    // This just pipes the read stream to the response object (which goes to the client)
    readStream.pipe(res);
  });
  // This catches any errors that happen while creating the readable stream (usually invalid names)
  readStream.on('error', err => {
    res.end(err);
  });
});

app.get('/',(req,res) => {
  res.send('ok')
})

app.listen(4000, () => {
  console.log('listening on 4000');
});
