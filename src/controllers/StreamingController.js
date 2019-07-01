const express = require('express');
const expressWS = require('express-ws');
const { STREAM_CRAWL_EVENT } = require('../lib/constants');

module.exports = (db, emitter) => {
  const StreamingController = express.Router();
  expressWS(StreamingController);

  StreamingController.ws('/', ws => {
    const listener = ([attributes]) => {
      ws.send(JSON.stringify(attributes), error => {
        console.error(error);
      });
    };
    const ping = setInterval(() => {
      ws.send('ping');
    }, 15000);
    emitter.addListener(STREAM_CRAWL_EVENT, listener);
    ws.on('close', () => {
      clearTimeout(ping);
      emitter.removeListener(STREAM_CRAWL_EVENT, listener);
    });
  });

  return StreamingController;
};
