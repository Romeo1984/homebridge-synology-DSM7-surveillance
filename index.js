const axios = require('axios');
const https = require('https');

let Service, Characteristic;

module.exports = (homebridge) => {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory(
    'homebridge-synology-dsm7-surveillance',
    'SynologyHomeMode',
    SynologyHomeModeAccessory
  );
};

class SynologyHomeModeAccessory {

  constructor(log, config, api) {
    this.log = log;
    this.api = api;

    this.name = config.name || "Surveillance HomeMode";
    this.host = config.host;
    this.username = config.username;
    this.password = config.password;
    this.port = config.port || 5001;
    this.insecure = config.insecure || false;
    this.debug = config.debug || false;

    this.protocol = 'https';

    this.sid = null;
    this.sidExpires = 0;
    this.isShuttingDown = false;

    this.currentState = false;
    this.lastFetch = 0;
    this.cacheTTL = 1500; // short cache for responsiveness

    this.httpsAgent = new https.Agent({
      rejectUnauthorized: !this.insecure
    });

    this.service = new Service.Switch(this.name);

    this.service
      .getCharacteristic(Characteristic.On)
      .onSet(this.setHomeMode.bind(this))
      .onGet(this.getHomeMode.bind(this));

    api.on('shutdown', () => {
      this.isShuttingDown = true;
    });

    // Warm cache after startup
    setTimeout(() => {
      this.refreshState().catch(() => {});
    }, 2000);
  }

  getServices() {
    return [this.service];
  }

  logDebug(message) {
    if (this.debug) {
      this.log.debug(message);
    }
  }

  async login() {
    if (this.isShuttingDown) return;

    const url = `${this.protocol}://${this.host}:${this.port}/webapi/auth.cgi`;

    const response = await axios.get(url, {
      params: {
        api: 'SYNO.API.Auth',
        method: 'login',
        version: 7,
        account: this.username,
        passwd: this.password,
        session: 'SurveillanceStation',
        format: 'sid'
      },
      httpsAgent: this.httpsAgent,
      timeout: 5000
    });

    if (!response.data.success) {
      throw new Error(`DSM Authentication failed: ${JSON.stringify(response.data)}`);
    }

    this.sid = response.data.data.sid;
    this.sidExpires = Date.now() + (14 * 60 * 1000);
  }

  async ensureSession() {
    if (!this.sid || Date.now() > this.sidExpires) {
      await this.login();
    }
  }

  async apiCall(params) {
    if (this.isShuttingDown) return;

    await this.ensureSession();

    const url = `${this.protocol}://${this.host}:${this.port}/webapi/entry.cgi`;

    const response = await axios.get(url, {
      params: { ...params, _sid: this.sid },
      httpsAgent: this.httpsAgent,
      timeout: 5000
    });

    if (!response.data.success) {
      if (response.data.error?.code === 119) {
        this.sid = null;
        await this.login();
        return this.apiCall(params);
      }
      throw new Error(JSON.stringify(response.data));
    }

    return response.data;
  }

  async refreshState() {
    const response = await this.apiCall({
      api: 'SYNO.SurveillanceStation.HomeMode',
      method: 'GetInfo',
      version: 1
    });

    this.currentState = response.data.on;
    this.lastFetch = Date.now();

    this.service.updateCharacteristic(
      Characteristic.On,
      this.currentState
    );
  }

  async setHomeMode(value) {

    this.log.info(`Setting HomeMode: ${value}`);

    // Optimistic update
    this.currentState = value;
    this.lastFetch = Date.now();

    this.service.updateCharacteristic(
      Characteristic.On,
      value
    );

    await this.apiCall({
      api: 'SYNO.SurveillanceStation.HomeMode',
      method: 'Switch',
      version: 1,
      on: value
    });

    // Verify state after short delay
    setTimeout(() => {
      this.refreshState().catch(err =>
        this.log.error("Post-write verification failed:", err.message)
      );
    }, 1000);
  }

  async getHomeMode() {

    if (Date.now() - this.lastFetch < this.cacheTTL) {
      return this.currentState;
    }

    await this.refreshState();
    return this.currentState;
  }
}

