const path = require('path');
const { asyncMw } = require('express-asyncmw');
const mega = require('../utils/mega');
const { fileListQuery } = require('../schemas/file');
const { archiveToBuffer } = require('../utils/archiver');
const { generateDate, generateArchiveName } = require('../utils/file');

class FileController {
  constructor() {}

  upload = asyncMw(async (req, res) => {
    return res.status(200).json({
      code: 200,
      data: req.uploaded,
    });
  });

  list = asyncMw(async (req, res) => {
    const query = fileListQuery.parse(req.query);
    const archiveName = generateArchiveName(query);
    const dates = generateDate(query, '.txt');

    const buffers = await mega.downloadBuffers(dates);
    const archive = await archiveToBuffer(buffers);

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename=${archiveName}`);

    return res.status(200).send(archive);
  });

  stats = asyncMw(async (req, res) => {
    const ext = path.extname(mega.latestFileName);
    const fileName = mega.latestFileName.replace(ext, '');

    res.setHeader('Content-Type', 'application/json');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${[fileName, 'json'].join('.')}`
    );

    return res.status(200).send(await mega.latestParsed);
  });
}

module.exports = FileController;
