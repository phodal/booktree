/*global define */
(function(global, factory) {
  "use strict";
  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = global.document ?
      factory(global, true) :
      function(w) {
        if (!w.document) {
          throw new Error("jQuery requires a window with a document");
        }
        return factory(w);
      };
  } else {
    factory(global);
  }

}(typeof window !== "undefined" ? window : this, function(window, noGlobal) {

  'use strict';


  var Lettuce = function() {};

  Lettuce.VERSION = '0.2.2';

  window.lettuce = Lettuce;


  /*     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   *     Underscore may be freely distributed under the MIT license.
   */

  Lettuce.isObject = function (obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  Lettuce.isFunction = function(obj) {
    return typeof obj == 'function' || false;
  };

  Lettuce.defaults = function(obj) {
    if (!Lettuce.isObject(obj)) {
      return obj;
    }

    for (var i = 1, length = arguments.length; i < length; i++) {
      var source = arguments[i];
      for (var prop in source) {
        if (obj[prop] === void 0) {
          obj[prop] = source[prop];
        }
      }
    }
    return obj;
  };

  Lettuce.extend = function (obj) {
    if (!Lettuce.isObject(obj)) {
      return obj;
    }
    var source, prop;
    for (var i = 1, length = arguments.length; i < length; i++) {
      source = arguments[i];
      for (prop in source) {
        if (hasOwnProperty.call(source, prop)) {
          obj[prop] = source[prop];
        }
      }
    }
    return obj;
  };


  /**
   * Lettuce Class 0.0.1
   * JavaScript Class built-in inheritance system
   *(c) 2015, Fengda Huang - http://www.phodal.com
   *
   * Copyright (c) 2011, 2012 Jeanine Adkisson.
   *  MIT Licensed.
   * Inspired by https://github.com/munro/self, https://github.com/jneen/pjs
   */

  Lettuce.prototype.Class = (function (prototype, ownProperty) {

    var lettuceClass = function Klass(_superclass, definition) {

      function Class() {
        var self = this instanceof Class ? this : new Basic();
        self.init.apply(self, arguments);
        return self;
      }

      function Basic() {
      }

      Class.Basic = Basic;

      var _super = Basic[prototype] = _superclass[prototype];
      var proto = Basic[prototype] = Class[prototype] = new Basic();

      proto.constructor = Class;

      Class.extend = function (def) {
        return new Klass(Class, def);
      };

      var open = (Class.open = function (def) {
        if (Lettuce.isFunction(def)) {
          def = def.call(Class, proto, _super, Class, _superclass);
        }

        if (Lettuce.isObject(def)) {
          for (var key in def) {
            if (ownProperty.call(def, key)) {
              proto[key] = def[key];
            }
          }
        }

        if (!('init' in proto)) {
          proto.init = _superclass;
        }

        return Class;
      });

      return (open)(definition);
    };

    return lettuceClass;

  })('prototype', ({}).hasOwnProperty);


  var Parser = new Lettuce.prototype.Class({});

  Parser.prototype.init = function (options) {
    this.options = options || {};
    Lettuce.defaults(this.options, {
      first: 'first',
      regex: /.*Page/,
      last: 'last'
    });
  };

  Parser.prototype.run = function (methods) {
    var self = this;
    self.methods = methods;
    self.execute(self.options.first);
    for (var key in self.methods) {
      if (key !== self.options.last && key.match(self.options.regex)) {
        this.execute(key);
      }
    }

    self.execute(self.options.last);
  };

  Parser.prototype.execute = function (methodName) {
    this.methods[methodName]();
  };

  var parser = {
    Parser: Parser
  };

  Lettuce.prototype = Lettuce.extend(Lettuce.prototype, parser);


  Lettuce.get = function (url, callback) {
    Lettuce.send(url, 'GET', callback);
  };

  Lettuce.load = function (url, callback) {
    Lettuce.send(url, 'GET', callback);
  };

  Lettuce.post = function (url, data, callback) {
    Lettuce.send(url, 'POST', callback, data);
  };

  Lettuce.send = function (url, method, callback, data) {
    data = data || null;
    var request = new XMLHttpRequest();
    if (callback instanceof Function) {
      request.onreadystatechange = function () {
        if (request.readyState === 4 && (request.status === 200 || request.status === 0)) {
          callback(request.responseText);
        }
      };
    }
    request.open(method, url, true);
    if (data instanceof Object) {
      data = JSON.stringify(data);
      request.setRequestHeader('Content-Type', 'application/json');
    }
    request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    request.send(data);
  };


  var Event = {
    on: function(event, callback){
      this._events = this._events || {};
      this._events[event] = this._events[event] || [];
      this._events[event].push(callback);
    },
    off: function(event, callback){
      this._events = this._events || {};
      if (event in this._events === false) {
        return;
      }
      this._events[event].splice(this._events[event].indexOf(callback), 1);
    },
    trigger: function(event){
      this._events = this._events || {};
      if (event in this._events === false) {
        return;
      }
      for (var i = 0; i < this._events[event].length; i++) {
        this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
      }
    }
  };

  var event = {
    Event: Event
  };


  Lettuce.prototype = Lettuce.extend(Lettuce.prototype, event);


  /*
   * JavaScript Templates 2.4.1
   * https://github.com/blueimp/JavaScript-Templates
   *
   * Copyright 2011, Sebastian Tschan
   * https://blueimp.net
   *
   * Licensed under the MIT license:
   * http://www.opensource.org/licenses/MIT
   *
   * Inspired by John Resig's JavaScript Micro-Templating:
   * http://ejohn.org/blog/javascript-micro-templating/
   */

  /*jslint evil: true, regexp: true, unparam: true */

  var Template = {
    regexp: /([\s'\\])(?!(?:[^{]|\{(?!%))*%\})|(?:\{%(=|#)([\s\S]+?)%\})|(\{%)|(%\})/g,
    encReg: /[<>&"'\x00]/g,
    encMap: {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      "\"": "&quot;",
      "'": "&#39;"
    },
    arg: "o",
    helper: ",print=function(s,e){_s+=e?(s==null?'':s):_e(s);}" +
    ",include=function(s,d){_s+=tmpl(s,d);}",

    tmpl: function (str, data){
      var f = !/[^\w\-\.:]/.test(str) ? "" : this.compile(str);
      return f(data, this);
    },

    compile: function (str) {
      var fn, variable;
      variable = this.arg + ',tmpl';
      fn = "var _e=tmpl.encode" + this.helper + ",_s='" + str.replace(this.regexp, this.func) + "';";
      fn = fn + "return _s;";
      return new Function(variable, fn);
    },

    encode: function (s) {
      /*jshint eqnull:true */
      var encodeRegex = /[<>&"'\x00]/g,
        encodeMap = {
          "<": "&lt;",
          ">": "&gt;",
          "&": "&amp;",
          "\"": "&quot;",
          "'": "&#39;"
        };
      return (s == null ? "" : "" + s).replace(
        encodeRegex,
        function (c) {
          return encodeMap[c] || "";
        }
      );
    },

    func: function (s, p1, p2, p3, p4, p5) {
      var specialCharMAP = {
        "\n": "\\n",
        "\r": "\\r",
        "\t": "\\t",
        " ": " "
      };

      if (p1) { // whitespace, quote and backspace in HTML context
        return specialCharMAP[p1] || "\\" + p1;
      }
      if (p2) { // interpolation: {%=prop%}, or unescaped: {%#prop%}
        if (p2 === "=") {
          return "'+_e(" + p3 + ")+'";
        }
        return "'+(" + p3 + "==null?'':" + p3 + ")+'";
      }
      if (p4) { // evaluation start tag: {%
        return "';";
      }
      if (p5) { // evaluation end tag: %}
        return "_s+='";
      }
    }
  };

  var template = {
    Template: Template
  };

  Lettuce.prototype = Lettuce.extend(Lettuce.prototype, template);


  /*
   *  Copyright 2012-2013 (c) Pierre Duquesne <stackp@online.fr>
   *  Licensed under the New BSD License.
   *  https://github.com/stackp/promisejs
   */

  function Promise() {
    this._callbacks = [];
  }

  Promise.prototype.then = function(func, context) {
    var p;
    if (this._isdone) {
      p = func.apply(context, this.result);
    } else {
      p = new Promise();
      this._callbacks.push(function () {
        var res = func.apply(context, arguments);
        if (res && typeof res.then === 'function') {
          res.then(p.done, p);
        }
      });
    }
    return p;
  };

  Promise.prototype.done = function() {
    this.result = arguments;
    this._isdone = true;
    for (var i = 0; i < this._callbacks.length; i++) {
      this._callbacks[i].apply(null, arguments);
    }
    this._callbacks = [];
  };

  var promise = {
    Promise: Promise
  };

  Lettuce.prototype = Lettuce.extend(Lettuce.prototype, promise);


  var FX = {
    easing: {
      linear: function(progress) {
        return progress;
      },
      quadratic: function(progress) {
        return Math.pow(progress, 2);
      },
      swing: function(progress) {
        return 0.5 - Math.cos(progress * Math.PI) / 2;
      },
      circ: function(progress) {
        return 1 - Math.sin(Math.acos(progress));
      },
      back: function(progress, x) {
        return Math.pow(progress, 2) * ((x + 1) * progress - x);
      },
      bounce: function(progress) {
        for (var a = 0, b = 1; 1; a += b, b /= 2) {
          if (progress >= (7 - 4 * a) / 11) {
            return -Math.pow((11 - 6 * a - 11 * progress) / 4, 2) + Math.pow(b, 2);
          }
        }
      },
      elastic: function(progress, x) {
        return Math.pow(2, 10 * (progress - 1)) * Math.cos(20 * Math.PI * x / 3 * progress);
      }
    },
    animate: function(options) {
      var start = new Date();
      var id = setInterval(function() {
        var timePassed = new Date() - start;
        var progress = timePassed / options.duration;
        if (progress > 1) {
          progress = 1;
        }
        options.progress = progress;
        var delta = options.delta(progress);
        options.step(delta);
        if (progress == 1) {
          clearInterval(id);
          options.complete();
        }
      }, options.delay || 10);
    },
    fadeOut: function(element, options) {
      var to = 1;
      this.animate({
        duration: options.duration,
        delta: function(progress) {
          progress = this.progress;
          return FX.easing.swing(progress);
        },
        complete: options.complete,
        step: function(delta) {
          element.style.opacity = to - delta;
        }
      });
    },
    fadeIn: function(element, options) {
      var to = 0;
      this.animate({
        duration: options.duration,
        delta: function(progress) {
          progress = this.progress;
          return FX.easing.swing(progress);
        },
        complete: options.complete,
        step: function(delta) {
          element.style.opacity = to + delta;
        }
      });
    }
  };

  var fx = {
    FX: FX
  };

  Lettuce.prototype = Lettuce.extend(Lettuce.prototype, fx);


  /*
   *Inspired by http://krasimirtsonev.com/blog/article/A-modern-JavaScript-router-in-100-lines-history-api-pushState-hash-url
   *  Backbone
   */
  var Router = {
    routes: [],
    hashStrip: /^#*/,
    location: window.location,

    getFragment: function () {
      return (this.location).hash.replace(this.hashStrip, '');
    },

    add: function (regex, handler) {
      if (Lettuce.isFunction(regex)) {
        handler = regex;
        regex = '';
      }
      this.routes.push({regex: regex, handler: handler});
      return this;
    },

    check: function (self) {
      var fragment = self.getFragment();
      for (var i = 0; i < self.routes.length; i++) {
        var newFragment = "#" + fragment;
        var match = newFragment.match(self.routes[i].regex);
        if (match) {
          match.shift();
          self.routes[i].handler.apply({}, match);
        }
      }
    },

    load: function () {
      var self, checkUrl;
      self = this;

      checkUrl = function () {
        self.check(self);
      };

      function addEventListener() {
        if (window.addEventListener) {
          window.addEventListener("hashchange", checkUrl, false);
        }
        else if (window.attachEvent) {
          window.attachEvent("onhashchange", checkUrl);
        }
      }

      addEventListener();
      return this;
    },

    navigate: function (path) {
      path = path ? path : '';
      this.location.href.match(/#(.*)$/);
      this.location.href = this.location.href.replace(/#(.*)$/, '') + '#' + path;
      return this;
    }
  };

  var router = {
    Router: Router
  };

  Lettuce.prototype = Lettuce.extend(Lettuce.prototype, router);


  if (typeof define === "function" && define.amd) {
    define("lettuce", [], function () {
      return Lettuce;
    });
  }
  var strundefined = typeof undefined;
  if (typeof noGlobal === strundefined) {
    window.Lettuce = Lettuce;
  }
  return Lettuce;
}));

