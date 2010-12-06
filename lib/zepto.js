var Zepto = (function() {
  var slice = [].slice, key, css, $$, document = window.document, undefined;

  // fix for iOS 3.2
  if (String.prototype.trim === undefined)
    String.prototype.trim = function(){ return this.replace(/^\s+/, '').replace(/\s+$/, '') };

  function classRE(name){ return new RegExp("(^|\\s)" + name + "(\\s|$)") }
  function compact(array){ return array.filter(function(item){ return item !== undefined && item !== null }) }
  function camelize(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }

  function Z(dom, selector){ this.dom = dom || []; this.selector = selector || '' }

  function $(selector, context){
    if (selector == document) return new Z;
    else if (context !== undefined) return $(context).find(selector);
    else {
      var dom;
      if (selector instanceof Z) dom = selector.dom;
      else if (selector instanceof Array) dom = selector;
      else if (selector instanceof Element || selector === window) dom = [selector];
      else dom = $$(document, selector);

      return new Z(compact(dom), selector);
    }
  }

  $.extend = function(target, source){ for (key in source) target[key] = source[key] }
  $.qsa = $$ = function(element, selector){ return slice.call(element.querySelectorAll(selector)) }

  $.fn = {
    ready: function(callback){
      document.addEventListener('DOMContentLoaded', callback, false); return this;
    },
    compact: function(){ this.dom = compact(this.dom); return this },
    get: function(idx){ return idx === undefined ? this.dom : this.dom[idx] },
    remove: function(){
      return this.each(function(el){ el.parentNode.removeChild(el) });
    },
    each: function(callback){ this.dom.forEach(callback); return this },
    filter: function(selector){
      return $(this.dom.filter(function(element){
        return $$(element.parentNode, selector).indexOf(element) >= 0;
      }));
    },
    is: function(selector){
      return this.dom.length > 0 && $(this.dom[0]).filter(selector).dom.length > 0;
    },
    first: function(callback){ this.dom = compact([this.dom[0]]); return this },
    find: function(selector){
      return $(this.dom.map(function(el){ return $$(el, selector) }).reduce(function(a,b){ return a.concat(b) }, []));
    },
    closest: function(selector){
      var node = this.dom[0].parentNode, nodes = $$(document, selector);
      while(node && nodes.indexOf(node) < 0) node = node.parentNode;
      return $(node && !(node === document) ? node : []);
    },
    pluck: function(property){ return this.dom.map(function(element){ return element[property] }) },
    show: function(){ return this.css('display', 'block') },
    hide: function(){ return this.css('display', 'none') },
    prev: function(){ return $(this.pluck('previousElementSibling')) },
    next: function(){ return $(this.pluck('nextElementSibling')) },
    html: function(html){
      return html === undefined ?
        (this.dom.length > 0 ? this.dom[0].innerHTML : null) :
        this.each(function(element){ element.innerHTML = html });
    },
    text: function(text){
      return text === undefined ?
        (this.dom.length > 0 ? this.dom[0].innerText : null) :
        this.each(function(element){ element.innerText = text });
    },
    attr: function(name, value){
      return (typeof name == 'string' && value === undefined) ?
        (this.dom.length > 0 ? this.dom[0].getAttribute(name) || undefined : null) :
        this.each(function(element){
          if (typeof name == 'object') for (key in name) element.setAttribute(key, name[key])
          else element.setAttribute(name, value);
        });
    },
    offset: function(){
      var obj = this.dom[0].getBoundingClientRect();
      return {
        left: obj.left + document.body.scrollLeft,
        top: obj.top + document.body.scrollTop,
        width: obj.width,
        height: obj.height
      };
    },
    css: function(property, value){
      if (value === undefined && typeof property == 'string') return this.dom[0].style[camelize(property)];
      css = "";
      for (key in property) css += key + ':' + property[key] + ';';
      if (typeof property == 'string') css = property + ":" + value;
      return this.each(function(element) { element.style.cssText += ';' + css });
    },
    index: function(element){
      return this.dom.indexOf($(element).get(0));
    },
    hasClass: function(name){
      return classRE(name).test(this.dom[0].className);
    },
    addClass: function(name){
      return this.each(function(element){
        !$(element).hasClass(name) && (element.className += (element.className ? ' ' : '') + name)
      });
    },
    removeClass: function(name){
      return this.each(function(element){
        element.className = element.className.replace(classRE(name), ' ').trim()
      });
    }
  };

  ['width', 'height'].forEach(function(property){
    $.fn[property] = function(){ return this.offset()[property] }
  });


  var adjacencyOperators = {append: 'beforeEnd', prepend: 'afterBegin', before: 'beforeBegin', after: 'afterEnd'};

  for (key in adjacencyOperators)
    $.fn[key] = (function(operator) {
      return function(html){
        return this.each(function(element){
          element['insertAdjacent' + (html instanceof Element ? 'Element' : 'HTML')](operator, html);
        });
      };
    })(adjacencyOperators[key]);

  Z.prototype = $.fn;

  return $;
})();

