/*eslint-env mocha*/
/*eslint max-nested-callbacks: 0*/
'use strict';

var sinon = require('sinon');
var assert = sinon.assert;
var spy = sinon.spy;
var same = sinon.match.same;

var subscribers = require('./');

describe('subscribers:', function() {
  var notify, subscribe;
  beforeEach(function() {
    var s = subscribers();
    notify = s.notify;
    subscribe = s.subscribe;
  });

  it('can notify without subscribers', function() {
    notify();
  });

  it('notifies a subscriber', function() {
    var subscriber = spy();
    subscribe(subscriber);

    notify();
    assert.called(subscriber);
  });

  it('notifies multiple subscribers', function() {
    var spies = [spy(), spy(), spy(), spy()];
    spies.forEach(subscribe);

    notify();
    spies.forEach(assert.called);
  });

  it('does not notify removed subscribers', function() {
    subscribe(function() {});
    var removed = spy();
    var unsubscribe = subscribe(removed);
    subscribe(function() {});
    unsubscribe();

    notify();
    assert.notCalled(removed);
  });

  it('allows to unsubscribe a listener twice with no further effect', function() {
    var callbacks = [spy(function a() {}), spy(function b() {}), spy(function c() {})];
    var unsubscribe = callbacks.map(subscribe);
    unsubscribe[1]();
    unsubscribe[1]();

    notify();
    callbacks.forEach(function(callback, i) {
      if (i % 2) assert.notCalled(callback);
      else assert.called(callback);
    });
  });

  it('removes a listener that has been registered twice only once when calling the unsubscribe function', function() {
    var callback = spy();
    var unsubscribe = subscribe(callback);
    subscribe(callback);
    unsubscribe();

    notify();
    assert.calledOnce(callback);
  });

  it('removes a listener that has been registered twice only once when calling an unsubscribe function repeatedly', function() {
    var callback = spy();
    var unsubscribe = subscribe(callback);
    subscribe(callback);
    unsubscribe();
    unsubscribe();

    notify();
    assert.calledOnce(callback);
  });

  it('does not notify callbacks that are registered during notification', function() {
    var added = spy();
    subscribe(function() { subscribe(added); });

    notify();
    assert.notCalled(added);
  });

  it('still notifies callbacks that are removed during notification', function() {
    var removeFirst, removeLast;
    var first = spy();
    var last = spy();
    removeFirst = subscribe(first);
    subscribe(function() { removeFirst(); removeLast(); });
    removeLast = subscribe(last);

    notify();
    assert.called(first);
    assert.called(last);
  });

  describe('argument passing:', function() {
    var callbacks;
    beforeEach(function() {
      callbacks = [spy(), spy(), spy()];
      callbacks.forEach(subscribe);
    });

    it('passes a notification argument on to all subscribers, calling without context', function() {
      var argument = {};

      notify(argument);
      callbacks.forEach(function(callback) {
        assert.calledWithExactly(callback, same(argument));
        assert.calledOn(callback, undefined);
      });
    });

    it('passes two notification arguments on to all subscribers, calling without context', function() {
      var a = {};
      var b = {};

      notify(a, b);
      callbacks.forEach(function(callback) {
        assert.calledWithExactly(callback, same(a), same(b));
        assert.calledOn(callback, undefined);
      });
    });

    it('calls subscribers without arguments if notify is called without arguments', function() {
      notify();
      callbacks.forEach(function(callback) {
        assert.calledWithExactly(callback);
        assert.calledOn(callback, undefined);
      });
    });

    it('passes many notification arguments on to all subscribers, calling without context', function() {
      var args = Array.apply(null, Array(128)).map(function() { return {}; });

      notify.apply(null, args);
      callbacks.forEach(function(callback) {
        assert.calledWithExactly.apply(null, [callback].concat(args.map(same)));
        assert.calledOn(callback, undefined);
      });
    });
  });
});
