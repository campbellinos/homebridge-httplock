var request = require("request");
require('ssl-root-cas').inject();
var Service, Characteristic;

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory("homebridge-httplock", "Httplock", LockAccessory);
}

function LockAccessory(log, config) {
  this.log = log;
  this.name = config["name"];
  this.url = config["url"];
  this.lockID = config["lock-id"];
  this.username = config["username"];
  this.password = config["password"];
  
  this.service = new Service.LockMechanism(this.name);
  
  this.service
    .getCharacteristic(Characteristic.LockCurrentState)
    .on('get', this.getState.bind(this));
  
  this.service
    .getCharacteristic(Characteristic.LockTargetState)
    .on('get', this.getState.bind(this))
    .on('set', this.setState.bind(this));
}

LockAccessory.prototype.getState = function(callback) {
  this.log("Getting current state...");
  
  request.get({
    url: this.url,
    qs: { username: this.username, password: this.password, lockid: this.lockID }
  }, function(err, response, body) {
    
    if (!err && response.statusCode == 200) {
      var json = JSON.parse(body);
      var state = json.state; // "locked" or "unlocked"
      this.log("Lock state is %s", state);
      var locked = state == "locked"
      callback(null, locked); // success
    }
    else {
      this.log("Error getting state (status code %s): %s", response.statusCode, err);
      callback(err);
    }
  }.bind(this));
}

LockAccessory.prototype.setState = function(state, callback) {
  var lockState = (state == Characteristic.LockTargetState.SECURED) ? "locked" : "unlocked";

  this.log("Set state to %s", lockState);

  request.put({
    url: this.url,
    qs: { username: this.username, password: this.password, lockid: this.lockID, state: lockState }
  }, function(err, response, body) {

    if (!err && response.statusCode == 200) {
      this.log("State change complete.");
      
      // we succeeded, so update the "current" state as well
      var currentState = (state == Characteristic.LockTargetState.SECURED) ?
        Characteristic.LockCurrentState.SECURED : Characteristic.LockCurrentState.UNSECURED;
      
      this.service
        .setCharacteristic(Characteristic.LockCurrentState, currentState);
      
      callback(null); // success
    }
    else {
      this.log("Error '%s' setting lock state. Response: %s", err, body);
      callback(err || new Error("Error setting lock state."));
    }
  }.bind(this));
},

LockAccessory.prototype.getServices = function() {
  return [this.service];
}