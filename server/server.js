import App from '../src/App.tsx';

const express = require('express');
const fs = require('fs');
const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const sha256Streaming = require('@bitmatrix/sha256streaming');

// import sslRedirect from 'heroku-ssl-redirect';

const app = express();
// app.use(sslRedirect());

app.use('^/$', (req, res, next) => {
  fs.readFile(path.resolve('./build/index.html'), 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).send('Some error happened');
    }

    return res.send(
      data.replace('<div id="root"></div>', `<div id="root">${ReactDOMServer.renderToString(<App extension={sha256Streaming} />)}</div>`),
    );
  });
});

app.use(express.static(path.resolve(__dirname, '..', 'build')));

app.listen(process.env.PORT || 8000, function () {
  console.log('Express server listening on port %d in %s mode', this.address().port, app.settings.env);
});
