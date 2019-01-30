# TransPerth API
[![Build Status](https://travis-ci.org/maxrumsey/transperthAPI.svg?branch=master)](https://travis-ci.org/maxrumsey/transperthAPI)
![](https://img.shields.io/npm/v/transperthapi.svg?style=flat)
[![Coverage Status](https://coveralls.io/repos/github/maxrumsey/transperthAPI/badge.svg?branch=master)](https://coveralls.io/github/maxrumsey/transperthAPI?branch=master)

This is an API that allows read-only access to information from TransPerth such as the scheduled arrival time of trains, buses and ferries at stopping points as well as SmartRider data.

## Documentation
Documentation for this project can be found at [maxrumsey.xyz](https://maxrumsey.xyz/transperthapi/API).

## Example
These examples fetch data from a SmartRider as well as the expected arrival time of a bus.
### SmartRider
```js
const transperth = require('transperthapi');
const Client = new transperth();
Client.smartRiderInfo('SR 1234 5678 9') // Example SmartRider Number
  .then(data => {
    if (data.error) throw new Error(data.error);

    console.log(data);

    //  {
    //    balance: '$XX.XX',
    //    conc_type: '' || 'Concession Description',
    //    conc_expirt: 'XX/XX/XX',
    //    autolad: 'True | False'
    //    meta: { endpoint: 'http://...' }
    //  }
  })
  .catch(e => {
    throw e;
  })
```
### Bus Times
```js
const transperth = require('transperthapi');
const Client = new transperth();
Client.busTimes('XXXXX') // Example Bus Stop Number
  .then(data => {
    if (data.error) throw new Error(data.error);

    console.log(data);

    /*
      { buses:
        [ { route: '000', time: 'XX:XX', destination: 'To XXX' },
          {...}],
        meta:
          { endpoint: 'http://...' } }
    */
  })
  .catch(e => {
    throw e;
  })
```
