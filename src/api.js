const Axios = require('axios');
const Cheerio = require('cheerio');
/**
 * The Transperth API Class.
 * @alias TransPerthAPI
 * @name TransPerthAPI Constructor
 */
class API {
  constructor(opts = {}) {
    if (typeof opts !== 'object') {
      throw new Error('The options specified is not an object.');
    }
    this.options = {
      endpoint: opts.endpoint || 'http://136213.mobi/',
      smartRiderEndpoint: opts.smartRiderEndpoint || 'SmartRider/SmartRiderResult.aspx',
      busStopEndpoint: opts.busStopEndpoint || 'Bus/StopResults.aspx',
      ferryEndpoint: opts.ferryEndpoint || 'Ferry/FerryResults.aspx',
      trainEndpoint: opts.trainEndpoint || 'Trains/TrainResults.aspx'
    };
  }
  /**
   * The options passed to the Transperth API Constructor
   * @typedef {Object} Options
   * @property {string} endpoint - The global endpoint
   * @property {string} smartRiderEndpoint - The smartrider API endpoint
   * @property {string} busStopEndpoint - The bus stop API endpoint
   * @property {string} ferryEndpoint - The ferry API endpoint
   * @property {string} trainEndpoint - The ferry API endpoint
   * @example
   * const opts = {
     endpoint: 'http://136213.mobi/',
     smartRiderEndpoint: 'SmartRider/SmartRiderResult.aspx',
     busStopEndpoint: 'Bus/StopResults.aspx',
     ferryEndpoint: 'Ferry/FerryResults.aspx',
     trainEndpoint: 'Trains/TrainResults.aspx'
    }
   */
  smartRiderInfo(smartrider_id) {
    if (!smartrider_id) throw new Error('SmartRider number not present.');
    const number = cleanSmartRiderNumber(smartrider_id);
    if (number.length !== 9) {
      throw new Error('SmartRider not a valid 9 digit number.')
    }
    return new Promise((resolve, reject) => {
      Axios.get(buildSmartRiderEndpoint(this.options, number))
        .then(data => {
          const html = Cheerio.load(data.data);
          let response;
          try {
            response = {
              balance: html('#lblCurrentBalance').contents()[0].data,
              conc_type: html('#lblType').contents()[0].data,
              conc_expiry: html('#lblExpires').contents()[0].data,
              autoload: html('#lblAutoload').contents()[0].data,
              meta: {
                endpoint: buildSmartRiderEndpoint(this.options, number)
              }
            }
          } catch (e) {
            response = {
              balance: null,
              conc_type: null,
              conc_expiry: null,
              autoload: null,
              meta: {
                endpoint: buildSmartRiderEndpoint(this.options, number),
                error: e.message || e
              }
            }
          }
          return resolve(response);
        })
        .catch(err => {
          return reject(err)
        })
    })
  }
  busStopTimes(stop_number) {
    if (!stop_number) throw new Error('Stop number not present.');
    return new Promise((resolve, reject) => {
      Axios.get(buildBusStopEndpoint(this.options, stop_number))
        .then(data => {
          // Initialises Variables
          const text = Cheerio.load(data.data).text().split(' '),
            routes = [],
            times = [],
            destinations = [];
          /*
           * Loops through all the spaces, looking for keywords that indicate
           * a value is next. If a keyword is found, pushes the respective
           * value to the respective array.
           */
          for (var i = 0; i < text.length; i++) {
            if (text[i] == 'Route:') {
              routes.push(text[i + 1].replace('\n', ''))
            }
            if (text[i] == 'Time') {
              times.push(text[i + 1].replace('\n', '').replace('*', ''))
            }
            if (text[i] == 'Destination') {
              let words = [];
              for (var x = i + 1; x < text.length; x++) {
                if (text[x].includes('\n')) {
                  words.push(text[x].replace('\n', '').replace(/\t/g, ''))
                  break;
                } else {
                  words.push(text[x])
                }
              }
              destinations.push(words.join(' '));
            }
          }
          const response = {
            buses: [],
            meta: {
              endpoint: buildBusStopEndpoint(this.options, stop_number)
            }
          }
          /*
           * Loops through all the found values, pushing each one with it's
           * respective partners to the final `buses` array.
           */
          for (var i = 0; i < times.length; i++) {
            response.buses.push({
              route: routes[i],
              time: times[i],
              destination: destinations[i]
            })
          }
          return resolve(response);
        })
        .catch(err => {
          return reject(err)
        })
    })
  }
  trainTimes({direction, trainline, station}) {
    if (!direction) throw new Error('Direction not present. Must be either `from Perth` or `to Perth`.');
    if (!trainline) throw new Error('Trainline not present');
    if (!station) throw new Error('Train Station not present.');
    return new Promise((resolve, reject) => {
      Axios.get(buildTrainEndpoint(this.options, direction, trainline, station))
        .then(data => {
          const text = Cheerio.load(data.data).text().split(' '),
            scheduled = [],
            running = [],
            patterns = [],
            platforms = [];
          for (var i = 0; i < text.length; i++) {
            if (text[i] == 'Scheduled') {
              scheduled.push(text[i + 2].replace('\n', ''))
            }
            if (text[i] == 'Platform') {
              platforms.push(text[i + 1].replace('\n', ''))
            }
            if (text[i] == 'Running') {
              running.push(text[i + 2].replace('\n', ''))
            }
            if (text[i] == 'Pattern') {
              let stops = [];
              for (var x = i; x < text.length; x++) {
                if (text[x].includes('\n')) {
                  stops.push(text[x].replace('\n', '').replace('\t\t\t\t', ''))
                  break;
                } else {
                  stops.push(text[x])
                }
              }
              patterns.push(stops.join(' '));
            }

          }
          const response = {
            trains: [],
            meta: {
              endpoint: buildTrainEndpoint(this.options, direction, trainline, station).replace(/ /g, '%20')
            }
          }
          for (var i = 0; i < platforms.length; i++) {
            response.trains.push({
              scheduled_time: scheduled[i],
              running_time: running[i],
              platform: platforms[i],
              stopping_pattern: patterns[i]
            })
          }
          resolve(response)
        })
        .catch(err => {
          return reject(err)
        })
    })
  }
  ferryTimes(stop_number) {
    if (!stop_number) throw new Error('Stop number not present.');
    return new Promise((resolve, reject) => {
      Axios.get(buildFerryEndpoint(this.options, stop_number))
        .then(data => {
          // Initialises Variables
          const text = Cheerio.load(data.data).text().split(' '),
            routes = [],
            times = [],
            departs = [];
          /*
           * Loops through all the spaces, looking for keywords that indicate
           * a value is next. If a keyword is found, pushes the respective
           * value to the respective array.
           */
          for (var i = 0; i < text.length; i++) {
            if (text[i] == 'Route') {
              let words = [];
              for (var x = i + 1; x < text.length; x++) {
                if (text[x].includes('\n')) {
                  words.push(text[x].replace('\n', '').replace(/\t/g, ''))
                  break;
                } else {
                  words.push(text[x])
                }
              }
              routes.push(words.join(' '));
            }
            if (text[i] == 'Time') {
              times.push(text[i + 1].replace('\n', '').replace('*', ''))
            }
            if (text[i] == 'Departs') {
              let words = [];
              for (var x = i + 1; x < text.length; x++) {
                if (text[x].includes('\n')) {
                  words.push(text[x].replace('\n', '').replace(' \t', '').replace(/\t/g, ''))
                  break;
                } else {
                  words.push(text[x])
                }
              }
              departs.push(words.join(' '));
            }
          }
          const response = {
            ferries: [],
            meta: {
              endpoint: buildFerryEndpoint(this.options, stop_number)
            }
          }
          /*
           * Loops through all the found values, pushing each one with it's
           * respective partners to the final `buses` array.
           */
          for (var i = 0; i < times.length; i++) {
            response.ferries.push({
              departs: departs[i],
              route: routes[i],
              time: times[i]
            })
          }
          return resolve(response);
        })
        .catch(err => {
          return reject(err)
        })
    })
  }
}
function cleanSmartRiderNumber(number) {
  const string = number.toString()
  let cleaned = string.replace('SR', '');
  cleaned = cleaned.replace(/ /g, '');
  return cleaned;
}
function buildSmartRiderEndpoint(options, number) {
  return `${options.endpoint}${options.smartRiderEndpoint}?SRN=${number}`
}
function buildBusStopEndpoint(options, number) {
  return `${options.endpoint}${options.busStopEndpoint}?SN=${number}`
}
function buildFerryEndpoint(options, number) {
  return `${options.endpoint}${options.ferryEndpoint}?SN=${number}`
}
function buildTrainEndpoint(options, direction, trainline, station) {
  return `${options.endpoint}${options.trainEndpoint}?direction=${direction}&station=${station}&trainline=${trainline}`
}
module.exports = API;
