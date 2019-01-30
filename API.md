# Documentation
## TransPerth API Class
The constructor takes an options object as the only parameter.
```js
const transperth = require('transperthapi');
const API = new transperth({
  endpoint: 'http://136213.mobi/',
  smartRiderEndpoint: 'SmartRider/SmartRiderResult.aspx',
  busStopEndpoint: 'Bus/StopResults.aspx',
  ferryEndpoint: 'Ferry/FerryResults.aspx',
  trainEndpoint: 'Trains/TrainResults.aspx'
 })
```
## SmartRider Info
```
API.smartRiderInfo(card_number)
API.smartRiderInfo('SR 1234 5678 9')
returns: Promise
```

Takes a SmartRider card number as the only argument. Returns a promise. The balance can be delayed by as much as two days.

```js
{
  balance: '$10.09',
  conc_type: 'Student Travel Permit (Up to Yr12)',
  conc_expiry: '01/01/2000',
  autoload: 'True'
}
```
## Bus Stop Status
```
API.busStopTimes(stop_number)
API.busStopTimes('20685')
returns: Promise
```

Outputs the buses scheduled to arrive at this stop. (If any).

```js
{ buses:
   [ { route: '507', time: '16:28', destination: 'To Bull Creek Stn' },
     { route: '507', time: '16:43', destination: 'To Bull Creek Stn' },
     { route: '507', time: '16:58', destination: 'To Bull Creek Stn' },
     { route: '507', time: '17:15', destination: 'To Bull Creek Stn' },
     { route: '507', time: '17:30', destination: 'To Bull Creek Stn' } ],
  meta:
   { endpoint: 'http://136213.mobi/Bus/StopResults.aspx?SN=20685' } }
```
## Train Station Status
```
API.trainTimes({direction, trainline, station})
API.trainTimes({
  direction: 'to Perth',
  trainline: 'Mandurah',
  station: 'Cockburn Central'
})
returns: Promise
```

Outputs the trains scheduled to arrive at the station. Direction is either `to Perth` or `from Perth`.

```js
{ trains:
   [ { scheduled_time: '16:31',
       running_time: '16:31',
       platform: '1',
       stopping_pattern: 'Pattern Murdoch, Bull Creek, Canning Bridge, Elizabeth Quay, Perth Underground ' },
     { scheduled_time: '16:38',
       running_time: '16:38',
       platform: '1',
       stopping_pattern: 'Pattern Murdoch, Bull Creek, Canning Bridge, Elizabeth Quay, Perth Underground ' },
     { scheduled_time: '16:41',
       running_time: '16:42',
       platform: '1',
       stopping_pattern: 'Pattern Murdoch, Bull Creek, Canning Bridge, Elizabeth Quay, Perth Underground ' },
     { scheduled_time: '16:48',
       running_time: '16:48',
       platform: '1',
       stopping_pattern: 'Pattern Murdoch, Bull Creek, Canning Bridge, Elizabeth Quay, Perth Underground ' },
     { scheduled_time: '16:51',
       running_time: '16:51',
       platform: '1',
       stopping_pattern: 'Pattern Murdoch, Bull Creek, Canning Bridge, Elizabeth Quay, Perth Underground ' } ],
  meta:
   { endpoint: 'http://136213.mobi/Trains/TrainResults.aspx?direction=to%20Perth&station=Cockburn%20Central&trainline=Mandurah' } }
```
## Ferry Status
```
API.ferryTimes(stop_number)
API.ferryTimes('99998')
returns: Promise
```

Outputs the ferries scheduled to arrive at this stop. (If any). The stop number can be either `99998` or `99997`. More information can be found on the **[Transperth Website](transperth.wa.gov.au)**.

```js
{ ferries:
   [ { departs: 'Mends St ', routes: 'To Perth', time: '16:45' },
     { departs: 'Mends St ', routes: 'To Perth', time: '17:00' },
     { departs: 'Mends St ', routes: 'To Perth', time: '17:15' },
     { departs: 'Mends St ', routes: 'To Perth', time: '17:30' },
     { departs: 'Mends St ', routes: 'To Perth', time: '17:45' } ],
  meta:
   { endpoint: 'http://136213.mobi/Ferry/FerryResults.aspx?SN=99998' } }
```
## Responses
For every API call this package returns an object that is formatted like this:
```js
{
  meta: {
    endpoint: 'https://...',
    error: '<Error Message If Error>'
  },
  ferries: [], // For API calls related to Ferry Status
  buses: [], // For API calls related to Bus Status
  trains: [], // For API calls related to Train Status
  /*
   * For API calls related to SmartRider Information
   */
  balance: '$00.00',
  conc_type: 'XXX',
  conc_expiry: 'XXX',
  autoload: 'True | False'
}
```
