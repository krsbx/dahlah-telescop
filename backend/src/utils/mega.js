const dayjs = require('dayjs');
const _ = require('lodash');
const { Storage } = require('megajs');
const { env } = require('./env');
const Logger = require('./Logger');
const { parseClarityIILog } = require('./parser');

class Mega {
  /** @type {Storage|null} */
  #storage = null;
  /** @type {Buffer|null} */
  latestFile = null;
  /** @type {string|null} */
  latestFileName = null;
  /** @type {Promise<{timestamp: string; SKY: number; AMB:number; WIND: number; HUM: number; ADAY: number}[]>|null} */
  latestParsed = null;
  /** @type {Map<string, Buffer>} */
  #fileCache = new Map();
  /** @type {Map<string, Promise<{timestamp: string; SKY: number; AMB:number; WIND: number; HUM: number; ADAY: number}[]>>} */
  #parsedCache = new Map();

  constructor() {}

  async setup() {
    this.#storage = new Storage({
      email: env.MEGA_EMAIL,
      password: env.MEGA_PASS,
    });

    this.listenStorage();
    await this.storage.ready;
    await this.onReady();
  }

  /**
   * Cache the given file
   * @param {string} name
   * @param {Buffer} buffer
   */
  #cacheFile(name, buffer) {
    this.#fileCache.set(name, buffer);

    Logger.info(`File cached: ${name}`);
  }

  #cacheLatestFile() {
    this.#cacheFile(this.latestFileName, this.latestFile);
  }

  async #parseLatestFile() {
    const logs = new TextDecoder().decode(new Uint8Array(this.latestFile));
    const result = parseClarityIILog(logs);

    this.latestParsed = result;
    this.#parsedCache.set(this.latestFileName, result);
    Logger.info(`File parsed: ${this.latestFileName}`);
  }

  async onReady() {
    Logger.info('Mega connected!');

    const sortedFiles = _.filter(this.storage.files, (file) =>
      /^(\d{4}-\d{2}-\d{2})(\.txt)$/.test(file.name)
    ).sort((a, b) => dayjs(b.name.replace('.txt', '')) - dayjs(a.name.replace('.txt', '')));

    if (!sortedFiles?.[0]) return;

    // Automatically download the latest file that being uploaded
    Logger.info(`Latest file: ${sortedFiles[0].name}`);
    this.latestFileName = sortedFiles[0].name;
    this.latestFile = await sortedFiles[0].downloadBuffer();
    this.#cacheLatestFile();
    this.#parseLatestFile();
  }

  listenStorage() {
    this.storage.on('add', async (file) => {
      if (file.directory) return;

      const today = dayjs().format('YYYY-MM-DD');

      Logger.info(`File added: ${file.name}`);

      // Do not download files that are not from today
      if (!file.name.startsWith(today)) return;

      this.latestFileName = file.name;
      this.latestFile = await file.downloadBuffer();
      this.#cacheLatestFile();
      this.#parseLatestFile();
    });
  }

  /**
   * Get the buffer of the given file name
   * @param {string} fileName
   * @returns Promise<{name: string, buffer: Buffer}>
   */
  async #downloadBuffer(fileName) {
    const cached = this.#fileCache.get(fileName);

    if (cached) {
      return {
        name: fileName,
        buffer: cached,
      };
    }

    const file = Object.values(this.storage.files).find((file) =>
      file.name.startsWith(fileName)
    );

    if (!file) throw new Error(`File not found: ${fileName}`);

    const buffer = await file.downloadBuffer();

    this.#cacheFile(fileName, buffer);

    return {
      name: fileName,
      buffer,
    };
  }

  /**
   * Get the buffers of the given file names
   * @param {string | string[]} fileName
   * @returns {Promise<{name: string, buffer: Buffer}[]}>}
   */
  async downloadBuffers(fileName) {
    const fileNames = Array.isArray(fileName) ? fileName : [fileName];

    let buffers = await Promise.allSettled(
      fileNames.map(this.#downloadBuffer.bind(this))
    );
    buffers = buffers.filter((result) => result.status === 'fulfilled');
    buffers = buffers
      .filter((result) => result.value)
      .map((result) => result.value);

    return buffers;
  }

  get storage() {
    if (!this.#storage) {
      throw new Error('Storage not initialized');
    }

    return this.#storage;
  }
}

module.exports = new Mega();
