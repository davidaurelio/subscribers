# subscribers

A tiny library to manage lists of subscribers. Think of it as a “single event”. Use it when an event emitter is too much.

Focus has been minimal API surface and fast notification.

[![Build Status](https://travis-ci.org/davidaurelio/subscribers.svg?branch=master)](https://travis-ci.org/davidaurelio/subscribers)

## Installation

    npm install subscribers

## API

1. Import the library:
  ```js
  var subscribers = require('subscribers');
  ```

2. create a list of subscribers
  ```js
  var list = subscribers();
  // or in ES6:
  const {subscribe, notify} = subscribers();
  ```

3. register subscribers:
  ```js
  list.subscribe(function() { /* ... */ });
  subscribe(() => {}); // ES6
  ```

4. notify subscribers:
  ```js
  list.notify({some: 'value'} /*, ... */);
  notify({any: 'other value'} /*, ... */); // does not depend on `this` binding
  ```

5. unsubscribe:
  ```js
  var unsubscribe = subscribe(function() {});
  unsubscribe();
  ```

6. Use it in other objects:
  ```js
  class UnicornNews {
    constructor() {
      const {notify, subscribe} = subscribers();
      this.subscribe = subscribe; // does not depend on `this` binding
    }
  }
  ```
