const Axios = require('axios');
const Cheerio = require('cheerio');

class API {
  constructor(opts = {}) {
    if (typeof opts !== 'object') {
      throw new Error('The options specified is not an object.');
    }
    this.options = {
      endpoint: opts.endpoint || 'http://136213.mobi/',
      smartRiderEndpoint: opts.smartRiderEndpoint || 'SmartRider/SmartRiderResult.aspx',
      busStopEndpoint: opts.busStopEndpoint || 'Bus/StopResults.aspx'
    };
  }
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
          const response = {
            balance: html('#lblCurrentBalance').contents()[0].data,
            conc_type: html('#lblType').contents()[0].data,
            conc_expiry: html('#lblExpires').contents()[0].data,
            autoload: html('#lblAutoload').contents()[0].data,
            meta: {
              endpoint: buildSmartRiderEndpoint(this.options, number)
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
                  words.push(text[x].replace('\n', '').replace('\t\t\t\t', ''))
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
module.exports = API;
