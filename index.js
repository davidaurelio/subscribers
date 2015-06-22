'use strict';

module.exports = function subscribers() {
  var callbacks = [];
  return {
    notify: function(argument) {
      var n = arguments.length;
      return n === 1 ? each(callbacks, callWith, argument) :
             n === 0 ? each(callbacks, call) :
             each(callbacks, apply, arguments);
    },
    subscribe: function(callback) {
      callbacks.push(callback);
      return once(function() {
        callbacks = removeOne(callbacks, callback);
      });
    }
  };
};

function each(array, callback, argument) {
  for (var i = 0, n = array.length; i < n; i++) {
    callback(array[i], argument);
  }
}

function apply(fn, args) {
  fn.apply(undefined, args);
}

function callWith(fn, argument) {
  fn(argument);
}

function call(fn) {
  fn();
}

function removeOne(array, value) {
  for (var i = 0, n = array.length; i < n; i++) {
    if (array[i] === value) {
      return array.slice(0, i).concat(array.slice(i + 1));
    }
  }
  return array;
}

function once(fn) {
  var called;
  return function() {
    if (!called) {
      called = true;
      fn();
    }
  };
}
