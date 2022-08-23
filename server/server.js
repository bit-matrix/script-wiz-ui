/* eslint-disable no-template-curly-in-string */
import App from '../src/App.tsx';

const express = require('express');
const fs = require('fs');
const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const Sha256Streaming = require('@bitmatrix/sha256streaming');

// import sslRedirect from 'heroku-ssl-redirect';

const app = express();
// app.use(sslRedirect());

app.use('^/$', (req, res, next) => {
  fs.readFile(path.resolve('./build/index.html'), 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).send('Some error happened');
    }

    return res.send(
      data.replace(
        '<div id="root"></div>',
        `<script>window.extension=${Sha256Streaming}</script><div id="root">${ReactDOMServer.renderToString(
          <App extension={Sha256Streaming} />,
        )}</div>`,
      ),
    );
  });
});

app.use(express.static(path.resolve(__dirname, '..', 'build')));

app.listen(process.env.PORT || 8000, function () {
  console.log('Express server listening on port %d in %s mode', this.address().port, app.settings.env);
});