'$' in window || (window.$ = Zepto);
(function($){
  var $$ = $.qsa, handlers = [];

  function find(element, event, fn) {
    return handlers.filter(function(handler){
      return handler && handler.element === element &&
        (!event || handler.event === event) && (!fn || handler.fn === fn);
    });
  }

  $.event = {
    add: function(element, events, fn){
      events.split(/\s/).forEach(function(event){
        var handler = {event: event, element: element, fn: fn, i: handlers.length};
        handlers.push(handler);
        element.addEventListener(event, fn, false);
      });
    },
    remove: function(element, events, fn){
      (events || '').split(/\s/).forEach(function(event){
        find(element, event, fn).forEach(function(handler){
          handlers[handler.i] = null;
          element.removeEventListener(handler.event, handler.fn, false);
        });
      });
    }
  };
  $.fn.bind = function(event, callback){
    return this.each(function(element){
      $.event.add(element, event, callback);
    });
  };
  $.fn.unbind = function(event, callback){
    return this.each(function(element){
      $.event.remove(element, event, callback);
    });
  };
  $.fn.delegate = function(selector, event, callback){
    return this.each(function(element){
      $.event.add(element, event, function(e){
        var target = e.target, nodes = $$(element, selector);
        while (target && nodes.indexOf(target) < 0) target = target.parentNode;
        if (target && !(target === element) && !(target === document)) callback.call(target, e);
      });
    });
  };
  $.fn.live = function(event, callback){
    $(document.body).delegate(this.selector, event, callback); return this;
  };
  $.fn.trigger = function(event){
    return this.each(function(element){
      var e = document.createEvent('Events');
      element.dispatchEvent(e, e.initEvent(event, true, false));
    });
  };
})(Zepto);
(function($){
  function detect(ua){
    var ua = ua, os = {},
      android = ua.match(/(Android)\s+([\d.]+)/),
      iphone = ua.match(/(iPhone\sOS)\s([\d_]+)/),
      ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
      webos = ua.match(/(webOS)\/([\d.]+)/);
    if (android) os.android = true, os.version = android[2];
    if (iphone) os.ios = true, os.version = iphone[2].replace(/_/g, '.'), os.iphone = true;
    if (ipad) os.ios = true, os.version = ipad[2].replace(/_/g, '.'), os.ipad = true;
    if (webos) os.webos = true, os.version = webos[2];
    return os;
  }
  $.os = detect(navigator.userAgent);
  $.__detect = detect;
  $.browser = {
    webkit: true,
    version: navigator.userAgent.match(/WebKit\/([\d.]+)/)[1]
  }
})(Zepto);
(function($){
  $.fn.anim = function(properties, duration, ease){
    var transforms = [], opacity, key;
    for (key in properties)
      if (key === 'opacity') opacity = properties[key];
      else transforms.push(key + '(' + properties[key] + ')');

    return this.css({
      '-webkit-transition': 'all ' + (duration || 0.5) + 's ' + (ease || ''),
      '-webkit-transform': transforms.join(' '),
      '-moz-transition': 'all '+(dur||0.5)+'s '+(ease||''),
      '-moz-transform': transforms.join(' '), opacity: opacity,
      opacity: opacity
    });
  }
})(Zepto);
(function($){
  var touch = {}, touchTimeout;

  function parentIfText(node){
    return 'tagName' in node ? node : node.parentNode;
  }

  $(document).ready(function(){
    $(document.body).bind('touchstart', function(e){
      var now = Date.now(), delta = now - (touch.last || now);
      touch.target = parentIfText(e.touches[0].target);
      touchTimeout && clearTimeout(touchTimeout);
      touch.x1 = e.touches[0].pageX;
      if (delta > 0 && delta <= 250) touch.isDoubleTap = true;
      touch.last = now;
    }).bind('touchmove', function(e){
      touch.x2 = e.touches[0].pageX
    }).bind('touchend', function(e){
      if (touch.isDoubleTap) {
        $(touch.target).trigger('doubleTap');
        touch = {};
      } else if (touch.x2 > 0) {
        Math.abs(touch.x1 - touch.x2) > 30 && $(touch.target).trigger('swipe');
        touch.x1 = touch.x2 = touch.last = 0;
      } else if ('last' in touch) {
        touchTimeout = setTimeout(function(){
          touchTimeout = null;
          $(touch.target).trigger('tap')
          touch = {};
        }, 250);
      }
    }).bind('touchcancel', function(){ touch = {} });
  });

  ['swipe', 'doubleTap', 'tap'].forEach(function(gesture){
    $.fn[gesture] = function(callback){ return this.bind(gesture, callback) }
  });
})(Zepto);
(function($){
  $.ajax = function(options){
    // { type, url, data, success, dataType, contentType }
    options = options || {};
    var data = options.data,
        callback = options.success,
        mime = mimeTypes[options.dataType],
        content = options.contentType,
        xhr = new XMLHttpRequest();

    if (callback instanceof Function) {
      xhr.onreadystatechange = function(){
        if(xhr.readyState==4 && (xhr.status==200 || xhr.status==0)) {
          if (mime == 'application/json') callback(JSON.parse(xhr.responseText));
          else callback(xhr.responseText);
        }
      };
    }

    xhr.open(options.type || 'GET', options.url || window.location, true);
    if (mime) xhr.setRequestHeader('Accept', mime);
    if (data instanceof Object) data = JSON.stringify(data), content = content || 'application/json';
    if (content) xhr.setRequestHeader('Content-Type', content);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.send(data);
  };

  var mimeTypes = $.ajax.mimeTypes = {
    json: 'application/json',
    xml:  'application/xml',
    html: 'text/html',
    text: 'text/plain'
  };

  $.get = function(url, success){ $.ajax({ url: url, success: success }) };
  $.post = function(url, data, success, dataType){
    if (data instanceof Function) dataType = dataType || success, success = data, data = null;
    $.ajax({ type: 'POST', url: url, data: data, success: success, dataType: dataType });
  };
  $.getJSON = function(url, success){ $.ajax({ url: url, success: success, dataType: 'json' }) };

  $.fn.load = function(url, success){
    if (!this.dom.length) return this;
    var self = this, parts = url.split(/\s/), selector;
    if (parts.length > 1) url = parts[0], selector = parts[1];
    $.get(url, function(response){
      self.html(selector ?
        $(document.createElement('div')).html(response).find(selector).html()
        : response);
      success && success();
    });
    return this;
  };
})(Zepto);
(function($){
  var cache = [], timeout;

  $.fn.remove = function(){
    return this.each(function(element){
      if(element.tagName == 'IMG'){
        cache.push(element);
        element.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(function(){ cache = [] }, 60000);
      }
      element.parentNode.removeChild(element);
    });
  }
})(Zepto);
