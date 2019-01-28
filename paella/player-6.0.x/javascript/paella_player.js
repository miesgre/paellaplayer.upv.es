"use strict";
var GlobalParams = {
  video: {zIndex: 1},
  background: {zIndex: 0}
};
window.paella = window.paella || {};
paella.player = null;
paella.version = "6.0.4 - build: 9b996ea";
(function buildBaseUrl() {
  if (window.paella_debug_baseUrl) {
    paella.baseUrl = window.paella_debug_baseUrl;
  } else {
    var scripts = document.getElementsByTagName('script');
    var script = scripts[scripts.length - 1].src.split("/");
    script.pop();
    script.pop();
    paella.baseUrl = script.join("/") + '/';
  }
})();
paella.events = {
  play: "paella:play",
  pause: "paella:pause",
  next: "paella:next",
  previous: "paella:previous",
  seeking: "paella:seeking",
  seeked: "paella:seeked",
  timeupdate: "paella:timeupdate",
  timeUpdate: "paella:timeupdate",
  seekTo: "paella:setseek",
  endVideo: "paella:endvideo",
  seekToTime: "paella:seektotime",
  setTrim: "paella:settrim",
  setPlaybackRate: "paella:setplaybackrate",
  setVolume: 'paella:setVolume',
  setComposition: 'paella:setComposition',
  loadStarted: 'paella:loadStarted',
  loadComplete: 'paella:loadComplete',
  loadPlugins: 'paella:loadPlugins',
  error: 'paella:error',
  documentChanged: 'paella:documentChanged',
  didSaveChanges: 'paella:didsavechanges',
  controlBarWillHide: 'paella:controlbarwillhide',
  controlBarDidHide: 'paella:controlbardidhide',
  controlBarDidShow: 'paella:controlbardidshow',
  hidePopUp: 'paella:hidePopUp',
  showPopUp: 'paella:showPopUp',
  enterFullscreen: 'paella:enterFullscreen',
  exitFullscreen: 'paella:exitFullscreen',
  resize: 'paella:resize',
  videoZoomChanged: 'paella:videoZoomChanged',
  audioTagChanged: 'paella:audiotagchanged',
  zoomAvailabilityChanged: 'paella:zoomavailabilitychanged',
  qualityChanged: 'paella:qualityChanged',
  singleVideoReady: 'paella:singleVideoReady',
  singleVideoUnloaded: 'paella:singleVideoUnloaded',
  videoReady: 'paella:videoReady',
  videoUnloaded: 'paella:videoUnloaded',
  controlBarLoaded: 'paella:controlBarLoaded',
  flashVideoEvent: 'paella:flashVideoEvent',
  captionAdded: 'paella:caption:add',
  captionsEnabled: 'paella:caption:enabled',
  captionsDisabled: 'paella:caption:disabled',
  profileListChanged: 'paella:profilelistchanged',
  setProfile: 'paella:setprofile',
  seekAvailabilityChanged: 'paella:seekAvailabilityChanged',
  trigger: function(event, params) {
    $(document).trigger(event, params);
  },
  bind: function(event, callback) {
    $(document).bind(event, function(event, params) {
      callback(event, params);
    });
  },
  setupExternalListener: function() {
    window.addEventListener("message", function(event) {
      if (event.data && event.data.event) {
        paella.events.trigger(event.data.event, event.data.params);
      }
    }, false);
  }
};
paella.events.setupExternalListener();

"use strict";
Class("paella.MouseManager", {
  targetObject: null,
  initialize: function() {
    var thisClass = this;
    paella.events.bind('mouseup', function(event) {
      thisClass.up(event);
    });
    paella.events.bind('mousemove', function(event) {
      thisClass.move(event);
    });
    paella.events.bind('mouseover', function(event) {
      thisClass.over(event);
    });
  },
  down: function(targetObject, event) {
    this.targetObject = targetObject;
    if (this.targetObject && this.targetObject.down) {
      this.targetObject.down(event, event.pageX, event.pageY);
      event.cancelBubble = true;
    }
    return false;
  },
  up: function(event) {
    if (this.targetObject && this.targetObject.up) {
      this.targetObject.up(event, event.pageX, event.pageY);
      event.cancelBubble = true;
    }
    this.targetObject = null;
    return false;
  },
  out: function(event) {
    if (this.targetObject && this.targetObject.out) {
      this.targetObject.out(event, event.pageX, event.pageY);
      event.cancelBubble = true;
    }
    return false;
  },
  move: function(event) {
    if (this.targetObject && this.targetObject.move) {
      this.targetObject.move(event, event.pageX, event.pageY);
      event.cancelBubble = true;
    }
    return false;
  },
  over: function(event) {
    if (this.targetObject && this.targetObject.over) {
      this.targetObject.over(event, event.pageX, event.pageY);
      event.cancelBubble = true;
    }
    return false;
  }
});
(function initSkinDeps() {
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = paella.baseUrl + 'resources/bootstrap/css/bootstrap.min.css';
  link.type = 'text/css';
  link.media = 'screen';
  link.charset = 'utf-8';
  document.head.appendChild(link);
})();
paella.utils = {
  mouseManager: new paella.MouseManager(),
  folders: {
    get: function(folder) {
      if (paella.player && paella.player.config && paella.player.config.folders && paella.player.config.folders[folder]) {
        return paella.player.config.folders[folder];
      }
      return undefined;
    },
    profiles: function() {
      return paella.baseUrl + (paella.utils.folders.get("profiles") || "config/profiles");
    },
    resources: function() {
      return paella.baseUrl + (paella.utils.folders.get("resources") || "resources");
    },
    skins: function() {
      return paella.baseUrl + (paella.utils.folders.get("skins") || paella.utils.folders.get("resources") + "/style");
    }
  },
  styleSheet: {
    removeById: function(id) {
      var outStyleSheet = $(document.head).find('#' + id)[0];
      if (outStyleSheet) {
        document.head.removeChild(outStyleSheet);
      }
    },
    remove: function(fileName) {
      var links = document.head.getElementsByTagName('link');
      for (var i = 0; i < links.length; ++i) {
        if (links[i].href) {
          document.head.removeChild(links[i]);
          break;
        }
      }
    },
    add: function(fileName, id) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = fileName;
      link.type = 'text/css';
      link.media = 'screen';
      link.charset = 'utf-8';
      if (id)
        link.id = id;
      document.head.appendChild(link);
    },
    swap: function(outFile, inFile) {
      this.remove(outFile);
      this.add(inFile);
    }
  },
  skin: {
    set: function(skinName) {
      var skinId = 'paellaSkin';
      paella.utils.styleSheet.removeById(skinId);
      paella.utils.styleSheet.add(paella.utils.folders.skins() + '/style_' + skinName + '.css');
      base.cookies.set("skin", skinName);
    },
    restore: function(defaultSkin) {
      var storedSkin = base.cookies.get("skin");
      if (storedSkin && storedSkin != "") {
        this.set(storedSkin);
      } else {
        this.set(defaultSkin);
      }
    }
  },
  timeParse: {
    timeToSeconds: function(timeString) {
      var hours = 0;
      var minutes = 0;
      var seconds = 0;
      if (/([0-9]+)h/i.test(timeString)) {
        hours = parseInt(RegExp.$1) * 60 * 60;
      }
      if (/([0-9]+)m/i.test(timeString)) {
        minutes = parseInt(RegExp.$1) * 60;
      }
      if (/([0-9]+)s/i.test(timeString)) {
        seconds = parseInt(RegExp.$1);
      }
      return hours + minutes + seconds;
    },
    secondsToTime: function(seconds) {
      var hrs = ~~(seconds / 3600);
      if (hrs < 10)
        hrs = '0' + hrs;
      var mins = ~~((seconds % 3600) / 60);
      if (mins < 10)
        mins = '0' + mins;
      var secs = Math.floor(seconds % 60);
      if (secs < 10)
        secs = '0' + secs;
      return hrs + ':' + mins + ':' + secs;
    },
    secondsToText: function(secAgo) {
      if (secAgo <= 1) {
        return base.dictionary.translate("1 second ago");
      }
      if (secAgo < 60) {
        return base.dictionary.translate("{0} seconds ago").replace(/\{0\}/g, secAgo);
      }
      var minAgo = Math.round(secAgo / 60);
      if (minAgo <= 1) {
        return base.dictionary.translate("1 minute ago");
      }
      if (minAgo < 60) {
        return base.dictionary.translate("{0} minutes ago").replace(/\{0\}/g, minAgo);
      }
      var hourAgo = Math.round(secAgo / (60 * 60));
      if (hourAgo <= 1) {
        return base.dictionary.translate("1 hour ago");
      }
      if (hourAgo < 24) {
        return base.dictionary.translate("{0} hours ago").replace(/\{0\}/g, hourAgo);
      }
      var daysAgo = Math.round(secAgo / (60 * 60 * 24));
      if (daysAgo <= 1) {
        return base.dictionary.translate("1 day ago");
      }
      if (daysAgo < 24) {
        return base.dictionary.translate("{0} days ago").replace(/\{0\}/g, daysAgo);
      }
      var monthsAgo = Math.round(secAgo / (60 * 60 * 24 * 30));
      if (monthsAgo <= 1) {
        return base.dictionary.translate("1 month ago");
      }
      if (monthsAgo < 12) {
        return base.dictionary.translate("{0} months ago").replace(/\{0\}/g, monthsAgo);
      }
      var yearsAgo = Math.round(secAgo / (60 * 60 * 24 * 365));
      if (yearsAgo <= 1) {
        return base.dictionary.translate("1 year ago");
      }
      return base.dictionary.translate("{0} years ago").replace(/\{0\}/g, yearsAgo);
    },
    matterhornTextDateToDate: function(mhdate) {
      var d = new Date();
      d.setFullYear(parseInt(mhdate.substring(0, 4), 10));
      d.setMonth(parseInt(mhdate.substring(5, 7), 10) - 1);
      d.setDate(parseInt(mhdate.substring(8, 10), 10));
      d.setHours(parseInt(mhdate.substring(11, 13), 10));
      d.setMinutes(parseInt(mhdate.substring(14, 16), 10));
      d.setSeconds(parseInt(mhdate.substring(17, 19), 10));
      return d;
    }
  },
  objectFromString: function(str) {
    var arr = str.split(".");
    var fn = (window || this);
    for (var i = 0,
        len = arr.length; i < len; i++) {
      fn = fn[arr[i]];
    }
    if (typeof fn !== "function") {
      throw new Error("constructor not found");
    }
    return fn;
  }
};
Class("paella.DataDelegate", {
  read: function(context, params, onSuccess) {
    if (typeof(onSuccess) == 'function') {
      onSuccess({}, true);
    }
  },
  write: function(context, params, value, onSuccess) {
    if (typeof(onSuccess) == 'function') {
      onSuccess({}, true);
    }
  },
  remove: function(context, params, onSuccess) {
    if (typeof(onSuccess) == 'function') {
      onSuccess({}, true);
    }
  }
});
paella.dataDelegates = {};
(function() {
  var g_delegateCallbacks = {};
  var g_dataDelegates = [];
  var Data = function() {
    function Data(config) {
      this._enabled = config.data.enabled;
      var executedCallbacks = [];
      var $__2 = function(context) {
        var callback = g_delegateCallbacks[context];
        var DelegateClass = null;
        var delegateName = null;
        if (!executedCallbacks.some(function(execCallbackData) {
          if (execCallbackData.callback == callback) {
            delegateName = execCallbackData.delegateName;
            return true;
          }
        })) {
          DelegateClass = g_delegateCallbacks[context]();
          delegateName = DelegateClass.name;
          paella.dataDelegates[delegateName] = DelegateClass;
          executedCallbacks.push({
            callback: callback,
            delegateName: delegateName
          });
        }
        if (!config.data.dataDelegates[context]) {
          config.data.dataDelegates[context] = delegateName;
        }
      };
      for (var context in g_delegateCallbacks) {
        $__2(context);
      }
      for (var key in config.data.dataDelegates) {
        try {
          var delegateName = config.data.dataDelegates[key];
          var DelegateClass = paella.dataDelegates[delegateName];
          var delegateInstance = new DelegateClass();
          g_dataDelegates[key] = delegateInstance;
        } catch (e) {
          console.warn("Warning: delegate not found - " + delegateName);
        }
      }
      if (!this.dataDelegates["default"]) {
        this.dataDelegates["default"] = new paella.dataDelegates.DefaultDataDelegate();
      }
    }
    return ($traceurRuntime.createClass)(Data, {
      get enabled() {
        return this._enabled;
      },
      get dataDelegates() {
        return g_dataDelegates;
      },
      read: function(context, key, onSuccess) {
        var del = this.getDelegate(context);
        del.read(context, key, onSuccess);
      },
      write: function(context, key, params, onSuccess) {
        var del = this.getDelegate(context);
        del.write(context, key, params, onSuccess);
      },
      remove: function(context, key, onSuccess) {
        var del = this.getDelegate(context);
        del.remove(context, key, onSuccess);
      },
      getDelegate: function(context) {
        if (this.dataDelegates[context])
          return this.dataDelegates[context];
        else
          return this.dataDelegates["default"];
      }
    }, {});
  }();
  paella.Data = Data;
  paella.addDataDelegate = function(context, callback) {
    if (Array.isArray(context)) {
      context.forEach(function(ctx) {
        g_delegateCallbacks[ctx] = callback;
      });
    } else if (typeof(context) == "string") {
      g_delegateCallbacks[context] = callback;
    }
  };
})();
paella.addDataDelegate(["default", "trimming"], function() {
  paella.dataDelegates.DefaultDataDelegate = function($__super) {
    function CookieDataDelegate() {
      $traceurRuntime.superConstructor(CookieDataDelegate).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(CookieDataDelegate, {
      serializeKey: function(context, params) {
        if ($traceurRuntime.typeof((params)) == 'object')
          params = JSON.stringify(params);
        return context + '|' + params;
      },
      read: function(context, params, onSuccess) {
        var key = this.serializeKey(context, params);
        var value = base.cookies.get(key);
        try {
          value = unescape(value);
          value = JSON.parse(value);
        } catch (e) {}
        if (typeof(onSuccess) == 'function') {
          onSuccess(value, true);
        }
      },
      write: function(context, params, value, onSuccess) {
        var key = this.serializeKey(context, params);
        if ($traceurRuntime.typeof((value)) == 'object')
          value = JSON.stringify(value);
        value = escape(value);
        base.cookies.set(key, value);
        if (typeof(onSuccess) == 'function') {
          onSuccess({}, true);
        }
      },
      remove: function(context, params, onSuccess) {
        var key = this.serializeKey(context, params);
        if ($traceurRuntime.typeof((value)) == 'object')
          value = JSON.stringify(value);
        base.cookies.set(key, '');
        if (typeof(onSuccess) == 'function') {
          onSuccess({}, true);
        }
      }
    }, {}, $__super);
  }(paella.DataDelegate);
  return paella.dataDelegates.DefaultDataDelegate;
});
paella.data = null;
var g_requiredScripts = {};
paella.require = function(path) {
  if (!g_requiredScripts[path]) {
    g_requiredScripts[path] = new Promise(function(resolve, reject) {
      var script = document.createElement("script");
      if (path.split(".").pop() == 'js') {
        script.src = path;
        script.async = false;
        document.head.appendChild(script);
        setTimeout(function() {
          return resolve();
        }, 100);
      } else {
        reject(new Error("Unexpected file type"));
      }
    });
  }
  return g_requiredScripts[path];
};
Class("paella.MessageBox", {
  modalContainerClassName: 'modalMessageContainer',
  frameClassName: 'frameContainer',
  messageClassName: 'messageContainer',
  errorClassName: 'errorContainer',
  currentMessageBox: null,
  messageContainer: null,
  onClose: null,
  initialize: function() {
    var thisClass = this;
    $(window).resize(function(event) {
      thisClass.adjustTop();
    });
  },
  showFrame: function(src, params) {
    var closeButton = true;
    var onClose = null;
    if (params) {
      closeButton = params.closeButton;
      onClose = params.onClose;
    }
    this.doShowFrame(src, closeButton, onClose);
  },
  doShowFrame: function(src, closeButton, onClose) {
    this.onClose = onClose;
    $('#playerContainer').addClass("modalVisible");
    if (this.currentMessageBox) {
      this.close();
    }
    var modalContainer = document.createElement('div');
    modalContainer.className = this.modalContainerClassName;
    modalContainer.style.position = 'fixed';
    modalContainer.style.top = '0px';
    modalContainer.style.left = '0px';
    modalContainer.style.right = '0px';
    modalContainer.style.bottom = '0px';
    modalContainer.style.zIndex = 999999;
    var messageContainer = document.createElement('div');
    messageContainer.className = this.frameClassName;
    modalContainer.appendChild(messageContainer);
    var iframeContainer = document.createElement('iframe');
    iframeContainer.src = src;
    iframeContainer.setAttribute("frameborder", "0");
    iframeContainer.style.width = "100%";
    iframeContainer.style.height = "100%";
    messageContainer.appendChild(iframeContainer);
    if (paella.player && paella.player.isFullScreen()) {
      paella.player.mainContainer.appendChild(modalContainer);
    } else {
      $('body')[0].appendChild(modalContainer);
    }
    this.currentMessageBox = modalContainer;
    this.messageContainer = messageContainer;
    var thisClass = this;
    this.adjustTop();
    if (closeButton) {
      this.createCloseButton();
    }
  },
  showElement: function(domElement, params) {
    var closeButton = true;
    var onClose = null;
    var className = this.messageClassName;
    if (params) {
      className = params.className;
      closeButton = params.closeButton;
      onClose = params.onClose;
    }
    this.doShowElement(domElement, closeButton, className, onClose);
  },
  showMessage: function(message, params) {
    var closeButton = true;
    var onClose = null;
    var className = this.messageClassName;
    if (params) {
      className = params.className;
      closeButton = params.closeButton;
      onClose = params.onClose;
    }
    this.doShowMessage(message, closeButton, className, onClose);
  },
  doShowElement: function(domElement, closeButton, className, onClose) {
    this.onClose = onClose;
    $('#playerContainer').addClass("modalVisible");
    if (this.currentMessageBox) {
      this.close();
    }
    if (!className)
      className = this.messageClassName;
    var modalContainer = document.createElement('div');
    modalContainer.className = this.modalContainerClassName;
    modalContainer.style.position = 'fixed';
    modalContainer.style.top = '0px';
    modalContainer.style.left = '0px';
    modalContainer.style.right = '0px';
    modalContainer.style.bottom = '0px';
    modalContainer.style.zIndex = 999999;
    var messageContainer = document.createElement('div');
    messageContainer.className = className;
    messageContainer.appendChild(domElement);
    modalContainer.appendChild(messageContainer);
    $('body')[0].appendChild(modalContainer);
    this.currentMessageBox = modalContainer;
    this.messageContainer = messageContainer;
    var thisClass = this;
    this.adjustTop();
    if (closeButton) {
      this.createCloseButton();
    }
  },
  doShowMessage: function(message, closeButton, className, onClose) {
    this.onClose = onClose;
    $('#playerContainer').addClass("modalVisible");
    if (this.currentMessageBox) {
      this.close();
    }
    if (!className)
      className = this.messageClassName;
    var modalContainer = document.createElement('div');
    modalContainer.className = this.modalContainerClassName;
    modalContainer.style.position = 'fixed';
    modalContainer.style.top = '0px';
    modalContainer.style.left = '0px';
    modalContainer.style.right = '0px';
    modalContainer.style.bottom = '0px';
    modalContainer.style.zIndex = 999999;
    var messageContainer = document.createElement('div');
    messageContainer.className = className;
    messageContainer.innerHTML = message;
    modalContainer.appendChild(messageContainer);
    if (paella.player && paella.player.isFullScreen()) {
      paella.player.mainContainer.appendChild(modalContainer);
    } else {
      $('body')[0].appendChild(modalContainer);
    }
    this.currentMessageBox = modalContainer;
    this.messageContainer = messageContainer;
    var thisClass = this;
    this.adjustTop();
    if (closeButton) {
      this.createCloseButton();
    }
  },
  showError: function(message, params) {
    var closeButton = false;
    var onClose = null;
    if (params) {
      closeButton = params.closeButton;
      onClose = params.onClose;
    }
    this.doShowError(message, closeButton, onClose);
  },
  doShowError: function(message, closeButton, onClose) {
    this.doShowMessage(message, closeButton, this.errorClassName, onClose);
  },
  createCloseButton: function() {
    if (this.messageContainer) {
      var thisClass = this;
      var closeButton = document.createElement('span');
      this.messageContainer.appendChild(closeButton);
      closeButton.className = 'paella_messageContainer_closeButton icon-cancel-circle';
      $(closeButton).click(function(event) {
        thisClass.onCloseButtonClick();
      });
    }
  },
  adjustTop: function() {
    if (this.currentMessageBox) {
      var msgHeight = $(this.messageContainer).outerHeight();
      var containerHeight = $(this.currentMessageBox).height();
      var top = containerHeight / 2 - msgHeight / 2;
      this.messageContainer.style.marginTop = top + 'px';
    }
  },
  close: function() {
    if (this.currentMessageBox && this.currentMessageBox.parentNode) {
      var msgBox = this.currentMessageBox;
      var parent = msgBox.parentNode;
      $('#playerContainer').removeClass("modalVisible");
      $(msgBox).animate({opacity: 0.0}, 300, function() {
        parent.removeChild(msgBox);
      });
      if (this.onClose) {
        this.onClose();
      }
    }
  },
  onCloseButtonClick: function() {
    this.close();
  }
});
paella.messageBox = new paella.MessageBox();
paella.AntiXSS = {
  htmlEscape: function(str) {
    return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  },
  htmlUnescape: function(value) {
    return String(value).replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  }
};

"use strict";
Class("paella.Node", {
  identifier: '',
  nodeList: null,
  parent: null,
  initialize: function(id) {
    this.nodeList = {};
    this.identifier = id;
  },
  addTo: function(parentNode) {
    parentNode.addNode(this);
  },
  addNode: function(childNode) {
    childNode.parent = this;
    this.nodeList[childNode.identifier] = childNode;
    return childNode;
  },
  getNode: function(id) {
    return this.nodeList[id];
  },
  removeNode: function(childNode) {
    if (this.nodeList[childNode.identifier]) {
      delete this.nodeList[childNode.identifier];
      return true;
    }
    return false;
  }
});
Class("paella.DomNode", paella.Node, {
  domElement: null,
  initialize: function(elementType, id, style) {
    this.parent(id);
    this.domElement = document.createElement(elementType);
    this.domElement.id = id;
    if (style)
      $(this.domElement).css(style);
  },
  addNode: function(childNode) {
    var returnValue = this.parent(childNode);
    this.domElement.appendChild(childNode.domElement);
    return returnValue;
  },
  onresize: function() {},
  removeNode: function(childNode) {
    if (this.parent(childNode)) {
      this.domElement.removeChild(childNode.domElement);
    }
  }
});
Class("paella.Button", paella.DomNode, {
  isToggle: false,
  initialize: function(id, className, action, isToggle) {
    this.isToggle = isToggle;
    var style = {};
    this.parent('div', id, style);
    this.domElement.className = className;
    if (isToggle) {
      var thisClass = this;
      $(this.domElement).click(function(event) {
        thisClass.toggleIcon();
      });
    }
    $(this.domElement).click('click', action);
  },
  isToggled: function() {
    if (this.isToggle) {
      var element = this.domElement;
      return /([a-zA-Z0-9_]+)_active/.test(element.className);
    } else {
      return false;
    }
  },
  toggle: function() {
    this.toggleIcon();
  },
  toggleIcon: function() {
    var element = this.domElement;
    if (/([a-zA-Z0-9_]+)_active/.test(element.className)) {
      element.className = RegExp.$1;
    } else {
      element.className = element.className + '_active';
    }
  },
  show: function() {
    $(this.domElement).show();
  },
  hide: function() {
    $(this.domElement).hide();
  },
  visible: function() {
    return this.domElement.visible();
  }
});

"use strict";
(function() {
  var g_profiles = [];
  var g_monostreamProfile = null;
  paella.addProfile = function(cb) {
    cb().then(function(profileData) {
      if (profileData) {
        g_profiles.push(profileData);
        if (typeof(profileData.onApply) != "function") {
          profileData.onApply = function() {};
        }
        paella.events.trigger(paella.events.profileListChanged, {profileData: profileData});
      }
    });
  };
  paella.setMonostreamProfile = function(cb) {
    cb().then(function(profileData) {
      if (typeof(profileData.onApply) != "function") {
        profileData.onApply = function() {};
      }
      g_monostreamProfile = profileData;
    });
  };
  function hideBackground() {
    var bkgNode = this.container.getNode("videoContainerBackground");
    if (bkgNode)
      this.container.removeNode(bkgNode);
  }
  function showBackground(bkgData) {
    if (!bkgData)
      return;
    hideBackground.apply(this);
    this.backgroundData = bkgData;
    var style = {
      backgroundImage: ("url(" + paella.utils.folders.get("resources") + "/style/" + bkgData.content + ")"),
      backgroundSize: "100% 100%",
      zIndex: bkgData.layer,
      position: 'absolute',
      left: bkgData.rect.left + "px",
      right: bkgData.rect.right + "px",
      width: "100%",
      height: "100%"
    };
    this.container.addNode(new paella.DomNode('div', "videoContainerBackground", style));
  }
  function hideAllLogos() {
    if (this.logos == undefined)
      return;
    for (var i = 0; i < this.logos.length; ++i) {
      var logoId = this.logos[i].content.replace(/\./ig, "-");
      var logo = this.container.getNode(logoId);
      $(logo.domElement).hide();
    }
  }
  function showLogos(logos) {
    this.logos = logos;
    var relativeSize = new paella.RelativeVideoSize();
    for (var i = 0; i < logos.length; ++i) {
      var logo = logos[i];
      var logoId = logo.content.replace(/\./ig, "-");
      var logoNode = this.container.getNode(logoId);
      var rect = logo.rect;
      if (!logoNode) {
        style = {};
        logoNode = this.container.addNode(new paella.DomNode('img', logoId, style));
        logoNode.domElement.setAttribute('src', (paella.utils.folders.get("resources") + "/style/" + logo.content));
      } else {
        $(logoNode.domElement).show();
      }
      var percentTop = Number(relativeSize.percentVSize(rect.top)) + '%';
      var percentLeft = Number(relativeSize.percentWSize(rect.left)) + '%';
      var percentWidth = Number(relativeSize.percentWSize(rect.width)) + '%';
      var percentHeight = Number(relativeSize.percentVSize(rect.height)) + '%';
      var style = {
        top: percentTop,
        left: percentLeft,
        width: percentWidth,
        height: percentHeight,
        position: 'absolute',
        zIndex: logo.zIndex
      };
      $(logoNode.domElement).css(style);
    }
  }
  function hideButtons() {
    var $__1 = this;
    if (this.buttons) {
      this.buttons.forEach(function(btn) {
        $__1.container.removeNode($__1.container.getNode(btn.id));
      });
      this.buttons = null;
    }
  }
  function showButtons(buttons, profileData) {
    var $__1 = this;
    hideButtons.apply(this);
    if (buttons) {
      var relativeSize = new paella.RelativeVideoSize();
      this.buttons = buttons;
      buttons.forEach(function(btn, index) {
        btn.id = "button_" + index;
        var rect = btn.rect;
        var percentTop = relativeSize.percentVSize(rect.top) + '%';
        var percentLeft = relativeSize.percentWSize(rect.left) + '%';
        var percentWidth = relativeSize.percentWSize(rect.width) + '%';
        var percentHeight = relativeSize.percentVSize(rect.height) + '%';
        var url = paella.baseUrl;
        url = url.replace(/\\/ig, '/');
        var style = {
          top: percentTop,
          left: percentLeft,
          width: percentWidth,
          height: percentHeight,
          position: 'absolute',
          zIndex: btn.layer,
          backgroundImage: ("url(" + paella.utils.folders.get("resources") + "/style/" + btn.icon + ")"),
          backgroundSize: '100% 100%',
          display: 'block'
        };
        var logoNode = $__1.container.addNode(new paella.DomNode('button', btn.id, style));
        logoNode.domElement.className = "paella-profile-button";
        logoNode.domElement.data = {
          action: btn.onClick,
          profileData: profileData
        };
        $(logoNode.domElement).click(function(evt) {
          this.data.action.apply(this.data.profileData, [evt]);
          evt.stopPropagation();
          return false;
        });
      });
    }
  }
  function getClosestRect(profileData, videoDimensions) {
    var minDiff = 10;
    var re = /([0-9\.]+)\/([0-9\.]+)/;
    var result = profileData.rect[0];
    var videoAspectRatio = videoDimensions.h == 0 ? 1.777777 : videoDimensions.w / videoDimensions.h;
    var profileAspectRatio = 1;
    var reResult = false;
    profileData.rect.forEach(function(rect) {
      if ((reResult = re.exec(rect.aspectRatio))) {
        profileAspectRatio = Number(reResult[1]) / Number(reResult[2]);
      }
      var diff = Math.abs(profileAspectRatio - videoAspectRatio);
      if (minDiff > diff) {
        minDiff = diff;
        result = rect;
      }
    });
    return result;
  }
  function applyProfileWithJson(profileData, animate) {
    var $__1 = this;
    if (animate == undefined)
      animate = true;
    if (!profileData)
      return;
    var getProfile = function(content) {
      var result = null;
      profileData && profileData.videos.some(function(videoProfile) {
        if (videoProfile.content == content) {
          result = videoProfile;
        }
        return result != null;
      });
      return result;
    };
    var applyVideoRect = function(profile, videoData, videoWrapper, player) {
      var frameStrategy = $__1.profileFrameStrategy;
      if (frameStrategy) {
        var rect = getClosestRect(profile, videoData.res);
        var videoSize = videoData.res;
        var containerSize = {
          width: $($__1.domElement).width(),
          height: $($__1.domElement).height()
        };
        var scaleFactor = rect.width / containerSize.width;
        var scaledVideoSize = {
          width: videoSize.w * scaleFactor,
          height: videoSize.h * scaleFactor
        };
        rect.left = Number(rect.left);
        rect.top = Number(rect.top);
        rect.width = Number(rect.width);
        rect.height = Number(rect.height);
        rect = frameStrategy.adaptFrame(scaledVideoSize, rect);
        var visible = /true/i.test(profile.visible);
        rect.visible = visible;
        var layer = parseInt(profile.layer);
        videoWrapper.domElement.style.zIndex = layer;
        videoWrapper.setRect(rect, animate);
        videoWrapper.setVisible(visible, animate);
        var isMainAudioPlayer = paella.player.videoContainer.streamProvider.mainAudioPlayer == player;
        visible ? player.enable(isMainAudioPlayer) : player.disable(isMainAudioPlayer);
      }
    };
    profileData && profileData.onApply();
    hideAllLogos.apply(this);
    profileData && showLogos.apply(this, [profileData.logos]);
    hideBackground.apply(this);
    profileData && showBackground.apply(this, [profileData.background]);
    hideButtons.apply(this);
    profileData && showButtons.apply(this, [profileData.buttons, profileData]);
    if (this.streamProvider.videoStreams.length == 1) {
      var profile = paella.profiles.loadMonostreamProfile();
      profile = profile && profile.videos && profile.videos.length > 0 && profile.videos[0];
      var player = this.streamProvider.videoPlayers[0];
      var videoWrapper = this.videoWrappers[0];
      if (profile) {
        player.getVideoData().then(function(data) {
          applyVideoRect(profile, data, videoWrapper, player);
        });
      }
    } else {
      this.streamProvider.videoStreams.forEach(function(streamData, index) {
        var profile = getProfile(streamData.content);
        var player = $__1.streamProvider.videoPlayers[index];
        var videoWrapper = $__1.videoWrappers[index];
        if (profile) {
          player.getVideoData().then(function(data) {
            applyVideoRect(profile, data, videoWrapper, player);
          });
        } else if (videoWrapper) {
          videoWrapper.setVisible(false, animate);
          if (paella.player.videoContainer.streamProvider.mainAudioPlayer != player) {
            player.disable();
          }
        }
      });
    }
  }
  var Profiles = function() {
    function Profiles() {
      var $__1 = this;
      paella.events.bind(paella.events.controlBarDidHide, function() {
        return $__1.hideButtons();
      });
      paella.events.bind(paella.events.controlBarDidShow, function() {
        return $__1.showButtons();
      });
      paella.events.bind(paella.events.profileListChanged, function() {
        if (paella.player && paella.player.videoContainer && (!$__1.currentProfile || $__1.currentProfileName != $__1.currentProfile.id)) {
          $__1.setProfile($__1.currentProfileName, false);
        }
      });
    }
    return ($traceurRuntime.createClass)(Profiles, {
      get profileList() {
        return g_profiles;
      },
      getDefaultProfile: function() {
        if (paella.player.videoContainer.masterVideo() && paella.player.videoContainer.masterVideo().defaultProfile()) {
          return paella.player.videoContainer.masterVideo().defaultProfile();
        }
        if (paella.player && paella.player.config && paella.player.config.defaultProfile) {
          return paella.player.config.defaultProfile;
        }
        return undefined;
      },
      loadProfile: function(profileId) {
        var result = null;
        g_profiles.some(function(profile) {
          if (profile.id == profileId) {
            result = profile;
          }
          return result;
        });
        return result;
      },
      loadMonostreamProfile: function() {
        return g_monostreamProfile;
      },
      get currentProfile() {
        return this.getProfile(this._currentProfileName);
      },
      get currentProfileName() {
        return this._currentProfileName;
      },
      setProfile: function(profileName, animate) {
        animate = base.userAgent.browser.Explorer ? false : animate;
        if (!paella.player.videoContainer.ready) {
          return false;
        } else if (paella.player.videoContainer.streamProvider.videoStreams.length == 1) {
          var profileData = this.loadMonostreamProfile();
          this._currentProfileName = profileName;
          applyProfileWithJson.apply(paella.player.videoContainer, [profileData, animate]);
          return true;
        } else {
          var profileData$__2 = this.loadProfile(profileName) || (g_profiles.length > 0 && g_profiles[0]);
          this._currentProfileName = profileName;
          applyProfileWithJson.apply(paella.player.videoContainer, [profileData$__2, animate]);
          return true;
        }
      },
      getProfile: function(profileName) {},
      placeVideos: function() {
        this.setProfile(this._currentProfileName, false);
      },
      hideButtons: function() {
        $('.paella-profile-button').hide();
      },
      showButtons: function() {
        $('.paella-profile-button').show();
      }
    }, {});
  }();
  paella.profiles = new Profiles();
})();

"use strict";
(function() {
  var VideoQualityStrategy = function() {
    function VideoQualityStrategy() {}
    return ($traceurRuntime.createClass)(VideoQualityStrategy, {
      getParams: function() {
        return paella.player.config.player.videoQualityStrategyParams || {};
      },
      getQualityIndex: function(source) {
        if (source.length > 0) {
          return source[source.length - 1];
        } else {
          return source;
        }
      }
    }, {Factory: function() {
        var config = paella.player.config;
        try {
          var strategyClass = config.player.videoQualityStrategy;
          var ClassObject = paella.utils.objectFromString(strategyClass);
          var strategy = new ClassObject();
          if (strategy instanceof paella.VideoQualityStrategy) {
            return strategy;
          }
        } catch (e) {}
        return null;
      }});
  }();
  paella.VideoQualityStrategy = VideoQualityStrategy;
  var BestFitVideoQualityStrategy = function($__super) {
    function BestFitVideoQualityStrategy() {
      $traceurRuntime.superConstructor(BestFitVideoQualityStrategy).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(BestFitVideoQualityStrategy, {getQualityIndex: function(source) {
        var index = source.length - 1;
        if (source.length > 0) {
          var selected = source[0];
          var win_w = $(window).width();
          var win_h = $(window).height();
          var win_res = (win_w * win_h);
          if (selected.res && selected.res.w && selected.res.h) {
            var selected_res = parseInt(selected.res.w) * parseInt(selected.res.h);
            var selected_diff = Math.abs(win_res - selected_res);
            for (var i = 0; i < source.length; ++i) {
              var res = source[i].res;
              if (res) {
                var m_res = parseInt(source[i].res.w) * parseInt(source[i].res.h);
                var m_diff = Math.abs(win_res - m_res);
                if (m_diff <= selected_diff) {
                  selected_diff = m_diff;
                  index = i;
                }
              }
            }
          }
        }
        return index;
      }}, {}, $__super);
  }(paella.VideoQualityStrategy);
  paella.BestFitVideoQualityStrategy = BestFitVideoQualityStrategy;
  var LimitedBestFitVideoQualityStrategy = function($__super) {
    function LimitedBestFitVideoQualityStrategy() {
      $traceurRuntime.superConstructor(LimitedBestFitVideoQualityStrategy).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(LimitedBestFitVideoQualityStrategy, {getQualityIndex: function(source) {
        var index = source.length - 1;
        var params = this.getParams();
        if (source.length > 0) {
          var selected = null;
          var win_h = $(window).height();
          var maxRes = params.maxAutoQualityRes || 720;
          var diff = Number.MAX_VALUE;
          source.forEach(function(item, i) {
            if (item.res && item.res.h <= maxRes) {
              var itemDiff = Math.abs(win_h - item.res.h);
              if (itemDiff < diff) {
                selected = item;
                index = i;
              }
            }
          });
        }
        return index;
      }}, {}, $__super);
  }(paella.VideoQualityStrategy);
  paella.LimitedBestFitVideoQualityStrategy = LimitedBestFitVideoQualityStrategy;
})();
Class("paella.VideoFactory", {
  isStreamCompatible: function(streamData) {
    return false;
  },
  getVideoObject: function(id, streamData, rect) {
    return null;
  }
});
paella.videoFactory = {
  _factoryList: [],
  initFactories: function() {
    if (paella.videoFactories) {
      var This = this;
      paella.player.config.player.methods.forEach(function(method) {
        if (method.enabled && paella.videoFactories[method.factory]) {
          This.registerFactory(new paella.videoFactories[method.factory]());
        }
      });
      this.registerFactory(new paella.videoFactories.EmptyVideoFactory());
    }
  },
  getVideoObject: function(id, streamData, rect) {
    if (this._factoryList.length == 0) {
      this.initFactories();
    }
    var selectedFactory = null;
    if (this._factoryList.some(function(factory) {
      if (factory.isStreamCompatible(streamData)) {
        selectedFactory = factory;
        return true;
      }
    })) {
      return selectedFactory.getVideoObject(id, streamData, rect);
    }
    return null;
  },
  registerFactory: function(factory) {
    this._factoryList.push(factory);
  }
};

"use strict";
(function() {
  var AudioElementBase = function($__super) {
    function AudioElementBase(id, stream) {
      $traceurRuntime.superConstructor(AudioElementBase).call(this, 'div', id);
      this._stream = stream;
    }
    return ($traceurRuntime.createClass)(AudioElementBase, {
      get stream() {
        return this._stream;
      },
      setAutoplay: function() {
        return Promise.reject(new Error("no such compatible video player"));
      },
      load: function() {
        return Promise.reject(new Error("no such compatible video player"));
      },
      play: function() {
        return Promise.reject(new Error("no such compatible video player"));
      },
      pause: function() {
        return Promise.reject(new Error("no such compatible video player"));
      },
      isPaused: function() {
        return Promise.reject(new Error("no such compatible video player"));
      },
      duration: function() {
        return Promise.reject(new Error("no such compatible video player"));
      },
      setCurrentTime: function(time) {
        return Promise.reject(new Error("no such compatible video player"));
      },
      currentTime: function() {
        return Promise.reject(new Error("no such compatible video player"));
      },
      setVolume: function(volume) {
        return Promise.reject(new Error("no such compatible video player"));
      },
      volume: function() {
        return Promise.reject(new Error("no such compatible video player"));
      },
      setPlaybackRate: function(rate) {
        return Promise.reject(new Error("no such compatible video player"));
      },
      playbackRate: function() {
        return Promise.reject(new Error("no such compatible video player"));
      },
      unload: function() {
        return Promise.reject(new Error("no such compatible video player"));
      },
      supportAutoplay: function() {
        return false;
      }
    }, {}, $__super);
  }(paella.DomNode);
  ;
  paella.AudioElementBase = AudioElementBase;
  paella.audioFactories = {};
  var AudioFactory = function() {
    function AudioFactory() {}
    return ($traceurRuntime.createClass)(AudioFactory, {
      isStreamCompatible: function(streamData) {
        return false;
      },
      getAudioObject: function(id, streamData) {
        return null;
      }
    }, {});
  }();
  paella.AudioFactory = AudioFactory;
  paella.audioFactory = {
    _factoryList: [],
    initFactories: function() {
      if (paella.audioFactories) {
        var This = this;
        paella.player.config.player.audioMethods = paella.player.config.player.audioMethods || {};
        paella.player.config.player.audioMethods.forEach(function(method) {
          if (method.enabled) {
            This.registerFactory(new paella.audioFactories[method.factory]());
          }
        });
      }
    },
    getAudioObject: function(id, streamData) {
      if (this._factoryList.length == 0) {
        this.initFactories();
      }
      var selectedFactory = null;
      if (this._factoryList.some(function(factory) {
        if (factory.isStreamCompatible(streamData)) {
          selectedFactory = factory;
          return true;
        }
      })) {
        return selectedFactory.getAudioObject(id, streamData);
      }
      return null;
    },
    registerFactory: function(factory) {
      this._factoryList.push(factory);
    }
  };
})();
(function() {
  function checkReady(cb) {
    var This = this;
    return new Promise(function(resolve, reject) {
      if (This._ready) {
        resolve(typeof(cb) == 'function' ? cb() : true);
      } else {
        var doCheck = function() {
          if (This.audio.readyState >= This.audio.HAVE_CURRENT_DATA) {
            This._ready = true;
            resolve(typeof(cb) == 'function' ? cb() : true);
          } else {
            setTimeout(doCheck, 50);
          }
        };
        doCheck();
      }
    });
  }
  var MultiformatAudioElement = function($__super) {
    function MultiformatAudioElement(id, stream) {
      $traceurRuntime.superConstructor(MultiformatAudioElement).call(this, id, stream);
      this._streamName = "audio";
      this._audio = document.createElement('audio');
      this.domElement.appendChild(this._audio);
    }
    return ($traceurRuntime.createClass)(MultiformatAudioElement, {
      get audio() {
        return this._audio;
      },
      setAutoplay: function(ap) {
        this.audio.autoplay = ap;
      },
      load: function() {
        var This = this;
        var sources = this._stream.sources[this._streamName];
        var stream = sources.length > 0 ? sources[0] : null;
        this.audio.innerText = "";
        if (stream) {
          var sourceElem = this.audio.querySelector('source');
          if (!sourceElem) {
            sourceElem = document.createElement('source');
            this.audio.appendChild(sourceElem);
          }
          sourceElem.src = stream.src;
          if (stream.type)
            sourceElem.type = stream.type;
          this.audio.load();
          return checkReady.apply(this, [function() {
            return stream;
          }]);
        } else {
          return Promise.reject(new Error("Could not load video: invalid quality stream index"));
        }
      },
      play: function() {
        var $__4 = this;
        return checkReady.apply(this, [function() {
          $__4.audio.play();
        }]);
      },
      pause: function() {
        var $__4 = this;
        return checkReady.apply(this, [function() {
          $__4.audio.pause();
        }]);
      },
      isPaused: function() {
        var $__4 = this;
        return checkReady.apply(this, [function() {
          return $__4.audio.paused;
        }]);
      },
      duration: function() {
        var $__4 = this;
        return checkReady.apply(this, [function() {
          return $__4.audio.duration;
        }]);
      },
      setCurrentTime: function(time) {
        var $__4 = this;
        return checkReady.apply(this, [function() {
          $__4.audio.currentTime = time;
        }]);
      },
      currentTime: function() {
        var $__4 = this;
        return checkReady.apply(this, [function() {
          return $__4.audio.currentTime;
        }]);
      },
      setVolume: function(volume) {
        var $__4 = this;
        return checkReady.apply(this, [function() {
          return $__4.audio.volume = volume;
        }]);
      },
      volume: function() {
        var $__4 = this;
        return checkReady.apply(this, [function() {
          return $__4.audio.volume;
        }]);
      },
      setPlaybackRate: function(rate) {
        var $__4 = this;
        return checkReady.apply(this, [function() {
          $__4.audio.playbackRate = rate;
        }]);
      },
      playbackRate: function() {
        var $__4 = this;
        return checkReady.apply(this, [function() {
          return $__4.audio.playbackRate;
        }]);
      },
      unload: function() {
        return Promise.resolve();
      }
    }, {}, $__super);
  }(paella.AudioElementBase);
  ;
  paella.MultiformatAudioElement = MultiformatAudioElement;
  var MultiformatAudioFactory = function() {
    function MultiformatAudioFactory() {}
    return ($traceurRuntime.createClass)(MultiformatAudioFactory, {
      isStreamCompatible: function(streamData) {
        return true;
      },
      getAudioObject: function(id, streamData) {
        return new paella.MultiformatAudioElement(id, streamData);
      }
    }, {});
  }();
  paella.audioFactories.MultiformatAudioFactory = MultiformatAudioFactory;
})();

"use strict";
paella.Profiles = {
  profileList: null,
  getDefaultProfile: function() {
    if (paella.player.videoContainer.masterVideo() && paella.player.videoContainer.masterVideo().defaultProfile()) {
      return paella.player.videoContainer.masterVideo().defaultProfile();
    }
    if (paella.player && paella.player.config && paella.player.config.defaultProfile) {
      return paella.player.config.defaultProfile;
    }
    return undefined;
  },
  loadProfile: function(profileName, onSuccessFunction) {
    var defaultProfile = this.getDefaultProfile();
    this.loadProfileList(function(data) {
      var profileData;
      if (data[profileName]) {
        profileData = data[profileName];
      } else if (data[defaultProfile]) {
        profileData = data[defaultProfile];
      } else {
        base.log.debug("Error loading the default profile. Check your Paella Player configuration");
        return false;
      }
      onSuccessFunction(profileData);
    });
  },
  loadProfileList: function(onSuccessFunction) {
    var thisClass = this;
    if (this.profileList == null) {
      var params = {url: paella.utils.folders.profiles() + "/profiles.json"};
      base.ajax.get(params, function(data, mimetype, code) {
        if (typeof(data) == "string") {
          data = JSON.parse(data);
        }
        thisClass.profileList = data;
        onSuccessFunction(thisClass.profileList);
      }, function(data, mimetype, code) {
        base.log.debug("Error loading video profiles. Check your Paella Player configuration");
      });
    } else {
      onSuccessFunction(thisClass.profileList);
    }
  }
};
Class("paella.RelativeVideoSize", {
  w: 1280,
  h: 720,
  proportionalHeight: function(newWidth) {
    return Math.floor(this.h * newWidth / this.w);
  },
  proportionalWidth: function(newHeight) {
    return Math.floor(this.w * newHeight / this.h);
  },
  percentVSize: function(pxSize) {
    return pxSize * 100 / this.h;
  },
  percentWSize: function(pxSize) {
    return pxSize * 100 / this.w;
  },
  aspectRatio: function() {
    return this.w / this.h;
  }
});
Class("paella.VideoRect", paella.DomNode, {
  _rect: null,
  initialize: function(id, domType, left, top, width, height) {
    var $__2 = this;
    var zoomSettings = paella.player.config.player.videoZoom || {};
    var zoomEnabled = (zoomSettings.enabled !== undefined ? zoomSettings.enabled : true) && this.allowZoom();
    this.parent(domType, id, zoomEnabled ? {
      width: this._zoom + '%',
      height: "100%",
      position: 'absolute'
    } : {
      width: "100%",
      height: "100%"
    });
    var eventCapture = document.createElement('div');
    setTimeout(function() {
      return $__2.domElement.parentElement.appendChild(eventCapture);
    }, 10);
    eventCapture.style.position = "absolute";
    eventCapture.style.top = "0px";
    eventCapture.style.left = "0px";
    eventCapture.style.right = "0px";
    eventCapture.style.bottom = "0px";
    this.eventCapture = eventCapture;
    if (zoomEnabled) {
      var checkZoomAvailable = function() {
        var minWindowSize = (paella.player.config.player && paella.player.config.player.videoZoom && paella.player.config.player.videoZoom.minWindowSize) || 500;
        var available = $(window).width() >= minWindowSize;
        if (this._zoomAvailable != available) {
          this._zoomAvailable = available;
          paella.events.trigger(paella.events.zoomAvailabilityChanged, {available: available});
        }
      };
      var mousePos = function(evt) {
        return {
          x: evt.originalEvent.offsetX,
          y: evt.originalEvent.offsetY
        };
      };
      var wheelDelta = function(evt) {
        var wheel = evt.originalEvent.deltaY * (paella.utils.userAgent.Firefox ? 2 : 1);
        var maxWheel = 6;
        return -Math.abs(wheel) < maxWheel ? wheel : maxWheel * Math.sign(wheel);
      };
      var touchesLength = function(p0, p1) {
        return Math.sqrt((p1.x - p0.x) * (p1.x - p0.x) + (p1.y - p0.y) * (p1.y - p0.y));
      };
      var centerPoint = function(p0, p1) {
        return {
          x: (p1.x - p0.x) / 2 + p0.x,
          y: (p1.y - p0.y) / 2 + p0.y
        };
      };
      var panImage = function(o) {
        var center = {
          x: this._mouseCenter.x - o.x * 1.1,
          y: this._mouseCenter.y - o.y * 1.1
        };
        var videoSize = {
          w: $(this.domElement).width(),
          h: $(this.domElement).height()
        };
        var maxOffset = this._zoom - 100;
        var offset = {
          x: (center.x * maxOffset / videoSize.w) * (maxOffset / 100),
          y: (center.y * maxOffset / videoSize.h) * (maxOffset / 100)
        };
        if (offset.x > maxOffset) {
          offset.x = maxOffset;
        } else if (offset.x < 0) {
          offset.x = 0;
        } else {
          this._mouseCenter.x = center.x;
        }
        if (offset.y > maxOffset) {
          offset.y = maxOffset;
        } else if (offset.y < 0) {
          offset.y = 0;
        } else {
          this._mouseCenter.y = center.y;
        }
        $(this.domElement).css({
          left: "-" + offset.x + "%",
          top: "-" + offset.y + "%"
        });
        this._zoomOffset = {
          x: offset.x,
          y: offset.y
        };
        paella.events.trigger(paella.events.videoZoomChanged, {video: this});
      };
      this._zoomAvailable = true;
      checkZoomAvailable.apply(this);
      $(window).resize(function() {
        checkZoomAvailable.apply($__2);
      });
      this._zoom = 100;
      this._mouseCenter = {
        x: 0,
        y: 0
      };
      this._mouseDown = {
        x: 0,
        y: 0
      };
      this._zoomOffset = {
        x: 0,
        y: 0
      };
      this._maxZoom = zoomSettings.max || 400;
      $(this.domElement).css({
        width: "100%",
        height: "100%",
        left: "0%",
        top: "0%"
      });
      Object.defineProperty(this, 'zoom', {get: function() {
          return this._zoom;
        }});
      Object.defineProperty(this, 'zoomOffset', {get: function() {
          return this._zoomOffset;
        }});
      var touches = [];
      $(eventCapture).on('touchstart', function(evt) {
        if (!$__2.allowZoom() || !$__2._zoomAvailable)
          return;
        touches = [];
        var videoOffset = $($__2.domElement).offset();
        for (var i = 0; i < evt.originalEvent.targetTouches.length; ++i) {
          var touch = evt.originalEvent.targetTouches[i];
          touches.push({
            x: touch.screenX - videoOffset.left,
            y: touch.screenY - videoOffset.top
          });
        }
        if (touches.length > 1)
          evt.preventDefault();
      });
      $(eventCapture).on('touchmove', function(evt) {
        if (!$__2.allowZoom() || !$__2._zoomAvailable)
          return;
        var curTouches = [];
        var videoOffset = $($__2.domElement).offset();
        for (var i = 0; i < evt.originalEvent.targetTouches.length; ++i) {
          var touch = evt.originalEvent.targetTouches[i];
          curTouches.push({
            x: touch.screenX - videoOffset.left,
            y: touch.screenY - videoOffset.top
          });
        }
        if (curTouches.length > 1 && touches.length > 1) {
          var l0 = touchesLength(touches[0], touches[1]);
          var l1 = touchesLength(curTouches[0], curTouches[1]);
          var delta = l1 - l0;
          var center = centerPoint(touches[0], touches[1]);
          $__2._mouseCenter = center;
          $__2._zoom += delta;
          $__2._zoom = $__2._zoom < 100 ? 100 : $__2._zoom;
          $__2._zoom = $__2._zoom > $__2._maxZoom ? $__2._maxZoom : $__2._zoom;
          var newVideoSize = {
            w: $($__2.domElement).width(),
            h: $($__2.domElement).height()
          };
          var mouse = $__2._mouseCenter;
          $($__2.domElement).css({
            width: $__2._zoom + '%',
            height: $__2._zoom + '%'
          });
          var maxOffset = $__2._zoom - 100;
          var offset = {
            x: (mouse.x * maxOffset / newVideoSize.w),
            y: (mouse.y * maxOffset / newVideoSize.h)
          };
          offset.x = offset.x < maxOffset ? offset.x : maxOffset;
          offset.y = offset.y < maxOffset ? offset.y : maxOffset;
          $($__2.domElement).css({
            left: "-" + offset.x + "%",
            top: "-" + offset.y + "%"
          });
          $__2._zoomOffset = {
            x: offset.x,
            y: offset.y
          };
          paella.events.trigger(paella.events.videoZoomChanged, {video: $__2});
          touches = curTouches;
          evt.preventDefault();
        } else if (curTouches.length > 0) {
          var desp = {
            x: curTouches[0].x - touches[0].x,
            y: curTouches[0].y - touches[0].y
          };
          panImage.apply($__2, [desp]);
          touches = curTouches;
          evt.preventDefault();
        }
      });
      $(eventCapture).on('touchend', function(evt) {
        if (!$__2.allowZoom() || !$__2._zoomAvailable)
          return;
        if (touches.length > 1)
          evt.preventDefault();
      });
      this.zoomIn = function() {
        if ($__2._zoom >= $__2._maxZoom || !$__2._zoomAvailable)
          return;
        if (!$__2._mouseCenter) {
          $__2._mouseCenter = {
            x: $($__2.domElement).width() / 2,
            y: $($__2.domElement).height() / 2
          };
        }
        $__2._zoom += 25;
        $__2._zoom = $__2._zoom < 100 ? 100 : $__2._zoom;
        $__2._zoom = $__2._zoom > $__2._maxZoom ? $__2._maxZoom : $__2._zoom;
        var newVideoSize = {
          w: $($__2.domElement).width(),
          h: $($__2.domElement).height()
        };
        var mouse = $__2._mouseCenter;
        $($__2.domElement).css({
          width: $__2._zoom + '%',
          height: $__2._zoom + '%'
        });
        var maxOffset = $__2._zoom - 100;
        var offset = {
          x: (mouse.x * maxOffset / newVideoSize.w) * (maxOffset / 100),
          y: (mouse.y * maxOffset / newVideoSize.h) * (maxOffset / 100)
        };
        offset.x = offset.x < maxOffset ? offset.x : maxOffset;
        offset.y = offset.y < maxOffset ? offset.y : maxOffset;
        $($__2.domElement).css({
          left: "-" + offset.x + "%",
          top: "-" + offset.y + "%"
        });
        $__2._zoomOffset = {
          x: offset.x,
          y: offset.y
        };
        paella.events.trigger(paella.events.videoZoomChanged, {video: $__2});
      };
      this.zoomOut = function() {
        if ($__2._zoom <= 100 || !$__2._zoomAvailable)
          return;
        if (!$__2._mouseCenter) {
          $__2._mouseCenter = {
            x: $($__2.domElement).width() / 2,
            y: $($__2.domElement).height() / 2
          };
        }
        $__2._zoom -= 25;
        $__2._zoom = $__2._zoom < 100 ? 100 : $__2._zoom;
        $__2._zoom = $__2._zoom > $__2._maxZoom ? $__2._maxZoom : $__2._zoom;
        var newVideoSize = {
          w: $($__2.domElement).width(),
          h: $($__2.domElement).height()
        };
        var mouse = $__2._mouseCenter;
        $($__2.domElement).css({
          width: $__2._zoom + '%',
          height: $__2._zoom + '%'
        });
        var maxOffset = $__2._zoom - 100;
        var offset = {
          x: (mouse.x * maxOffset / newVideoSize.w) * (maxOffset / 100),
          y: (mouse.y * maxOffset / newVideoSize.h) * (maxOffset / 100)
        };
        offset.x = offset.x < maxOffset ? offset.x : maxOffset;
        offset.y = offset.y < maxOffset ? offset.y : maxOffset;
        $($__2.domElement).css({
          left: "-" + offset.x + "%",
          top: "-" + offset.y + "%"
        });
        $__2._zoomOffset = {
          x: offset.x,
          y: offset.y
        };
        paella.events.trigger(paella.events.videoZoomChanged, {video: $__2});
      };
      $(eventCapture).on('mousewheel wheel', function(evt) {
        if (!$__2.allowZoom() || !$__2._zoomAvailable)
          return;
        var mouse = mousePos(evt);
        var wheel = wheelDelta(evt);
        if ($__2._zoom >= $__2._maxZoom && wheel > 0)
          return;
        $__2._zoom += wheel;
        $__2._zoom = $__2._zoom < 100 ? 100 : $__2._zoom;
        $__2._zoom = $__2._zoom > $__2._maxZoom ? $__2._maxZoom : $__2._zoom;
        var newVideoSize = {
          w: $($__2.domElement).width(),
          h: $($__2.domElement).height()
        };
        $($__2.domElement).css({
          width: $__2._zoom + '%',
          height: $__2._zoom + '%'
        });
        var maxOffset = $__2._zoom - 100;
        var offset = {
          x: (mouse.x * maxOffset / newVideoSize.w) * (maxOffset / 100),
          y: (mouse.y * maxOffset / newVideoSize.h) * (maxOffset / 100)
        };
        offset.x = offset.x < maxOffset ? offset.x : maxOffset;
        offset.y = offset.y < maxOffset ? offset.y : maxOffset;
        $($__2.domElement).css({
          left: "-" + offset.x + "%",
          top: "-" + offset.y + "%"
        });
        $__2._zoomOffset = {
          x: offset.x,
          y: offset.y
        };
        paella.events.trigger(paella.events.videoZoomChanged, {video: $__2});
        $__2._mouseCenter = mouse;
        evt.stopPropagation();
        return false;
      });
      $(eventCapture).on('mousedown', function(evt) {
        $__2._mouseDown = mousePos(evt);
        $__2.drag = true;
      });
      $(eventCapture).on('mousemove', function(evt) {
        if (!$__2.allowZoom() || !$__2._zoomAvailable)
          return;
        if ($__2.drag) {
          paella.player.videoContainer.disablePlayOnClick();
          var mouse = mousePos(evt);
          panImage.apply($__2, [{
            x: mouse.x - $__2._mouseDown.x,
            y: mouse.y - $__2._mouseDown.y
          }]);
          $__2._mouseDown = mouse;
        }
      });
      $(eventCapture).on('mouseup', function(evt) {
        if (!$__2.allowZoom() || !$__2._zoomAvailable)
          return;
        $__2.drag = false;
        setTimeout(function() {
          return paella.player.videoContainer.enablePlayOnClick();
        }, 10);
      });
      $(eventCapture).on('mouseleave', function(evt) {
        $__2.drag = false;
      });
    }
  },
  allowZoom: function() {
    return true;
  },
  setZoom: function(zoom, left, top) {
    var tween = arguments[3] !== (void 0) ? arguments[3] : 0;
    if (this.zoomAvailable()) {
      this._zoomOffset.x = left;
      this._zoomOffset.y = top;
      this._zoom = zoom;
      if (tween == 0) {
        $(this.domElement).css({
          width: this._zoom + '%',
          height: this._zoom + '%',
          left: "-" + this._zoomOffset.x + "%",
          top: "-" + this._zoomOffset.y + "%"
        });
      } else {
        $(this.domElement).stop(true, false).animate({
          width: this._zoom + '%',
          height: this._zoom + '%',
          left: "-" + this._zoomOffset.x + "%",
          top: "-" + this._zoomOffset.y + "%"
        }, tween, "linear");
      }
      paella.events.trigger(paella.events.videoZoomChanged, {video: this});
    }
  },
  captureFrame: function() {
    return Promise.resolve(null);
  },
  supportsCaptureFrame: function() {
    return Promise.resolve(false);
  },
  zoomAvailable: function() {
    return this.allowZoom() && this._zoomAvailable;
  },
  disableEventCapture: function() {
    this.eventCapture.style.pointerEvents = 'none';
  },
  enableEventCapture: function() {
    this.eventCapture.style.pointerEvents = '';
  }
});
function paella_DeferredResolved(param) {
  return new Promise(function(resolve) {
    resolve(param);
  });
}
function paella_DeferredRejected(param) {
  return new Promise(function(resolve, reject) {
    reject(param);
  });
}
function paella_DeferredNotImplemented() {
  return paella_DeferredRejected(new Error("not implemented"));
}
Class("paella.VideoElementBase", paella.VideoRect, {
  _ready: false,
  _autoplay: false,
  _stream: null,
  _videoQualityStrategy: null,
  initialize: function(id, stream, containerType, left, top, width, height) {
    this._stream = stream;
    this.parent(id, containerType, left, top, width, height);
    Object.defineProperty(this, 'ready', {get: function() {
        return this._ready;
      }});
    Object.defineProperty(this, 'stream', {get: function() {
        return this._stream;
      }});
    if (this._stream.preview)
      this.setPosterFrame(this._stream.preview);
  },
  defaultProfile: function() {
    return null;
  },
  setVideoQualityStrategy: function(strategy) {
    this._videoQualityStrategy = strategy;
  },
  setPosterFrame: function(url) {
    base.log.debug("TODO: implement setPosterFrame() function");
  },
  setAutoplay: function(autoplay) {
    this._autoplay = autoplay;
  },
  setMetadata: function(data) {
    this._metadata = data;
  },
  load: function() {
    return paella_DeferredNotImplemented();
  },
  supportAutoplay: function() {
    return true;
  },
  getVideoData: function() {
    return paella_DeferredNotImplemented();
  },
  play: function() {
    base.log.debug("TODO: implement play() function in your VideoElementBase subclass");
    return paella_DeferredNotImplemented();
  },
  pause: function() {
    base.log.debug("TODO: implement pause() function in your VideoElementBase subclass");
    return paella_DeferredNotImplemented();
  },
  isPaused: function() {
    base.log.debug("TODO: implement isPaused() function in your VideoElementBase subclass");
    return paella_DeferredNotImplemented();
  },
  duration: function() {
    base.log.debug("TODO: implement duration() function in your VideoElementBase subclass");
    return paella_DeferredNotImplemented();
  },
  setCurrentTime: function(time) {
    base.log.debug("TODO: implement setCurrentTime() function in your VideoElementBase subclass");
    return paella_DeferredNotImplemented();
  },
  currentTime: function() {
    base.log.debug("TODO: implement currentTime() function in your VideoElementBase subclass");
    return paella_DeferredNotImplemented();
  },
  setVolume: function(volume) {
    base.log.debug("TODO: implement setVolume() function in your VideoElementBase subclass");
    return paella_DeferredNotImplemented();
  },
  volume: function() {
    base.log.debug("TODO: implement volume() function in your VideoElementBase subclass");
    return paella_DeferredNotImplemented();
  },
  setPlaybackRate: function(rate) {
    base.log.debug("TODO: implement setPlaybackRate() function in your VideoElementBase subclass");
    return paella_DeferredNotImplemented();
  },
  playbackRate: function() {
    base.log.debug("TODO: implement playbackRate() function in your VideoElementBase subclass");
    return paella_DeferredNotImplemented();
  },
  getQualities: function() {
    return paella_DeferredNotImplemented();
  },
  setQuality: function(index) {
    return paella_DeferredNotImplemented();
  },
  getCurrentQuality: function() {
    return paella_DeferredNotImplemented();
  },
  unload: function() {
    this._callUnloadEvent();
    return paella_DeferredNotImplemented();
  },
  getDimensions: function() {
    return paella_DeferredNotImplemented();
  },
  goFullScreen: function() {
    return paella_DeferredNotImplemented();
  },
  freeze: function() {
    return paella_DeferredNotImplemented();
  },
  unFreeze: function() {
    return paella_DeferredNotImplemented();
  },
  disable: function(isMainAudioPlayer) {
    console.log("Disable video requested");
  },
  enable: function(isMainAudioPlayer) {
    console.log("Enable video requested");
  },
  setClassName: function(className) {
    this.domElement.className = className;
  },
  _callReadyEvent: function() {
    paella.events.trigger(paella.events.singleVideoReady, {sender: this});
  },
  _callUnloadEvent: function() {
    paella.events.trigger(paella.events.singleVideoUnloaded, {sender: this});
  }
});
Class("paella.EmptyVideo", paella.VideoElementBase, {
  initialize: function(id, stream, left, top, width, height) {
    this.parent(id, stream, 'div', left, top, width, height);
  },
  setPosterFrame: function(url) {},
  setAutoplay: function(auto) {},
  load: function() {
    return paella_DeferredRejected(new Error("no such compatible video player"));
  },
  play: function() {
    return paella_DeferredRejected(new Error("no such compatible video player"));
  },
  pause: function() {
    return paella_DeferredRejected(new Error("no such compatible video player"));
  },
  isPaused: function() {
    return paella_DeferredRejected(new Error("no such compatible video player"));
  },
  duration: function() {
    return paella_DeferredRejected(new Error("no such compatible video player"));
  },
  setCurrentTime: function(time) {
    return paella_DeferredRejected(new Error("no such compatible video player"));
  },
  currentTime: function() {
    return paella_DeferredRejected(new Error("no such compatible video player"));
  },
  setVolume: function(volume) {
    return paella_DeferredRejected(new Error("no such compatible video player"));
  },
  volume: function() {
    return paella_DeferredRejected(new Error("no such compatible video player"));
  },
  setPlaybackRate: function(rate) {
    return paella_DeferredRejected(new Error("no such compatible video player"));
  },
  playbackRate: function() {
    return paella_DeferredRejected(new Error("no such compatible video player"));
  },
  unFreeze: function() {
    return paella_DeferredRejected(new Error("no such compatible video player"));
  },
  freeze: function() {
    return paella_DeferredRejected(new Error("no such compatible video player"));
  },
  unload: function() {
    return paella_DeferredRejected(new Error("no such compatible video player"));
  },
  getDimensions: function() {
    return paella_DeferredRejected(new Error("no such compatible video player"));
  }
});
Class("paella.videoFactories.EmptyVideoFactory", paella.VideoFactory, {
  isStreamCompatible: function(streamData) {
    return true;
  },
  getVideoObject: function(id, streamData, rect) {
    return new paella.EmptyVideo(id, streamData, rect.x, rect.y, rect.w, rect.h);
  }
});
Class("paella.Html5Video", paella.VideoElementBase, {
  _posterFrame: null,
  _currentQuality: null,
  _autoplay: false,
  _streamName: null,
  initialize: function(id, stream, left, top, width, height, streamName) {
    var $__2 = this;
    this.parent(id, stream, 'video', left, top, width, height);
    this._streamName = streamName || 'mp4';
    var This = this;
    this._playbackRate = 1;
    if (this._stream.sources[this._streamName]) {
      this._stream.sources[this._streamName].sort(function(a, b) {
        return a.res.h - b.res.h;
      });
    }
    Object.defineProperty(this, 'video', {get: function() {
        return This.domElement;
      }});
    this.video.preload = "auto";
    this.video.setAttribute("playsinline", "");
    function onProgress(event) {
      if (!This._ready && This.video.readyState == 4) {
        This._ready = true;
        if (This._initialCurrentTipe !== undefined) {
          This.video.currentTime = This._initialCurrentTime;
          delete This._initialCurrentTime;
        }
        This._callReadyEvent();
      }
    }
    function evtCallback(event) {
      onProgress.apply(This, [event]);
    }
    $(this.video).bind('progress', evtCallback);
    $(this.video).bind('loadstart', evtCallback);
    $(this.video).bind('loadedmetadata', evtCallback);
    $(this.video).bind('canplay', evtCallback);
    $(this.video).bind('oncanplay', evtCallback);
    $(this.video).bind('timeupdate', function(evt) {
      $__2._resumeCurrentTime = $__2.video.currentTime;
    });
    $(this.video).bind('emptied', function(evt) {
      $__2.video.currentTime = $__2._resumeCurrentTime;
    });
    if (paella.utils.userAgent.browser.Safari) {
      $(this.video).bind('canplay canplaythrough', function(evt) {
        $__2.video.currentTime = $__2._resumeCurrentTime;
      });
    }
  },
  _deferredAction: function(action) {
    var $__2 = this;
    return new Promise(function(resolve, reject) {
      function processResult(actionResult) {
        if (actionResult instanceof Promise) {
          actionResult.then(function(p) {
            return resolve(p);
          }).catch(function(err) {
            return reject(err);
          });
        } else {
          resolve(actionResult);
        }
      }
      if ($__2.ready) {
        processResult(action());
      } else {
        $($__2.video).bind('canplay', function() {
          $__2._ready = true;
          processResult(action());
        });
      }
    });
  },
  _getQualityObject: function(index, s) {
    return {
      index: index,
      res: s.res,
      src: s.src,
      toString: function() {
        return this.res.w == 0 ? "auto" : this.res.w + "x" + this.res.h;
      },
      shortLabel: function() {
        return this.res.w == 0 ? "auto" : this.res.h + "p";
      },
      compare: function(q2) {
        return this.res.w * this.res.h - q2.res.w * q2.res.h;
      }
    };
  },
  captureFrame: function() {
    var $__2 = this;
    return new Promise(function(resolve) {
      resolve({
        source: $__2.video,
        width: $__2.video.videoWidth,
        height: $__2.video.videoHeight
      });
    });
  },
  supportsCaptureFrame: function() {
    return Promise.resolve(true);
  },
  getVideoData: function() {
    var $__2 = this;
    var This = this;
    return new Promise(function(resolve, reject) {
      $__2._deferredAction(function() {
        resolve({
          duration: This.video.duration,
          currentTime: This.video.currentTime,
          volume: This.video.volume,
          paused: This.video.paused,
          ended: This.video.ended,
          res: {
            w: This.video.videoWidth,
            h: This.video.videoHeight
          }
        });
      });
    });
  },
  setPosterFrame: function(url) {
    this._posterFrame = url;
  },
  setAutoplay: function(auto) {
    this._autoplay = auto;
    if (auto && this.video) {
      this.video.setAttribute("autoplay", auto);
    }
  },
  load: function() {
    var This = this;
    var sources = this._stream.sources[this._streamName];
    if (this._currentQuality === null && this._videoQualityStrategy) {
      this._currentQuality = this._videoQualityStrategy.getQualityIndex(sources);
    }
    var stream = this._currentQuality < sources.length ? sources[this._currentQuality] : null;
    this.video.innerText = "";
    if (stream) {
      var sourceElem = this.video.querySelector('source');
      if (!sourceElem) {
        sourceElem = document.createElement('source');
        this.video.appendChild(sourceElem);
      }
      if (this._posterFrame) {
        this.video.setAttribute("poster", this._posterFrame);
      }
      sourceElem.src = stream.src;
      sourceElem.type = stream.type;
      this.video.load();
      this.video.playbackRate = this._playbackRate;
      return this._deferredAction(function() {
        return stream;
      });
    } else {
      return paella_DeferredRejected(new Error("Could not load video: invalid quality stream index"));
    }
  },
  disable: function(isMainAudioPlayer) {},
  enable: function(isMainAudioPlayer) {},
  getQualities: function() {
    var $__2 = this;
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        var result = [];
        var sources = $__2._stream.sources[$__2._streamName];
        var index = -1;
        sources.forEach(function(s) {
          index++;
          result.push($__2._getQualityObject(index, s));
        });
        resolve(result);
      }, 10);
    });
  },
  setQuality: function(index) {
    var $__2 = this;
    return new Promise(function(resolve) {
      var paused = $__2.video.paused;
      var sources = $__2._stream.sources[$__2._streamName];
      $__2._currentQuality = index < sources.length ? index : 0;
      var currentTime = $__2.video.currentTime;
      var This = $__2;
      var onSeek = function() {
        This.unFreeze().then(function() {
          resolve();
          This.video.removeEventListener('seeked', onSeek, false);
        });
      };
      $__2.freeze().then(function() {
        return $__2.load();
      }).then(function() {
        if (!paused) {
          $__2.play();
        }
        $__2.video.addEventListener('seeked', onSeek);
        $__2.video.currentTime = currentTime;
      });
    });
  },
  getCurrentQuality: function() {
    var $__2 = this;
    return new Promise(function(resolve) {
      resolve($__2._getQualityObject($__2._currentQuality, $__2._stream.sources[$__2._streamName][$__2._currentQuality]));
    });
  },
  play: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      if (!$__2._isDisabled) {
        return $__2.video.play();
      } else {
        return Promise.resolve();
      }
    });
  },
  pause: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      if (!$__2._isDisabled) {
        return $__2.video.pause();
      } else {
        return Promise.resolve();
      }
    });
  },
  isPaused: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      return $__2.video.paused;
    });
  },
  duration: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      return $__2.video.duration;
    });
  },
  setCurrentTime: function(time) {
    var $__2 = this;
    return this._deferredAction(function() {
      $__2.video.currentTime = time;
    });
  },
  currentTime: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      return $__2.video.currentTime;
    });
  },
  setVolume: function(volume) {
    var $__2 = this;
    return this._deferredAction(function() {
      $__2.video.volume = volume;
      if (volume == 0) {
        $__2.video.setAttribute("muted", "muted");
        $__2.video.muted = true;
      } else {
        $__2.video.removeAttribute("muted");
        $__2.video.muted = false;
      }
    });
  },
  volume: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      return $__2.video.volume;
    });
  },
  setPlaybackRate: function(rate) {
    var $__2 = this;
    return this._deferredAction(function() {
      $__2._playbackRate = rate;
      $__2.video.playbackRate = rate;
    });
  },
  playbackRate: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      return $__2.video.playbackRate;
    });
  },
  supportAutoplay: function() {
    var macOS10_12_safari = paella.utils.userAgent.system.MacOS && paella.utils.userAgent.system.Version.minor >= 12 && paella.utils.userAgent.browser.Safari;
    var iOS = paella.utils.userAgent.system.iOS;
    var chrome_v64 = paella.utils.userAgent.browser.Chrome && paella.utils.userAgent.browser.Version.major == 64;
    if (macOS10_12_safari || iOS || chrome_v64) {
      return false;
    } else {
      return true;
    }
  },
  goFullScreen: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      var elem = $__2.video;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitEnterFullscreen) {
        elem.webkitEnterFullscreen();
      }
    });
  },
  unFreeze: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      var c = document.getElementById($__2.video.id + "canvas");
      if (c) {
        $(c).remove();
      }
    });
  },
  freeze: function() {
    var This = this;
    return this._deferredAction(function() {
      var canvas = document.createElement("canvas");
      canvas.id = This.video.id + "canvas";
      canvas.className = "freezeFrame";
      canvas.width = This.video.videoWidth;
      canvas.height = This.video.videoHeight;
      canvas.style.cssText = This.video.style.cssText;
      canvas.style.zIndex = 2;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(This.video, 0, 0, Math.ceil(canvas.width / 16) * 16, Math.ceil(canvas.height / 16) * 16);
      This.video.parentElement.appendChild(canvas);
    });
  },
  unload: function() {
    this._callUnloadEvent();
    return paella_DeferredNotImplemented();
  },
  getDimensions: function() {
    return paella_DeferredNotImplemented();
  }
});
paella.Html5Video.IsAutoplaySupported = function() {
  var debug = arguments[0] !== (void 0) ? arguments[0] : false;
  return new Promise(function(resolve) {
    var video = document.createElement('video');
    video.src = 'data:video/mp4;base64,AAAAIGZ0eXBtcDQyAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAC+htZGF0AAACqQYF//+l3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE1NSByMjkwMSA3ZDBmZjIyIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAxOCAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTEgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MToweDEgbWU9ZGlhIHN1Ym1lPTEgcHN5PTEgcHN5X3JkPTEuMDA6MC4wMCBtaXhlZF9yZWY9MCBtZV9yYW5nZT0xNiBjaHJvbWFfbWU9MSB0cmVsbGlzPTAgOHg4ZGN0PTAgY3FtPTAgZGVhZHpvbmU9MjEsMTEgZmFzdF9wc2tpcD0xIGNocm9tYV9xcF9vZmZzZXQ9MCB0aHJlYWRzPTEgbG9va2FoZWFkX3RocmVhZHM9MSBzbGljZWRfdGhyZWFkcz0wIG5yPTAgZGVjaW1hdGU9MSBpbnRlcmxhY2VkPTAgYmx1cmF5X2NvbXBhdD0wIGNvbnN0cmFpbmVkX2ludHJhPTAgYmZyYW1lcz0zIGJfcHlyYW1pZD0yIGJfYWRhcHQ9MSBiX2JpYXM9MCBkaXJlY3Q9MSB3ZWlnaHRiPTEgb3Blbl9nb3A9MCB3ZWlnaHRwPTEga2V5aW50PTMyMCBrZXlpbnRfbWluPTMyIHNjZW5lY3V0PTQwIGludHJhX3JlZnJlc2g9MCByYz1jcmYgbWJ0cmVlPTAgY3JmPTQwLjAgcWNvbXA9MC42MCBxcG1pbj0wIHFwbWF4PTY5IHFwc3RlcD00IGlwX3JhdGlvPTEuNDAgcGJfcmF0aW89MS4zMCBhcT0xOjEuMDAAgAAAAJBliIQD/2iscx5avG2BdVkxRtUop8zs5zVIqfxQM03W1oVb8spYPP0yjO506xIxgVQ4iSPGOtcDZBVYGqcTatSa730A8XTpnUDpUSrpyaCe/P8eLds/XenOFYMh8UIGMBwzhVOniajqOPFOmmFC20nufGOpJw81hGhgFwCO6a8acwB0P6LNhZZoRD0y2AZMQfEA0AAHAAAACEGaIRiEP5eAANAABwDSGK8UmBURhUGyINeXiuMlXvJnPVVQKigqVGy8PAuVNiWY94iJ/jL/HeT+/usIfmc/dsQ/TV87CTfXhD8C/4xCP3V+DJP8UP3iJdT8okfAuRJF8zkPgh5/J7XzGT8o9pJ+tvlST+g3uwh1330Q9qd4IbnwOQ9dexCHf8mQfVJ57wET8acsIcn6UT6p7yoP2uQ97fFAhrNARXaou2QkEJxrmP6ZBa7TiE6Uqx04OcnChy+OrfwfRWfSYRbS2wmENdDIKUQSkggeXbLb10CIHL5BPgiBydo+HEEPILBbH9zZOdw/77EbN8euVRS/ZcjbZ/D63aLDh1MTme4vfGzFjXkw9r7U8EhcddAmwXGKjo9o53+/8Rnm1rnt6yh3hLD9/htcZnjjGcW9ZQlj6DKIGrrPo/l6C6NyeVr07mB/N6VlGb5fkLBZM42iUNiIGnMJzShmmlFtEsO0mr5CMcFiJdrZQjdIxsYwpU4xlzmD2+oPtjSLVZiDh2lHDRmHubAxXMROEt0z4GkcCYCk832HaXZSM+4vZbUwJa2ysgmfAQMTEM9gxxct7h5xLdrMnHUnB2bXMO2rEnqnnjWHyFYTrzmZTjJ3N4qP+Pv5VHYzZuAa9jnrg35h5hu/Q87uewVnjbJrtcOOm6b9lltPS6n/mkxgxSyqLJVzr/bYt039aTYyhmveJTdeiG7kLfmn9bqjXfxdfZoz53RDcxw+jP7n7TtT8BsB3jUvxe7n5Gbrm9/5QzQ3cxxl9s6ojDMDg3R7Bx//b5rwuSI84z2fuP8/nPxj/wvHNccSL3n77sCEv+AUwlVzHAFkYCkDkdRIORiUg5GJSDkYlIORgKQsjI9E1d0PUP5zV31MSkvI+AAAAAtBmkMYjP/4v5j6wQDGGK/rogCQL/+rZ+PHZ8R11ITSYLDLmXtUdt5a5V+63JHBE/z0/3cCf4av6uOAGtQmr8mCvCxwSI/c7KILm624qm/Kb4fKK5P1GWvX/S84SiSuyTIfk3zVghdRlzZpLZXgddiJjKTGb43OFQCup1nyCbjWgjmOozS6mXGEDsuoVDkSR7/Q8ErEhAZqgHJ5yCxkICvpE+HztDoOSTYiiBCW6shBKQM/Aw5DdbsGWUc/3XEIhH8HXJSDU8mZDApXSSZR+4fbKiOTUHmUgYd7HOLNG544Zy3F+ZPqxMwuGkCo/HxfLXrebdQakkweTwTqUgIDlwvPC181Z5eZ7cDTV905pDXGj/KiRAk3p+hlgHPvRW35PT4b163gUGkmIl0Ds4OBn6G64lkPsnQPNFs8AtwH4PSeYoz9s5uh/jFX0tlr7f+xzN6PuDvyOmKvYhdYK5FLAOkbJ6E/r7fxRZ1g63PPgeLsfir/0iq9K7IW+eWH4ONNCdL5oyV/TSILB+ob8z1ZWUf9p50jIFh6l64geGZ785/8OQanz95/ZPwGF03PMeYdkuH6x5Q/gcx5bg2RejM+RPQ6Vg6D43WOe+1fDKbVqr9P6Y5S9fuwD56fvq62ESHISopAae8/mbMD2la4/h/K9uSYuhxZDNszxgmQmd2kQDoEU6g46KneCXN/b9b5Ez/4iQOfBj4EuXyfp8MlAlFg8P486y4HT9H680pqN9xN164m7ReXPWHU7pw7F9Pw3FEDjQrHHnM3KfE8KWrl2JyxrdR90wr+HPPrkO5v1XT88+iU5MfGOeswl1uQxhiAGn4O62zaMJmDbSrMNY4LEV/jc+TjMQJRwOsUrW8aDyVoo87t8G+Qtfm6fOy6DNK9crM2f3KQJ0YEPc5JM0eSQsjYSFkZFIWRkUgcB1El5HwAAAAIAZ5iRCX/y4AA7liudRsNCYNGAb/ocSIJGilo13xUupVcYzmaVbkEY3nch7y9pfI1qxo3V9n9Q+r84e3e7dCfx+aLdD6S8dDaqzc6eqH9onVdingfJndPc1yaRhn4JD1jsj85o/le4m9cE2W1F8unegGNvOuknfzBmz4/Us9R+kC7xW5e9Z1Z9JsGeb/z6XkKkxiNh1C3Ns5jTVxB9x1poY49zmq+xsXNh0uy75DZf0JM9Uq8ghKrZiQDyAlHf4dqw48mtmlozgUMkh7VJ7vbIW1UNI81pRTT7C3WOOa3mw0RNjAoMLjtm1+VqQBEhHw+6VBvNTwCBkyvjU+kVMA1OU8elyGQX0xTlHRM8iPGg3CO8B5AzpOm2M7J75cG3PPGc42ztXyYzat3TyZ54CyDqZi1/Mn4B6T1fhMSD0uk5lKsOHIktX1Sfud/I3Ew+McUpwm3bxVdAy7uiGeiXWbe3cMBmCruk4yW18G6dEf9prnjcT6HUZG5bBSQGYSQscX2KCZoWxWkVS0w6IkwqdVJ+Akyey/Hl0MyrcAMI6Sgq3HMn95sBcc4ZadQLT31gNKo6qyebwmyK63HlMTK40Zj3FGuboBQ3Zsg87Jf3Gg1SDlG6fRVl2+5Cc6q+0OcUNRyCfLIG157ZHTSCwD9UpZtZDLki0BCLgAAAAhBmmQYiv+BgQDyne7dSHRhSQ/D31OEhh0h14FMQDwlvgJODIIYGxb7iHQo1mvJn3hOUUli9mTrUMuuPv/W2bsX3X7l9k7jtvT/Cuf4Kmbbhn0zmtjx7GWFyjrJfyHHxs5mxuTjdr2/drXoPhh1rb2XOnE9H3BdBqm1I+K5Sd1hYCevn6PbJcDyUHpysOZeLu+VoYklOlicG52cbxZbzvVeiS4jb+qyJoL62Ox+nSrUhOkCNMf8dz5iEi+C5iYZciyXk6gmIvSJVQDNTiO2i1a6pGORhiNVWGAMBHNHyHbmWtqB9AYbSdGR5qQzHnGF9HWaHfTzIqQMNEioRwE00KEllO+UcuPFmOs0Kl9lgy1DgKSKfGaaVFc7RNrn0nOddM6OfOG51GuoJSCnOpRjIvLAMAAAAA1NfU1+Ro9v/o+AANDABwAABedtb292AAAAbG12aGQAAAAA18kDNdfJAzUAAAPoAAAAowABAAABAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAGGlvZHMAAAAAEICAgAcAT////v7/AAACknRyYWsAAABcdGtoZAAAAAPXyQM118kDNQAAAAEAAAAAAAAAnwAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAOAAAACAAAAAAACRlZHRzAAAAHGVsc3QAAAAAAAAAAQAAAJ8AABZEAAEAAAAAAgptZGlhAAAAIG1kaGQAAAAA18kDNdfJAzUAAV+QAAA3qlXEAAAAAAAtaGRscgAAAAAAAAAAdmlkZQAAAAAAAAAAAAAAAFZpZGVvSGFuZGxlcgAAAAG1bWluZgAAABR2bWhkAAAAAQAAAAAAAAAAAAAAJGRpbmYAAAAcZHJlZgAAAAAAAAABAAAADHVybCAAAAABAAABdXN0YmwAAACYc3RzZAAAAAAAAAABAAAAiGF2YzEAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAOAAgAEgAAABIAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY//8AAAAyYXZjQwFNQAr/4QAaZ01ACuyiLy+AtQYBBkAAAATAAAEsI8SJZYABAAVo74OcgAAAABhzdHRzAAAAAAAAAAEAAAAFAAALIgAAABRzdHNzAAAAAAAAAAEAAAABAAAAEXNkdHAAAAAAIBAQGBAAAAAwY3R0cwAAAAAAAAAEAAAAAgAAFkQAAAABAAAhZgAAAAEAAAsiAAAAAQAAFkQAAAAcc3RzYwAAAAAAAAABAAAAAQAAAAEAAAABAAAAKHN0c3oAAAAAAAAAAAAAAAUAAANBAAAADAAAAA8AAAAMAAAADAAAACRzdGNvAAAAAAAAAAUAAAAwAAADdQAABhAAAAjPAAAKyQAAAlp0cmFrAAAAXHRraGQAAAAD18kDNdfJAzUAAAACAAAAAAAAAKMAAAAAAAAAAAAAAAEBAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAkZWR0cwAAABxlbHN0AAAAAAAAAAEAAABzAAAIQAABAAAAAAG+bWRpYQAAACBtZGhkAAAAANfJAzXXyQM1AACsRAAAHABVxAAAAAAAJWhkbHIAAAAAAAAAAHNvdW4AAAAAAAAAAAAAAABNb25vAAAAAXFtaW5mAAAAEHNtaGQAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAATVzdGJsAAAAZ3N0c2QAAAAAAAAAAQAAAFdtcDRhAAAAAAAAAAEAAAAAAAAAAAACABAAAAAArEQAAAAAADNlc2RzAAAAAAOAgIAiAAIABICAgBRAFQAAAAAAAAAAAAAABYCAgAISCAaAgIABAgAAABhzdHRzAAAAAAAAAAEAAAAHAAAEAAAAABxzdHNjAAAAAAAAAAEAAAABAAAAAQAAAAEAAAAwc3RzegAAAAAAAAAAAAAABwAAAAQAAAAEAAACiwAAArAAAAHuAAABNwAAAAQAAAAsc3RjbwAAAAAAAAAHAAADcQAAA4EAAAOFAAAGHwAACNsAAArVAAAMDAAAABpzZ3BkAQAAAHJvbGwAAAACAAAAAf//AAAAHHNiZ3AAAAAAcm9sbAAAAAEAAAAHAAAAAQAAABR1ZHRhAAAADG5hbWVNb25vAAAAb3VkdGEAAABnbWV0YQAAAAAAAAAhaGRscgAAAAAAAAAAbWRpcmFwcGwAAAAAAAAAAAAAAAA6aWxzdAAAADKpdG9vAAAAKmRhdGEAAAABAAAAAEhhbmRCcmFrZSAxLjEuMiAyMDE4MDkwNTAw';
    video.load();
    if (debug) {
      video.style = "position: fixed; top: 0px; right: 0px; z-index: 1000000;";
      document.body.appendChild(video);
    } else {
      video.style.display = 'none';
    }
    video.playing = false;
    video.play().then(function(status) {
      resolve(true);
    }).catch(function(err) {
      resolve(false);
    });
  });
};
Class("paella.videoFactories.Html5VideoFactory", {
  isStreamCompatible: function(streamData) {
    try {
      if (paella.videoFactories.Html5VideoFactory.s_instances > 0 && base.userAgent.system.iOS && (paella.utils.userAgent.system.Version.major <= 10 && paella.utils.userAgent.system.Version.minor < 3)) {
        return false;
      }
      for (var key in streamData.sources) {
        if (key == 'mp4' || key == 'mp3')
          return true;
      }
    } catch (e) {}
    return false;
  },
  getVideoObject: function(id, streamData, rect) {
    ++paella.videoFactories.Html5VideoFactory.s_instances;
    return new paella.Html5Video(id, streamData, rect.x, rect.y, rect.w, rect.h);
  }
});
paella.videoFactories.Html5VideoFactory.s_instances = 0;
Class("paella.ImageVideo", paella.VideoElementBase, {
  _posterFrame: null,
  _currentQuality: null,
  _currentTime: 0,
  _duration: 0,
  _ended: false,
  _playTimer: null,
  _playbackRate: 1,
  _frameArray: null,
  initialize: function(id, stream, left, top, width, height) {
    this.parent(id, stream, 'img', left, top, width, height);
    var This = this;
    this._stream.sources.image.sort(function(a, b) {
      return a.res.h - b.res.h;
    });
    Object.defineProperty(this, 'img', {get: function() {
        return This.domElement;
      }});
    Object.defineProperty(this, 'imgStream', {get: function() {
        return this._stream.sources.image[this._currentQuality];
      }});
    Object.defineProperty(this, '_paused', {get: function() {
        return this._playTimer == null;
      }});
  },
  _deferredAction: function(action) {
    var $__2 = this;
    return new Promise(function(resolve) {
      if ($__2.ready) {
        resolve(action());
      } else {
        var resolve = function() {
          $__2._ready = true;
          resolve(action());
        };
        $($__2.video).bind('paella:imagevideoready', resolve);
      }
    });
  },
  _getQualityObject: function(index, s) {
    return {
      index: index,
      res: s.res,
      src: s.src,
      toString: function() {
        return Number(this.res.w) + "x" + Number(this.res.h);
      },
      shortLabel: function() {
        return this.res.h + "p";
      },
      compare: function(q2) {
        return Number(this.res.w) * Number(this.res.h) - Number(q2.res.w) * Number(q2.res.h);
      }
    };
  },
  _loadCurrentFrame: function() {
    var This = this;
    if (this._frameArray) {
      var frame = this._frameArray[0];
      this._frameArray.some(function(f) {
        if (This._currentTime < f.time) {
          return true;
        } else {
          frame = f.src;
        }
      });
      this.img.src = frame;
    }
  },
  getVideoData: function() {
    var $__2 = this;
    var This = this;
    return new Promise(function(resolve) {
      $__2._deferredAction(function() {
        var videoData = {
          duration: This._duration,
          currentTime: This._currentTime,
          volume: 0,
          paused: This._paused,
          ended: This._ended,
          res: {
            w: This.imgStream.res.w,
            h: This.imgStream.res.h
          }
        };
        resolve(videoData);
      });
    });
  },
  setPosterFrame: function(url) {
    this._posterFrame = url;
  },
  setAutoplay: function(auto) {
    this._autoplay = auto;
    if (auto && this.video) {
      this.video.setAttribute("autoplay", auto);
    }
  },
  load: function() {
    var This = this;
    var sources = this._stream.sources.image;
    if (this._currentQuality === null && this._videoQualityStrategy) {
      this._currentQuality = this._videoQualityStrategy.getQualityIndex(sources);
    }
    var stream = this._currentQuality < sources.length ? sources[this._currentQuality] : null;
    if (stream) {
      this._frameArray = [];
      for (var key in stream.frames) {
        var time = Math.floor(Number(key.replace("frame_", "")));
        this._frameArray.push({
          src: stream.frames[key],
          time: time
        });
      }
      this._frameArray.sort(function(a, b) {
        return a.time - b.time;
      });
      this._ready = true;
      this._currentTime = 0;
      this._duration = stream.duration;
      this._loadCurrentFrame();
      paella.events.trigger("paella:imagevideoready");
      return this._deferredAction(function() {
        return stream;
      });
    } else {
      return paella_DeferredRejected(new Error("Could not load video: invalid quality stream index"));
    }
  },
  supportAutoplay: function() {
    return true;
  },
  getQualities: function() {
    var $__2 = this;
    return new Promise(function(resolve) {
      setTimeout(function() {
        var result = [];
        var sources = $__2._stream.sources[$__2._streamName];
        var index = -1;
        sources.forEach(function(s) {
          index++;
          result.push($__2._getQualityObject(index, s));
        });
        resolve(result);
      }, 10);
    });
  },
  setQuality: function(index) {
    var $__2 = this;
    return new Promise(function(resolve) {
      var paused = $__2._paused;
      var sources = $__2._stream.sources.image;
      $__2._currentQuality = index < sources.length ? index : 0;
      var currentTime = $__2._currentTime;
      $__2.load().then(function() {
        this._loadCurrentFrame();
        resolve();
      });
    });
  },
  getCurrentQuality: function() {
    var $__2 = this;
    return new Promise(function(resolve) {
      resolve($__2._getQualityObject($__2._currentQuality, $__2._stream.sources.image[$__2._currentQuality]));
    });
  },
  play: function() {
    var This = this;
    return this._deferredAction(function() {
      This._playTimer = new base.Timer(function() {
        This._currentTime += 0.25 * This._playbackRate;
        This._loadCurrentFrame();
      }, 250);
      This._playTimer.repeat = true;
    });
  },
  pause: function() {
    var This = this;
    return this._deferredAction(function() {
      This._playTimer.repeat = false;
      This._playTimer = null;
    });
  },
  isPaused: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      return $__2._paused;
    });
  },
  duration: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      return $__2._duration;
    });
  },
  setCurrentTime: function(time) {
    var $__2 = this;
    return this._deferredAction(function() {
      $__2._currentTime = time;
      $__2._loadCurrentFrame();
    });
  },
  currentTime: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      return $__2._currentTime;
    });
  },
  setVolume: function(volume) {
    return this._deferredAction(function() {});
  },
  volume: function() {
    return this._deferredAction(function() {
      return 0;
    });
  },
  setPlaybackRate: function(rate) {
    var $__2 = this;
    return this._deferredAction(function() {
      $__2._playbackRate = rate;
    });
  },
  playbackRate: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      return $__2._playbackRate;
    });
  },
  goFullScreen: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      var elem = $__2.img;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitEnterFullscreen) {
        elem.webkitEnterFullscreen();
      }
    });
  },
  unFreeze: function() {
    return this._deferredAction(function() {});
  },
  freeze: function() {
    return this._deferredAction(function() {});
  },
  unload: function() {
    this._callUnloadEvent();
    return paella_DeferredNotImplemented();
  },
  getDimensions: function() {
    return paella_DeferredNotImplemented();
  }
});
Class("paella.videoFactories.ImageVideoFactory", {
  isStreamCompatible: function(streamData) {
    try {
      for (var key in streamData.sources) {
        if (key == 'image')
          return true;
      }
    } catch (e) {}
    return false;
  },
  getVideoObject: function(id, streamData, rect) {
    return new paella.ImageVideo(id, streamData, rect.x, rect.y, rect.w, rect.h);
  }
});

"use strict";
Class("paella.BackgroundContainer", paella.DomNode, {
  initialize: function(id, image) {
    this.parent('img', id, {
      position: 'relative',
      top: '0px',
      left: '0px',
      right: '0px',
      bottom: '0px',
      zIndex: GlobalParams.background.zIndex
    });
    this.domElement.setAttribute('src', image);
    this.domElement.setAttribute('alt', '');
    this.domElement.setAttribute('width', '100%');
    this.domElement.setAttribute('height', '100%');
  },
  setImage: function(image) {
    this.domElement.setAttribute('src', image);
  }
});
Class("paella.VideoOverlay", paella.DomNode, {
  size: {
    w: 1280,
    h: 720
  },
  initialize: function() {
    var style = {
      position: 'absolute',
      left: '0px',
      right: '0px',
      top: '0px',
      bottom: '0px',
      overflow: 'hidden',
      zIndex: 10
    };
    this.parent('div', 'overlayContainer', style);
    this.domElement.setAttribute("role", "main");
  },
  _generateId: function() {
    return Math.ceil(Date.now() * Math.random());
  },
  enableBackgroundMode: function() {
    this.domElement.className = 'overlayContainer background';
  },
  disableBackgroundMode: function() {
    this.domElement.className = 'overlayContainer';
  },
  clear: function() {
    this.domElement.innerText = "";
  },
  getVideoRect: function(index) {
    return paella.player.videoContainer.getVideoRect(index);
  },
  addText: function(text, rect, isDebug) {
    var textElem = document.createElement('div');
    textElem.innerText = text;
    textElem.className = "videoOverlayText";
    if (isDebug)
      textElem.style.backgroundColor = "red";
    return this.addElement(textElem, rect);
  },
  addElement: function(element, rect) {
    this.domElement.appendChild(element);
    element.style.position = 'absolute';
    element.style.left = this.getHSize(rect.left) + '%';
    element.style.top = this.getVSize(rect.top) + '%';
    element.style.width = this.getHSize(rect.width) + '%';
    element.style.height = this.getVSize(rect.height) + '%';
    return element;
  },
  getLayer: function(id, zindex) {
    id = id || this._generateId();
    return $(this.domElement).find("#" + id)[0] || this.addLayer(id, zindex);
  },
  addLayer: function(id, zindex) {
    zindex = zindex || 10;
    var element = document.createElement('div');
    element.className = "row";
    element.id = id || this._generateId();
    return this.addElement(element, {
      left: 0,
      top: 0,
      width: 1280,
      height: 720
    });
  },
  removeLayer: function(id) {
    var elem = $(this.domElement).find("#" + id)[0];
    if (elem) {
      this.domElement.removeChild(elem);
    }
  },
  removeElement: function(element) {
    if (element) {
      try {
        this.domElement.removeChild(element);
      } catch (e) {}
    }
  },
  getVSize: function(px) {
    return px * 100 / this.size.h;
  },
  getHSize: function(px) {
    return px * 100 / this.size.w;
  }
});
(function() {
  var VideoWrapper = function($__super) {
    function VideoWrapper(id, left, top, width, height) {
      var relativeSize = new paella.RelativeVideoSize();
      var percentTop = relativeSize.percentVSize(top) + '%';
      var percentLeft = relativeSize.percentWSize(left) + '%';
      var percentWidth = relativeSize.percentWSize(width) + '%';
      var percentHeight = relativeSize.percentVSize(height) + '%';
      var style = {
        top: percentTop,
        left: percentLeft,
        width: percentWidth,
        height: percentHeight,
        position: 'absolute',
        zIndex: GlobalParams.video.zIndex,
        overflow: 'hidden'
      };
      $traceurRuntime.superConstructor(VideoWrapper).call(this, 'div', id, style);
      this._rect = {
        left: left,
        top: top,
        width: width,
        height: height
      };
      this.domElement.className = "videoWrapper";
    }
    return ($traceurRuntime.createClass)(VideoWrapper, {
      setRect: function(rect, animate) {
        this._rect = JSON.parse(JSON.stringify(rect));
        var relativeSize = new paella.RelativeVideoSize();
        var percentTop = relativeSize.percentVSize(rect.top) + '%';
        var percentLeft = relativeSize.percentWSize(rect.left) + '%';
        var percentWidth = relativeSize.percentWSize(rect.width) + '%';
        var percentHeight = relativeSize.percentVSize(rect.height) + '%';
        var style = {
          top: percentTop,
          left: percentLeft,
          width: percentWidth,
          height: percentHeight,
          position: 'absolute'
        };
        if (animate) {
          this.disableClassName();
          var thisClass = this;
          $(this.domElement).animate(style, 400, function() {
            thisClass.enableClassName();
            paella.events.trigger(paella.events.setComposition, {video: thisClass});
          });
          this.enableClassNameAfter(400);
        } else {
          $(this.domElement).css(style);
          paella.events.trigger(paella.events.setComposition, {video: this});
        }
      },
      getRect: function() {
        return this._rect;
      },
      disableClassName: function() {
        this.classNameBackup = this.domElement.className;
        this.domElement.className = "";
      },
      enableClassName: function() {
        this.domElement.className = this.classNameBackup;
      },
      enableClassNameAfter: function(millis) {
        setTimeout("$('#" + this.domElement.id + "')[0].className = '" + this.classNameBackup + "'", millis);
      },
      setVisible: function(visible, animate) {
        if ($traceurRuntime.typeof((visible == "string"))) {
          visible = /true/i.test(visible) ? true : false;
        }
        if (visible && animate) {
          $(this.domElement).show();
          $(this.domElement).animate({opacity: 1.0}, 300);
        } else if (visible && !animate) {
          $(this.domElement).show();
        } else if (!visible && animate) {
          $(this.domElement).animate({opacity: 0.0}, 300);
        } else if (!visible && !animate) {
          $(this.domElement).hide();
        }
      },
      setLayer: function(layer) {
        this.domElement.style.zIndex = layer;
      }
    }, {}, $__super);
  }(paella.DomNode);
  paella.VideoWrapper = VideoWrapper;
})();
Class("paella.VideoContainerBase", paella.DomNode, {
  _trimming: {
    enabled: false,
    start: 0,
    end: 0
  },
  timeupdateEventTimer: null,
  timeupdateInterval: 250,
  masterVideoData: null,
  slaveVideoData: null,
  currentMasterVideoData: null,
  currentSlaveVideoData: null,
  _force: false,
  _playOnClickEnabled: true,
  _seekDisabled: false,
  initialize: function(id) {
    var self = this;
    var style = {
      position: 'absolute',
      left: '0px',
      right: '0px',
      top: '0px',
      bottom: '0px',
      overflow: 'hidden'
    };
    this.parent('div', id, style);
    $(this.domElement).click(function(evt) {
      if (self.firstClick && base.userAgent.browser.IsMobileVersion)
        return;
      if (self.firstClick && !self._playOnClickEnabled)
        return;
      paella.player.videoContainer.paused().then(function(paused) {
        self.firstClick = true;
        if (paused) {
          paella.player.play();
        } else {
          paella.player.pause();
        }
      });
    });
    this.domElement.addEventListener("touchstart", function(event) {
      if (paella.player.controls) {
        paella.player.controls.restartHideTimer();
      }
    });
    Object.defineProperty(this, "seekDisabled", {
      get: function() {
        return this._seekDisabled;
      },
      set: function(v) {
        var changed = v != this._seekDisabled;
        this._seekDisabled = v;
        if (changed) {
          paella.events.trigger(paella.events.seekAvailabilityChanged, {
            disabled: this._seekDisabled,
            enabled: !this._seekDisabled
          });
        }
      }
    });
    Object.defineProperty(this, "seekEnabled", {
      get: function() {
        return !this._seekDisabled;
      },
      set: function(v) {
        var changed = v == this._seekDisabled;
        this._seekDisabled = !v;
        if (changed) {
          paella.events.trigger(paella.events.seekAvailabilityChanged, {
            disabled: this._seekDisabled,
            enabled: !this._seekDisabled
          });
        }
      }
    });
  },
  triggerTimeupdate: function() {
    var This = this;
    var paused = 0;
    var duration = 0;
    this.paused().then(function(p) {
      paused = p;
      return This.duration();
    }).then(function(d) {
      duration = d;
      return This.currentTime();
    }).then(function(currentTime) {
      if (!paused || This._force) {
        This._force = false;
        paella.events.trigger(paella.events.timeupdate, {
          videoContainer: This,
          currentTime: currentTime,
          duration: duration
        });
      }
    });
  },
  startTimeupdate: function() {
    var thisClass = this;
    this.timeupdateEventTimer = new Timer(function(timer) {
      thisClass.triggerTimeupdate();
    }, this.timeupdateInterval);
    this.timeupdateEventTimer.repeat = true;
  },
  stopTimeupdate: function() {
    if (this.timeupdateEventTimer) {
      this.timeupdateEventTimer.repeat = false;
    }
    this.timeupdateEventTimer = null;
  },
  enablePlayOnClick: function() {
    this._playOnClickEnabled = true;
  },
  disablePlayOnClick: function() {
    this._playOnClickEnabled = false;
  },
  isPlayOnClickEnabled: function() {
    return this._playOnClickEnabled;
  },
  play: function() {
    this.startTimeupdate();
    setTimeout(function() {
      return paella.events.trigger(paella.events.play);
    }, 50);
  },
  pause: function() {
    paella.events.trigger(paella.events.pause);
    this.stopTimeupdate();
  },
  seekTo: function(newPositionPercent) {
    var $__2 = this;
    if (this._seekDisabled) {
      console.log("Warning: Seek is disabled");
      return;
    }
    var thisClass = this;
    this.setCurrentPercent(newPositionPercent).then(function(timeData) {
      thisClass._force = true;
      $__2.triggerTimeupdate();
      paella.events.trigger(paella.events.seekToTime, {newPosition: timeData.time});
      paella.events.trigger(paella.events.seekTo, {newPositionPercent: newPositionPercent});
    });
  },
  seekToTime: function(time) {
    var $__2 = this;
    if (this._seekDisabled) {
      console.log("Seek is disabled");
      return;
    }
    this.setCurrentTime(time).then(function(timeData) {
      $__2._force = true;
      $__2.triggerTimeupdate();
      var percent = timeData.time * 100 / timeData.duration;
      paella.events.trigger(paella.events.seekToTime, {newPosition: timeData.time});
      paella.events.trigger(paella.events.seekTo, {newPositionPercent: percent});
    });
  },
  setPlaybackRate: function(params) {
    paella.events.trigger(paella.events.setPlaybackRate, {rate: params});
  },
  setVolume: function(params) {},
  volume: function() {
    return 1;
  },
  trimStart: function() {
    var $__2 = this;
    return new Promise(function(resolve) {
      resolve($__2._trimming.start);
    });
  },
  trimEnd: function() {
    var $__2 = this;
    return new Promise(function(resolve) {
      resolve($__2._trimming.end);
    });
  },
  trimEnabled: function() {
    var $__2 = this;
    return new Promise(function(resolve) {
      resolve($__2._trimming.enabled);
    });
  },
  trimming: function() {
    var $__2 = this;
    return new Promise(function(resolve) {
      resolve($__2._trimming);
    });
  },
  enableTrimming: function() {
    this._trimming.enabled = true;
    var cap = paella.captions.getActiveCaptions();
    if (cap !== undefined)
      paella.plugins.captionsPlugin.buildBodyContent(cap._captions, "list");
    paella.events.trigger(paella.events.setTrim, {
      trimEnabled: this._trimming.enabled,
      trimStart: this._trimming.start,
      trimEnd: this._trimming.end
    });
  },
  disableTrimming: function() {
    this._trimming.enabled = false;
    var cap = paella.captions.getActiveCaptions();
    if (cap !== undefined)
      paella.plugins.captionsPlugin.buildBodyContent(cap._captions, "list");
    paella.events.trigger(paella.events.setTrim, {
      trimEnabled: this._trimming.enabled,
      trimStart: this._trimming.start,
      trimEnd: this._trimming.end
    });
  },
  setTrimming: function(start, end) {
    var $__2 = this;
    return new Promise(function(resolve) {
      var currentTime = 0;
      var duration = 0;
      $__2.currentTime().then(function(c) {
        currentTime = c;
        return $__2.duration();
      }).then(function(d) {
        duration = d;
        $__2._trimming.start = Math.floor(start);
        $__2._trimming.end = Math.floor(end);
        if (currentTime < $__2._trimming.start) {
          $__2.setCurrentTime($__2._trimming.start);
        }
        if (currentTime > $__2._trimming.end) {
          $__2.setCurrentTime($__2._trimming.end);
        }
        if ($__2._trimming.enabled) {
          var cap = paella.captions.getActiveCaptions();
          if (cap !== undefined)
            paella.plugins.captionsPlugin.buildBodyContent(cap._captions, "list");
        }
        paella.events.trigger(paella.events.setTrim, {
          trimEnabled: $__2._trimming.enabled,
          trimStart: $__2._trimming.start,
          trimEnd: $__2._trimming.end
        });
        resolve();
      });
    });
  },
  setTrimmingStart: function(start) {
    return this.setTrimming(start, this._trimming.end);
  },
  setTrimmingEnd: function(end) {
    return this.setTrimming(this._trimming.start, end);
  },
  setCurrentPercent: function(percent) {
    var $__2 = this;
    var This = this;
    var duration = 0;
    return new Promise(function(resolve) {
      $__2.duration().then(function(d) {
        duration = d;
        return This.trimming();
      }).then(function(trimming) {
        var position = 0;
        if (trimming.enabled) {
          var start = trimming.start;
          var end = trimming.end;
          duration = end - start;
          var trimedPosition = percent * duration / 100;
          position = parseFloat(trimedPosition);
        } else {
          position = percent * duration / 100;
        }
        return This.setCurrentTime(position);
      }).then(function(timeData) {
        resolve(timeData);
      });
    });
  },
  setCurrentTime: function(time) {
    base.log.debug("VideoContainerBase.setCurrentTime(" + time + ")");
  },
  currentTime: function() {
    base.log.debug("VideoContainerBase.currentTime()");
    return 0;
  },
  duration: function() {
    base.log.debug("VideoContainerBase.duration()");
    return 0;
  },
  paused: function() {
    base.log.debug("VideoContainerBase.paused()");
    return true;
  },
  setupVideo: function(onSuccess) {
    base.log.debug("VideoContainerBase.setupVide()");
  },
  isReady: function() {
    base.log.debug("VideoContainerBase.isReady()");
    return true;
  },
  onresize: function() {
    this.parent(onresize);
  }
});
(function() {
  var ProfileFrameStrategy = function() {
    function ProfileFrameStrategy() {}
    return ($traceurRuntime.createClass)(ProfileFrameStrategy, {
      valid: function() {
        return true;
      },
      adaptFrame: function(videoDimensions, frameRect) {
        return frameRect;
      }
    }, {Factory: function() {
        var config = paella.player.config;
        try {
          var strategyClass = config.player.profileFrameStrategy;
          var ClassObject = paella.utils.objectFromString(strategyClass);
          var strategy = new ClassObject();
          if (strategy instanceof paella.ProfileFrameStrategy) {
            return strategy;
          }
        } catch (e) {}
        return null;
      }});
  }();
  paella.ProfileFrameStrategy = ProfileFrameStrategy;
  var LimitedSizeProfileFrameStrategy = function($__super) {
    function LimitedSizeProfileFrameStrategy() {
      $traceurRuntime.superConstructor(LimitedSizeProfileFrameStrategy).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(LimitedSizeProfileFrameStrategy, {adaptFrame: function(videoDimensions, frameRect) {
        if (videoDimensions.width < frameRect.width || videoDimensions.height < frameRect.height) {
          var frameRectCopy = JSON.parse(JSON.stringify(frameRect));
          frameRectCopy.width = videoDimensions.width;
          frameRectCopy.height = videoDimensions.height;
          var diff = {
            w: frameRect.width - videoDimensions.width,
            h: frameRect.height - videoDimensions.height
          };
          frameRectCopy.top = frameRectCopy.top + diff.h / 2;
          frameRectCopy.left = frameRectCopy.left + diff.w / 2;
          return frameRectCopy;
        }
        return frameRect;
      }}, {}, $__super);
  }(ProfileFrameStrategy);
  paella.LimitedSizeProfileFrameStrategy = LimitedSizeProfileFrameStrategy;
})();
(function() {
  var StreamProvider = function() {
    function StreamProvider(videoData) {
      this._mainStream = null;
      this._videoStreams = [];
      this._audioStreams = [];
      this._mainPlayer = null;
      this._audioPlayer = null;
      this._videoPlayers = [];
      this._audioPlayers = [];
      this._players = [];
      this._autoplay = base.parameters.get('autoplay') == 'true' || this.isLiveStreaming;
      this._startTime = 0;
    }
    return ($traceurRuntime.createClass)(StreamProvider, {
      init: function(videoData) {
        var $__2 = this;
        if (videoData.length == 0)
          throw Error("Empty video data.");
        this._videoData = videoData;
        if (!this._videoData.some(function(stream) {
          return stream.role == "master";
        })) {
          this._videoData[0].role = "master";
        }
        this._videoData.forEach(function(stream, index) {
          stream.type = stream.type || 'video';
          if (stream.role == 'master') {
            $__2._mainStream = stream;
          }
          if (stream.type == 'video') {
            $__2._videoStreams.push(stream);
          } else if (stream.type == 'audio') {
            $__2._audioStreams.push(stream);
          }
        });
        if (this._videoStreams.length == 0) {
          throw new Error("No video streams found. Paella Player requires at least one video stream.");
        }
        var autoplay = this.autoplay;
        this._videoStreams.forEach(function(videoStream, index) {
          var rect = {
            x: 0,
            y: 0,
            w: 1280,
            h: 720
          };
          var player = paella.videoFactory.getVideoObject(("video_" + index), videoStream, rect);
          player.setVideoQualityStrategy($__2._qualityStrategy);
          player.setAutoplay(autoplay);
          if (videoStream == $__2._mainStream) {
            $__2._mainPlayer = player;
            $__2._audioPlayer = player;
          } else {
            player.setVolume(0);
          }
          $__2._videoPlayers.push(player);
          $__2._players.push(player);
        });
        this._audioStreams.forEach(function(audioStream, index) {
          var player = paella.audioFactory.getAudioObject(("audio_" + index), audioStream);
          player.setAutoplay(autoplay);
          if (player) {
            $__2._audioPlayers.push(player);
            $__2._players.push(player);
          }
        });
      },
      loadVideos: function() {
        var promises = [];
        this._players.forEach(function(player) {
          promises.push(player.load());
        });
        return Promise.all(promises);
      },
      get startTime() {
        return this._startTime;
      },
      set startTime(s) {
        this._startTime = s;
      },
      get isMonostream() {
        return this._videoStreams.length == 1;
      },
      get mainStream() {
        return this._mainStream;
      },
      get videoStreams() {
        return this._videoStreams;
      },
      get audioStreams() {
        return this._audioStreams;
      },
      get streams() {
        return this._videoStreams.concat(this._audioStreams);
      },
      get videoPlayers() {
        return this._videoPlayers;
      },
      get audioPlayers() {
        return this._audioPlayers;
      },
      get players() {
        return this._videoPlayers.concat(this._audioPlayers);
      },
      callPlayerFunction: function(fnName) {
        var $__2 = this;
        var promises = [];
        var functionArguments = [];
        for (var i = 1; i < arguments.length; ++i) {
          functionArguments.push(arguments[i]);
        }
        this.players.forEach(function(player) {
          var $__3;
          promises.push(($__3 = player)[fnName].apply($__3, $traceurRuntime.spread(functionArguments)));
        });
        return new Promise(function(resolve, reject) {
          Promise.all(promises).then(function() {
            if (fnName == 'play' && !$__2._firstPlay) {
              $__2._firstPlay = true;
              if ($__2._startTime) {
                $__2.players.forEach(function(p) {
                  return p.setCurrentTime($__2._startTime);
                });
              }
            }
            resolve();
          }).catch(function(err) {
            reject(err);
          });
        });
      },
      get mainVideoPlayer() {
        return this._mainPlayer;
      },
      get mainAudioPlayer() {
        return this._audioPlayer;
      },
      get isLiveStreaming() {
        return paella.player.isLiveStream();
      },
      set qualityStrategy(strategy) {
        this._qualityStrategy = strategy;
        this._videoPlayers.forEach(function(player) {
          player.setVideoQualityStrategy(strategy);
        });
      },
      get qualityStrategy() {
        return this._qualityStrategy || null;
      },
      get autoplay() {
        return this.supportAutoplay && this._autoplay;
      },
      set autoplay(ap) {
        if (!this.supportAutoplay || this.isLiveStreaming)
          return;
        this._autoplay = ap;
        if (this.videoPlayers) {
          this.videoPlayers.forEach(function(player) {
            return player.setAutoplay(ap);
          });
          this.audioPlayers.forEach(function(player) {
            return player.setAutoplay(ap);
          });
        }
      },
      get supportAutoplay() {
        return this.videoPlayers.every(function(player) {
          return player.supportAutoplay();
        });
      }
    }, {});
  }();
  paella.StreamProvider = StreamProvider;
  function addVideoWrapper(id, videoPlayer) {
    var wrapper = new paella.VideoWrapper(id);
    wrapper.addNode(videoPlayer);
    this.videoWrappers.push(wrapper);
    this.container.addNode(wrapper);
    return wrapper;
  }
  var VideoContainer = function($__super) {
    function VideoContainer(id) {
      $traceurRuntime.superConstructor(VideoContainer).call(this, id);
      this._streamProvider = new paella.StreamProvider();
      this._ready = false;
      this._videoWrappers = [];
      this._container = new paella.DomNode('div', 'playerContainer_videoContainer_container', {
        position: 'relative',
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '1024px',
        height: '567px'
      });
      this._container.domElement.setAttribute('role', 'main');
      this.addNode(this._container);
      this.overlayContainer = new paella.VideoOverlay(this.domElement);
      this.container.addNode(this.overlayContainer);
      this.setProfileFrameStrategy(paella.ProfileFrameStrategy.Factory());
      this.setVideoQualityStrategy(paella.VideoQualityStrategy.Factory());
      this._audioTag = paella.dictionary.currentLanguage();
      this._audioPlayer = null;
      this._volume = 1;
    }
    return ($traceurRuntime.createClass)(VideoContainer, {
      get streamProvider() {
        return this._streamProvider;
      },
      get ready() {
        return this._ready;
      },
      get isMonostream() {
        return this._streamProvider.isMonostream;
      },
      get trimmingHandler() {
        return this._trimmingHandler;
      },
      get videoWrappers() {
        return this._videoWrappers;
      },
      get container() {
        return this._container;
      },
      get profileFrameStrategy() {
        return this._profileFrameStrategy;
      },
      get sourceData() {
        return this._sourceData;
      },
      play: function() {
        var $__2 = this;
        return new Promise(function(resolve, reject) {
          $__2.streamProvider.startTime = $__2._startTime;
          $__2.streamProvider.callPlayerFunction('play').then(function() {
            $traceurRuntime.superGet($__2, VideoContainer.prototype, "play").call($__2);
            resolve();
          }).catch(function(err) {
            reject(err);
          });
        });
      },
      pause: function() {
        var $__2 = this;
        return new Promise(function(resolve, reject) {
          $__2.streamProvider.callPlayerFunction('pause').then(function() {
            $traceurRuntime.superGet($__2, VideoContainer.prototype, "pause").call($__2);
            resolve();
          }).catch(function(err) {
            reject(err);
          });
        });
      },
      setCurrentTime: function(time) {
        var $__2 = this;
        return new Promise(function(resolve, reject) {
          $__2.trimming().then(function(trimmingData) {
            if (trimmingData.enabled) {
              time += trimmingData.start;
              if (time < trimmingData.start) {
                time = trimmingData.start;
              }
              if (time > trimmingData.end) {
                time = trimmingData.end;
              }
            }
            return $__2.streamProvider.callPlayerFunction('setCurrentTime', time);
          }).then(function() {
            return $__2.duration(false);
          }).then(function(duration) {
            resolve({
              time: time,
              duration: duration
            });
          }).catch(function(err) {
            reject(err);
          });
        });
      },
      currentTime: function() {
        var ignoreTrimming = arguments[0] !== (void 0) ? arguments[0] : false;
        var $__2 = this;
        return new Promise(function(resolve) {
          var trimmingData = null;
          var p = ignoreTrimming ? Promise.resolve({enabled: false}) : $__2.trimming();
          p.then(function(t) {
            trimmingData = t;
            return $__2.streamProvider.mainVideoPlayer.currentTime();
          }).then(function(time) {
            if (trimmingData.enabled) {
              time = time - trimmingData.start;
            }
            resolve(time);
          });
        });
      },
      setPlaybackRate: function(rate) {
        this.streamProvider.callPlayerFunction('setPlaybackRate', rate);
        $traceurRuntime.superGet(this, VideoContainer.prototype, "setPlaybackRate").call(this, rate);
      },
      setVolume: function(params) {
        var $__2 = this;
        if ($traceurRuntime.typeof((params)) == 'object') {
          console.warn("videoContainer.setVolume(): set parameter as object is deprecated");
          return Promise.resolve();
        } else {
          return new Promise(function(resolve, reject) {
            $__2._audioPlayer.setVolume(params).then(function() {
              paella.events.trigger(paella.events.setVolume, {master: params});
              resolve(params);
            }).catch(function(err) {
              reject(err);
            });
          });
        }
      },
      volume: function() {
        return this._audioPlayer.volume();
      },
      duration: function() {
        var ignoreTrimming = arguments[0] !== (void 0) ? arguments[0] : false;
        var $__2 = this;
        return new Promise(function(resolve) {
          var trimmingData = null;
          var p = ignoreTrimming ? Promise.resolve({enabled: false}) : $__2.trimming();
          p.then(function(t) {
            trimmingData = t;
            return $__2.streamProvider.mainVideoPlayer.duration();
          }).then(function(duration) {
            if (trimmingData.enabled) {
              duration = trimmingData.end - trimmingData.start;
            }
            resolve(duration);
          });
        });
      },
      paused: function() {
        return this.streamProvider.mainVideoPlayer.isPaused();
      },
      getQualities: function() {
        return this.streamProvider.mainVideoPlayer.getQualities();
      },
      setQuality: function(index) {
        var qualities = [];
        var promises = [];
        this.streamProvider.videoPlayers.forEach(function(player) {
          var playerData = {
            player: player,
            promise: player.getQualities()
          };
          qualities.push(playerData);
          promises.push(playerData.promise);
        });
        return new Promise(function(resolve) {
          var resultPromises = [];
          Promise.all(promises).then(function() {
            qualities.forEach(function(data) {
              data.promise.then(function(videoQualities) {
                var videoQuality = videoQualities.length > index ? index : videoQualities.length - 1;
                resultPromises.push(data.player.setQuality(videoQuality));
              });
            });
            return Promise.all(resultPromises);
          }).then(function() {
            paella.events.trigger(paella.events.qualityChanged);
            resolve();
          });
        });
      },
      getCurrentQuality: function() {
        return this.streamProvider.mainVideoPlayer.getCurrentQuality();
      },
      get audioTag() {
        return this._audioTag;
      },
      get audioPlayer() {
        return this._audioPlayer;
      },
      getAudioTags: function() {
        var $__2 = this;
        return new Promise(function(resolve) {
          var lang = [];
          var p = $__2.streamProvider.players;
          p.forEach(function(player) {
            if (player.stream.audioTag) {
              lang.push(player.stream.audioTag);
            }
          });
          resolve(lang);
        });
      },
      setAudioTag: function(lang) {
        var $__2 = this;
        return new Promise(function(resolve) {
          var audioSet = false;
          var promises = [];
          $__2.streamProvider.players.forEach(function(player) {
            if (!audioSet && player.stream.audioTag == lang) {
              audioSet = true;
              $__2._audioPlayer = player;
            }
            promises.push(player.setVolume(0));
          });
          if (!audioSet) {
            $__2._audioPlayer = $__2.streamProvider.mainVideoPlayer;
          }
          Promise.all(promises).then(function() {
            return $__2._audioPlayer.setVolume($__2._volume);
          }).then(function() {
            $__2._audioTag = $__2._audioPlayer.stream.audioTag;
            paella.events.trigger(paella.events.audioTagChanged);
            resolve();
          });
        });
      },
      setProfileFrameStrategy: function(strategy) {
        this._profileFrameStrategy = strategy;
      },
      setVideoQualityStrategy: function(strategy) {
        this.streamProvider.qualityStrategy = strategy;
      },
      autoplay: function() {
        return this.streamProvider.autoplay;
      },
      supportAutoplay: function() {
        return this.streamProvider.supportAutoplay;
      },
      setAutoplay: function() {
        var ap = arguments[0] !== (void 0) ? arguments[0] : true;
        this.streamProvider.autoplay = ap;
        return this.streamProvider.supportAutoplay;
      },
      masterVideo: function() {
        return this.streamProvider.mainVideoPlayer;
      },
      getVideoRect: function(videoIndex) {
        if (this.videoWrappers.length > videoIndex) {
          return this.videoWrappers[videoIndex].getRect();
        } else {
          throw new Error(("Video wrapper with index " + videoIndex + " not found"));
        }
      },
      setStreamData: function(videoData) {
        var $__2 = this;
        var urlParamTime = base.parameters.get("time");
        var hashParamTime = base.hashParams.get("time");
        var timeString = hashParamTime ? hashParamTime : urlParamTime ? urlParamTime : "0s";
        var startTime = paella.utils.timeParse.timeToSeconds(timeString);
        if (startTime) {
          this._startTime = startTime;
        }
        videoData.forEach(function(stream) {
          for (var type in stream.sources) {
            var source = stream.sources[type];
            source.forEach(function(item) {
              if (item.res) {
                item.res.w = Number(item.res.w);
                item.res.h = Number(item.res.h);
              }
            });
          }
        });
        this._sourceData = videoData;
        return new Promise(function(resolve, reject) {
          $__2.streamProvider.init(videoData);
          $__2.streamProvider.videoPlayers.forEach(function(player, index) {
            addVideoWrapper.apply($__2, ['videoPlayerWrapper_' + index, player]);
            player.setAutoplay($__2.autoplay());
          });
          $__2.streamProvider.loadVideos().then(function() {
            return $__2.setAudioTag($__2.audioTag);
          }).then(function() {
            $($__2.streamProvider.mainVideoPlayer.video).bind('timeupdate', function(evt) {
              $__2.trimming().then(function(trimmingData) {
                var current = evt.currentTarget.currentTime;
                var duration = evt.currentTarget.duration;
                if (trimmingData.enabled) {
                  current -= trimmingData.start;
                  duration = trimmingData.end - trimmingData.start;
                }
                paella.events.trigger(paella.events.timeupdate, {
                  videoContainer: $__2,
                  currentTime: current,
                  duration: duration
                });
                if (current >= duration) {
                  $__2.streamProvider.callPlayerFunction('pause');
                }
              });
            });
            $__2._ready = true;
            paella.events.trigger(paella.events.videoReady);
            var profileToUse = base.parameters.get('profile') || base.cookies.get('profile') || paella.profiles.getDefaultProfile();
            if (paella.profiles.setProfile(profileToUse, false)) {
              resolve();
            } else if (!paella.profiles.setProfile(paella.profiles.getDefaultProfile(), false)) {
              resolve();
            }
          });
        });
      },
      resizePortrait: function() {
        var width = (paella.player.isFullScreen() == true) ? $(window).width() : $(this.domElement).width();
        var relativeSize = new paella.RelativeVideoSize();
        var height = relativeSize.proportionalHeight(width);
        this.container.domElement.style.width = width + 'px';
        this.container.domElement.style.height = height + 'px';
        var containerHeight = (paella.player.isFullScreen() == true) ? $(window).height() : $(this.domElement).height();
        var newTop = containerHeight / 2 - height / 2;
        this.container.domElement.style.top = newTop + "px";
      },
      resizeLandscape: function() {
        var height = (paella.player.isFullScreen() == true) ? $(window).height() : $(this.domElement).height();
        var relativeSize = new paella.RelativeVideoSize();
        var width = relativeSize.proportionalWidth(height);
        this.container.domElement.style.width = width + 'px';
        this.container.domElement.style.height = height + 'px';
        this.container.domElement.style.top = '0px';
      },
      onresize: function() {
        $traceurRuntime.superGet(this, VideoContainer.prototype, "onresize").call(this);
        var relativeSize = new paella.RelativeVideoSize();
        var aspectRatio = relativeSize.aspectRatio();
        var width = (paella.player.isFullScreen() == true) ? $(window).width() : $(this.domElement).width();
        var height = (paella.player.isFullScreen() == true) ? $(window).height() : $(this.domElement).height();
        var containerAspectRatio = width / height;
        if (containerAspectRatio > aspectRatio) {
          this.resizeLandscape();
        } else {
          this.resizePortrait();
        }
      }
    }, {}, $__super);
  }(paella.VideoContainerBase);
  paella.VideoContainer = VideoContainer;
})();

"use strict";
(function() {
  Class("paella.PluginManager", {
    targets: null,
    pluginList: [],
    eventDrivenPlugins: [],
    enabledPlugins: [],
    doResize: true,
    setupPlugin: function(plugin) {
      plugin.setup();
      this.enabledPlugins.push(plugin);
      if (dynamic_cast("paella.UIPlugin", plugin)) {
        plugin.checkVisibility();
      }
    },
    checkPluginsVisibility: function() {
      this.enabledPlugins.forEach(function(plugin) {
        if (dynamic_cast("paella.UIPlugin", plugin)) {
          plugin.checkVisibility();
        }
      });
    },
    initialize: function() {
      this.targets = {};
      var This = this;
      paella.events.bind(paella.events.loadPlugins, function(event) {
        This.loadPlugins("paella.DeferredLoadPlugin");
      });
      var timer = new base.Timer(function() {
        if (paella.player && paella.player.controls && This.doResize)
          paella.player.controls.onresize();
      }, 1000);
      timer.repeat = true;
    },
    setTarget: function(pluginType, target) {
      if (target.addPlugin) {
        this.targets[pluginType] = target;
      }
    },
    getTarget: function(pluginType) {
      if (pluginType == "eventDriven") {
        return this;
      } else {
        var target = this.targets[pluginType];
        return target;
      }
    },
    registerPlugin: function(plugin) {
      this.importLibraries(plugin);
      this.pluginList.push(plugin);
      this.pluginList.sort(function(a, b) {
        return a.getIndex() - b.getIndex();
      });
    },
    importLibraries: function(plugin) {
      plugin.getDependencies().forEach(function(lib) {
        var script = document.createElement('script');
        script.type = "text/javascript";
        script.src = 'javascript/' + lib + '.js';
        document.head.appendChild(script);
      });
    },
    loadPlugins: function(pluginBaseClass) {
      if (pluginBaseClass != undefined) {
        var This = this;
        this.foreach(function(plugin, config) {
          if (plugin.isLoaded())
            return;
          if (dynamic_cast(pluginBaseClass, plugin) != null) {
            if (config.enabled) {
              base.log.debug("Load plugin (" + pluginBaseClass + "): " + plugin.getName());
              plugin.config = config;
              plugin.load(This);
            }
          }
        });
      }
    },
    foreach: function(callback) {
      var enablePluginsByDefault = false;
      var pluginsConfig = {};
      try {
        enablePluginsByDefault = paella.player.config.plugins.enablePluginsByDefault;
      } catch (e) {}
      try {
        pluginsConfig = paella.player.config.plugins.list;
      } catch (e) {}
      this.pluginList.forEach(function(plugin) {
        var name = plugin.getName();
        var config = pluginsConfig[name];
        if (!config) {
          config = {enabled: enablePluginsByDefault};
        }
        callback(plugin, config);
      });
    },
    addPlugin: function(plugin) {
      var thisClass = this;
      if (plugin.__added__)
        return;
      plugin.__added__ = true;
      plugin.checkEnabled(function(isEnabled) {
        if (plugin.type == "eventDriven" && isEnabled) {
          paella.pluginManager.setupPlugin(plugin);
          thisClass.eventDrivenPlugins.push(plugin);
          var events = plugin.getEvents();
          var eventBind = function(event, params) {
            plugin.onEvent(event.type, params);
          };
          for (var i = 0; i < events.length; ++i) {
            var eventName = events[i];
            paella.events.bind(eventName, eventBind);
          }
        }
      });
    },
    getPlugin: function(name) {
      for (var i = 0; i < this.pluginList.length; ++i) {
        if (this.pluginList[i].getName() == name)
          return this.pluginList[i];
      }
      return null;
    },
    registerPlugins: function() {
      g_pluginCallbackList.forEach(function(pluginCallback) {
        var PluginClass = pluginCallback();
        var pluginInstance = new PluginClass();
        if (pluginInstance.getInstanceName()) {
          paella.plugins = paella.plugins || {};
          paella.plugins[pluginInstance.getInstanceName()] = pluginInstance;
        }
        paella.pluginManager.registerPlugin(pluginInstance);
      });
    }
  });
  paella.pluginManager = new paella.PluginManager();
  var g_pluginCallbackList = [];
  paella.addPlugin = function(cb) {
    g_pluginCallbackList.push(cb);
  };
  Class("paella.Plugin", {
    type: '',
    isLoaded: function() {
      return this.__loaded__;
    },
    initialize: function() {},
    getDependencies: function() {
      return [];
    },
    load: function(pluginManager) {
      if (this.__loaded__)
        return;
      this.__loaded__ = true;
      var target = pluginManager.getTarget(this.type);
      if (target && target.addPlugin) {
        target.addPlugin(this);
      }
    },
    getInstanceName: function() {
      return null;
    },
    getRootNode: function(id) {
      return null;
    },
    checkEnabled: function(onSuccess) {
      onSuccess(true);
    },
    setup: function() {},
    getIndex: function() {
      return 0;
    },
    getName: function() {
      return "";
    }
  });
  Class("paella.FastLoadPlugin", paella.Plugin, {});
  Class("paella.EarlyLoadPlugin", paella.Plugin, {});
  Class("paella.DeferredLoadPlugin", paella.Plugin, {});
  Class("paella.PopUpContainer", paella.DomNode, {
    containers: null,
    currentContainerId: -1,
    initialize: function(id, className) {
      var This = this;
      var style = {};
      this.parent('div', id, style);
      this.domElement.className = className;
      this.containers = {};
    },
    hideContainer: function(identifier, button) {
      var container = this.containers[identifier];
      if (container && this.currentContainerId == identifier) {
        container.identifier = identifier;
        paella.events.trigger(paella.events.hidePopUp, {container: container});
        container.plugin.willHideContent();
        $(container.element).hide();
        container.button.className = container.button.className.replace(' selected', '');
        $(this.domElement).css({width: '0px'});
        this.currentContainerId = -1;
        container.plugin.didHideContent();
      }
    },
    showContainer: function(identifier, button) {
      var thisClass = this;
      var width = 0;
      function hideContainer(container) {
        paella.events.trigger(paella.events.hidePopUp, {container: container});
        container.plugin.willHideContent();
        $(container.element).hide();
        $(thisClass.domElement).css({width: '0px'});
        container.button.className = container.button.className.replace(' selected', '');
        thisClass.currentContainerId = -1;
        container.plugin.didHideContent();
      }
      function showContainer(container) {
        paella.events.trigger(paella.events.showPopUp, {container: container});
        container.plugin.willShowContent();
        container.button.className = container.button.className + ' selected';
        $(container.element).show();
        width = $(container.element).width();
        if (container.plugin.getAlignment() == 'right') {
          var right = $(button.parentElement).width() - $(button).position().left - $(button).width();
          $(thisClass.domElement).css({
            width: width + 'px',
            right: right + 'px',
            left: ''
          });
        } else {
          var left = $(button).position().left;
          $(thisClass.domElement).css({
            width: width + 'px',
            left: left + 'px',
            right: ''
          });
        }
        thisClass.currentContainerId = identifier;
        container.plugin.didShowContent();
      }
      var container = this.containers[identifier];
      if (container && this.currentContainerId != identifier && this.currentContainerId != -1) {
        var prevContainer = this.containers[this.currentContainerId];
        hideContainer(prevContainer);
        showContainer(container);
      } else if (container && this.currentContainerId == identifier) {
        hideContainer(container);
      } else if (container) {
        showContainer(container);
      }
    },
    registerContainer: function(identifier, domElement, button, plugin) {
      var containerInfo = {
        identifier: identifier,
        button: button,
        element: domElement,
        plugin: plugin
      };
      this.containers[identifier] = containerInfo;
      if (plugin.closeOnMouseOut && plugin.closeOnMouseOut()) {
        var popUpId = identifier;
        var btn = button;
        $(domElement).mouseleave(function(evt) {
          paella.player.controls.playbackControl().hidePopUp(popUpId, btn);
        });
      }
      $(domElement).hide();
      button.popUpIdentifier = identifier;
      button.sourcePlugin = plugin;
      $(button).click(function(event) {
        if (!this.plugin.isPopUpOpen()) {
          paella.player.controls.playbackControl().showPopUp(this.popUpIdentifier, this);
        } else {
          paella.player.controls.playbackControl().hidePopUp(this.popUpIdentifier, this);
        }
      });
      $(button).keyup(function(event) {
        if ((event.keyCode == 13) && (!this.plugin.isPopUpOpen())) {
          paella.player.controls.playbackControl().showPopUp(this.popUpIdentifier, this);
        } else if ((event.keyCode == 27)) {
          paella.player.controls.playbackControl().hidePopUp(this.popUpIdentifier, this);
        }
      });
      plugin.containerManager = this;
    }
  });
  Class("paella.TimelineContainer", paella.PopUpContainer, {
    hideContainer: function(identifier, button) {
      var container = this.containers[identifier];
      if (container && this.currentContainerId == identifier) {
        paella.events.trigger(paella.events.hidePopUp, {container: container});
        container.plugin.willHideContent();
        $(container.element).hide();
        container.button.className = container.button.className.replace(' selected', '');
        this.currentContainerId = -1;
        $(this.domElement).css({height: '0px'});
        container.plugin.didHideContent();
      }
    },
    showContainer: function(identifier, button) {
      var height = 0;
      var container = this.containers[identifier];
      if (container && this.currentContainerId != identifier && this.currentContainerId != -1) {
        var prevContainer = this.containers[this.currentContainerId];
        prevContainer.button.className = prevContainer.button.className.replace(' selected', '');
        container.button.className = container.button.className + ' selected';
        paella.events.trigger(paella.events.hidePopUp, {container: prevContainer});
        prevContainer.plugin.willHideContent();
        $(prevContainer.element).hide();
        prevContainer.plugin.didHideContent();
        paella.events.trigger(paella.events.showPopUp, {container: container});
        container.plugin.willShowContent();
        $(container.element).show();
        this.currentContainerId = identifier;
        height = $(container.element).height();
        $(this.domElement).css({height: height + 'px'});
        container.plugin.didShowContent();
      } else if (container && this.currentContainerId == identifier) {
        paella.events.trigger(paella.events.hidePopUp, {container: container});
        container.plugin.willHideContent();
        $(container.element).hide();
        container.button.className = container.button.className.replace(' selected', '');
        $(this.domElement).css({height: '0px'});
        this.currentContainerId = -1;
        container.plugin.didHideContent();
      } else if (container) {
        paella.events.trigger(paella.events.showPopUp, {container: container});
        container.plugin.willShowContent();
        container.button.className = container.button.className + ' selected';
        $(container.element).show();
        this.currentContainerId = identifier;
        height = $(container.element).height();
        $(this.domElement).css({height: height + 'px'});
        container.plugin.didShowContent();
      }
    }
  });
  Class("paella.UIPlugin", paella.DeferredLoadPlugin, {
    ui: null,
    checkVisibility: function() {
      var modes = this.config.visibleOn || [paella.PaellaPlayer.mode.standard, paella.PaellaPlayer.mode.fullscreen, paella.PaellaPlayer.mode.embed];
      var visible = false;
      modes.forEach(function(m) {
        if (m == paella.player.getPlayerMode()) {
          visible = true;
        }
      });
      if (visible) {
        this.showUI();
      } else {
        this.hideUI();
      }
    },
    hideUI: function() {
      this.ui.setAttribute('aria-hidden', 'true');
      $(this.ui).hide();
    },
    showUI: function() {
      var thisClass = this;
      paella.pluginManager.enabledPlugins.forEach(function(p) {
        if (p == thisClass) {
          thisClass.ui.setAttribute('aria-hidden', 'false');
          $(thisClass.ui).show();
        }
      });
    }
  });
  Class("paella.ButtonPlugin", paella.UIPlugin, {
    type: 'button',
    subclass: '',
    container: null,
    containerManager: null,
    getAlignment: function() {
      return 'left';
    },
    getSubclass: function() {
      return "myButtonPlugin";
    },
    getIconClass: function() {
      return "";
    },
    addSubclass: function($subclass) {
      $(this.container).addClass($subclass);
    },
    removeSubclass: function($subclass) {
      $(this.container).removeClass($subclass);
    },
    action: function(button) {},
    getName: function() {
      return "ButtonPlugin";
    },
    getMinWindowSize: function() {
      return 0;
    },
    buildContent: function(domElement) {},
    willShowContent: function() {
      base.log.debug(this.getName() + " willDisplayContent");
    },
    didShowContent: function() {
      base.log.debug(this.getName() + " didDisplayContent");
    },
    willHideContent: function() {
      base.log.debug(this.getName() + " willHideContent");
    },
    didHideContent: function() {
      base.log.debug(this.getName() + " didHideContent");
    },
    getButtonType: function() {
      return paella.ButtonPlugin.type.actionButton;
    },
    getText: function() {
      return "";
    },
    setText: function(text) {
      this.container.innerHTML = '<span class="button-text">' + paella.AntiXSS.htmlEscape(text) + '</span>';
      if (this._i) {
        this.container.appendChild(this._i);
      }
    },
    hideButton: function() {
      this.hideUI();
    },
    showButton: function() {
      this.showUI();
    },
    changeSubclass: function(newSubclass) {
      this.subclass = newSubclass;
      this.container.className = this.getClassName();
    },
    changeIconClass: function(newClass) {
      this._i.className = 'button-icon ' + newClass;
    },
    getClassName: function() {
      return paella.ButtonPlugin.kClassName + ' ' + this.getAlignment() + ' ' + this.subclass;
    },
    getContainerClassName: function() {
      if (this.getButtonType() == paella.ButtonPlugin.type.timeLineButton) {
        return paella.ButtonPlugin.kTimeLineClassName + ' ' + this.getSubclass();
      } else if (this.getButtonType() == paella.ButtonPlugin.type.popUpButton) {
        return paella.ButtonPlugin.kPopUpClassName + ' ' + this.getSubclass();
      }
    },
    setToolTip: function(message) {
      this.button.setAttribute("title", message);
      this.button.setAttribute("aria-label", message);
    },
    getDefaultToolTip: function() {
      return "";
    },
    isPopUpOpen: function() {
      return (this.button.popUpIdentifier == this.containerManager.currentContainerId);
    }
  });
  paella.ButtonPlugin.alignment = {
    left: 'left',
    right: 'right'
  };
  paella.ButtonPlugin.kClassName = 'buttonPlugin';
  paella.ButtonPlugin.kPopUpClassName = 'buttonPluginPopUp';
  paella.ButtonPlugin.kTimeLineClassName = 'buttonTimeLine';
  paella.ButtonPlugin.type = {
    actionButton: 1,
    popUpButton: 2,
    timeLineButton: 3
  };
  paella.ButtonPlugin.buildPluginButton = function(plugin, id) {
    plugin.subclass = plugin.getSubclass();
    var elem = document.createElement('div');
    elem.className = plugin.getClassName();
    elem.id = id;
    elem.innerHTML = '<span class="button-text">' + paella.AntiXSS.htmlEscape(plugin.getText()) + '</span>';
    elem.setAttribute("tabindex", 1000 + plugin.getIndex());
    elem.setAttribute("alt", "");
    elem.setAttribute("role", "button");
    elem.plugin = plugin;
    plugin.button = elem;
    plugin.container = elem;
    plugin.ui = elem;
    plugin.setToolTip(plugin.getDefaultToolTip());
    var icon = document.createElement('i');
    icon.className = 'button-icon ' + plugin.getIconClass();
    elem.appendChild(icon);
    plugin._i = icon;
    function onAction(self) {
      paella.userTracking.log("paella:button:action", self.plugin.getName());
      self.plugin.action(self);
    }
    $(elem).click(function(event) {
      onAction(this);
    });
    $(elem).keyup(function(event) {
      if (event.keyCode == 13) {
        onAction(this);
      }
    });
    return elem;
  };
  paella.ButtonPlugin.buildPluginPopUp = function(parent, plugin, id) {
    plugin.subclass = plugin.getSubclass();
    var elem = document.createElement('div');
    parent.appendChild(elem);
    elem.className = plugin.getContainerClassName();
    elem.id = id;
    elem.plugin = plugin;
    plugin.buildContent(elem);
    return elem;
  };
  Class("paella.VideoOverlayButtonPlugin", paella.ButtonPlugin, {
    type: 'videoOverlayButton',
    getSubclass: function() {
      return "myVideoOverlayButtonPlugin" + " " + this.getAlignment();
    },
    action: function(button) {},
    getName: function() {
      return "VideoOverlayButtonPlugin";
    }
  });
  Class("paella.EventDrivenPlugin", paella.EarlyLoadPlugin, {
    type: 'eventDriven',
    initialize: function() {
      this.parent();
      var events = this.getEvents();
      for (var i = 0; i < events.length; ++i) {
        var event = events[i];
        if (event == paella.events.loadStarted) {
          this.onEvent(paella.events.loadStarted);
        }
      }
    },
    getEvents: function() {
      return [];
    },
    onEvent: function(eventType, params) {},
    getName: function() {
      return "EventDrivenPlugin";
    }
  });
})();

"use strict";
(function() {
  var captionParserManager = new (Class({
    _formats: {},
    addPlugin: function(plugin) {
      var self = this;
      var ext = plugin.ext;
      if (((Array.isArray && Array.isArray(ext)) || (ext instanceof Array)) == false) {
        ext = [ext];
      }
      if (ext.length == 0) {
        base.log.debug("No extension provided by the plugin " + plugin.getName());
      } else {
        base.log.debug("New captionParser added: " + plugin.getName());
        ext.forEach(function(f) {
          self._formats[f] = plugin;
        });
      }
    },
    initialize: function() {
      paella.pluginManager.setTarget('captionParser', this);
    }
  }))();
  var SearchCallback = Class(base.AsyncLoaderCallback, {
    initialize: function(caption, text) {
      this.name = "captionSearchCallback";
      this.caption = caption;
      this.text = text;
    },
    load: function(onSuccess, onError) {
      var self = this;
      this.caption.search(this.text, function(err, result) {
        if (err) {
          onError();
        } else {
          self.result = result;
          onSuccess();
        }
      });
    }
  });
  paella.captions = {
    parsers: {},
    _captions: {},
    _activeCaption: undefined,
    addCaptions: function(captions) {
      var cid = captions._captionsProvider + ':' + captions._id;
      this._captions[cid] = captions;
      paella.events.trigger(paella.events.captionAdded, cid);
    },
    getAvailableLangs: function() {
      var ret = [];
      var self = this;
      Object.keys(this._captions).forEach(function(k) {
        var c = self._captions[k];
        ret.push({
          id: k,
          lang: c._lang
        });
      });
      return ret;
    },
    getCaptions: function(cid) {
      if (cid && this._captions[cid]) {
        return this._captions[cid];
      }
      return undefined;
    },
    getActiveCaptions: function(cid) {
      return this._activeCaption;
    },
    setActiveCaptions: function(cid) {
      this._activeCaption = this.getCaptions(cid);
      if (this._activeCaption != undefined) {
        paella.events.trigger(paella.events.captionsEnabled, cid);
      } else {
        paella.events.trigger(paella.events.captionsDisabled);
      }
      return this._activeCaption;
    },
    getCaptionAtTime: function(cid, time) {
      var c = this.getCaptions(cid);
      if (c != undefined) {
        return c.getCaptionAtTime(time);
      }
      return undefined;
    },
    search: function(text, next) {
      var self = this;
      var asyncLoader = new base.AsyncLoader();
      this.getAvailableLangs().forEach(function(l) {
        asyncLoader.addCallback(new SearchCallback(self.getCaptions(l.id), text));
      });
      asyncLoader.load(function() {
        var res = [];
        Object.keys(asyncLoader.callbackArray).forEach(function(k) {
          res = res.concat(asyncLoader.getCallback(k).result);
        });
        if (next)
          next(false, res);
      }, function() {
        if (next)
          next(true);
      });
    }
  };
  Class("paella.captions.Caption", {
    initialize: function(id, format, url, lang, next) {
      this._id = id;
      this._format = format;
      this._url = url;
      this._captions = undefined;
      this._index = lunr(function() {
        this.ref('id');
        this.field('content', {boost: 10});
      });
      if (typeof(lang) == "string") {
        lang = {
          code: lang,
          txt: lang
        };
      }
      this._lang = lang;
      this._captionsProvider = "downloadCaptionsProvider";
      this.reloadCaptions(next);
    },
    canEdit: function(next) {
      next(false, false);
    },
    goToEdit: function() {},
    reloadCaptions: function(next) {
      var self = this;
      jQuery.ajax({
        url: self._url,
        cache: false,
        type: 'get',
        dataType: "text"
      }).then(function(dataRaw) {
        var parser = captionParserManager._formats[self._format];
        if (parser == undefined) {
          base.log.debug("Error adding captions: Format not supported!");
          paella.player.videoContainer.duration(true).then(function(duration) {
            self._captions = [{
              id: 0,
              begin: 0,
              end: duration,
              content: base.dictionary.translate("Error! Captions format not supported.")
            }];
            if (next) {
              next(true);
            }
          });
        } else {
          parser.parse(dataRaw, self._lang.code, function(err, c) {
            if (!err) {
              self._captions = c;
              self._captions.forEach(function(cap) {
                self._index.add({
                  id: cap.id,
                  content: cap.content
                });
              });
            }
            if (next) {
              next(err);
            }
          });
        }
      }).fail(function(error) {
        base.log.debug("Error loading captions: " + self._url);
        if (next) {
          next(true);
        }
      });
    },
    getCaptions: function() {
      return this._captions;
    },
    getCaptionAtTime: function(time) {
      if (this._captions != undefined) {
        for (var i = 0; i < this._captions.length; ++i) {
          var l_cap = this._captions[i];
          if ((l_cap.begin <= time) && (l_cap.end >= time)) {
            return l_cap;
          }
        }
      }
      return undefined;
    },
    getCaptionById: function(id) {
      if (this._captions != undefined) {
        for (var i = 0; i < this._captions.length; ++i) {
          var l_cap = this._captions[i];
          if (l_cap.id == id) {
            return l_cap;
          }
        }
      }
      return undefined;
    },
    search: function(txt, next) {
      var $__2 = this;
      var self = this;
      if (this._index == undefined) {
        if (next) {
          next(true, "Error. No captions found.");
        }
      } else {
        var results = [];
        paella.player.videoContainer.trimming().then(function(trimming) {
          $__2._index.search(txt).forEach(function(s) {
            var c = self.getCaptionById(s.ref);
            if (trimming.enabled && (c.end < trimming.start || c.begin > trimming.end)) {
              return;
            }
            results.push({
              time: c.begin,
              content: c.content,
              score: s.score
            });
          });
          if (next) {
            next(false, results);
          }
        });
      }
    }
  });
  Class("paella.CaptionParserPlugIn", paella.FastLoadPlugin, {
    type: 'captionParser',
    getIndex: function() {
      return -1;
    },
    ext: [],
    parse: function(content, lang, next) {
      throw new Error('paella.CaptionParserPlugIn#parse must be overridden by subclass');
    }
  });
}());

"use strict";
(function() {
  var searchServiceManager = new (Class({
    _plugins: [],
    addPlugin: function(plugin) {
      this._plugins.push(plugin);
    },
    initialize: function() {
      paella.pluginManager.setTarget('SearchServicePlugIn', this);
    }
  }))();
  var SearchCallback = Class(base.AsyncLoaderCallback, {
    initialize: function(plugin, text) {
      this.name = "searchCallback";
      this.plugin = plugin;
      this.text = text;
    },
    load: function(onSuccess, onError) {
      var self = this;
      this.plugin.search(this.text, function(err, result) {
        if (err) {
          onError();
        } else {
          self.result = result;
          onSuccess();
        }
      });
    }
  });
  paella.searchService = {search: function(text, next) {
      var asyncLoader = new base.AsyncLoader();
      paella.userTracking.log("paella:searchService:search", text);
      searchServiceManager._plugins.forEach(function(p) {
        asyncLoader.addCallback(new SearchCallback(p, text));
      });
      asyncLoader.load(function() {
        var res = [];
        Object.keys(asyncLoader.callbackArray).forEach(function(k) {
          res = res.concat(asyncLoader.getCallback(k).result);
        });
        if (next)
          next(false, res);
      }, function() {
        if (next)
          next(true);
      });
    }};
  Class("paella.SearchServicePlugIn", paella.FastLoadPlugin, {
    type: 'SearchServicePlugIn',
    getIndex: function() {
      return -1;
    },
    search: function(text, next) {
      throw new Error('paella.SearchServicePlugIn#search must be overridden by subclass');
    }
  });
}());

"use strict";
(function() {
  var userTrackingManager = new (Class({
    _plugins: [],
    addPlugin: function(plugin) {
      var self = this;
      plugin.checkEnabled(function(isEnabled) {
        if (isEnabled) {
          plugin.setup();
          self._plugins.push(plugin);
        }
      });
    },
    initialize: function() {
      paella.pluginManager.setTarget('userTrackingSaverPlugIn', this);
    }
  }))();
  paella.userTracking = {};
  Class("paella.userTracking.SaverPlugIn", paella.FastLoadPlugin, {
    type: 'userTrackingSaverPlugIn',
    getIndex: function() {
      return -1;
    },
    checkEnabled: function(onSuccess) {
      onSuccess(true);
    },
    log: function(event, params) {
      throw new Error('paella.userTracking.SaverPlugIn#log must be overridden by subclass');
    }
  });
  var evsentsToLog = {};
  paella.userTracking.log = function(event, params) {
    if (evsentsToLog[event] != undefined) {
      evsentsToLog[event].cancel();
    }
    evsentsToLog[event] = new base.Timer(function(timer) {
      userTrackingManager._plugins.forEach(function(p) {
        p.log(event, params);
      });
      delete evsentsToLog[event];
    }, 500);
  };
  [paella.events.play, paella.events.pause, paella.events.endVideo, paella.events.showEditor, paella.events.hideEditor, paella.events.enterFullscreen, paella.events.exitFullscreen, paella.events.loadComplete].forEach(function(event) {
    paella.events.bind(event, function(ev, params) {
      paella.userTracking.log(event);
    });
  });
  [paella.events.showPopUp, paella.events.hidePopUp].forEach(function(event) {
    paella.events.bind(event, function(ev, params) {
      paella.userTracking.log(event, params.identifier);
    });
  });
  [paella.events.captionsEnabled, paella.events.captionsDisabled].forEach(function(event) {
    paella.events.bind(event, function(ev, params) {
      var log;
      if (params != undefined) {
        var c = paella.captions.getCaptions(params);
        log = {
          id: params,
          lang: c._lang,
          url: c._url
        };
      }
      paella.userTracking.log(event, log);
    });
  });
  [paella.events.setProfile].forEach(function(event) {
    paella.events.bind(event, function(ev, params) {
      paella.userTracking.log(event, params.profileName);
    });
  });
  [paella.events.seekTo, paella.events.seekToTime].forEach(function(event) {
    paella.events.bind(event, function(ev, params) {
      var log;
      try {
        JSON.stringify(params);
        log = params;
      } catch (e) {}
      paella.userTracking.log(event, log);
    });
  });
  [paella.events.setVolume, paella.events.resize, paella.events.setPlaybackRate, paella.events.qualityChanged].forEach(function(event) {
    paella.events.bind(event, function(ev, params) {
      var log;
      try {
        JSON.stringify(params);
        log = params;
      } catch (e) {}
      paella.userTracking.log(event, log);
    });
  });
}());

"use strict";
Class("paella.TimeControl", paella.DomNode, {
  initialize: function(id) {
    this.parent('div', id, {left: "0%"});
    this.domElement.className = 'timeControlOld';
    this.domElement.className = 'timeControl';
    var thisClass = this;
    paella.events.bind(paella.events.timeupdate, function(event, params) {
      thisClass.onTimeUpdate(params);
    });
  },
  onTimeUpdate: function(memo) {
    var videoContainer = memo.videoContainer;
    var percent = memo.currentTime * 100 / memo.duration;
    this.domElement.innerText = this.secondsToHours(parseInt(memo.currentTime));
  },
  secondsToHours: function(sec_numb) {
    var hours = Math.floor(sec_numb / 3600);
    var minutes = Math.floor((sec_numb - (hours * 3600)) / 60);
    var seconds = sec_numb - (hours * 3600) - (minutes * 60);
    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return hours + ':' + minutes + ':' + seconds;
  }
});
Class("paella.PlaybackBar", paella.DomNode, {
  playbackFullId: '',
  updatePlayBar: true,
  timeControlId: '',
  _images: null,
  _keys: null,
  _prev: null,
  _next: null,
  _videoLength: null,
  _lastSrc: null,
  _aspectRatio: 1.777777778,
  _hasSlides: null,
  _imgNode: null,
  _canvas: null,
  initialize: function(id) {
    var self = this;
    var style = {};
    this.parent('div', id, style);
    this.domElement.className = "playbackBar";
    this.domElement.setAttribute("alt", "");
    this.domElement.setAttribute("aria-label", "Timeline Slider");
    this.domElement.setAttribute("role", "slider");
    this.domElement.setAttribute("aria-valuemin", "0");
    this.domElement.setAttribute("aria-valuemax", "100");
    this.domElement.setAttribute("aria-valuenow", "0");
    this.domElement.setAttribute("tabindex", "1100");
    $(this.domElement).keyup(function(event) {
      var currentTime = 0;
      var duration = 0;
      paella.player.videoContainer.currentTime().then(function(t) {
        currentTime = t;
        return paella.player.videoContainer.duration();
      }).then(function(d) {
        duration = d;
        var curr,
            selectedPosition;
        switch (event.keyCode) {
          case 37:
            curr = 100 * currentTime / duration;
            selectedPosition = curr - 5;
            paella.player.videoContainer.seekTo(selectedPosition);
            break;
          case 39:
            curr = 100 * currentTime / duration;
            selectedPosition = curr + 5;
            paella.player.videoContainer.seekTo(selectedPosition);
            break;
        }
      });
    });
    this.playbackFullId = id + "_full";
    this.timeControlId = id + "_timeControl";
    var playbackFull = new paella.DomNode('div', this.playbackFullId, {width: '0%'});
    playbackFull.domElement.className = "playbackBarFull";
    this.addNode(playbackFull);
    this.addNode(new paella.TimeControl(this.timeControlId));
    var thisClass = this;
    paella.events.bind(paella.events.timeupdate, function(event, params) {
      thisClass.onTimeUpdate(params);
    });
    $(this.domElement).bind('mousedown', function(event) {
      paella.utils.mouseManager.down(thisClass, event);
      event.stopPropagation();
    });
    $(playbackFull.domElement).bind('mousedown', function(event) {
      paella.utils.mouseManager.down(thisClass, event);
      event.stopPropagation();
    });
    if (!base.userAgent.browser.IsMobileVersion) {
      $(this.domElement).bind('mousemove', function(event) {
        thisClass.movePassive(event);
        paella.utils.mouseManager.move(event);
      });
      $(playbackFull.domElement).bind('mousemove', function(event) {
        paella.utils.mouseManager.move(event);
      });
      $(this.domElement).bind("mouseout", function(event) {
        thisClass.mouseOut(event);
      });
    }
    $(this.domElement).bind('mouseup', function(event) {
      paella.utils.mouseManager.up(event);
    });
    $(playbackFull.domElement).bind('mouseup', function(event) {
      paella.utils.mouseManager.up(event);
    });
    if (paella.player.isLiveStream()) {
      $(this.domElement).hide();
    }
    paella.events.bind(paella.events.seekAvailabilityChanged, function(e, data) {
      if (data.enabled) {
        $(playbackFull.domElement).removeClass("disabled");
      } else {
        $(playbackFull.domElement).addClass("disabled");
      }
    });
  },
  mouseOut: function(event) {
    var self = this;
    if (self._hasSlides) {
      $("#divTimeImageOverlay").remove();
    } else {
      $("#divTimeOverlay").remove();
    }
  },
  drawTimeMarks: function() {
    var $__2 = this;
    var trimming = {};
    paella.player.videoContainer.trimming().then(function(t) {
      trimming = t;
      return $__2.imageSetup();
    }).then(function() {
      var self = $__2;
      var duration = trimming.enabled ? trimming.end - trimming.start : $__2._videoLength;
      var parent = $("#playerContainer_controls_playback_playbackBar");
      $__2.clearCanvas();
      if ($__2._keys && paella.player.config.player.slidesMarks.enabled) {
        $__2._keys.forEach(function(l) {
          var timeInstant = parseInt(l) - trimming.start;
          if (timeInstant > 0) {
            var aux = (timeInstant * parent.width()) / self._videoLength;
            self.drawTimeMark(aux);
          }
        });
      }
    });
  },
  drawTimeMark: function(sec) {
    var ht = 12;
    var ctx = this.getCanvasContext();
    ctx.fillStyle = paella.player.config.player.slidesMarks.color;
    ctx.fillRect(sec, 0, 1, ht);
  },
  clearCanvas: function() {
    if (this._canvas) {
      var ctx = this.getCanvasContext();
      ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }
  },
  getCanvas: function() {
    if (!this._canvas) {
      var parent = $("#playerContainer_controls_playback_playbackBar");
      var canvas = document.createElement("canvas");
      canvas.className = "playerContainer_controls_playback_playbackBar_canvas";
      canvas.id = ("playerContainer_controls_playback_playbackBar_canvas");
      canvas.width = parent.width();
      var ht = canvas.height = parent.height();
      parent.prepend(canvas);
      this._canvas = document.getElementById("playerContainer_controls_playback_playbackBar_canvas");
    }
    return this._canvas;
  },
  getCanvasContext: function() {
    return this.getCanvas().getContext("2d");
  },
  movePassive: function(event) {
    var This = this;
    function updateTimePreview(duration, trimming) {
      var p = $(This.domElement);
      var pos = p.offset();
      var width = p.width();
      var left = (event.clientX - pos.left);
      left = (left < 0) ? 0 : left;
      var position = left * 100 / width;
      var time = position * duration / 100;
      if (trimming.enabled) {
        time += trimming.start;
      }
      var hou = Math.floor((time - trimming.start) / 3600) % 24;
      hou = ("00" + hou).slice(hou.toString().length);
      var min = Math.floor((time - trimming.start) / 60) % 60;
      min = ("00" + min).slice(min.toString().length);
      var sec = Math.floor((time - trimming.start) % 60);
      sec = ("00" + sec).slice(sec.toString().length);
      var timestr = (hou + ":" + min + ":" + sec);
      if (This._hasSlides) {
        if ($("#divTimeImageOverlay").length == 0)
          This.setupTimeImageOverlay(timestr, pos.top, width);
        else {
          $("#divTimeOverlay")[0].innerText = timestr;
        }
        This.imageUpdate(time);
      } else {
        if ($("#divTimeOverlay").length == 0) {
          This.setupTimeOnly(timestr, pos.top, width);
        } else {
          $("#divTimeOverlay")[0].innerText = timestr;
        }
      }
      if (This._hasSlides) {
        var ancho = $("#divTimeImageOverlay").width();
        var posx = event.clientX - (ancho / 2);
        if (event.clientX > (ancho / 2 + pos.left) && event.clientX < (pos.left + width - ancho / 2)) {
          $("#divTimeImageOverlay").css("left", posx);
        } else if (event.clientX < width / 2)
          $("#divTimeImageOverlay").css("left", pos.left);
        else
          $("#divTimeImageOverlay").css("left", pos.left + width - ancho);
      }
      var ancho2 = $("#divTimeOverlay").width();
      var posx2 = event.clientX - (ancho2 / 2);
      if (event.clientX > ancho2 / 2 + pos.left && event.clientX < (pos.left + width - ancho2 / 2)) {
        $("#divTimeOverlay").css("left", posx2);
      } else if (event.clientX < width / 2)
        $("#divTimeOverlay").css("left", pos.left);
      else
        $("#divTimeOverlay").css("left", pos.left + width - ancho2 - 2);
      if (This._hasSlides) {
        $("#divTimeImageOverlay").css("bottom", $('.playbackControls').height());
      }
    }
    paella.player.videoContainer.duration();
    var duration = 0;
    paella.player.videoContainer.duration().then(function(d) {
      duration = d;
      return paella.player.videoContainer.trimming();
    }).then(function(trimming) {
      updateTimePreview(duration, trimming);
    });
  },
  imageSetup: function() {
    var This = this;
    return new Promise(function(resolve) {
      paella.player.videoContainer.duration().then(function(duration) {
        This._images = {};
        var n = paella.initDelegate.initParams.videoLoader.frameList;
        if (!n || Object.keys(n).length === 0) {
          This._hasSlides = false;
          return;
        } else
          This._hasSlides = true;
        This._images = n;
        This._videoLength = duration;
        This._keys = Object.keys(This._images);
        This._keys = This._keys.sort(function(a, b) {
          return parseInt(a) - parseInt(b);
        });
        This._next = 0;
        This._prev = 0;
        resolve();
      });
    });
  },
  imageUpdate: function(sec) {
    var self = this;
    var src = $("#imgOverlay").attr('src');
    $(self._imgNode).show();
    if (sec > this._next || sec < this._prev) {
      src = self.getPreviewImageSrc(sec);
      if (src) {
        self._lastSrc = src;
        $("#imgOverlay").attr('src', src);
      } else
        self.hideImg();
    } else {
      if (src != undefined) {
        return;
      } else {
        $("#imgOverlay").attr('src', self._lastSrc);
      }
    }
  },
  hideImg: function() {
    var self = this;
    $(self._imgNode).hide();
  },
  getPreviewImageSrc: function(sec) {
    var keys = Object.keys(this._images);
    keys.push(sec);
    keys.sort(function(a, b) {
      return parseInt(a) - parseInt(b);
    });
    var n = keys.indexOf(sec) - 1;
    n = (n > 0) ? n : 0;
    var i = keys[n];
    var next = keys[n + 2];
    var prev = keys[n];
    next = (next == undefined) ? keys.length - 1 : parseInt(next);
    this._next = next;
    prev = (prev == undefined) ? 0 : parseInt(prev);
    this._prev = prev;
    i = parseInt(i);
    if (this._images[i]) {
      return this._images[i].url || this._images[i].url;
    } else
      return false;
  },
  setupTimeImageOverlay: function(time_str, top, width) {
    var self = this;
    var div = document.createElement("div");
    div.className = "divTimeImageOverlay";
    div.id = ("divTimeImageOverlay");
    var aux = Math.round(width / 10);
    div.style.width = Math.round(aux * self._aspectRatio) + "px";
    if (self._hasSlides) {
      var img = document.createElement("img");
      img.className = "imgOverlay";
      img.id = "imgOverlay";
      self._imgNode = img;
      div.appendChild(img);
    }
    var div2 = document.createElement("div");
    div2.className = "divTimeOverlay";
    div2.style.top = (top - 20) + "px";
    div2.id = ("divTimeOverlay");
    div2.innerText = time_str;
    div.appendChild(div2);
    $(this.domElement).parent().append(div);
  },
  setupTimeOnly: function(time_str, top, width) {
    var div2 = document.createElement("div");
    div2.className = "divTimeOverlay";
    div2.style.top = (top - 20) + "px";
    div2.id = ("divTimeOverlay");
    div2.innerText = time_str;
    $(this.domElement).parent().append(div2);
  },
  playbackFull: function() {
    return this.getNode(this.playbackFullId);
  },
  timeControl: function() {
    return this.getNode(this.timeControlId);
  },
  setPlaybackPosition: function(percent) {
    this.playbackFull().domElement.style.width = percent + '%';
  },
  isSeeking: function() {
    return !this.updatePlayBar;
  },
  onTimeUpdate: function(memo) {
    if (this.updatePlayBar) {
      var currentTime = memo.currentTime;
      var duration = memo.duration;
      this.setPlaybackPosition(currentTime * 100 / duration);
    }
  },
  down: function(event, x, y) {
    this.updatePlayBar = false;
    this.move(event, x, y);
  },
  move: function(event, x, y) {
    var width = $(this.domElement).width();
    var selectedPosition = x - $(this.domElement).offset().left;
    if (selectedPosition < 0) {
      selectedPosition = 0;
    } else if (selectedPosition > width) {
      selectedPosition = 100;
    } else {
      selectedPosition = selectedPosition * 100 / width;
    }
    this.setPlaybackPosition(selectedPosition);
  },
  up: function(event, x, y) {
    var width = $(this.domElement).width();
    var selectedPosition = x - $(this.domElement).offset().left;
    if (selectedPosition < 0) {
      selectedPosition = 0;
    } else if (selectedPosition > width) {
      selectedPosition = 100;
    } else {
      selectedPosition = selectedPosition * 100 / width;
    }
    paella.player.videoContainer.seekTo(selectedPosition);
    this.updatePlayBar = true;
  },
  onresize: function() {
    var playbackBar = $("#playerContainer_controls_playback_playbackBar");
    this.getCanvas().width = playbackBar.width();
    this.drawTimeMarks();
  }
});
Class("paella.PlaybackControl", paella.DomNode, {
  playbackBarId: '',
  pluginsContainer: null,
  _popUpPluginContainer: null,
  _timeLinePluginContainer: null,
  playbackPluginsWidth: 0,
  popupPluginsWidth: 0,
  minPlaybackBarSize: 120,
  playbackBarInstance: null,
  buttonPlugins: [],
  addPlugin: function(plugin) {
    var This = this;
    var id = 'buttonPlugin' + this.buttonPlugins.length;
    this.buttonPlugins.push(plugin);
    var button = paella.ButtonPlugin.buildPluginButton(plugin, id);
    plugin.button = button;
    this.pluginsContainer.domElement.appendChild(button);
    $(button).hide();
    plugin.checkEnabled(function(isEnabled) {
      var parent;
      if (isEnabled) {
        $(plugin.button).show();
        paella.pluginManager.setupPlugin(plugin);
        var id = 'buttonPlugin' + This.buttonPlugins.length;
        if (plugin.getButtonType() == paella.ButtonPlugin.type.popUpButton) {
          parent = This.popUpPluginContainer.domElement;
          var popUpContent = paella.ButtonPlugin.buildPluginPopUp(parent, plugin, id + '_container');
          This.popUpPluginContainer.registerContainer(plugin.getName(), popUpContent, button, plugin);
        } else if (plugin.getButtonType() == paella.ButtonPlugin.type.timeLineButton) {
          parent = This.timeLinePluginContainer.domElement;
          var timeLineContent = paella.ButtonPlugin.buildPluginPopUp(parent, plugin, id + '_timeline');
          This.timeLinePluginContainer.registerContainer(plugin.getName(), timeLineContent, button, plugin);
        }
      } else {
        This.pluginsContainer.domElement.removeChild(plugin.button);
      }
    });
  },
  initialize: function(id) {
    var style = {};
    this.parent('div', id, style);
    this.domElement.className = 'playbackControls';
    this.playbackBarId = id + '_playbackBar';
    var thisClass = this;
    this.pluginsContainer = new paella.DomNode('div', id + '_playbackBarPlugins');
    this.pluginsContainer.domElement.className = 'playbackBarPlugins';
    this.pluginsContainer.domElement.setAttribute("role", "toolbar");
    this.addNode(this.pluginsContainer);
    this.addNode(new paella.PlaybackBar(this.playbackBarId));
    paella.pluginManager.setTarget('button', this);
    Object.defineProperty(this, "popUpPluginContainer", {get: function() {
        if (!this._popUpPluginContainer) {
          this._popUpPluginContainer = new paella.PopUpContainer(id + '_popUpPluginContainer', 'popUpPluginContainer');
          this.addNode(this._popUpPluginContainer);
        }
        return this._popUpPluginContainer;
      }});
    Object.defineProperty(this, "timeLinePluginContainer", {get: function() {
        if (!this._timeLinePluginContainer) {
          this._timeLinePluginContainer = new paella.TimelineContainer(id + '_timelinePluginContainer', 'timelinePluginContainer');
          this.addNode(this._timeLinePluginContainer);
        }
        return this._timeLinePluginContainer;
      }});
  },
  showPopUp: function(identifier, button) {
    this.popUpPluginContainer.showContainer(identifier, button);
    this.timeLinePluginContainer.showContainer(identifier, button);
  },
  hidePopUp: function(identifier, button) {
    this.popUpPluginContainer.hideContainer(identifier, button);
    this.timeLinePluginContainer.hideContainer(identifier, button);
  },
  playbackBar: function() {
    if (this.playbackBarInstance == null) {
      this.playbackBarInstance = this.getNode(this.playbackBarId);
    }
    return this.playbackBarInstance;
  },
  onresize: function() {
    var windowSize = $(this.domElement).width();
    base.log.debug("resize playback bar (width=" + windowSize + ")");
    for (var i = 0; i < this.buttonPlugins.length; ++i) {
      var plugin = this.buttonPlugins[i];
      var minSize = plugin.getMinWindowSize();
      if (minSize > 0 && windowSize < minSize) {
        plugin.hideUI();
      } else {
        plugin.checkVisibility();
      }
    }
    this.getNode(this.playbackBarId).onresize();
  }
});
Class("paella.ControlsContainer", paella.DomNode, {
  playbackControlId: '',
  editControlId: '',
  isEnabled: true,
  autohideTimer: null,
  hideControlsTimeMillis: 3000,
  playbackControlInstance: null,
  videoOverlayButtons: null,
  buttonPlugins: [],
  _hidden: false,
  _over: false,
  addPlugin: function(plugin) {
    var thisClass = this;
    var id = 'videoOverlayButtonPlugin' + this.buttonPlugins.length;
    this.buttonPlugins.push(plugin);
    var button = paella.ButtonPlugin.buildPluginButton(plugin, id);
    this.videoOverlayButtons.domElement.appendChild(button);
    plugin.button = button;
    $(button).hide();
    plugin.checkEnabled(function(isEnabled) {
      if (isEnabled) {
        $(plugin.button).show();
        paella.pluginManager.setupPlugin(plugin);
      }
    });
  },
  initialize: function(id) {
    this.parent('div', id);
    this.viewControlId = id + '_view';
    this.playbackControlId = id + '_playback';
    this.editControlId = id + '_editor';
    this.addNode(new paella.PlaybackControl(this.playbackControlId));
    var thisClass = this;
    paella.events.bind(paella.events.showEditor, function(event) {
      thisClass.onShowEditor();
    });
    paella.events.bind(paella.events.hideEditor, function(event) {
      thisClass.onHideEditor();
    });
    paella.events.bind(paella.events.play, function(event) {
      thisClass.onPlayEvent();
    });
    paella.events.bind(paella.events.pause, function(event) {
      thisClass.onPauseEvent();
    });
    $(document).mousemove(function(event) {
      paella.player.controls.restartHideTimer();
    });
    $(this.domElement).bind("mousemove", function(event) {
      thisClass._over = true;
    });
    $(this.domElement).bind("mouseout", function(event) {
      thisClass._over = false;
    });
    paella.events.bind(paella.events.endVideo, function(event) {
      thisClass.onEndVideoEvent();
    });
    paella.events.bind('keydown', function(event) {
      thisClass.onKeyEvent();
    });
    this.videoOverlayButtons = new paella.DomNode('div', id + '_videoOverlayButtonPlugins');
    this.videoOverlayButtons.domElement.className = 'videoOverlayButtonPlugins';
    this.videoOverlayButtons.domElement.setAttribute("role", "toolbar");
    this.addNode(this.videoOverlayButtons);
    paella.pluginManager.setTarget('videoOverlayButton', this);
  },
  onShowEditor: function() {
    var editControl = this.editControl();
    if (editControl)
      $(editControl.domElement).hide();
  },
  onHideEditor: function() {
    var editControl = this.editControl();
    if (editControl)
      $(editControl.domElement).show();
  },
  enterEditMode: function() {
    var playbackControl = this.playbackControl();
    var editControl = this.editControl();
    if (playbackControl && editControl) {
      $(playbackControl.domElement).hide();
    }
  },
  exitEditMode: function() {
    var playbackControl = this.playbackControl();
    var editControl = this.editControl();
    if (playbackControl && editControl) {
      $(playbackControl.domElement).show();
    }
  },
  playbackControl: function() {
    if (this.playbackControlInstance == null) {
      this.playbackControlInstance = this.getNode(this.playbackControlId);
    }
    return this.playbackControlInstance;
  },
  editControl: function() {
    return this.getNode(this.editControlId);
  },
  disable: function() {
    this.isEnabled = false;
    this.hide();
  },
  enable: function() {
    this.isEnabled = true;
    this.show();
  },
  isHidden: function() {
    return this._hidden;
  },
  hide: function() {
    var This = this;
    this._doHide = true;
    function hideIfNotCanceled() {
      if (This._doHide) {
        $(This.domElement).css({opacity: 0.0});
        $(This.domElement).hide();
        This.domElement.setAttribute('aria-hidden', 'true');
        This._hidden = true;
        paella.events.trigger(paella.events.controlBarDidHide);
      }
    }
    paella.events.trigger(paella.events.controlBarWillHide);
    if (This._doHide) {
      if (!base.userAgent.browser.IsMobileVersion && !base.userAgent.browser.Explorer) {
        $(this.domElement).animate({opacity: 0.0}, {
          duration: 300,
          complete: hideIfNotCanceled
        });
      } else {
        hideIfNotCanceled();
      }
    }
  },
  showPopUp: function(identifier) {
    this.playbackControl().showPopUp(identifier);
  },
  hidePopUp: function(identifier) {
    this.playbackControl().hidePopUp(identifier);
  },
  show: function() {
    if (this.isEnabled) {
      $(this.domElement).stop();
      this._doHide = false;
      this.domElement.style.opacity = 1.0;
      this.domElement.setAttribute('aria-hidden', 'false');
      this._hidden = false;
      $(this.domElement).show();
      paella.events.trigger(paella.events.controlBarDidShow);
    }
  },
  autohideTimeout: function() {
    var playbackBar = this.playbackControl().playbackBar();
    if (playbackBar.isSeeking() || this._over) {
      paella.player.controls.restartHideTimer();
    } else {
      paella.player.controls.hideControls();
    }
  },
  hideControls: function() {
    var This = this;
    paella.player.videoContainer.paused().then(function(paused) {
      if (!paused) {
        This.hide();
      } else {
        This.show();
      }
    });
  },
  showControls: function() {
    this.show();
  },
  onPlayEvent: function() {
    this.restartHideTimer();
  },
  onPauseEvent: function() {
    this.clearAutohideTimer();
  },
  onEndVideoEvent: function() {
    this.show();
    this.clearAutohideTimer();
  },
  onKeyEvent: function() {
    this.restartHideTimer();
    paella.player.videoContainer.paused().then(function(paused) {
      if (!paused) {
        paella.player.controls.restartHideTimer();
      }
    });
  },
  cancelHideBar: function() {
    this.restartTimerEvent();
  },
  restartTimerEvent: function() {
    var This = this;
    if (this.isHidden()) {
      this.showControls();
    }
    this._doHide = false;
    paella.player.videoContainer.paused(function(paused) {
      if (!paused) {
        This.restartHideTimer();
      }
    });
  },
  clearAutohideTimer: function() {
    if (this.autohideTimer != null) {
      this.autohideTimer.cancel();
      this.autohideTimer = null;
    }
  },
  restartHideTimer: function() {
    this.showControls();
    this.clearAutohideTimer();
    var thisClass = this;
    this.autohideTimer = new base.Timer(function(timer) {
      thisClass.autohideTimeout();
    }, this.hideControlsTimeMillis);
  },
  onresize: function() {
    this.playbackControl().onresize();
  }
});

"use strict";
(function() {
  Class("paella.LoaderContainer", paella.DomNode, {
    timer: null,
    loader: null,
    loaderPosition: 0,
    initialize: function(id) {
      var $__2 = this;
      this.parent('div', id, {
        position: 'fixed',
        backgroundColor: 'white',
        opacity: '0.7',
        top: '0px',
        left: '0px',
        right: '0px',
        bottom: '0px',
        zIndex: 10000
      });
      this.loader = this.addNode(new paella.DomNode('i', '', {
        width: "100px",
        height: "100px",
        color: "black",
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "32%",
        fontSize: "100px"
      }));
      this.loader.domElement.className = "icon-spinner";
      paella.events.bind(paella.events.loadComplete, function(event, params) {
        $__2.loadComplete(params);
      });
      this.timer = new base.Timer(function(timer) {
        $__2.loader.domElement.style.transform = ("rotate(" + $__2.loaderPosition + "deg");
        $__2.loaderPosition += 45;
      }, 250);
      this.timer.repeat = true;
    },
    loadComplete: function(params) {
      $(this.domElement).hide();
      this.timer.repeat = false;
    }
  });
  paella.Keys = {
    Space: 32,
    Left: 37,
    Up: 38,
    Right: 39,
    Down: 40,
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90
  };
  Class("paella.KeyPlugin", paella.FastLoadPlugin, {
    type: 'keyboard',
    onKeyPress: function(key) {
      console.log(key);
      return false;
    }
  });
  var KeyManager = function() {
    function KeyManager() {
      this._isPlaying = false;
      var thisClass = this;
      paella.events.bind(paella.events.loadComplete, function(event, params) {
        thisClass.loadComplete(event, params);
      });
      paella.events.bind(paella.events.play, function(event) {
        thisClass.onPlay();
      });
      paella.events.bind(paella.events.pause, function(event) {
        thisClass.onPause();
      });
      paella.pluginManager.setTarget('keyboard', this);
      this._pluginList = [];
    }
    return ($traceurRuntime.createClass)(KeyManager, {
      get isPlaying() {
        return this._isPlaying;
      },
      set isPlaying(p) {
        this._isPlaying = p;
      },
      get enabled() {
        return this._enabled !== undefined ? this._enabled : true;
      },
      set enabled(e) {
        this._enabled = e;
      },
      addPlugin: function(plugin) {
        var $__2 = this;
        if (plugin.checkEnabled(function(e) {
          $__2._pluginList.push(plugin);
          plugin.setup();
        }))
          ;
      },
      loadComplete: function(event, params) {
        var thisClass = this;
        paella.events.bind("keyup", function(event) {
          thisClass.keyUp(event);
        });
      },
      onPlay: function() {
        this.isPlaying = true;
      },
      onPause: function() {
        this.isPlaying = false;
      },
      keyUp: function(event) {
        if (!this.enabled)
          return;
        this._pluginList.some(function(plugin) {
          return plugin.onKeyPress(event);
        });
      }
    }, {});
  }();
  paella.keyManager = new KeyManager();
})();

"use strict";
Class("paella.VideoLoader", {
  metadata: {
    title: "",
    duration: 0
  },
  streams: [],
  frameList: [],
  loadStatus: false,
  codecStatus: false,
  getMetadata: function() {
    return this.metadata;
  },
  getVideoId: function() {
    return paella.initDelegate.getId();
  },
  getVideoUrl: function() {
    return "";
  },
  getDataUrl: function() {},
  loadVideo: function(onSuccess) {
    onSuccess();
  }
});
Class("paella.AccessControl", {
  canRead: function() {
    return paella_DeferredResolved(true);
  },
  canWrite: function() {
    return paella_DeferredResolved(false);
  },
  userData: function() {
    return paella_DeferredResolved({
      username: 'anonymous',
      name: 'Anonymous',
      avatar: paella.utils.folders.resources() + '/images/default_avatar.png',
      isAnonymous: true
    });
  },
  getAuthenticationUrl: function(callbackParams) {
    var authCallback = this._authParams.authCallbackName && window[this._authParams.authCallbackName];
    if (!authCallback && paella.player.config.auth) {
      authCallback = paella.player.config.auth.authCallbackName && window[paella.player.config.auth.authCallbackName];
    }
    if (typeof(authCallback) == "function") {
      return authCallback(callbackParams);
    }
    return "";
  }
});
Class("paella.PlayerBase", {
  config: null,
  playerId: '',
  mainContainer: null,
  videoContainer: null,
  controls: null,
  accessControl: null,
  checkCompatibility: function() {
    var message = "";
    if (base.parameters.get('ignoreBrowserCheck')) {
      return true;
    }
    if (base.userAgent.browser.IsMobileVersion)
      return true;
    var isCompatible = base.userAgent.browser.Chrome || base.userAgent.browser.Safari || base.userAgent.browser.Firefox || base.userAgent.browser.Opera || base.userAgent.browser.Edge || (base.userAgent.browser.Explorer && base.userAgent.browser.Version.major >= 9);
    if (isCompatible) {
      return true;
    } else {
      var errorMessage = base.dictionary.translate("It seems that your browser is not HTML 5 compatible");
      paella.events.trigger(paella.events.error, {error: errorMessage});
      message = errorMessage + '<div style="display:block;width:470px;height:140px;margin-left:auto;margin-right:auto;font-family:Verdana,sans-sherif;font-size:12px;"><a href="http://www.google.es/chrome" style="color:#004488;float:left;margin-right:20px;"><img src="' + paella.utils.folders.resources() + 'images/chrome.png" style="width:80px;height:80px" alt="Google Chrome"></img><p>Google Chrome</p></a><a href="http://windows.microsoft.com/en-US/internet-explorer/products/ie/home" style="color:#004488;float:left;margin-right:20px;"><img src="' + paella.utils.folders.resources() + 'images/explorer.png" style="width:80px;height:80px" alt="Internet Explorer 9"></img><p>Internet Explorer 9</p></a><a href="http://www.apple.com/safari/" style="float:left;margin-right:20px;color:#004488"><img src="' + paella.utils.folders.resources() + 'images/safari.png" style="width:80px;height:80px" alt="Safari"></img><p>Safari 5</p></a><a href="http://www.mozilla.org/firefox/" style="float:left;color:#004488"><img src="' + paella.utils.folders.resources() + 'images/firefox.png" style="width:80px;height:80px" alt="Firefox"></img><p>Firefox 12</p></a></div>';
      message += '<div style="margin-top:30px;"><a id="ignoreBrowserCheckLink" href="#" onclick="window.location = window.location + \'&ignoreBrowserCheck=true\'">' + base.dictionary.translate("Continue anyway") + '</a></div>';
      paella.messageBox.showError(message, {height: '40%'});
    }
    return false;
  },
  initialize: function(playerId) {
    Object.defineProperty(this, 'repoUrl', {get: function() {
        return paella.player.videoLoader._url || "";
      }});
    Object.defineProperty(this, 'videoUrl', {get: function() {
        return paella.player.videoLoader.getVideoUrl();
      }});
    Object.defineProperty(this, 'dataUrl', {get: function() {
        return paella.player.videoLoader.getDataUrl();
      }});
    Object.defineProperty(this, 'videoId', {get: function() {
        return paella.initDelegate.getId();
      }});
    if (base.parameters.get('log') != undefined) {
      var log = 0;
      switch (base.parameters.get('log')) {
        case "error":
          log = base.Log.kLevelError;
          break;
        case "warn":
          log = base.Log.kLevelWarning;
          break;
        case "debug":
          log = base.Log.kLevelDebug;
          break;
        case "log":
        case "true":
          log = base.Log.kLevelLog;
          break;
      }
      base.log.setLevel(log);
    }
    if (!this.checkCompatibility()) {
      base.log.debug('It seems that your browser is not HTML 5 compatible');
    } else {
      paella.player = this;
      this.playerId = playerId;
      this.mainContainer = $('#' + this.playerId)[0];
      var thisClass = this;
      paella.events.bind(paella.events.loadComplete, function(event, params) {
        thisClass.loadComplete(event, params);
      });
    }
  },
  loadComplete: function(event, params) {},
  auth: {
    login: function(redirect) {
      redirect = redirect || window.location.href;
      var url = paella.initDelegate.initParams.accessControl.getAuthenticationUrl(redirect);
      if (url) {
        window.location.href = url;
      }
    },
    canRead: function() {
      return paella.initDelegate.initParams.accessControl.canRead();
    },
    canWrite: function() {
      return paella.initDelegate.initParams.accessControl.canWrite();
    },
    userData: function() {
      return paella.initDelegate.initParams.accessControl.userData();
    }
  }
});
Class("paella.InitDelegate", {
  initParams: {
    configUrl: paella.baseUrl + 'config/config.json',
    dictionaryUrl: paella.baseUrl + 'localization/paella',
    accessControl: null,
    videoLoader: null
  },
  initialize: function(params) {
    if (arguments.length == 2) {
      this._config = arguments[0];
    }
    if (params) {
      for (var key in params) {
        this.initParams[key] = params[key];
      }
    }
  },
  getId: function() {
    return base.parameters.get('id') || "noid";
  },
  loadDictionary: function() {
    var $__2 = this;
    return new Promise(function(resolve) {
      base.ajax.get({url: $__2.initParams.dictionaryUrl + "_" + base.dictionary.currentLanguage() + '.json'}, function(data, type, returnCode) {
        base.dictionary.addDictionary(data);
        resolve(data);
      }, function(data, type, returnCode) {
        resolve();
      });
    });
  },
  loadConfig: function() {
    var $__2 = this;
    var loadAccessControl = function(data) {
      var AccessControlClass = Class.fromString(data.player.accessControlClass || "paella.AccessControl");
      $__2.initParams.accessControl = new AccessControlClass();
    };
    if (this.initParams.config) {
      return new Promise(function(resolve) {
        loadAccessControl($__2.initParams.config);
        resolve($__2.initParams.config);
      });
    } else if (this.initParams.loadConfig) {
      return new Promise(function(resolve, reject) {
        $__2.initParams.loadConfig($__2.initParams.configUrl).then(function(data) {
          loadAccessControl(data);
          resolve(data);
        }).catch(function(err) {
          reject(err);
        });
      });
    } else {
      return new Promise(function(resolve, reject) {
        var configUrl = $__2.initParams.configUrl;
        var params = {};
        params.url = configUrl;
        base.ajax.get(params, function(data, type, returnCode) {
          try {
            data = JSON.parse(data);
          } catch (e) {}
          loadAccessControl(data);
          resolve(data);
        }, function(data, type, returnCode) {
          paella.messageBox.showError(base.dictionary.translate("Error! Config file not found. Please configure paella!"));
        });
      });
    }
  }
});
var paellaPlayer = null;
paella.plugins = {};
paella.plugins.events = {};
paella.initDelegate = null;

"use strict";
Class("paella.PaellaPlayer", paella.PlayerBase, {
  player: null,
  videoIdentifier: '',
  loader: null,
  videoData: null,
  getPlayerMode: function() {
    if (paella.player.isFullScreen()) {
      return paella.PaellaPlayer.mode.fullscreen;
    } else if (window.self !== window.top) {
      return paella.PaellaPlayer.mode.embed;
    }
    return paella.PaellaPlayer.mode.standard;
  },
  checkFullScreenCapability: function() {
    var fs = document.getElementById(paella.player.mainContainer.id);
    if ((fs.webkitRequestFullScreen) || (fs.mozRequestFullScreen) || (fs.msRequestFullscreen) || (fs.requestFullScreen)) {
      return true;
    }
    if (base.userAgent.browser.IsMobileVersion && paella.player.videoContainer.isMonostream) {
      return true;
    }
    return false;
  },
  addFullScreenListeners: function() {
    var thisClass = this;
    var onFullScreenChangeEvent = function() {
      setTimeout(function() {
        paella.pluginManager.checkPluginsVisibility();
      }, 1000);
      var fs = document.getElementById(paella.player.mainContainer.id);
      if (paella.player.isFullScreen()) {
        fs.style.width = '100%';
        fs.style.height = '100%';
      } else {
        fs.style.width = '';
        fs.style.height = '';
      }
      if (thisClass.isFullScreen()) {
        paella.events.trigger(paella.events.enterFullscreen);
      } else {
        paella.events.trigger(paella.events.exitFullscreen);
      }
    };
    if (!this.eventFullScreenListenerAdded) {
      this.eventFullScreenListenerAdded = true;
      document.addEventListener("fullscreenchange", onFullScreenChangeEvent, false);
      document.addEventListener("webkitfullscreenchange", onFullScreenChangeEvent, false);
      document.addEventListener("mozfullscreenchange", onFullScreenChangeEvent, false);
      document.addEventListener("MSFullscreenChange", onFullScreenChangeEvent, false);
      document.addEventListener("webkitendfullscreen", onFullScreenChangeEvent, false);
    }
  },
  isFullScreen: function() {
    var webKitIsFullScreen = (document.webkitIsFullScreen === true);
    var msIsFullScreen = (document.msFullscreenElement !== undefined && document.msFullscreenElement !== null);
    var mozIsFullScreen = (document.mozFullScreen === true);
    var stdIsFullScreen = (document.fullScreenElement !== undefined && document.fullScreenElement !== null);
    return (webKitIsFullScreen || msIsFullScreen || mozIsFullScreen || stdIsFullScreen);
  },
  goFullScreen: function() {
    if (!this.isFullScreen()) {
      if (base.userAgent.system.iOS && (paella.utils.userAgent.browser.Version.major < 12 || !paella.utils.userAgent.system.iPad)) {
        paella.player.videoContainer.masterVideo().goFullScreen();
      } else {
        var fs = document.getElementById(paella.player.mainContainer.id);
        if (fs.webkitRequestFullScreen) {
          fs.webkitRequestFullScreen();
        } else if (fs.mozRequestFullScreen) {
          fs.mozRequestFullScreen();
        } else if (fs.msRequestFullscreen) {
          fs.msRequestFullscreen();
        } else if (fs.requestFullScreen) {
          fs.requestFullScreen();
        }
      }
    }
  },
  exitFullScreen: function() {
    if (this.isFullScreen()) {
      if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen()) {
        document.msExitFullscreen();
      } else if (document.cancelFullScreen) {
        document.cancelFullScreen();
      }
    }
  },
  setProfile: function(profileName, animate) {
    if (paella.profiles.setProfile(profileName, animate)) {
      var profileData = paella.player.getProfile(profileName);
      if (profileData && !paella.player.videoContainer.isMonostream) {
        base.cookies.set('lastProfile', profileName);
      }
      paella.events.trigger(paella.events.setProfile, {profileName: profileName});
    }
  },
  getProfile: function(profileName) {
    return paella.profiles.getProfile(profileName);
  },
  initialize: function(playerId) {
    this.parent(playerId);
    if (this.playerId == playerId) {
      this.loadPaellaPlayer();
      var thisClass = this;
    }
    Object.defineProperty(this, 'selectedProfile', {get: function() {
        return paella.profiles.currentProfileName;
      }});
  },
  loadPaellaPlayer: function() {
    var This = this;
    this.loader = new paella.LoaderContainer('paellaPlayer_loader');
    $('body')[0].appendChild(this.loader.domElement);
    paella.events.trigger(paella.events.loadStarted);
    paella.initDelegate.loadDictionary().then(function() {
      return paella.initDelegate.loadConfig();
    }).then(function(config) {
      This.accessControl = paella.initDelegate.initParams.accessControl;
      This.videoLoader = paella.initDelegate.initParams.videoLoader;
      This.onLoadConfig(config);
      if (config.skin) {
        var skin = config.skin.default || 'dark';
        paella.utils.skin.restore(skin);
      }
    });
  },
  onLoadConfig: function(configData) {
    paella.data = new paella.Data(configData);
    paella.pluginManager.registerPlugins();
    this.config = configData;
    this.videoIdentifier = paella.initDelegate.getId();
    if (this.videoIdentifier) {
      if (this.mainContainer) {
        this.videoContainer = new paella.VideoContainer(this.playerId + "_videoContainer");
        var videoQualityStrategy = new paella.BestFitVideoQualityStrategy();
        try {
          var StrategyClass = this.config.player.videoQualityStrategy;
          var ClassObject = Class.fromString(StrategyClass);
          videoQualityStrategy = new ClassObject();
        } catch (e) {
          base.log.warning("Error selecting video quality strategy: strategy not found");
        }
        this.videoContainer.setVideoQualityStrategy(videoQualityStrategy);
        this.mainContainer.appendChild(this.videoContainer.domElement);
      }
      $(window).resize(function(event) {
        paella.player.onresize();
      });
      this.onload();
    }
    paella.pluginManager.loadPlugins("paella.FastLoadPlugin");
  },
  onload: function() {
    var thisClass = this;
    var ac = this.accessControl;
    var canRead = false;
    var userData = {};
    this.accessControl.canRead().then(function(c) {
      canRead = c;
      return thisClass.accessControl.userData();
    }).then(function(d) {
      userData = d;
      if (canRead) {
        thisClass.loadVideo();
      } else if (userData.isAnonymous) {
        var redirectUrl = paella.initDelegate.initParams.accessControl.getAuthenticationUrl("player/?id=" + paella.player.videoIdentifier);
        var message = '<div>' + base.dictionary.translate("You are not authorized to view this resource") + '</div>';
        if (redirectUrl) {
          message += '<div class="login-link"><a href="' + redirectUrl + '">' + base.dictionary.translate("Login") + '</a></div>';
        }
        thisClass.unloadAll(message);
      } else {
        var errorMessage = base.dictionary.translate("You are not authorized to view this resource");
        thisClass.unloadAll(errorMessage);
        paella.events.trigger(paella.events.error, {error: errorMessage});
      }
    }).catch(function(error) {
      var errorMessage = base.dictionary.translate(error);
      thisClass.unloadAll(errorMessage);
      paella.events.trigger(paella.events.error, {error: errorMessage});
    });
  },
  onresize: function() {
    this.videoContainer.onresize();
    if (this.controls)
      this.controls.onresize();
    if (this.videoContainer.ready) {
      var cookieProfile = paella.utils.cookies.get('lastProfile');
      if (cookieProfile) {
        this.setProfile(cookieProfile, false);
      } else {
        this.setProfile(paella.player.selectedProfile, false);
      }
    }
    paella.events.trigger(paella.events.resize, {
      width: $(this.videoContainer.domElement).width(),
      height: $(this.videoContainer.domElement).height()
    });
  },
  unloadAll: function(message) {
    var loaderContainer = $('#paellaPlayer_loader')[0];
    this.mainContainer.innerText = "";
    paella.messageBox.showError(message);
  },
  reloadVideos: function(masterQuality, slaveQuality) {
    if (this.videoContainer) {
      this.videoContainer.reloadVideos(masterQuality, slaveQuality);
      this.onresize();
    }
  },
  loadVideo: function() {
    if (this.videoIdentifier) {
      var This = this;
      var loader = paella.player.videoLoader;
      this.onresize();
      loader.loadVideo(function() {
        var playOnLoad = false;
        This.videoContainer.setStreamData(loader.streams).then(function() {
          paella.events.trigger(paella.events.loadComplete);
          This.addFullScreenListeners();
          This.onresize();
          if (This.videoContainer.autoplay()) {
            This.play();
          }
        }).catch(function(error) {
          console.log(error);
        });
      });
    }
  },
  showPlaybackBar: function() {
    if (!this.controls) {
      this.controls = new paella.ControlsContainer(this.playerId + '_controls');
      this.mainContainer.appendChild(this.controls.domElement);
      this.controls.onresize();
      paella.events.trigger(paella.events.loadPlugins, {pluginManager: paella.pluginManager});
    }
  },
  isLiveStream: function() {
    if (this._isLiveStream === undefined) {
      var loader = paella.initDelegate.initParams.videoLoader;
      var checkSource = function(sources, index) {
        if (sources.length > index) {
          var source = sources[index];
          for (var key in source.sources) {
            if ($traceurRuntime.typeof((source.sources[key])) == "object") {
              for (var i = 0; i < source.sources[key].length; ++i) {
                var stream = source.sources[key][i];
                if (stream.isLiveStream)
                  return true;
              }
            }
          }
        }
        return false;
      };
      this._isLiveStream = checkSource(loader.streams, 0) || checkSource(loader.streams, 1);
    }
    return this._isLiveStream;
  },
  loadPreviews: function() {
    var streams = paella.initDelegate.initParams.videoLoader.streams;
    var slavePreviewImg = null;
    var masterPreviewImg = streams[0].preview;
    if (streams.length >= 2) {
      slavePreviewImg = streams[1].preview;
    }
    if (masterPreviewImg) {
      var masterRect = paella.player.videoContainer.overlayContainer.getVideoRect(0);
      this.masterPreviewElem = document.createElement('img');
      this.masterPreviewElem.src = masterPreviewImg;
      paella.player.videoContainer.overlayContainer.addElement(this.masterPreviewElem, masterRect);
    }
    if (slavePreviewImg) {
      var slaveRect = paella.player.videoContainer.overlayContainer.getVideoRect(1);
      this.slavePreviewElem = document.createElement('img');
      this.slavePreviewElem.src = slavePreviewImg;
      paella.player.videoContainer.overlayContainer.addElement(this.slavePreviewElem, slaveRect);
    }
    paella.events.bind(paella.events.timeUpdate, function(event) {
      paella.player.unloadPreviews();
    });
  },
  unloadPreviews: function() {
    if (this.masterPreviewElem) {
      paella.player.videoContainer.overlayContainer.removeElement(this.masterPreviewElem);
      this.masterPreviewElem = null;
    }
    if (this.slavePreviewElem) {
      paella.player.videoContainer.overlayContainer.removeElement(this.slavePreviewElem);
      this.slavePreviewElem = null;
    }
  },
  loadComplete: function(event, params) {
    var thisClass = this;
    paella.pluginManager.loadPlugins("paella.EarlyLoadPlugin");
    if (paella.player.videoContainer._autoplay) {
      this.play();
    }
  },
  play: function() {
    var $__2 = this;
    return new Promise(function(resolve, reject) {
      $__2.videoContainer.play().then(function() {
        if (!$__2.controls) {
          $__2.showPlaybackBar();
          paella.events.trigger(paella.events.controlBarLoaded);
          $__2.controls.onresize();
        }
        resolve();
      }).catch(function(err) {
        reject(err);
      });
    });
  },
  pause: function() {
    return this.videoContainer.pause();
  },
  playing: function() {
    var $__2 = this;
    return new Promise(function(resolve) {
      $__2.paused().then(function(p) {
        resolve(!p);
      });
    });
  },
  paused: function() {
    return this.videoContainer.paused();
  }
});
var PaellaPlayer = paella.PaellaPlayer;
paella.PaellaPlayer.mode = {
  standard: 'standard',
  fullscreen: 'fullscreen',
  embed: 'embed'
};
function initPaellaEngage(playerId, initDelegate) {
  if (!initDelegate) {
    initDelegate = new paella.InitDelegate();
  }
  paella.initDelegate = initDelegate;
  paellaPlayer = new PaellaPlayer(playerId, paella.initDelegate);
}

"use strict";
Class("paella.DefaultVideoLoader", paella.VideoLoader, {
  _url: null,
  initialize: function(data) {
    if ($traceurRuntime.typeof((data)) == "object") {
      this._data = data;
    } else {
      try {
        this._data = JSON.parse(data);
      } catch (e) {
        this._url = data;
      }
    }
  },
  getVideoUrl: function() {
    if (paella.initDelegate.initParams.videoUrl) {
      return typeof(paella.initDelegate.initParams.videoUrl) == "function" ? paella.initDelegate.initParams.videoUrl() : paella.initDelegate.initParams.videoUrl;
    } else {
      var url = this._url || paella.player.config.standalone.repository;
      return (/\/$/.test(url) ? url : url + '/') + paella.initDelegate.getId() + '/';
    }
  },
  getDataUrl: function() {
    if (paella.initDelegate.initParams.dataUrl) {
      return typeof(paella.initDelegate.initParams.dataUrl) == 'function' ? paella.initDelegate.initParams.dataUrl() : paella.initDelegate.initParams.dataUrl;
    } else {
      return this.getVideoUrl() + 'data.json';
    }
  },
  loadVideo: function(onSuccess) {
    var $__2 = this;
    var loadVideoDelegate = paella.initDelegate.initParams.loadVideo;
    var url = this._url || this.getDataUrl();
    if (this._data) {
      this.loadVideoData(this._data, onSuccess);
    } else if (loadVideoDelegate) {
      loadVideoDelegate().then(function(data) {
        $__2._data = data;
        $__2.loadVideoData($__2._data, onSuccess);
      });
    } else if (url) {
      var This = this;
      base.ajax.get({url: this.getDataUrl()}, function(data, type, err) {
        if (typeof(data) == "string") {
          try {
            data = JSON.parse(data);
          } catch (e) {}
        }
        This._data = data;
        This.loadVideoData(This._data, onSuccess);
      }, function(data, type, err) {
        switch (err) {
          case 401:
            paella.messageBox.showError(base.dictionary.translate("You are not logged in"));
            break;
          case 403:
            paella.messageBox.showError(base.dictionary.translate("You are not authorized to view this resource"));
            break;
          case 404:
            paella.messageBox.showError(base.dictionary.translate("The specified video identifier does not exist"));
            break;
          default:
            paella.messageBox.showError(base.dictionary.translate("Could not load the video"));
        }
      });
    }
  },
  loadVideoData: function(data, onSuccess) {
    var This = this;
    if (data.metadata) {
      this.metadata = data.metadata;
    }
    if (data.streams) {
      data.streams.forEach(function(stream) {
        This.loadStream(stream);
      });
    }
    if (data.frameList) {
      this.loadFrameData(data);
    }
    if (data.captions) {
      this.loadCaptions(data.captions);
    }
    if (data.blackboard) {
      this.loadBlackboard(data.streams[0], data.blackboard);
    }
    this.streams = data.streams;
    this.frameList = data.frameList;
    this.loadStatus = this.streams.length > 0;
    onSuccess();
  },
  loadFrameData: function(data) {
    var This = this;
    if (data.frameList && data.frameList.forEach) {
      var newFrames = {};
      data.frameList.forEach(function(frame) {
        if (!/^[a-zA-Z]+:\/\//.test(frame.url) && !/^data:/.test(frame.url)) {
          frame.url = This.getVideoUrl() + frame.url;
        }
        if (frame.thumb && !/^[a-zA-Z]+:\/\//.test(frame.thumb) && !/^data:/.test(frame.thumb)) {
          frame.thumb = This.getVideoUrl() + frame.thumb;
        }
        var id = frame.time;
        newFrames[id] = frame;
      });
      data.frameList = newFrames;
    }
  },
  loadStream: function(stream) {
    var This = this;
    if (stream.preview && !/^[a-zA-Z]+:\/\//.test(stream.preview) && !/^data:/.test(stream.preview)) {
      stream.preview = This.getVideoUrl() + stream.preview;
    }
    if (stream.sources.image) {
      stream.sources.image.forEach(function(image) {
        if (image.frames.forEach) {
          var newFrames = {};
          image.frames.forEach(function(frame) {
            if (frame.src && !/^[a-zA-Z]+:\/\//.test(frame.src) && !/^data:/.test(frame.src)) {
              frame.src = This.getVideoUrl() + frame.src;
            }
            if (frame.thumb && !/^[a-zA-Z]+:\/\//.test(frame.thumb) && !/^data:/.test(frame.thumb)) {
              frame.thumb = This.getVideoUrl() + frame.thumb;
            }
            var id = "frame_" + frame.time;
            newFrames[id] = frame.src;
          });
          image.frames = newFrames;
        }
      });
    }
    for (var type in stream.sources) {
      if (stream.sources[type]) {
        if (type != 'image') {
          var source = stream.sources[type];
          source.forEach(function(sourceItem) {
            var pattern = /^[a-zA-Z\:]+\:\/\//gi;
            if (typeof(sourceItem.src) == "string") {
              if (sourceItem.src.match(pattern) == null) {
                sourceItem.src = This.getVideoUrl() + sourceItem.src;
              }
            }
            sourceItem.type = sourceItem.mimetype;
          });
        }
      } else {
        delete stream.sources[type];
      }
    }
  },
  loadCaptions: function(captions) {
    if (captions) {
      for (var i = 0; i < captions.length; ++i) {
        var url = captions[i].url;
        if (!/^[a-zA-Z]+:\/\//.test(url)) {
          url = this.getVideoUrl() + url;
        }
        var c = new paella.captions.Caption(i, captions[i].format, url, {
          code: captions[i].lang,
          txt: captions[i].text
        });
        paella.captions.addCaptions(c);
      }
    }
  },
  loadBlackboard: function(stream, blackboard) {
    var This = this;
    if (!stream.sources.image) {
      stream.sources.image = [];
    }
    var imageObject = {
      count: blackboard.frames.length,
      duration: blackboard.duration,
      mimetype: blackboard.mimetype,
      res: blackboard.res,
      frames: {}
    };
    blackboard.frames.forEach(function(frame) {
      var id = "frame_" + Math.round(frame.time);
      if (!/^[a-zA-Z]+:\/\//.test(frame.src)) {
        frame.src = This.getVideoUrl() + frame.src;
      }
      imageObject.frames[id] = frame.src;
    });
    stream.sources.image.push(imageObject);
  }
});
Class("paella.DefaultInitDelegate", paella.InitDelegate, {});
paella.load = function(playerContainer, params) {
  var auth = (params && params.auth) || {};
  var master = null;
  if (master = paella.utils.parameters.get('video')) {
    var slave = paella.utils.parameters.get('videoSlave');
    slave = slave && decodeURIComponent(slave);
    var masterPreview = paella.utils.parameters.get('preview');
    masterPreview = masterPreview && decodeURIComponent(masterPreview);
    var slavePreview = paella.utils.parameters.get('previewSlave');
    slavePreview = slavePreview && decodeURIComponent(slavePreview);
    var title = paella.utils.parameters.get('preview') || "Untitled Video";
    var data = {
      metadata: {title: title},
      streams: [{
        sources: {mp4: [{
            src: decodeURIComponent(master),
            mimetype: "video/mp4",
            res: {
              w: 0,
              h: 0
            }
          }]},
        preview: masterPreview
      }]
    };
    if (slave) {
      data.streams.push({
        sources: {mp4: [{
            src: slave,
            mimetype: "video/mp4",
            res: {
              w: 0,
              h: 0
            }
          }]},
        preview: slavePreview
      });
    }
    params.data = data;
  }
  var initObjects = params;
  initObjects.videoLoader = new paella.DefaultVideoLoader(params.data || params.url);
  paella.initDelegate = new paella.DefaultInitDelegate(initObjects);
  new PaellaPlayer(playerContainer, paella.initDelegate);
};

"use strict";
Class("paella.RightBarPlugin", paella.DeferredLoadPlugin, {
  type: 'rightBarPlugin',
  getName: function() {
    return "es.upv.paella.RightBarPlugin";
  },
  buildContent: function(domElement) {}
});
Class("paella.TabBarPlugin", paella.DeferredLoadPlugin, {
  type: 'tabBarPlugin',
  getName: function() {
    return "es.upv.paella.TabBarPlugin";
  },
  getTabName: function() {
    return "New Tab";
  },
  action: function(tab) {},
  buildContent: function(domElement) {},
  setToolTip: function(message) {
    this.button.setAttribute("title", message);
    this.button.setAttribute("aria-label", message);
  },
  getDefaultToolTip: function() {
    return "";
  }
});
Class("paella.ExtendedAdapter", {
  rightContainer: null,
  bottomContainer: null,
  rightBarPlugins: [],
  tabBarPlugins: [],
  currentTabIndex: 0,
  bottomContainerTabs: null,
  bottomContainerContent: null,
  initialize: function() {
    this.rightContainer = document.createElement('div');
    this.rightContainer.className = "rightPluginContainer";
    this.bottomContainer = document.createElement('div');
    this.bottomContainer.className = "tabsPluginContainer";
    var tabs = document.createElement('div');
    tabs.className = 'tabsLabelContainer';
    this.bottomContainerTabs = tabs;
    this.bottomContainer.appendChild(tabs);
    var bottomContent = document.createElement('div');
    bottomContent.className = 'tabsContentContainer';
    this.bottomContainerContent = bottomContent;
    this.bottomContainer.appendChild(bottomContent);
    this.initPlugins();
  },
  initPlugins: function() {
    paella.pluginManager.setTarget('rightBarPlugin', this);
    paella.pluginManager.setTarget('tabBarPlugin', this);
  },
  addPlugin: function(plugin) {
    var thisClass = this;
    plugin.checkEnabled(function(isEnabled) {
      if (isEnabled) {
        paella.pluginManager.setupPlugin(plugin);
        if (plugin.type == 'rightBarPlugin') {
          thisClass.rightBarPlugins.push(plugin);
          thisClass.addRightBarPlugin(plugin);
        }
        if (plugin.type == 'tabBarPlugin') {
          thisClass.tabBarPlugins.push(plugin);
          thisClass.addTabPlugin(plugin);
        }
      }
    });
  },
  showTab: function(tabIndex) {
    var i = 0;
    var labels = this.bottomContainer.getElementsByClassName("tabLabel");
    var contents = this.bottomContainer.getElementsByClassName("tabContent");
    for (i = 0; i < labels.length; ++i) {
      if (labels[i].getAttribute("tab") == tabIndex) {
        labels[i].className = "tabLabel enabled";
      } else {
        labels[i].className = "tabLabel disabled";
      }
    }
    for (i = 0; i < contents.length; ++i) {
      if (contents[i].getAttribute("tab") == tabIndex) {
        contents[i].className = "tabContent enabled";
      } else {
        contents[i].className = "tabContent disabled";
      }
    }
  },
  addTabPlugin: function(plugin) {
    var thisClass = this;
    var tabIndex = this.currentTabIndex;
    var tabItem = document.createElement('div');
    tabItem.setAttribute("tab", tabIndex);
    tabItem.className = "tabLabel disabled";
    tabItem.innerText = plugin.getTabName();
    tabItem.plugin = plugin;
    $(tabItem).click(function(event) {
      if (/disabled/.test(this.className)) {
        thisClass.showTab(tabIndex);
        this.plugin.action(this);
      }
    });
    $(tabItem).keyup(function(event) {
      if (event.keyCode == 13) {
        if (/disabledTabItem/.test(this.className)) {
          thisClass.showTab(tabIndex);
          this.plugin.action(this);
        }
      }
    });
    this.bottomContainerTabs.appendChild(tabItem);
    var tabContent = document.createElement('div');
    tabContent.setAttribute("tab", tabIndex);
    tabContent.className = "tabContent disabled " + plugin.getSubclass();
    this.bottomContainerContent.appendChild(tabContent);
    plugin.buildContent(tabContent);
    plugin.button = tabItem;
    plugin.container = tabContent;
    plugin.button.setAttribute("tabindex", 3000 + plugin.getIndex());
    plugin.button.setAttribute("alt", "");
    plugin.setToolTip(plugin.getDefaultToolTip());
    if (this.firstTabShown === undefined) {
      this.showTab(tabIndex);
      this.firstTabShown = true;
    }
    ++this.currentTabIndex;
  },
  addRightBarPlugin: function(plugin) {
    var container = document.createElement('div');
    container.className = "rightBarPluginContainer " + plugin.getSubclass();
    this.rightContainer.appendChild(container);
    plugin.buildContent(container);
  }
});
paella.extendedAdapter = new paella.ExtendedAdapter();

"use strict";
Class("paella.editor.EmbedPlayer", base.AsyncLoaderCallback, {
  editar: null,
  initialize: function() {
    this.editor = paella.editor.instance;
  },
  load: function(onSuccess, onError) {
    var barHeight = this.editor.bottomBar.getHeight() + 20;
    var rightBarWidth = this.editor.rightBar.getWidth() + 20;
    $(paella.player.mainContainer).css({
      'position': 'fixed',
      "width": "",
      "bottom": barHeight + "px",
      "right": rightBarWidth + "px",
      "left": "20px",
      "top": "20px"
    });
    paella.player.mainContainer.className = "paellaMainContainerEditorMode";
    new Timer(function(timer) {
      paella.player.controls.disable();
      paella.player.onresize();
      if (onSuccess) {
        onSuccess();
      }
    }, 500);
  },
  restorePlayer: function() {
    $('body')[0].appendChild(paella.player.mainContainer);
    paella.player.controls.enable();
    paella.player.mainContainer.className = "";
    $(paella.player.mainContainer).css({
      'position': '',
      "width": "",
      "bottom": "",
      "left": "",
      "right": "",
      "top": ""
    });
    paella.player.onresize();
  },
  onresize: function() {
    var barHeight = this.editor.bottomBar.getHeight() + 20;
    var rightBarWidth = this.editor.rightBar.getWidth() + 20;
    $(paella.player.mainContainer).css({
      'position': 'fixed',
      "width": "",
      "bottom": barHeight + "px",
      "right": rightBarWidth + "px",
      "left": "20px",
      "top": "20px"
    });
  }
});

"use strict";
function DeprecatedClass(name, replacedBy, p) {
  Class(name, p, {initialize: function() {
      base.log.warning(name + " is deprecated, use " + replacedBy + " instead.");
      this.parent.apply(this, arguments);
    }});
}
function DeprecatedFunc(name, replacedBy, func) {
  function ret() {
    base.log.warning(name + " is deprecated, use " + replacedBy + " instead.");
    func.apply(this, arguments);
  }
  return ret;
}
DeprecatedClass("paella.Dictionary", "base.Dictionary", base.Dictionary);
paella.dictionary = base.dictionary;
DeprecatedClass("paella.AsyncLoaderCallback", "base.AsyncLoaderCallback", base.AsyncLoaderCallback);
DeprecatedClass("paella.AjaxCallback", "base.AjaxCallback", base.AjaxCallback);
DeprecatedClass("paella.JSONCallback", "base.JSONCallback", base.JSONCallback);
DeprecatedClass("paella.DictionaryCallback", "base.DictionaryCallback", base.DictionaryCallback);
DeprecatedClass("paella.AsyncLoader", "base.AsyncLoader", base.AsyncLoader);
DeprecatedClass("paella.Timer", "base.Timer", base.Timer);
DeprecatedClass("paella.utils.Timer", "base.Timer", base.Timer);
paella.ajax = {};
paella.ajax['send'] = DeprecatedFunc("paella.ajax.send", "base.ajax.send", base.ajax.send);
paella.ajax['get'] = DeprecatedFunc("paella.ajax.get", "base.ajax.get", base.ajax.get);
paella.ajax['put'] = DeprecatedFunc("paella.ajax.put", "base.ajax.put", base.ajax.put);
paella.ajax['post'] = DeprecatedFunc("paella.ajax.post", "base.ajax.post", base.ajax.post);
paella.ajax['delete'] = DeprecatedFunc("paella.ajax.delete", "base.ajax.delete", base.ajax.send);
paella.ui = {};
paella.ui.Container = function(params) {
  var elem = document.createElement('div');
  if (params.id)
    elem.id = params.id;
  if (params.className)
    elem.className = params.className;
  if (params.style)
    $(elem).css(params.style);
  return elem;
};
paella.utils.ajax = base.ajax;
paella.utils.cookies = base.cookies;
paella.utils.parameters = base.parameters;
paella.utils.require = base.require;
paella.utils.importStylesheet = base.importStylesheet;
paella.utils.language = base.dictionary.currentLanguage;
paella.utils.uuid = base.uuid;
paella.utils.userAgent = base.userAgent;
paella.debug = {log: function(msg) {
    base.log.warning("paella.debug.log is deprecated, use base.debug.[error/warning/debug/log] instead.");
    base.log.log(msg);
  }};
paella.debugReady = true;

"use strict";
paella.addPlugin(function() {
  var FlexSkipPlugin = function($__super) {
    function FlexSkipPlugin() {
      $traceurRuntime.superConstructor(FlexSkipPlugin).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(FlexSkipPlugin, {
      getAlignment: function() {
        return 'left';
      },
      getName: function() {
        return "edu.harvard.dce.paella.flexSkipPlugin";
      },
      getIndex: function() {
        return 121;
      },
      getSubclass: function() {
        return 'flexSkip_Rewind_10';
      },
      getIconClass: function() {
        return 'icon-back-10-s';
      },
      formatMessage: function() {
        return 'Rewind 10 seconds';
      },
      getDefaultToolTip: function() {
        return base.dictionary.translate(this.formatMessage());
      },
      getMinWindowSize: function() {
        return 510;
      },
      checkEnabled: function(onSuccess) {
        onSuccess(!paella.player.isLiveStream());
      },
      action: function(button) {
        paella.player.videoContainer.currentTime().then(function(currentTime) {
          paella.player.videoContainer.seekToTime(currentTime - 10);
        });
      }
    }, {}, $__super);
  }(paella.ButtonPlugin);
  paella.plugins.FlexSkipPlugin = FlexSkipPlugin;
  return FlexSkipPlugin;
});
paella.addPlugin(function() {
  return function($__super) {
    function FlexSkipForwardPlugin() {
      $traceurRuntime.superConstructor(FlexSkipForwardPlugin).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(FlexSkipForwardPlugin, {
      getIndex: function() {
        return 122;
      },
      getName: function() {
        return "edu.harvard.dce.paella.flexSkipForwardPlugin";
      },
      getSubclass: function() {
        return 'flexSkip_Forward_30';
      },
      getIconClass: function() {
        return 'icon-forward-30-s';
      },
      formatMessage: function() {
        return 'Forward 30 seconds';
      },
      action: function(button) {
        paella.player.videoContainer.currentTime().then(function(currentTime) {
          paella.player.videoContainer.seekToTime(currentTime + 30);
        });
      }
    }, {}, $__super);
  }(paella.plugins.FlexSkipPlugin);
});

"use strict";
paella.addPlugin(function() {
  return function($__super) {
    function WebVTTParserPlugin() {
      $traceurRuntime.superConstructor(WebVTTParserPlugin).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(WebVTTParserPlugin, {
      get ext() {
        return ["vtt"];
      },
      getName: function() {
        return "es.teltek.paella.captions.WebVTTParserPlugin";
      },
      parse: function(content, lang, next) {
        var captions = [];
        var self = this;
        var lls = content.split("\n");
        var c;
        var id = 0;
        var skip = false;
        for (var idx = 0; idx < lls.length; ++idx) {
          var ll = lls[idx].trim();
          if ((/^WEBVTT/.test(ll) && c === undefined) || ll.length === 0) {
            continue;
          }
          if ((/^[0-9]+$/.test(ll) || /^[0-9]+ -/.test(ll)) && lls[idx - 1].trim().length === 0) {
            continue;
          }
          if (/^NOTE/.test(ll) || /^STYLE/.test(ll)) {
            skip = true;
            continue;
          }
          if (/^(([0-9]+:)?[0-9]{2}:[0-9]{2}.[0-9]{3} --> ([0-9]+:)?[0-9]{2}:[0-9]{2}.[0-9]{3})/.test(ll)) {
            skip = false;
            if (c != undefined) {
              captions.push(c);
              id++;
            }
            c = {
              id: id,
              begin: self.parseTimeTextToSeg(ll.split("-->")[0]),
              end: self.parseTimeTextToSeg(ll.split("-->")[1])
            };
            continue;
          }
          if (c !== undefined && !skip) {
            ll = ll.replace(/^- /, "");
            ll = ll.replace(/<[^>]*>/g, "");
            if (c.content === undefined) {
              c.content = ll;
            } else {
              c.content += "<br/>" + ll;
            }
          }
        }
        captions.push(c);
        if (captions.length > 0) {
          next(false, captions);
        } else {
          next(true);
        }
      },
      parseTimeTextToSeg: function(ttime) {
        var nseg = 0;
        var factor = 1;
        ttime = /(([0-9]+:)?[0-9]{2}:[0-9]{2}.[0-9]{3})/.exec(ttime);
        var split = ttime[0].split(":");
        for (var i = split.length - 1; i >= 0; i--) {
          factor = Math.pow(60, (split.length - 1 - i));
          nseg += split[i] * factor;
        }
        return nseg;
      }
    }, {}, $__super);
  }(paella.CaptionParserPlugIn);
});

"use strict";
paella.addPlugin(function() {
  return function($__super) {
    function xAPISaverPlugin() {
      $traceurRuntime.superConstructor(xAPISaverPlugin).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(xAPISaverPlugin, {
      getName: function() {
        return "es.teltek.paella.usertracking.xAPISaverPlugin";
      },
      setup: function() {
        this.endpoint = this.config.endpoint;
        this.auth = this.config.auth;
        this.user_info = {};
        this.paused = true;
        this.played_segments = "";
        this.played_segments_segment_start = null;
        this.played_segments_segment_end = null;
        this.progress = 0;
        this.duration = 0;
        this.current_time = [];
        this.completed = false;
        this.volume = null;
        this.speed = null;
        this.language = "us-US";
        this.quality = null;
        this.fullscreen = false;
        this.title = "No title available";
        this.description = "";
        this.user_agent = "";
        this.total_time = 0;
        this.total_time_start = 0;
        this.total_time_end = 0;
        this.session_id = "";
        var self = this;
        this._loadDeps().then(function() {
          var conf = {
            "endpoint": self.endpoint,
            "auth": "Basic " + toBase64(self.auth)
          };
          ADL.XAPIWrapper.changeConfig(conf);
        });
        paella.events.bind(paella.events.timeUpdate, function(event, params) {
          self.current_time.push(params.currentTime);
          if (self.current_time.length >= 10) {
            self.current_time = self.current_time.slice(-10);
          }
          var a = Math.round(self.current_time[0]);
          var b = Math.round(self.current_time[9]);
          if ((params.currentTime !== 0) && (a + 1 >= b) && (b - 1 >= a)) {
            self.progress = self.get_progress(params.currentTime, params.duration);
            if (self.progress >= 0.95 && self.completed === false) {
              self.completed = true;
              self.end_played_segment(params.currentTime);
              self.start_played_segment(params.currentTime);
              self.send_completed(params.currentTime, self.progress);
            }
          }
        });
      },
      get_session_data: function() {
        var myparams = ADL.XAPIWrapper.searchParams();
        var agent = JSON.stringify({"mbox": this.user_info.email});
        var timestamp = new Date();
        timestamp.setDate(timestamp.getDate() - 1);
        timestamp = timestamp.toISOString();
        myparams['activity'] = window.location.href;
        myparams['verb'] = 'http://adlnet.gov/expapi/verbs/terminated';
        myparams['since'] = timestamp;
        myparams['limit'] = 1;
        myparams['agent'] = agent;
        var ret = ADL.XAPIWrapper.getStatements(myparams);
        if (ret.statements.length === 1) {
          this.played_segments = ret.statements[0].result.extensions['https://w3id.org/xapi/video/extensions/played-segments'];
          this.progress = ret.statements[0].result.extensions['https://w3id.org/xapi/video/extensions/progress'];
          ADL.XAPIWrapper.lrs.registration = ret.statements[0].context.registration;
        } else {
          ADL.XAPIWrapper.lrs.registration = ADL.ruuid();
        }
      },
      getCookie: function(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
      },
      setCookie: function(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
      },
      checkCookie: function() {
        var user_info = this.getCookie("user_info");
        if (user_info === "") {
          user_info = JSON.stringify(generateName());
        }
        this.setCookie("user_info", user_info);
        return JSON.parse(user_info);
      },
      checkEnabled: function(onSuccess) {
        this._url = this.config.url;
        this._index = this.config.index || "paellaplayer";
        this._type = this.config.type || "usertracking";
        onSuccess(true);
      },
      _loadDeps: function() {
        return new Promise(function(resolve, reject) {
          if (!window.$paella_mpd) {
            require(['resources/deps/xapiwrapper.min.js'], function() {
              require(['resources/deps/random_name_generator.js'], function() {
                window.$paella_bg2e = true;
                resolve(window.$paella_bg2e);
              });
            });
          } else {
            defer.resolve(window.$paella_mpd);
          }
        });
      },
      log: function(event, params) {
        var p = params;
        var self = this;
        switch (event) {
          case "paella:loadComplete":
            this.user_agent = navigator.userAgent.toString();
            this.get_title();
            this.get_description();
            paella.player.videoContainer.duration().then(function(duration) {
              return paella.player.videoContainer.streamProvider.mainAudioPlayer.volume().then(function(volume) {
                return paella.player.videoContainer.getCurrentQuality().then(function(quality) {
                  return paella.player.auth.userData().then(function(user_info) {
                    self.duration = duration;
                    self.volume = volume;
                    self.speed = 1;
                    if (paella.player.videoContainer.streamProvider.mainAudioPlayer.stream.language) {
                      self.language = paella.player.videoContainer.streamProvider.mainAudioPlayer.stream.language.replace("_", "-");
                    }
                    self.quality = quality.shortLabel();
                    if (user_info.email && user_info.name) {
                      self.user_info = user_info;
                    } else {
                      self.user_info = self.checkCookie();
                    }
                    self.get_session_data();
                    self.send_initialized();
                  });
                });
              });
            });
            window.onbeforeunload = function(e) {
              if (!self.paused) {
                self.send_pause(self);
              }
              self.send_terminated(self);
            };
            break;
          case "paella:play":
            this.send_play(self);
            break;
          case "paella:pause":
            this.send_pause(self);
            break;
          case "paella:seektotime":
            this.send_seek(self, params);
            break;
          case "paella:setVolume":
            paella.player.videoContainer.currentTime().then(function(currentTime) {
              var current_time = self.format_float(currentTime);
              self.volume = params.master;
              var interacted = {"https://w3id.org/xapi/video/extensions/volume": self.format_float(params.master)};
              self.send_interacted(current_time, interacted);
            });
            break;
          case "paella:setplaybackrate":
            paella.player.videoContainer.currentTime().then(function(currentTime) {
              var current_time = self.format_float(currentTime);
              self.speed = params.rate;
              var interacted = {"https://w3id.org/xapi/video/extensions/speed": params.rate + "x"};
              self.send_interacted(current_time, interacted);
            });
            break;
          case "paella:qualityChanged":
            paella.player.videoContainer.currentTime().then(function(currentTime) {
              return paella.player.videoContainer.getCurrentQuality().then(function(quality) {
                self.quality = quality.shortLabel();
                var current_time = self.format_float(currentTime);
                var interacted = {"https://w3id.org/xapi/video/extensions/quality": quality.shortLabel()};
                self.send_interacted(current_time, interacted);
              });
            });
            break;
          case "paella:enterFullscreen":
          case "paella:exitFullscreen":
            paella.player.videoContainer.currentTime().then(function(currentTime) {
              var current_time = self.format_float(currentTime);
              self.fullscreen ? self.fullscreen = false : self.fullscreen = true;
              var interacted = {"https://w3id.org/xapi/video/extensions/full-screen": self.fullscreen};
              self.send_interacted(current_time, interacted);
            });
            break;
          default:
            break;
        }
      },
      send: function(params) {
        var agent = new ADL.XAPIStatement.Agent(this.user_info.email, this.user_info.name);
        var verb = new ADL.XAPIStatement.Verb(params.verb.id, params.verb.description);
        var activity = new ADL.XAPIStatement.Activity(window.location.href, this.title, this.description);
        activity.definition.type = "https://w3id.org/xapi/video/activity-type/video";
        paella.player.videoContainer.streamProvider.mainAudioPlayer.volume().then(function(volume) {});
        var statement = new ADL.XAPIStatement(agent, verb, activity);
        statement.result = params.result;
        if (params.verb.id === "http://adlnet.gov/expapi/verbs/initialized") {
          statement.generateId();
          this.session_id = statement.id;
        }
        var ce_base = {
          "https://w3id.org/xapi/video/extensions/session-id": this.session_id,
          "https://w3id.org/xapi/video/extensions/length": Math.floor(this.duration),
          "https://w3id.org/xapi/video/extensions/user-agent": this.user_agent
        };
        var ce_interactions = {
          "https://w3id.org/xapi/video/extensions/volume": this.format_float(this.volume),
          "https://w3id.org/xapi/video/extensions/speed": this.speed + "x",
          "https://w3id.org/xapi/video/extensions/quality": this.quality,
          "https://w3id.org/xapi/video/extensions/full-screen": this.fullscreen
        };
        var context_extensions = {};
        if (params.interacted) {
          context_extensions = $.extend({}, ce_base, params.interacted);
        } else {
          context_extensions = $.extend({}, ce_base, ce_interactions);
        }
        statement.context = {
          "language": this.language,
          "extensions": context_extensions,
          "contextActivities": {"category": [{
              "objectType": "Activity",
              "id": "https://w3id.org/xapi/video"
            }]}
        };
        var result = ADL.XAPIWrapper.sendStatement(statement);
      },
      send_initialized: function() {
        var statement = {"verb": {
            "id": "http://adlnet.gov/expapi/verbs/initialized",
            "description": "initalized"
          }};
        this.send(statement);
      },
      send_terminated: function(self) {
        paella.player.videoContainer.currentTime().then(function(end_time) {
          var statement = {
            "verb": {
              "id": "http://adlnet.gov/expapi/verbs/terminated",
              "description": "terminated"
            },
            "result": {"extensions": {
                "https://w3id.org/xapi/video/extensions/time": end_time,
                "https://w3id.org/xapi/video/extensions/progress": self.progress,
                "https://w3id.org/xapi/video/extensions/played-segments": self.played_segments
              }}
          };
          self.send(statement);
        });
      },
      send_play: function(self) {
        this.paused = false;
        this.total_time_start = new Date().getTime() / 1000;
        paella.player.videoContainer.currentTime().then(function(currentTime) {
          var start_time = self.format_float(currentTime);
          if (start_time <= 1) {
            start_time = 0;
          }
          self.start_played_segment(start_time);
          var statement = {
            "verb": {
              "id": "https://w3id.org/xapi/video/verbs/played",
              "description": "played"
            },
            "result": {"extensions": {"https://w3id.org/xapi/video/extensions/time": start_time}}
          };
          self.send(statement);
        });
      },
      send_pause: function(self) {
        this.paused = true;
        this.total_time_end = new Date().getTime() / 1000;
        this.total_time += (this.total_time_end - this.total_time_start);
        paella.player.videoContainer.currentTime().then(function(currentTime) {
          var end_time = self.format_float(currentTime);
          if (end_time === 0) {
            end_time = self.duration;
          }
          self.end_played_segment(end_time);
          var statement = {
            "verb": {
              "id": "https://w3id.org/xapi/video/verbs/paused",
              "description": "paused"
            },
            "result": {"extensions": {
                "https://w3id.org/xapi/video/extensions/time": end_time,
                "https://w3id.org/xapi/video/extensions/progress": self.progress,
                "https://w3id.org/xapi/video/extensions/played-segments": self.played_segments
              }}
          };
          self.send(statement);
        });
      },
      send_seek: function(self, params) {
        var seekedto = this.format_float(params.newPosition);
        var a = this.current_time.filter(function(value) {
          return value <= seekedto - 1;
        });
        if (a.length === 0) {
          a = this.current_time.filter(function(value) {
            return value >= seekedto + 1;
          });
        }
        var seekedfrom = a.filter(Number).pop();
        this.current_time = [];
        this.current_time.push(seekedto);
        self.progress = self.get_progress(seekedfrom, self.duration);
        if (!this.paused) {
          this.end_played_segment(seekedfrom);
          this.start_played_segment(seekedto);
        }
        var statement = {
          "verb": {
            "id": "https://w3id.org/xapi/video/verbs/seeked",
            "description": "seeked"
          },
          "result": {"extensions": {
              "https://w3id.org/xapi/video/extensions/time-from": seekedfrom,
              "https://w3id.org/xapi/video/extensions/time-to": seekedto,
              "https://w3id.org/xapi/video/extensions/progress": self.progress,
              "https://w3id.org/xapi/video/extensions/played-segments": self.played_segments
            }}
        };
        self.send(statement);
      },
      send_completed: function(time, progress) {
        var statement = {
          "verb": {
            "id": "http://adlnet.gov/xapi/verbs/completed",
            "description": "completed"
          },
          "result": {
            "completion": true,
            "success": true,
            "duration": "PT" + this.total_time + "S",
            "extensions": {
              "https://w3id.org/xapi/video/extensions/time": time,
              "https://w3id.org/xapi/video/extensions/progress": progress,
              "https://w3id.org/xapi/video/extensions/played-segments": this.played_segments
            }
          }
        };
        this.send(statement);
      },
      send_interacted: function(current_time, interacted) {
        var statement = {
          "verb": {
            "id": "http://adlnet.gov/expapi/verbs/interacted",
            "description": "interacted"
          },
          "result": {"extensions": {"https://w3id.org/xapi/video/extensions/time": current_time}},
          "interacted": interacted
        };
        this.send(statement);
      },
      start_played_segment: function(start_time) {
        this.played_segments_segment_start = start_time;
      },
      end_played_segment: function(end_time) {
        var arr;
        arr = (this.played_segments === "") ? [] : this.played_segments.split("[,]");
        arr.push(this.played_segments_segment_start + "[.]" + end_time);
        this.played_segments = arr.join("[,]");
        this.played_segments_segment_end = end_time;
      },
      format_float: function(number) {
        number = parseFloat(number);
        return parseFloat(number.toFixed(3));
      },
      get_title: function() {
        if (paella.player.videoLoader.getMetadata().i18nTitle) {
          this.title = paella.player.videoLoader.getMetadata().i18nTitle;
        } else if (paella.player.videoLoader.getMetadata().title) {
          this.title = paella.player.videoLoader.getMetadata().title;
        }
      },
      get_description: function() {
        if (paella.player.videoLoader.getMetadata().i18nTitle) {
          this.description = paella.player.videoLoader.getMetadata().i18nDescription;
        } else {
          this.description = paella.player.videoLoader.getMetadata().description;
        }
      },
      get_progress: function(currentTime, duration) {
        var arr,
            arr2;
        arr = (this.played_segments === "") ? [] : this.played_segments.split("[,]");
        if (this.played_segments_segment_start != null) {
          arr.push(this.played_segments_segment_start + "[.]" + currentTime);
        }
        arr2 = [];
        arr.forEach(function(v, i) {
          arr2[i] = v.split("[.]");
          arr2[i][0] *= 1;
          arr2[i][1] *= 1;
        });
        arr2.sort(function(a, b) {
          return a[0] - b[0];
        });
        arr2.forEach(function(v, i) {
          if (i > 0) {
            if (arr2[i][0] < arr2[i - 1][1]) {
              arr2[i][0] = arr2[i - 1][1];
              if (arr2[i][0] > arr2[i][1])
                arr2[i][1] = arr2[i][0];
            }
          }
        });
        var progress_length = 0;
        arr2.forEach(function(v, i) {
          if (v[1] > v[0])
            progress_length += v[1] - v[0];
        });
        var progress = 1 * (progress_length / duration).toFixed(2);
        return progress;
      }
    }, {}, $__super);
  }(paella.userTracking.SaverPlugIn);
});

"use strict";
paella.setMonostreamProfile(function() {
  return new Promise(function(resolve, reject) {
    resolve({
      id: "monostream",
      name: {es: "Monostream"},
      hidden: true,
      icon: "",
      videos: [{
        content: "presenter",
        visible: true,
        layer: 1,
        rect: [{
          aspectRatio: "1/1",
          left: 280,
          top: 0,
          width: 720,
          height: 720
        }, {
          aspectRatio: "6/5",
          left: 208,
          top: 0,
          width: 864,
          height: 720
        }, {
          aspectRatio: "5/4",
          left: 190,
          top: 0,
          width: 900,
          height: 720
        }, {
          aspectRatio: "4/3",
          left: 160,
          top: 0,
          width: 960,
          height: 720
        }, {
          aspectRatio: "11/8",
          left: 145,
          top: 0,
          width: 990,
          height: 720
        }, {
          aspectRatio: "1.41/1",
          left: 132,
          top: 0,
          width: 1015,
          height: 720
        }, {
          aspectRatio: "1.43/1",
          left: 125,
          top: 0,
          width: 1029,
          height: 720
        }, {
          aspectRatio: "3/2",
          left: 100,
          top: 0,
          width: 1080,
          height: 720
        }, {
          aspectRatio: "16/10",
          left: 64,
          top: 0,
          width: 1152,
          height: 720
        }, {
          aspectRatio: "5/3",
          left: 40,
          top: 0,
          width: 1200,
          height: 720
        }, {
          aspectRatio: "16/9",
          left: 0,
          top: 0,
          width: 1280,
          height: 720
        }, {
          aspectRatio: "1.85/1",
          left: 0,
          top: 14,
          width: 1280,
          height: 692
        }, {
          aspectRatio: "2.35/1",
          left: 0,
          top: 87,
          width: 1280,
          height: 544
        }, {
          aspectRatio: "2.41/1",
          left: 0,
          top: 94,
          width: 1280,
          height: 531
        }, {
          aspectRatio: "2.76/1",
          left: 0,
          top: 128,
          width: 1280,
          height: 463
        }]
      }],
      logos: [{
        content: "paella_logo.png",
        zIndex: 5,
        rect: {
          top: 10,
          left: 10,
          width: 49,
          height: 42
        }
      }]
    });
  });
});
paella.addPlugin(function() {
  return function($__super) {
    function SingleStreamProfilePlugin() {
      $traceurRuntime.superConstructor(SingleStreamProfilePlugin).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(SingleStreamProfilePlugin, {
      getName: function() {
        return "es.upv.paella.singleStreamProfilePlugin";
      },
      checkEnabled: function(onSuccess) {
        var config = this.config;
        config.videoSets.forEach(function(videoSet, index) {
          var validContent = videoSet.content;
          if (validContent.length == 1) {
            var streamCount = 0;
            paella.player.videoContainer.streamProvider.videoStreams.forEach(function(v) {
              if (validContent.indexOf(v.content) != -1) {
                streamCount++;
              }
            });
            if (streamCount >= 1) {
              onSuccess(true);
              paella.addProfile(function() {
                return new Promise(function(resolve, reject) {
                  resolve({
                    id: videoSet.id,
                    name: {es: "Un stream"},
                    hidden: false,
                    icon: videoSet.icon,
                    videos: [{
                      content: validContent[0],
                      rect: [{
                        aspectRatio: "1/1",
                        left: 280,
                        top: 0,
                        width: 720,
                        height: 720
                      }, {
                        aspectRatio: "6/5",
                        left: 208,
                        top: 0,
                        width: 864,
                        height: 720
                      }, {
                        aspectRatio: "5/4",
                        left: 190,
                        top: 0,
                        width: 900,
                        height: 720
                      }, {
                        aspectRatio: "4/3",
                        left: 160,
                        top: 0,
                        width: 960,
                        height: 720
                      }, {
                        aspectRatio: "11/8",
                        left: 145,
                        top: 0,
                        width: 990,
                        height: 720
                      }, {
                        aspectRatio: "1.41/1",
                        left: 132,
                        top: 0,
                        width: 1015,
                        height: 720
                      }, {
                        aspectRatio: "1.43/1",
                        left: 125,
                        top: 0,
                        width: 1029,
                        height: 720
                      }, {
                        aspectRatio: "3/2",
                        left: 100,
                        top: 0,
                        width: 1080,
                        height: 720
                      }, {
                        aspectRatio: "16/10",
                        left: 64,
                        top: 0,
                        width: 1152,
                        height: 720
                      }, {
                        aspectRatio: "5/3",
                        left: 40,
                        top: 0,
                        width: 1200,
                        height: 720
                      }, {
                        aspectRatio: "16/9",
                        left: 0,
                        top: 0,
                        width: 1280,
                        height: 720
                      }, {
                        aspectRatio: "1.85/1",
                        left: 0,
                        top: 14,
                        width: 1280,
                        height: 692
                      }, {
                        aspectRatio: "2.35/1",
                        left: 0,
                        top: 87,
                        width: 1280,
                        height: 544
                      }, {
                        aspectRatio: "2.41/1",
                        left: 0,
                        top: 94,
                        width: 1280,
                        height: 531
                      }, {
                        aspectRatio: "2.76/1",
                        left: 0,
                        top: 128,
                        width: 1280,
                        height: 463
                      }],
                      visible: true,
                      layer: 1
                    }],
                    background: {
                      content: "slide_professor_paella.jpg",
                      zIndex: 5,
                      rect: {
                        left: 0,
                        top: 0,
                        width: 1280,
                        height: 720
                      },
                      visible: true,
                      layer: 0
                    },
                    logos: [{
                      content: "paella_logo.png",
                      zIndex: 5,
                      rect: {
                        top: 10,
                        left: 10,
                        width: 49,
                        height: 42
                      }
                    }],
                    buttons: [],
                    onApply: function() {}
                  });
                });
              });
            } else {
              onSuccess(false);
            }
          }
        });
      }
    }, {}, $__super);
  }(paella.EventDrivenPlugin);
});
paella.addPlugin(function() {
  return function($__super) {
    function DualStreamProfilePlugin() {
      $traceurRuntime.superConstructor(DualStreamProfilePlugin).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(DualStreamProfilePlugin, {
      getName: function() {
        return "es.upv.paella.dualStreamProfilePlugin";
      },
      checkEnabled: function(onSuccess) {
        var config = this.config;
        config.videoSets.forEach(function(videoSet, index) {
          var validContent = videoSet.content;
          if (validContent.length == 2) {
            var streamCount = 0;
            paella.player.videoContainer.streamProvider.videoStreams.forEach(function(v) {
              if (validContent.indexOf(v.content) != -1) {
                streamCount++;
              }
            });
            if (streamCount >= 2) {
              onSuccess(true);
              paella.addProfile(function() {
                return new Promise(function(resolve, reject) {
                  resolve({
                    id: videoSet.id,
                    name: {es: "Dos streams con posición dinámica"},
                    hidden: false,
                    icon: videoSet.icon,
                    videos: [{
                      content: validContent[0],
                      rect: [{
                        aspectRatio: "16/9",
                        left: 712,
                        top: 302,
                        width: 560,
                        height: 315
                      }, {
                        aspectRatio: "16/10",
                        left: 712,
                        top: 267,
                        width: 560,
                        height: 350
                      }, {
                        aspectRatio: "4/3",
                        left: 712,
                        top: 198,
                        width: 560,
                        height: 420
                      }, {
                        aspectRatio: "5/3",
                        left: 712,
                        top: 281,
                        width: 560,
                        height: 336
                      }, {
                        aspectRatio: "5/4",
                        left: 712,
                        top: 169,
                        width: 560,
                        height: 448
                      }],
                      visible: true,
                      layer: 1
                    }, {
                      content: validContent[1],
                      rect: [{
                        aspectRatio: "16/9",
                        left: 10,
                        top: 225,
                        width: 695,
                        height: 390
                      }, {
                        aspectRatio: "16/10",
                        left: 10,
                        top: 183,
                        width: 695,
                        height: 434
                      }, {
                        aspectRatio: "4/3",
                        left: 10,
                        top: 96,
                        width: 695,
                        height: 521
                      }, {
                        aspectRatio: "5/3",
                        left: 10,
                        top: 200,
                        width: 695,
                        height: 417
                      }, {
                        aspectRatio: "5/4",
                        left: 10,
                        top: 62,
                        width: 695,
                        height: 556
                      }],
                      visible: true,
                      layer: "1"
                    }],
                    background: {
                      content: "slide_professor_paella.jpg",
                      zIndex: 5,
                      rect: {
                        left: 0,
                        top: 0,
                        width: 1280,
                        height: 720
                      },
                      visible: true,
                      layer: 0
                    },
                    logos: [{
                      content: "paella_logo.png",
                      zIndex: 5,
                      rect: {
                        top: 10,
                        left: 10,
                        width: 49,
                        height: 42
                      }
                    }],
                    buttons: [{
                      rect: {
                        left: 682,
                        top: 565,
                        width: 45,
                        height: 45
                      },
                      onClick: function(event) {
                        this.switch();
                      },
                      label: "Switch",
                      icon: "icon_rotate.svg",
                      layer: 2
                    }, {
                      rect: {
                        left: 682,
                        top: 515,
                        width: 45,
                        height: 45
                      },
                      onClick: function(event) {
                        this.switchMinimize();
                      },
                      label: "Minimize",
                      icon: "minimize.svg",
                      layer: 2
                    }],
                    onApply: function() {},
                    switch: function() {
                      var v0 = this.videos[0].content;
                      var v1 = this.videos[1].content;
                      this.videos[0].content = v1;
                      this.videos[1].content = v0;
                      paella.profiles.placeVideos();
                    },
                    switchMinimize: function() {
                      if (this.minimized) {
                        this.minimized = false;
                        this.videos = [{
                          content: validContent[0],
                          rect: [{
                            aspectRatio: "16/9",
                            left: 712,
                            top: 302,
                            width: 560,
                            height: 315
                          }, {
                            aspectRatio: "16/10",
                            left: 712,
                            top: 267,
                            width: 560,
                            height: 350
                          }, {
                            aspectRatio: "4/3",
                            left: 712,
                            top: 198,
                            width: 560,
                            height: 420
                          }, {
                            aspectRatio: "5/3",
                            left: 712,
                            top: 281,
                            width: 560,
                            height: 336
                          }, {
                            aspectRatio: "5/4",
                            left: 712,
                            top: 169,
                            width: 560,
                            height: 448
                          }],
                          visible: true,
                          layer: 1
                        }, {
                          content: validContent[1],
                          rect: [{
                            aspectRatio: "16/9",
                            left: 10,
                            top: 225,
                            width: 695,
                            height: 390
                          }, {
                            aspectRatio: "16/10",
                            left: 10,
                            top: 183,
                            width: 695,
                            height: 434
                          }, {
                            aspectRatio: "4/3",
                            left: 10,
                            top: 96,
                            width: 695,
                            height: 521
                          }, {
                            aspectRatio: "5/3",
                            left: 10,
                            top: 200,
                            width: 695,
                            height: 417
                          }, {
                            aspectRatio: "5/4",
                            left: 10,
                            top: 62,
                            width: 695,
                            height: 556
                          }],
                          visible: true,
                          layer: 2
                        }];
                        this.buttons = [{
                          rect: {
                            left: 682,
                            top: 565,
                            width: 45,
                            height: 45
                          },
                          onClick: function(event) {
                            this.switch();
                          },
                          label: "Switch",
                          icon: "icon_rotate.svg",
                          layer: 2
                        }, {
                          rect: {
                            left: 682,
                            top: 515,
                            width: 45,
                            height: 45
                          },
                          onClick: function(event) {
                            this.switchMinimize();
                          },
                          label: "Minimize",
                          icon: "minimize.svg",
                          layer: 2
                        }];
                      } else {
                        this.minimized = true;
                        this.videos = [{
                          content: validContent[0],
                          rect: [{
                            aspectRatio: "16/9",
                            left: 0,
                            top: 0,
                            width: 1280,
                            height: 720
                          }, {
                            aspectRatio: "16/10",
                            left: 64,
                            top: 0,
                            width: 1152,
                            height: 720
                          }, {
                            aspectRatio: "5/3",
                            left: 40,
                            top: 0,
                            width: 1200,
                            height: 720
                          }, {
                            aspectRatio: "5/4",
                            left: 190,
                            top: 0,
                            width: 900,
                            height: 720
                          }, {
                            aspectRatio: "4/3",
                            left: 160,
                            top: 0,
                            width: 960,
                            height: 720
                          }],
                          visible: true,
                          layer: 1
                        }, {
                          content: validContent[1],
                          rect: [{
                            aspectRatio: "16/9",
                            left: 50,
                            top: 470,
                            width: 350,
                            height: 197
                          }, {
                            aspectRatio: "16/10",
                            left: 50,
                            top: 448,
                            width: 350,
                            height: 219
                          }, {
                            aspectRatio: "5/3",
                            left: 50,
                            top: 457,
                            width: 350,
                            height: 210
                          }, {
                            aspectRatio: "5/4",
                            left: 50,
                            top: 387,
                            width: 350,
                            height: 280
                          }, {
                            aspectRatio: "4/3",
                            left: 50,
                            top: 404,
                            width: 350,
                            height: 262
                          }],
                          visible: true,
                          layer: 2
                        }];
                        this.buttons = [{
                          rect: {
                            left: 388,
                            top: 465,
                            width: 45,
                            height: 45
                          },
                          onClick: function(event) {
                            this.switch();
                          },
                          label: "Switch",
                          icon: "icon_rotate.svg",
                          layer: 2
                        }, {
                          rect: {
                            left: 388,
                            top: 415,
                            width: 45,
                            height: 45
                          },
                          onClick: function(event) {
                            this.switchMinimize();
                          },
                          label: "Switch",
                          icon: "minimize.svg",
                          layer: 2
                        }];
                      }
                      paella.profiles.placeVideos();
                    }
                  });
                });
              });
            } else {
              onSuccess(false);
            }
          }
        });
      }
    }, {}, $__super);
  }(paella.EventDrivenPlugin);
});
paella.addPlugin(function() {
  return function($__super) {
    function TripleStreamProfilePlugin() {
      $traceurRuntime.superConstructor(TripleStreamProfilePlugin).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(TripleStreamProfilePlugin, {
      getName: function() {
        return "es.upv.paella.tripleStreamProfilePlugin";
      },
      checkEnabled: function(onSuccess) {
        var config = this.config;
        config.videoSets.forEach(function(videoSet, index) {
          var validContent = videoSet.content;
          if (validContent.length == 3) {
            var streamCount = 0;
            paella.player.videoContainer.streamProvider.videoStreams.forEach(function(v) {
              if (validContent.indexOf(v.content) != -1) {
                streamCount++;
              }
            });
            if (streamCount >= 3) {
              onSuccess(true);
              paella.addProfile(function() {
                return new Promise(function(resolve, reject) {
                  resolve({
                    id: videoSet.id,
                    name: {es: "Tres streams posición dinámica"},
                    hidden: false,
                    icon: videoSet.icon,
                    videos: [{
                      content: validContent[0],
                      rect: [{
                        aspectRatio: "16/9",
                        left: 239,
                        top: 17,
                        width: 803,
                        height: 451
                      }],
                      visible: true,
                      layer: 1
                    }, {
                      content: validContent[1],
                      rect: [{
                        aspectRatio: "16/9",
                        left: 44,
                        top: 482,
                        width: 389,
                        height: 218
                      }],
                      visible: true,
                      layer: 1
                    }, {
                      content: validContent[2],
                      rect: [{
                        aspectRatio: "16/9",
                        left: 847,
                        top: 482,
                        width: 389,
                        height: 218
                      }],
                      visible: true,
                      layer: 1
                    }],
                    background: {
                      content: "slide_professor_paella.jpg",
                      zIndex: 5,
                      rect: {
                        left: 0,
                        top: 0,
                        width: 1280,
                        height: 720
                      },
                      visible: true,
                      layer: 0
                    },
                    logos: [{
                      content: "paella_logo.png",
                      zIndex: 5,
                      rect: {
                        top: 10,
                        left: 10,
                        width: 49,
                        height: 42
                      }
                    }],
                    buttons: [{
                      rect: {
                        left: 618,
                        top: 495,
                        width: 45,
                        height: 45
                      },
                      onClick: function(event) {
                        this.rotate();
                      },
                      label: "Rotate",
                      icon: "icon_rotate.svg",
                      layer: 2
                    }],
                    onApply: function() {},
                    rotate: function() {
                      var v0 = this.videos[0].content;
                      var v1 = this.videos[1].content;
                      var v2 = this.videos[2].content;
                      this.videos[0].content = v2;
                      this.videos[1].content = v0;
                      this.videos[2].content = v1;
                      paella.profiles.placeVideos();
                    }
                  });
                });
              });
            } else {
              onSuccess(false);
            }
          }
        });
      }
    }, {}, $__super);
  }(paella.EventDrivenPlugin);
});
paella.addProfile(function() {
  return new Promise(function(resolve, reject) {
    paella.events.bind(paella.events.videoReady, function() {
      var available = paella.player.videoContainer.streamProvider.videoStreams.some(function(v) {
        return v.content == "blackboard";
      });
      if (!available) {
        resolve(null);
      } else {
        resolve({
          id: "blackboard_video_stream",
          name: {es: "Pizarra"},
          hidden: false,
          icon: "s_p_blackboard.svg",
          videos: [{
            content: "presentation",
            rect: [{
              aspectRatio: "16/9",
              left: 10,
              top: 70,
              width: 432,
              height: 243
            }],
            visible: true,
            layer: 1
          }, {
            content: "blackboard",
            rect: [{
              aspectRatio: "16/9",
              left: 450,
              top: 135,
              width: 816,
              height: 459
            }],
            visible: true,
            layer: 1
          }, {
            content: "presenter",
            rect: [{
              aspectRatio: "16/9",
              left: 10,
              top: 325,
              width: 432,
              height: 324
            }],
            visible: true,
            layer: 1
          }],
          background: {
            content: "slide_professor_paella.jpg",
            zIndex: 5,
            rect: {
              left: 0,
              top: 0,
              width: 1280,
              height: 720
            },
            visible: true,
            layer: 0
          },
          logos: [{
            content: "paella_logo.png",
            zIndex: 5,
            rect: {
              top: 10,
              left: 10,
              width: 49,
              height: 42
            }
          }],
          buttons: [{
            rect: {
              left: 422,
              top: 295,
              width: 45,
              height: 45
            },
            onClick: function(event) {
              this.rotate();
            },
            label: "Rotate",
            icon: "icon_rotate.svg",
            layer: 2
          }],
          rotate: function() {
            var v0 = this.videos[0].content;
            var v1 = this.videos[1].content;
            var v2 = this.videos[2].content;
            this.videos[0].content = v2;
            this.videos[1].content = v0;
            this.videos[2].content = v1;
            paella.profiles.placeVideos();
          }
        });
      }
    });
  });
});
paella.addProfile(function() {
  return new Promise(function(resolve, reject) {
    paella.events.bind(paella.events.videoReady, function() {
      var n = paella.player.videoContainer.sourceData[0].sources;
      if (!n.chroma) {
        resolve(null);
      } else {
        resolve({
          id: "chroma",
          name: {es: "Polimedia"},
          hidden: false,
          icon: "chroma.svg",
          videos: [{
            content: "presenter",
            rect: [{
              aspectRatio: "16/9",
              left: 0,
              top: 0,
              width: 1280,
              height: 720
            }, {
              aspectRatio: "16/10",
              left: 64,
              top: 0,
              width: 1152,
              height: 720
            }, {
              aspectRatio: "5/3",
              left: 40,
              top: 0,
              width: 1200,
              height: 720
            }, {
              aspectRatio: "5/4",
              left: 190,
              top: 0,
              width: 900,
              height: 720
            }, {
              aspectRatio: "4/3",
              left: 160,
              top: 0,
              width: 960,
              height: 720
            }],
            visible: "true",
            layer: "1"
          }, {
            content: "presentation",
            rect: [{
              aspectRatio: "16/9",
              left: 0,
              top: 0,
              width: 1280,
              height: 720
            }, {
              aspectRatio: "16/10",
              left: 64,
              top: 0,
              width: 1152,
              height: 720
            }, {
              aspectRatio: "5/3",
              left: 40,
              top: 0,
              width: 1200,
              height: 720
            }, {
              aspectRatio: "5/4",
              left: 190,
              top: 0,
              width: 900,
              height: 720
            }, {
              aspectRatio: "4/3",
              left: 160,
              top: 0,
              width: 960,
              height: 720
            }],
            visible: "true",
            layer: "0"
          }],
          background: {
            content: "default_background_paella.jpg",
            zIndex: 5,
            rect: {
              left: 0,
              top: 0,
              width: 1280,
              height: 720
            },
            visible: "true",
            layer: "0"
          },
          logos: [{
            content: "paella_logo.png",
            zIndex: 5,
            rect: {
              top: 10,
              left: 10,
              width: 49,
              height: 42
            }
          }]
        });
      }
    });
  });
});

"use strict";
paella.plugins.TrimmingTrackPlugin = Class.create(paella.editor.MainTrackPlugin, {
  trimmingTrack: null,
  trimmingData: {
    s: 0,
    e: 0
  },
  getTrackItems: function() {
    if (this.trimmingTrack == null) {
      this.trimmingTrack = {
        id: 1,
        s: 0,
        e: 0
      };
      this.trimmingTrack.s = paella.player.videoContainer.trimStart();
      this.trimmingTrack.e = paella.player.videoContainer.trimEnd();
      this.trimmingData.s = this.trimmingTrack.s;
      this.trimmingData.e = this.trimmingTrack.e;
    }
    var tracks = [];
    tracks.push(this.trimmingTrack);
    return tracks;
  },
  getName: function() {
    return "es.upv.paella.editor.trimmingTrackPlugin";
  },
  getTools: function() {
    if (this.config.enableResetButton) {
      return [{
        name: 'reset',
        label: base.dictionary.translate('Reset'),
        hint: base.dictionary.translate('Resets the trimming bar to the default length of the video.')
      }];
    }
  },
  onToolSelected: function(toolName) {
    if (this.config.enableResetButton) {
      if (toolName == 'reset') {
        this.trimmingTrack = {
          id: 1,
          s: 0,
          e: 0
        };
        this.trimmingTrack.s = 0;
        this.trimmingTrack.e = paella.player.videoContainer.duration(true);
        return true;
      }
    }
  },
  getTrackName: function() {
    return base.dictionary.translate("Trimming");
  },
  getColor: function() {
    return 'rgb(0, 51, 107)';
  },
  onSave: function(onDone) {
    paella.player.videoContainer.enableTrimming();
    paella.player.videoContainer.setTrimmingStart(this.trimmingTrack.s);
    paella.player.videoContainer.setTrimmingEnd(this.trimmingTrack.e);
    this.trimmingData.s = this.trimmingTrack.s;
    this.trimmingData.e = this.trimmingTrack.e;
    paella.data.write('trimming', {id: paella.initDelegate.getId()}, {
      start: this.trimmingTrack.s,
      end: this.trimmingTrack.e
    }, function(data, status) {
      onDone(status);
    });
  },
  onDiscard: function(onDone) {
    this.trimmingTrack.s = this.trimmingData.s;
    this.trimmingTrack.e = this.trimmingData.e;
    onDone(true);
  },
  allowDrag: function() {
    return false;
  },
  onTrackChanged: function(id, start, end) {
    playerEnd = paella.player.videoContainer.duration(true);
    start = (start < 0) ? 0 : start;
    end = (end > playerEnd) ? playerEnd : end;
    this.trimmingTrack.s = start;
    this.trimmingTrack.e = end;
    this.parent(id, start, end);
  },
  contextHelpString: function() {
    if (base.dictionary.currentLanguage() == "es") {
      return "Utiliza la herramienta de recorte para definir el instante inicial y el instante final de la clase. Para cambiar la duración solo hay que arrastrar el inicio o el final de la pista \"Recorte\", en la linea de tiempo.";
    } else {
      return "Use this tool to define the start and finish time.";
    }
  }
});
paella.plugins.trimmingTrackPlugin = new paella.plugins.TrimmingTrackPlugin();

"use strict";
paella.addPlugin(function() {
  return function($__super) {
    function TrimmingLoaderPlugin() {
      $traceurRuntime.superConstructor(TrimmingLoaderPlugin).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(TrimmingLoaderPlugin, {
      getName: function() {
        return "es.upv.paella.trimmingPlayerPlugin";
      },
      getEvents: function() {
        return [paella.events.controlBarLoaded, paella.events.showEditor, paella.events.hideEditor];
      },
      onEvent: function(eventType, params) {
        switch (eventType) {
          case paella.events.controlBarLoaded:
            this.loadTrimming();
            break;
          case paella.events.showEditor:
            paella.player.videoContainer.disableTrimming();
            break;
          case paella.events.hideEditor:
            if (paella.player.config.trimming && paella.player.config.trimming.enabled) {
              paella.player.videoContainer.enableTrimming();
            }
            break;
        }
      },
      loadTrimming: function() {
        var videoId = paella.initDelegate.getId();
        paella.data.read('trimming', {id: videoId}, function(data, status) {
          if (data && status && data.end > 0) {
            paella.player.videoContainer.setTrimming(data.start, data.end).then(function() {
              return paella.player.videoContainer.enableTrimming();
            });
          } else {
            var startTime = base.parameters.get('start');
            var endTime = base.parameters.get('end');
            if (startTime && endTime) {
              paella.player.videoContainer.setTrimming(startTime, endTime).then(function() {
                return paella.player.videoContainer.enableTrimming();
              });
            }
          }
        });
      }
    }, {}, $__super);
  }(paella.EventDrivenPlugin);
});

"use strict";
paella.addPlugin(function() {
  return function($__super) {
    function AirPlayPlugin() {
      $traceurRuntime.superConstructor(AirPlayPlugin).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(AirPlayPlugin, {
      getIndex: function() {
        return 552;
      },
      getAlignment: function() {
        return 'right';
      },
      getSubclass: function() {
        return "AirPlayButton";
      },
      getIconClass: function() {
        return 'icon-airplay';
      },
      getName: function() {
        return "es.upv.paella.airPlayPlugin";
      },
      checkEnabled: function(onSuccess) {
        this._visible = false;
        onSuccess(window.WebKitPlaybackTargetAvailabilityEvent);
      },
      getDefaultToolTip: function() {
        return base.dictionary.translate("Emit to AirPlay.");
      },
      setup: function() {
        var $__1 = this;
        var video = paella.player.videoContainer.masterVideo().video;
        if (window.WebKitPlaybackTargetAvailabilityEvent) {
          video.addEventListener('webkitplaybacktargetavailabilitychanged', function(event) {
            switch (event.availability) {
              case "available":
                $__1._visible = true;
                break;
              case "not-available":
                $__1._visible = false;
                break;
            }
            $__1.updateClassName();
          });
        }
      },
      action: function(button) {
        var video = paella.player.videoContainer.masterVideo().video;
        video.webkitShowPlaybackTargetPicker();
      },
      updateClassName: function() {
        this.button.className = this.getButtonItemClass(true);
      },
      getButtonItemClass: function(selected) {
        return 'buttonPlugin ' + this.getSubclass() + " " + this.getAlignment() + " " + (this._visible ? "available" : "not-available");
      }
    }, {}, $__super);
  }(paella.ButtonPlugin);
});

"use strict";
paella.addPlugin(function() {
  return function($__super) {
    function ArrowSlidesNavigator() {
      $traceurRuntime.superConstructor(ArrowSlidesNavigator).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(ArrowSlidesNavigator, {
      getName: function() {
        return "es.upv.paella.arrowSlidesNavigatorPlugin";
      },
      checkEnabled: function(onSuccess) {
        if (!paella.initDelegate.initParams.videoLoader.frameList || Object.keys(paella.initDelegate.initParams.videoLoader.frameList).length == 0 || paella.player.videoContainer.isMonostream) {
          onSuccess(false);
        } else {
          onSuccess(true);
        }
      },
      setup: function() {
        var self = this;
        this._showArrowsIn = this.config.showArrowsIn || 'slave';
        this.createOverlay();
        self._frames = [];
        var frames = paella.initDelegate.initParams.videoLoader.frameList;
        var numFrames;
        if (frames) {
          var framesKeys = Object.keys(frames);
          numFrames = framesKeys.length;
          framesKeys.map(function(i) {
            return Number(i, 10);
          }).sort(function(a, b) {
            return a - b;
          }).forEach(function(key) {
            self._frames.push(frames[key]);
          });
        }
      },
      createOverlay: function() {
        var self = this;
        var overlayContainer = paella.player.videoContainer.overlayContainer;
        if (!this.arrows) {
          this.arrows = document.createElement('div');
          this.arrows.id = "arrows";
          this.arrows.style.marginTop = "25%";
          var arrowNext = document.createElement('div');
          arrowNext.className = "buttonPlugin arrowSlideNavidator nextButton right icon-next2";
          this.arrows.appendChild(arrowNext);
          var arrowPrev = document.createElement('div');
          arrowPrev.className = "buttonPlugin arrowSlideNavidator prevButton left icon-previous2";
          this.arrows.appendChild(arrowPrev);
          $(arrowNext).click(function(e) {
            self.goNextSlide();
            e.stopPropagation();
          });
          $(arrowPrev).click(function(e) {
            self.goPrevSlide();
            e.stopPropagation();
          });
        }
        if (this.container) {
          overlayContainer.removeElement(this.container);
        }
        var rect = null;
        var element = null;
        switch (self._showArrowsIn) {
          case 'full':
            this.container = overlayContainer.addLayer();
            this.container.style.marginRight = "0";
            this.container.style.marginLeft = "0";
            this.arrows.style.marginTop = "25%";
            break;
          case 'master':
            element = document.createElement('div');
            rect = overlayContainer.getVideoRect(0);
            this.container = overlayContainer.addElement(element, rect);
            this.visible = rect.visible;
            this.arrows.style.marginTop = "23%";
            break;
          case 'slave':
            element = document.createElement('div');
            rect = overlayContainer.getVideoRect(1);
            this.container = overlayContainer.addElement(element, rect);
            this.visible = rect.visible;
            this.arrows.style.marginTop = "35%";
            break;
        }
        this.container.appendChild(this.arrows);
        this.hideArrows();
      },
      getCurrentRange: function() {
        var $__2 = this;
        return new Promise(function(resolve) {
          if ($__2._frames.length < 1) {
            resolve(null);
          } else {
            var trimming = null;
            var duration = 0;
            paella.player.videoContainer.duration().then(function(d) {
              duration = d;
              return paella.player.videoContainer.trimming();
            }).then(function(t) {
              trimming = t;
              return paella.player.videoContainer.currentTime();
            }).then(function(currentTime) {
              if (!$__2._frames.some(function(f1, i, array) {
                if (i + 1 == array.length) {
                  return;
                }
                var f0 = i == 0 ? f1 : $__2._frames[i - 1];
                var f2 = $__2._frames[i + 1];
                var t0 = trimming.enabled ? f0.time - trimming.start : f0.time;
                var t1 = trimming.enabled ? f1.time - trimming.start : f1.time;
                var t2 = trimming.enabled ? f2.time - trimming.start : f2.time;
                if ((t1 < currentTime && t2 > currentTime) || t1 == currentTime) {
                  var range = {
                    prev: t0,
                    next: t2
                  };
                  if (t0 < 0) {
                    range.prev = t1 > 0 ? t1 : 0;
                  }
                  resolve(range);
                  return true;
                }
              })) {
                var t0 = $__2._frames[$__2._frames.length - 2].time;
                var t1 = $__2._frames[$__2._frames.length - 1].time;
                resolve({
                  prev: trimming.enabled ? t0 - trimming.start : t0,
                  next: trimming.enabled ? t1 - trimming.start : t1
                });
              }
            });
          }
        });
      },
      goNextSlide: function() {
        var self = this;
        var trimming;
        this.getCurrentRange().then(function(range) {
          return paella.player.videoContainer.seekToTime(range.next);
        }).then(function() {
          paella.player.videoContainer.play();
        });
      },
      goPrevSlide: function() {
        var self = this;
        var trimming = null;
        this.getCurrentRange().then(function(range) {
          return paella.player.videoContainer.seekToTime(range.prev);
        }).then(function() {
          paella.player.videoContainer.play();
        });
      },
      showArrows: function() {
        if (this.visible)
          $(this.arrows).show();
      },
      hideArrows: function() {
        $(this.arrows).hide();
      },
      getEvents: function() {
        return [paella.events.controlBarDidShow, paella.events.controlBarDidHide, paella.events.setComposition];
      },
      onEvent: function(eventType, params) {
        var self = this;
        switch (eventType) {
          case paella.events.controlBarDidShow:
            this.showArrows();
            break;
          case paella.events.controlBarDidHide:
            this.hideArrows();
            break;
          case paella.events.setComposition:
            this.createOverlay();
            break;
        }
      }
    }, {}, $__super);
  }(paella.EventDrivenPlugin);
});

"use strict";
paella.addPlugin(function() {
  return function($__super) {
    function AudioSelector() {
      $traceurRuntime.superConstructor(AudioSelector).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(AudioSelector, {
      getAlignment: function() {
        return 'right';
      },
      getSubclass: function() {
        return "audioSelector";
      },
      getIconClass: function() {
        return 'icon-headphone';
      },
      getIndex: function() {
        return 2040;
      },
      getMinWindowSize: function() {
        return 400;
      },
      getName: function() {
        return "es.upv.paella.audioSelector";
      },
      getDefaultToolTip: function() {
        return base.dictionary.translate("Set audio stream");
      },
      closeOnMouseOut: function() {
        return true;
      },
      checkEnabled: function(onSuccess) {
        var $__1 = this;
        paella.player.videoContainer.getAudioTags().then(function(tags) {
          $__1._tags = tags;
          onSuccess(tags.length > 1);
        });
      },
      setup: function() {
        var $__1 = this;
        var This = this;
        this.setTagLabel();
        paella.events.bind(paella.events.audioTagChanged, function() {
          $__1.setTagLabel();
        });
      },
      getButtonType: function() {
        return paella.ButtonPlugin.type.popUpButton;
      },
      buildContent: function(domElement) {
        var $__1 = this;
        this._tags.forEach(function(tag) {
          domElement.appendChild($__1.getItemButton(tag));
        });
      },
      getItemButton: function(lang) {
        var elem = document.createElement('div');
        var currentTag = paella.player.videoContainer.audioTag;
        var label = paella.dictionary.translate(lang);
        elem.className = this.getButtonItemClass(label, lang == currentTag);
        elem.id = "audioTagSelectorItem_" + lang;
        elem.innerText = label;
        elem.data = lang;
        $(elem).click(function(event) {
          $('.videoAudioTrackItem').removeClass('selected');
          $('.videoAudioTrackItem.' + this.data).addClass('selected');
          paella.player.videoContainer.setAudioTag(this.data);
        });
        return elem;
      },
      setQualityLabel: function() {
        var This = this;
        paella.player.videoContainer.getCurrentQuality().then(function(q) {
          This.setText(q.shortLabel());
        });
      },
      getButtonItemClass: function(tag, selected) {
        return 'videoAudioTrackItem ' + tag + ((selected) ? ' selected' : '');
      },
      setTagLabel: function() {
        this.setText(paella.player.videoContainer.audioTag);
      }
    }, {}, $__super);
  }(paella.ButtonPlugin);
});

"use strict";
paella.addPlugin(function() {
  return function($__super) {
    function BlackBoard2() {
      $traceurRuntime.superConstructor(BlackBoard2).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(BlackBoard2, {
      getName: function() {
        return "es.upv.paella.blackBoardPlugin";
      },
      getIndex: function() {
        return 10;
      },
      getAlignment: function() {
        return 'right';
      },
      getSubclass: function() {
        return "blackBoardButton2";
      },
      getDefaultToolTip: function() {
        return base.dictionary.translate("BlackBoard");
      },
      checkEnabled: function(onSuccess) {
        this._blackBoardProfile = "s_p_blackboard2";
        this._blackBoardDIV = null;
        this._hasImages = null;
        this._active = false;
        this._creationTimer = 500;
        this._zImages = null;
        this._videoLength = null;
        this._keys = null;
        this._currentImage = null;
        this._next = null;
        this._prev = null;
        this._lensDIV = null;
        this._lensContainer = null;
        this._lensWidth = null;
        this._lensHeight = null;
        this._conImg = null;
        this._zoom = 250;
        this._currentZoom = null;
        this._maxZoom = 500;
        this._mousePos = null;
        this._containerRect = null;
        onSuccess(true);
      },
      getEvents: function() {
        return [paella.events.setProfile, paella.events.timeUpdate];
      },
      onEvent: function(event, params) {
        var self = this;
        switch (event) {
          case paella.events.setProfile:
            if (params.profileName != self._blackBoardProfile) {
              if (self._active) {
                self.destroyOverlay();
                self._active = false;
              }
              break;
            } else {
              if (!self._hasImages) {
                paella.player.setProfile("slide_professor");
              }
              if (self._hasImages && !self._active) {
                self.createOverlay();
                self._active = true;
              }
            }
            break;
          case paella.events.timeUpdate:
            if (self._active && self._hasImages) {
              self.imageUpdate(event, params);
            }
            break;
        }
      },
      setup: function() {
        var self = this;
        var n = paella.player.videoContainer.sourceData[0].sources;
        if (n.hasOwnProperty("image")) {
          self._hasImages = true;
          self._zImages = {};
          self._zImages = paella.player.videoContainer.sourceData[0].sources.image[0].frames;
          self._videoLength = paella.player.videoContainer.sourceData[0].sources.image[0].duration;
          self._keys = Object.keys(self._zImages);
          self._keys = self._keys.sort(function(a, b) {
            a = a.slice(6);
            b = b.slice(6);
            return parseInt(a) - parseInt(b);
          });
        } else {
          self._hasImages = false;
          if (paella.player.selectedProfile == self._blackBoardProfile) {
            var defaultprofile = paella.player.config.defaultProfile;
            paella.player.setProfile(defaultprofile);
          }
        }
        this._next = 0;
        this._prev = 0;
        if (paella.player.selectedProfile == self._blackBoardProfile) {
          self.createOverlay();
          self._active = true;
        }
        self._mousePos = {};
        paella.Profiles.loadProfile(self._blackBoardProfile, function(profileData) {
          self._containerRect = profileData.blackBoardImages;
        });
      },
      createLens: function() {
        var self = this;
        if (self._currentZoom == null) {
          self._currentZoom = self._zoom;
        }
        var lens = document.createElement("div");
        lens.className = "lensClass";
        self._lensDIV = lens;
        var p = $('.conImg').offset();
        var width = $('.conImg').width();
        var height = $('.conImg').height();
        lens.style.width = (width / (self._currentZoom / 100)) + "px";
        lens.style.height = (height / (self._currentZoom / 100)) + "px";
        self._lensWidth = parseInt(lens.style.width);
        self._lensHeight = parseInt(lens.style.height);
        $(self._lensContainer).append(lens);
        $(self._lensContainer).mousemove(function(event) {
          var mouseX = (event.pageX - p.left);
          var mouseY = (event.pageY - p.top);
          self._mousePos.x = mouseX;
          self._mousePos.y = mouseY;
          var lensTop = (mouseY - self._lensHeight / 2);
          lensTop = (lensTop < 0) ? 0 : lensTop;
          lensTop = (lensTop > (height - self._lensHeight)) ? (height - self._lensHeight) : lensTop;
          var lensLeft = (mouseX - self._lensWidth / 2);
          lensLeft = (lensLeft < 0) ? 0 : lensLeft;
          lensLeft = (lensLeft > (width - self._lensWidth)) ? (width - self._lensWidth) : lensLeft;
          self._lensDIV.style.left = lensLeft + "px";
          self._lensDIV.style.top = lensTop + "px";
          if (self._currentZoom != 100) {
            var x = (lensLeft) * 100 / (width - self._lensWidth);
            var y = (lensTop) * 100 / (height - self._lensHeight);
            self._blackBoardDIV.style.backgroundPosition = x.toString() + '% ' + y.toString() + '%';
          } else if (self._currentZoom == 100) {
            var xRelative = mouseX * 100 / width;
            var yRelative = mouseY * 100 / height;
            self._blackBoardDIV.style.backgroundPosition = xRelative.toString() + '% ' + yRelative.toString() + '%';
          }
          self._blackBoardDIV.style.backgroundSize = self._currentZoom + '%';
        });
        $(self._lensContainer).bind('wheel mousewheel', function(e) {
          var delta;
          if (e.originalEvent.wheelDelta !== undefined) {
            delta = e.originalEvent.wheelDelta;
          } else {
            delta = e.originalEvent.deltaY * -1;
          }
          if (delta > 0 && self._currentZoom < self._maxZoom) {
            self.reBuildLens(10);
          } else if (self._currentZoom > 100) {
            self.reBuildLens(-10);
          } else if (self._currentZoom == 100) {
            self._lensDIV.style.left = 0 + "px";
            self._lensDIV.style.top = 0 + "px";
          }
          self._blackBoardDIV.style.backgroundSize = (self._currentZoom) + "%";
        });
      },
      reBuildLens: function(zoomValue) {
        var self = this;
        self._currentZoom += zoomValue;
        var p = $('.conImg').offset();
        var width = $('.conImg').width();
        var height = $('.conImg').height();
        self._lensDIV.style.width = (width / (self._currentZoom / 100)) + "px";
        self._lensDIV.style.height = (height / (self._currentZoom / 100)) + "px";
        self._lensWidth = parseInt(self._lensDIV.style.width);
        self._lensHeight = parseInt(self._lensDIV.style.height);
        if (self._currentZoom != 100) {
          var mouseX = self._mousePos.x;
          var mouseY = self._mousePos.y;
          var lensTop = (mouseY - self._lensHeight / 2);
          lensTop = (lensTop < 0) ? 0 : lensTop;
          lensTop = (lensTop > (height - self._lensHeight)) ? (height - self._lensHeight) : lensTop;
          var lensLeft = (mouseX - self._lensWidth / 2);
          lensLeft = (lensLeft < 0) ? 0 : lensLeft;
          lensLeft = (lensLeft > (width - self._lensWidth)) ? (width - self._lensWidth) : lensLeft;
          self._lensDIV.style.left = lensLeft + "px";
          self._lensDIV.style.top = lensTop + "px";
          var x = (lensLeft) * 100 / (width - self._lensWidth);
          var y = (lensTop) * 100 / (height - self._lensHeight);
          self._blackBoardDIV.style.backgroundPosition = x.toString() + '% ' + y.toString() + '%';
        }
      },
      destroyLens: function() {
        var self = this;
        if (self._lensDIV) {
          $(self._lensDIV).remove();
          self._blackBoardDIV.style.backgroundSize = 100 + '%';
          self._blackBoardDIV.style.opacity = 0;
        }
      },
      createOverlay: function() {
        var self = this;
        var blackBoardDiv = document.createElement("div");
        blackBoardDiv.className = "blackBoardDiv";
        self._blackBoardDIV = blackBoardDiv;
        self._blackBoardDIV.style.opacity = 0;
        var lensContainer = document.createElement("div");
        lensContainer.className = "lensContainer";
        self._lensContainer = lensContainer;
        var conImg = document.createElement("img");
        conImg.className = "conImg";
        self._conImg = conImg;
        if (self._currentImage) {
          self._conImg.src = self._currentImage;
          $(self._blackBoardDIV).css('background-image', 'url(' + self._currentImage + ')');
        }
        $(lensContainer).append(conImg);
        $(self._lensContainer).mouseenter(function() {
          self.createLens();
          self._blackBoardDIV.style.opacity = 1.0;
        });
        $(self._lensContainer).mouseleave(function() {
          self.destroyLens();
        });
        setTimeout(function() {
          var overlayContainer = paella.player.videoContainer.overlayContainer;
          overlayContainer.addElement(blackBoardDiv, overlayContainer.getVideoRect(0));
          overlayContainer.addElement(lensContainer, self._containerRect);
        }, self._creationTimer);
      },
      destroyOverlay: function() {
        var self = this;
        if (self._blackBoardDIV) {
          $(self._blackBoardDIV).remove();
        }
        if (self._lensContainer) {
          $(self._lensContainer).remove();
        }
      },
      imageUpdate: function(event, params) {
        var self = this;
        var sec = Math.round(params.currentTime);
        var src = $(self._blackBoardDIV).css('background-image');
        if ($(self._blackBoardDIV).length > 0) {
          if (self._zImages.hasOwnProperty("frame_" + sec)) {
            if (src == self._zImages["frame_" + sec]) {
              return;
            } else {
              src = self._zImages["frame_" + sec];
            }
          } else if (sec > self._next || sec < self._prev) {
            src = self.returnSrc(sec);
          } else {
            return;
          }
          var image = new Image();
          image.onload = function() {
            $(self._blackBoardDIV).css('background-image', 'url(' + src + ')');
          };
          image.src = src;
          self._currentImage = src;
          self._conImg.src = self._currentImage;
        }
      },
      returnSrc: function(sec) {
        var prev = 0;
        for (var i = 0; i < this._keys.length; i++) {
          var id = parseInt(this._keys[i].slice(6));
          var lastId = parseInt(this._keys[(this._keys.length - 1)].slice(6));
          if (sec < id) {
            this._next = id;
            this._prev = prev;
            this._imageNumber = i - 1;
            return this._zImages["frame_" + prev];
          } else if (sec > lastId && sec < this._videoLength) {
            this._next = this._videoLength;
            this._prev = lastId;
            return this._zImages["frame_" + prev];
          } else {
            prev = id;
          }
        }
      }
    }, {}, $__super);
  }(paella.EventDrivenPlugin);
});

"use strict";
paella.addPlugin(function() {
  return function($__super) {
    function BreaksPlayerPlugin() {
      $traceurRuntime.superConstructor(BreaksPlayerPlugin).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(BreaksPlayerPlugin, {
      get breaks() {
        return this._breaks || [];
      },
      set breaks(b) {
        this._breaks = b;
      },
      get lastEvent() {
        return this._lastEvent || 0;
      },
      set lastEvent(e) {
        this._lastEvent = e;
      },
      get visibleBreaks() {
        return this._visibleBreaks || [];
      },
      set visibleBreaks(v) {
        this._visibleBreaks = v;
      },
      getName: function() {
        return "es.upv.paella.breaksPlayerPlugin";
      },
      checkEnabled: function(onSuccess) {
        var This = this;
        paella.data.read('breaks', {id: paella.initDelegate.getId()}, function(data, status) {
          if (data && $traceurRuntime.typeof((data)) == 'object' && data.breaks && data.breaks.length > 0) {
            This.breaks = data.breaks;
          }
          onSuccess(true);
        });
      },
      getEvents: function() {
        return [paella.events.timeUpdate];
      },
      onEvent: function(eventType, params) {
        var thisClass = this;
        params.videoContainer.currentTime(true).then(function(currentTime) {
          thisClass.checkBreaks(currentTime);
        });
      },
      checkBreaks: function(currentTime) {
        var a;
        for (var i = 0; i < this.breaks.length; ++i) {
          a = this.breaks[i];
          if (a.s < currentTime && a.e > currentTime) {
            if (this.areBreaksClickable())
              this.avoidBreak(a);
            else
              this.showBreaks(a);
          } else if (a.s.toFixed(0) == currentTime.toFixed(0)) {
            this.avoidBreak(a);
          }
        }
        if (!this.areBreaksClickable()) {
          for (var key in this.visibleBreaks) {
            if ($traceurRuntime.typeof((a)) == 'object') {
              a = this.visibleBreaks[key];
              if (a && (a.s >= currentTime || a.e <= currentTime)) {
                this.removeBreak(a);
              }
            }
          }
        }
      },
      areBreaksClickable: function() {
        return this.config.neverShow && !(paella.editor.instance && paella.editor.instance.isLoaded);
      },
      showBreaks: function(br) {
        if (!this.visibleBreaks[br.s]) {
          var rect = {
            left: 100,
            top: 350,
            width: 1080,
            height: 40
          };
          var name = br.name || paella.dictionary.translate("Break");
          br.elem = paella.player.videoContainer.overlayContainer.addText(name, rect);
          br.elem.className = 'textBreak';
          this.visibleBreaks[br.s] = br;
        }
      },
      removeBreak: function(br) {
        if (this.visibleBreaks[br.s]) {
          var elem = this.visibleBreaks[br.s].elem;
          paella.player.videoContainer.overlayContainer.removeElement(elem);
          this.visibleBreaks[br.s] = null;
        }
      },
      avoidBreak: function(br) {
        var $__2 = this;
        var newTime;
        if (paella.player.videoContainer.trimEnabled()) {
          paella.player.videoContainer.trimming().then(function(trimming) {
            if (br.e >= trimming.end) {
              newTime = 0;
              paella.player.videoContainer.pause();
            } else {
              newTime = br.e + ($__2.config.neverShow ? 0.5 : 0) - trimming.start;
            }
            paella.player.videoContainer.seekToTime(newTime);
          });
        } else {
          paella.player.videoContainer.duration(true).then(function(duration) {
            if (br.e >= duration) {
              newTime = 0;
              paella.player.videoContainer.pause();
            } else {
              newTime = br.e + ($__2.config.neverShow ? 0.5 : 0);
            }
            paella.player.videoContainer.seekToTime(newTime);
          });
        }
      }
    }, {}, $__super);
  }(paella.EventDrivenPlugin);
});

"use strict";
paella.addPlugin(function() {
  return function($__super) {
    function DFXPParserPlugin() {
      $traceurRuntime.superConstructor(DFXPParserPlugin).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(DFXPParserPlugin, {
      get ext() {
        return ["dfxp"];
      },
      getName: function() {
        return "es.upv.paella.captions.DFXPParserPlugin";
      },
      parse: function(content, lang, next) {
        var captions = [];
        var self = this;
        var xml = $(content);
        var g_lang = xml.attr("xml:lang");
        var lls = xml.find("div");
        for (var idx = 0; idx < lls.length; ++idx) {
          var ll = $(lls[idx]);
          var l_lang = ll.attr("xml:lang");
          if ((l_lang == undefined) || (l_lang == "")) {
            if ((g_lang == undefined) || (g_lang == "")) {
              base.log.debug("No xml:lang found! Using '" + lang + "' lang instead.");
              l_lang = lang;
            } else {
              l_lang = g_lang;
            }
          }
          if (l_lang == lang) {
            ll.find("p").each(function(i, cap) {
              var c = {
                id: i,
                begin: self.parseTimeTextToSeg(cap.getAttribute("begin")),
                end: self.parseTimeTextToSeg(cap.getAttribute("end")),
                content: $(cap).text().trim()
              };
              captions.push(c);
            });
            break;
          }
        }
        if (captions.length > 0) {
          next(false, captions);
        } else {
          next(true);
        }
      },
      parseTimeTextToSeg: function(ttime) {
        var nseg = 0;
        var segtime = /^([0-9]*([.,][0-9]*)?)s/.test(ttime);
        if (segtime) {
          nseg = parseFloat(RegExp.$1);
        } else {
          var split = ttime.split(":");
          var h = parseInt(split[0]);
          var m = parseInt(split[1]);
          var s = parseInt(split[2]);
          nseg = s + (m * 60) + (h * 60 * 60);
        }
        return nseg;
      }
    }, {}, $__super);
  }(paella.CaptionParserPlugIn);
});

"use strict";
paella.addPlugin(function() {
  return function($__super) {
    function CaptionsPlugin() {
      $traceurRuntime.superConstructor(CaptionsPlugin).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(CaptionsPlugin, {
      getInstanceName: function() {
        return "captionsPlugin";
      },
      getAlignment: function() {
        return 'right';
      },
      getSubclass: function() {
        return 'captionsPluginButton';
      },
      getIconClass: function() {
        return 'icon-captions';
      },
      getName: function() {
        return "es.upv.paella.captionsPlugin";
      },
      getButtonType: function() {
        return paella.ButtonPlugin.type.popUpButton;
      },
      getDefaultToolTip: function() {
        return base.dictionary.translate("Subtitles");
      },
      getIndex: function() {
        return 509;
      },
      closeOnMouseOut: function() {
        return false;
      },
      checkEnabled: function(onSuccess) {
        this._searchTimerTime = 1500;
        this._searchTimer = null;
        this._pluginButton = null;
        this._open = 0;
        this._parent = null;
        this._body = null;
        this._inner = null;
        this._bar = null;
        this._input = null;
        this._select = null;
        this._editor = null;
        this._activeCaptions = null;
        this._lastSel = null;
        this._browserLang = null;
        this._defaultBodyHeight = 280;
        this._autoScroll = true;
        this._searchOnCaptions = null;
        onSuccess(true);
      },
      showUI: function() {
        if (paella.captions.getAvailableLangs().length >= 1) {
          $traceurRuntime.superGet(this, CaptionsPlugin.prototype, "showUI").call(this);
        }
      },
      setup: function() {
        var self = this;
        if (!paella.captions.getAvailableLangs().length) {
          paella.plugins.captionsPlugin.hideUI();
        }
        paella.events.bind(paella.events.captionsEnabled, function(event, params) {
          self.onChangeSelection(params);
        });
        paella.events.bind(paella.events.captionsDisabled, function(event, params) {
          self.onChangeSelection(params);
        });
        paella.events.bind(paella.events.captionAdded, function(event, params) {
          self.onCaptionAdded(params);
          paella.plugins.captionsPlugin.showUI();
        });
        paella.events.bind(paella.events.timeUpdate, function(event, params) {
          if (self._searchOnCaptions) {
            self.updateCaptionHiglighted(params);
          }
        });
        paella.events.bind(paella.events.controlBarWillHide, function(evt) {
          self.cancelHideBar();
        });
        self._activeCaptions = paella.captions.getActiveCaptions();
        self._searchOnCaptions = self.config.searchOnCaptions || false;
      },
      cancelHideBar: function() {
        var thisClass = this;
        if (thisClass._open > 0) {
          paella.player.controls.cancelHideBar();
        }
      },
      updateCaptionHiglighted: function(time) {
        var thisClass = this;
        var sel = null;
        var id = null;
        if (time) {
          paella.player.videoContainer.trimming().then(function(trimming) {
            var offset = trimming.enabled ? trimming.start : 0;
            var c = paella.captions.getActiveCaptions();
            var caption = c && c.getCaptionAtTime(time.currentTime + offset);
            var id = caption && caption.id;
            if (id != null) {
              sel = $(".bodyInnerContainer[sec-id='" + id + "']");
              if (sel != thisClass._lasSel) {
                $(thisClass._lasSel).removeClass("Highlight");
              }
              if (sel) {
                $(sel).addClass("Highlight");
                if (thisClass._autoScroll) {
                  thisClass.updateScrollFocus(id);
                }
                thisClass._lasSel = sel;
              }
            }
          });
        }
      },
      updateScrollFocus: function(id) {
        var thisClass = this;
        var resul = 0;
        var t = $(".bodyInnerContainer").slice(0, id);
        t = t.toArray();
        t.forEach(function(l) {
          var i = $(l).outerHeight(true);
          resul += i;
        });
        var x = parseInt(resul / 280);
        $(".captionsBody").scrollTop(x * thisClass._defaultBodyHeight);
      },
      onCaptionAdded: function(obj) {
        var thisClass = this;
        var newCap = paella.captions.getCaptions(obj);
        var defOption = document.createElement("option");
        defOption.text = newCap._lang.txt;
        defOption.value = obj;
        thisClass._select.add(defOption);
      },
      changeSelection: function() {
        var thisClass = this;
        var sel = $(thisClass._select).val();
        if (sel == "") {
          $(thisClass._body).empty();
          paella.captions.setActiveCaptions(sel);
          return;
        }
        paella.captions.setActiveCaptions(sel);
        thisClass._activeCaptions = sel;
        if (thisClass._searchOnCaptions) {
          thisClass.buildBodyContent(paella.captions.getActiveCaptions()._captions, "list");
        }
        thisClass.setButtonHideShow();
      },
      onChangeSelection: function(obj) {
        var thisClass = this;
        if (thisClass._activeCaptions != obj) {
          $(thisClass._body).empty();
          if (obj == undefined) {
            thisClass._select.value = "";
            $(thisClass._input).prop('disabled', true);
          } else {
            $(thisClass._input).prop('disabled', false);
            thisClass._select.value = obj;
            if (thisClass._searchOnCaptions) {
              thisClass.buildBodyContent(paella.captions.getActiveCaptions()._captions, "list");
            }
          }
          thisClass._activeCaptions = obj;
          thisClass.setButtonHideShow();
        }
      },
      action: function() {
        var self = this;
        self._browserLang = base.dictionary.currentLanguage();
        self._autoScroll = true;
        switch (self._open) {
          case 0:
            if (self._browserLang && paella.captions.getActiveCaptions() == undefined) {
              self.selectDefaultBrowserLang(self._browserLang);
            }
            self._open = 1;
            paella.keyManager.enabled = false;
            break;
          case 1:
            paella.keyManager.enabled = true;
            self._open = 0;
            break;
        }
      },
      buildContent: function(domElement) {
        var thisClass = this;
        thisClass._parent = document.createElement('div');
        thisClass._parent.className = 'captionsPluginContainer';
        thisClass._bar = document.createElement('div');
        thisClass._bar.className = 'captionsBar';
        if (thisClass._searchOnCaptions) {
          thisClass._body = document.createElement('div');
          thisClass._body.className = 'captionsBody';
          thisClass._parent.appendChild(thisClass._body);
          $(thisClass._body).scroll(function() {
            thisClass._autoScroll = false;
          });
          thisClass._input = document.createElement("input");
          thisClass._input.className = "captionsBarInput";
          thisClass._input.type = "text";
          thisClass._input.id = "captionsBarInput";
          thisClass._input.name = "captionsString";
          thisClass._input.placeholder = base.dictionary.translate("Search captions");
          thisClass._bar.appendChild(thisClass._input);
          $(thisClass._input).change(function() {
            var text = $(thisClass._input).val();
            thisClass.doSearch(text);
          });
          $(thisClass._input).keyup(function() {
            var text = $(thisClass._input).val();
            if (thisClass._searchTimer != null) {
              thisClass._searchTimer.cancel();
            }
            thisClass._searchTimer = new base.Timer(function(timer) {
              thisClass.doSearch(text);
            }, thisClass._searchTimerTime);
          });
        }
        thisClass._select = document.createElement("select");
        thisClass._select.className = "captionsSelector";
        var defOption = document.createElement("option");
        defOption.text = base.dictionary.translate("None");
        defOption.value = "";
        thisClass._select.add(defOption);
        paella.captions.getAvailableLangs().forEach(function(l) {
          var option = document.createElement("option");
          option.text = l.lang.txt;
          option.value = l.id;
          thisClass._select.add(option);
        });
        thisClass._bar.appendChild(thisClass._select);
        thisClass._parent.appendChild(thisClass._bar);
        $(thisClass._select).change(function() {
          thisClass.changeSelection();
        });
        thisClass._editor = document.createElement("button");
        thisClass._editor.className = "editorButton";
        thisClass._editor.innerText = "";
        thisClass._bar.appendChild(thisClass._editor);
        $(thisClass._editor).prop("disabled", true);
        $(thisClass._editor).click(function() {
          var c = paella.captions.getActiveCaptions();
          paella.userTracking.log("paella:caption:edit", {
            id: c._captionsProvider + ':' + c._id,
            lang: c._lang
          });
          c.goToEdit();
        });
        domElement.appendChild(thisClass._parent);
      },
      selectDefaultBrowserLang: function(code) {
        var thisClass = this;
        var provider = null;
        paella.captions.getAvailableLangs().forEach(function(l) {
          if (l.lang.code == code) {
            provider = l.id;
          }
        });
        if (provider) {
          paella.captions.setActiveCaptions(provider);
        }
      },
      doSearch: function(text) {
        var thisClass = this;
        var c = paella.captions.getActiveCaptions();
        if (c) {
          if (text == "") {
            thisClass.buildBodyContent(paella.captions.getActiveCaptions()._captions, "list");
          } else {
            c.search(text, function(err, resul) {
              if (!err) {
                thisClass.buildBodyContent(resul, "search");
              }
            });
          }
        }
      },
      setButtonHideShow: function() {
        var thisClass = this;
        var editor = $('.editorButton');
        var c = paella.captions.getActiveCaptions();
        var res = null;
        if (c != null) {
          $(thisClass._select).width('39%');
          c.canEdit(function(err, r) {
            res = r;
          });
          if (res) {
            $(editor).prop("disabled", false);
            $(editor).show();
          } else {
            $(editor).prop("disabled", true);
            $(editor).hide();
            $(thisClass._select).width('47%');
          }
        } else {
          $(editor).prop("disabled", true);
          $(editor).hide();
          $(thisClass._select).width('47%');
        }
        if (!thisClass._searchOnCaptions) {
          if (res) {
            $(thisClass._select).width('92%');
          } else {
            $(thisClass._select).width('100%');
          }
        }
      },
      buildBodyContent: function(obj, type) {
        var $__2 = this;
        paella.player.videoContainer.trimming().then(function(trimming) {
          var thisClass = $__2;
          $(thisClass._body).empty();
          obj.forEach(function(l) {
            if (trimming.enabled && (l.end < trimming.start || l.begin > trimming.end)) {
              return;
            }
            thisClass._inner = document.createElement('div');
            thisClass._inner.className = 'bodyInnerContainer';
            thisClass._inner.innerText = l.content;
            if (type == "list") {
              thisClass._inner.setAttribute('sec-begin', l.begin);
              thisClass._inner.setAttribute('sec-end', l.end);
              thisClass._inner.setAttribute('sec-id', l.id);
              thisClass._autoScroll = true;
            }
            if (type == "search") {
              thisClass._inner.setAttribute('sec-begin', l.time);
            }
            thisClass._body.appendChild(thisClass._inner);
            $(thisClass._inner).hover(function() {
              $(this).css('background-color', 'rgba(250, 161, 102, 0.5)');
            }, function() {
              $(this).removeAttr('style');
            });
            $(thisClass._inner).click(function() {
              var secBegin = $(this).attr("sec-begin");
              paella.player.videoContainer.trimming().then(function(trimming) {
                var offset = trimming.enabled ? trimming.start : 0;
                paella.player.videoContainer.seekToTime(secBegin - offset + 0.1);
              });
            });
          });
        });
      }
    }, {}, $__super);
  }(paella.ButtonPlugin);
});

"use strict";
paella.addPlugin(function() {
  return function($__super) {
    function CaptionsOnScreen() {
      $traceurRuntime.superConstructor(CaptionsOnScreen).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(CaptionsOnScreen, {
      checkEnabled: function(onSuccess) {
        this.containerId = 'paella_plugin_CaptionsOnScreen';
        this.container = null;
        this.innerContainer = null;
        this.top = null;
        this.actualPos = null;
        this.lastEvent = null;
        this.controlsPlayback = null;
        this.captions = false;
        this.captionProvider = null;
        onSuccess(!paella.player.isLiveStream());
      },
      setup: function() {},
      getEvents: function() {
        return [paella.events.controlBarDidHide, paella.events.resize, paella.events.controlBarDidShow, paella.events.captionsEnabled, paella.events.captionsDisabled, paella.events.timeUpdate];
      },
      onEvent: function(eventType, params) {
        var thisClass = this;
        switch (eventType) {
          case paella.events.controlBarDidHide:
            if (thisClass.lastEvent == eventType || thisClass.captions == false)
              break;
            thisClass.moveCaptionsOverlay("down");
            break;
          case paella.events.resize:
            if (thisClass.captions == false)
              break;
            if (paella.player.controls.isHidden()) {
              thisClass.moveCaptionsOverlay("down");
            } else {
              thisClass.moveCaptionsOverlay("top");
            }
            break;
          case paella.events.controlBarDidShow:
            if (thisClass.lastEvent == eventType || thisClass.captions == false)
              break;
            thisClass.moveCaptionsOverlay("top");
            break;
          case paella.events.captionsEnabled:
            thisClass.buildContent(params);
            thisClass.captions = true;
            if (paella.player.controls.isHidden()) {
              thisClass.moveCaptionsOverlay("down");
            } else {
              thisClass.moveCaptionsOverlay("top");
            }
            break;
          case paella.events.captionsDisabled:
            thisClass.hideContent();
            thisClass.captions = false;
            break;
          case paella.events.timeUpdate:
            if (thisClass.captions) {
              thisClass.updateCaptions(params);
            }
            break;
        }
        thisClass.lastEvent = eventType;
      },
      buildContent: function(provider) {
        var thisClass = this;
        thisClass.captionProvider = provider;
        if (thisClass.container == null) {
          thisClass.container = document.createElement('div');
          thisClass.container.className = "CaptionsOnScreen";
          thisClass.container.id = thisClass.containerId;
          thisClass.innerContainer = document.createElement('div');
          thisClass.innerContainer.className = "CaptionsOnScreenInner";
          thisClass.container.appendChild(thisClass.innerContainer);
          if (thisClass.controlsPlayback == null)
            thisClass.controlsPlayback = $('#playerContainer_controls_playback');
          paella.player.videoContainer.domElement.appendChild(thisClass.container);
        } else {
          $(thisClass.container).show();
        }
      },
      updateCaptions: function(time) {
        var $__1 = this;
        if (this.captions) {
          paella.player.videoContainer.trimming().then(function(trimming) {
            var offset = trimming.enabled ? trimming.start : 0;
            var c = paella.captions.getActiveCaptions();
            var caption = c.getCaptionAtTime(time.currentTime + offset);
            if (caption) {
              $($__1.container).show();
              $__1.innerContainer.innerText = caption.content;
              $__1.moveCaptionsOverlay("auto");
            } else {
              $__1.innerContainer.innerText = "";
              $__1.hideContent();
            }
          });
        }
      },
      hideContent: function() {
        var thisClass = this;
        $(thisClass.container).hide();
      },
      moveCaptionsOverlay: function(pos) {
        var thisClass = this;
        var marginbottom = 10;
        if (thisClass.controlsPlayback == null)
          thisClass.controlsPlayback = $('#playerContainer_controls_playback');
        if (pos == "auto" || pos == undefined) {
          pos = paella.player.controls.isHidden() ? "down" : "top";
        }
        if (pos == "down") {
          var t = thisClass.container.offsetHeight;
          t -= thisClass.innerContainer.offsetHeight + marginbottom;
          thisClass.innerContainer.style.bottom = (0 - t) + "px";
        }
        if (pos == "top") {
          var t2 = thisClass.controlsPlayback.offset().top;
          t2 -= thisClass.innerContainer.offsetHeight + marginbottom;
          thisClass.innerContainer.style.bottom = (0 - t2) + "px";
        }
      },
      getIndex: function() {
        return 1050;
      },
      getName: function() {
        return "es.upv.paella.overlayCaptionsPlugin";
      }
    }, {}, $__super);
  }(paella.EventDrivenPlugin);
});

"use strict";
function buildChromaVideoCanvas(stream, canvas) {
  var ChromaVideoCanvas = function($__super) {
    function ChromaVideoCanvas(stream) {
      $traceurRuntime.superConstructor(ChromaVideoCanvas).call(this);
      this.stream = stream;
      this._chroma = bg.Color.White();
      this._crop = new bg.Vector4(0.3, 0.01, 0.3, 0.01);
      this._transform = bg.Matrix4.Identity().translate(0.6, -0.04, 0);
      this._bias = 0.01;
    }
    return ($traceurRuntime.createClass)(ChromaVideoCanvas, {
      get chroma() {
        return this._chroma;
      },
      get bias() {
        return this._bias;
      },
      get crop() {
        return this._crop;
      },
      get transform() {
        return this._transform;
      },
      set chroma(c) {
        this._chroma = c;
      },
      set bias(b) {
        this._bias = b;
      },
      set crop(c) {
        this._crop = c;
      },
      set transform(t) {
        this._transform = t;
      },
      get video() {
        return this.texture ? this.texture.video : null;
      },
      loaded: function() {
        var $__2 = this;
        return new Promise(function(resolve) {
          var checkLoaded = function() {
            if ($__2.video) {
              resolve($__2);
            } else {
              setTimeout(checkLoaded, 100);
            }
          };
          checkLoaded();
        });
      },
      buildShape: function() {
        this.plist = new bg.base.PolyList(this.gl);
        this.plist.vertex = [-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0];
        this.plist.texCoord0 = [0, 0, 1, 0, 1, 1, 0, 1];
        this.plist.index = [0, 1, 2, 2, 3, 0];
        this.plist.build();
      },
      buildShader: function() {
        var vshader = "\n\t\t\t\t\tattribute vec4 position;\n\t\t\t\t\tattribute vec2 texCoord;\n\t\t\t\t\tuniform mat4 inTransform;\n\t\t\t\t\tvarying vec2 vTexCoord;\n\t\t\t\t\tvoid main() {\n\t\t\t\t\t\tgl_Position = inTransform * position;\n\t\t\t\t\t\tvTexCoord = texCoord;\n\t\t\t\t\t}\n\t\t\t\t";
        var fshader = "\n\t\t\t\t\tprecision mediump float;\n\t\t\t\t\tvarying vec2 vTexCoord;\n\t\t\t\t\tuniform sampler2D inTexture;\n\t\t\t\t\tuniform vec4 inChroma;\n\t\t\t\t\tuniform float inBias;\n\t\t\t\t\tuniform vec4 inCrop;\n\t\t\t\t\tvoid main() {\n\t\t\t\t\t\tvec4 result = texture2D(inTexture,vTexCoord);\n\t\t\t\t\t\t\n\t\t\t\t\t\tif ((result.r>=inChroma.r-inBias && result.r<=inChroma.r+inBias &&\n\t\t\t\t\t\t\tresult.g>=inChroma.g-inBias && result.g<=inChroma.g+inBias &&\n\t\t\t\t\t\t\tresult.b>=inChroma.b-inBias && result.b<=inChroma.b+inBias) ||\n\t\t\t\t\t\t\t(vTexCoord.x<inCrop.x || vTexCoord.x>inCrop.z || vTexCoord.y<inCrop.w || vTexCoord.y>inCrop.y)\n\t\t\t\t\t\t)\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\tdiscard;\n\t\t\t\t\t\t}\n\t\t\t\t\t\telse {\n\t\t\t\t\t\t\tgl_FragColor = result;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t";
        this.shader = new bg.base.Shader(this.gl);
        this.shader.addShaderSource(bg.base.ShaderType.VERTEX, vshader);
        this.shader.addShaderSource(bg.base.ShaderType.FRAGMENT, fshader);
        status = this.shader.link();
        if (!this.shader.status) {
          console.log(this.shader.compileError);
          console.log(this.shader.linkError);
        }
        this.shader.initVars(["position", "texCoord"], ["inTransform", "inTexture", "inChroma", "inBias", "inCrop"]);
      },
      init: function() {
        var $__2 = this;
        bg.Engine.Set(new bg.webgl1.Engine(this.gl));
        bg.base.Loader.RegisterPlugin(new bg.base.VideoTextureLoaderPlugin());
        this.buildShape();
        this.buildShader();
        this.pipeline = new bg.base.Pipeline(this.gl);
        bg.base.Pipeline.SetCurrent(this.pipeline);
        this.pipeline.clearColor = bg.Color.Transparent();
        bg.base.Loader.Load(this.gl, this.stream.src).then(function(texture) {
          $__2.texture = texture;
        });
      },
      frame: function(delta) {
        if (this.texture) {
          this.texture.update();
        }
      },
      display: function() {
        this.pipeline.clearBuffers(bg.base.ClearBuffers.COLOR | bg.base.ClearBuffers.DEPTH);
        if (this.texture) {
          this.shader.setActive();
          this.shader.setInputBuffer("position", this.plist.vertexBuffer, 3);
          this.shader.setInputBuffer("texCoord", this.plist.texCoord0Buffer, 2);
          this.shader.setMatrix4("inTransform", this.transform);
          this.shader.setTexture("inTexture", this.texture || bg.base.TextureCache.WhiteTexture(this.gl), bg.base.TextureUnit.TEXTURE_0);
          this.shader.setVector4("inChroma", this.chroma);
          this.shader.setValueFloat("inBias", this.bias);
          this.shader.setVector4("inCrop", new bg.Vector4(this.crop.x, 1.0 - this.crop.y, 1.0 - this.crop.z, this.crop.w));
          this.plist.draw();
          this.shader.disableInputBuffer("position");
          this.shader.disableInputBuffer("texCoord");
          this.shader.clearActive();
        }
      },
      reshape: function(width, height) {
        var canvas = this.canvas.domElement;
        canvas.width = width;
        canvas.height = height;
        this.pipeline.viewport = new bg.Viewport(0, 0, width, height);
      },
      mouseMove: function(evt) {
        this.postRedisplay();
      }
    }, {}, $__super);
  }(bg.app.WindowController);
  var controller = new ChromaVideoCanvas(stream);
  var mainLoop = bg.app.MainLoop.singleton;
  mainLoop.updateMode = bg.app.FrameUpdate.AUTO;
  mainLoop.canvas = canvas;
  mainLoop.run(controller);
  return controller.loaded();
}
Class("paella.ChromaVideo", paella.VideoElementBase, {
  _posterFrame: null,
  _currentQuality: null,
  _autoplay: false,
  _streamName: null,
  initialize: function(id, stream, left, top, width, height, streamName) {
    this.parent(id, stream, 'canvas', left, top, width, height);
    this._streamName = streamName || 'chroma';
    var This = this;
    if (this._stream.sources[this._streamName]) {
      this._stream.sources[this._streamName].sort(function(a, b) {
        return a.res.h - b.res.h;
      });
    }
    this.video = null;
    function onProgress(event) {
      if (!This._ready && This.video.readyState == 4) {
        This._ready = true;
        if (This._initialCurrentTipe !== undefined) {
          This.video.currentTime = This._initialCurrentTime;
          delete This._initialCurrentTime;
        }
        This._callReadyEvent();
      }
    }
    function evtCallback(event) {
      onProgress.apply(This, event);
    }
    function onUpdateSize() {
      if (This.canvasController) {
        var canvas = This.canvasController.canvas.domElement;
        This.canvasController.reshape($(canvas).width(), $(canvas).height());
      }
    }
    var timer = new paella.Timer(function(timer) {
      onUpdateSize();
    }, 500);
    timer.repeat = true;
  },
  defaultProfile: function() {
    return 'chroma';
  },
  _setVideoElem: function(video) {
    $(this.video).bind('progress', evtCallback);
    $(this.video).bind('loadstart', evtCallback);
    $(this.video).bind('loadedmetadata', evtCallback);
    $(this.video).bind('canplay', evtCallback);
    $(this.video).bind('oncanplay', evtCallback);
  },
  _loadDeps: function() {
    return new Promise(function(resolve, reject) {
      if (!window.$paella_bg2e) {
        paella.require(paella.baseUrl + 'resources/deps/bg2e.js').then(function() {
          window.$paella_bg2e = bg;
          resolve(window.$paella_bg2e);
        }).catch(function(err) {
          console.error(err.message);
          reject();
        });
      } else {
        defer.resolve(window.$paella_bg2e);
      }
    });
  },
  _deferredAction: function(action) {
    var $__2 = this;
    return new Promise(function(resolve, reject) {
      if ($__2.video) {
        resolve(action());
      } else {
        $($__2.video).bind('canplay', function() {
          $__2._ready = true;
          resolve(action());
        });
      }
    });
  },
  _getQualityObject: function(index, s) {
    return {
      index: index,
      res: s.res,
      src: s.src,
      toString: function() {
        return this.res.w + "x" + this.res.h;
      },
      shortLabel: function() {
        return this.res.h + "p";
      },
      compare: function(q2) {
        return this.res.w * this.res.h - q2.res.w * q2.res.h;
      }
    };
  },
  allowZoom: function() {
    return false;
  },
  getVideoData: function() {
    var $__2 = this;
    var This = this;
    return new Promise(function(resolve, reject) {
      $__2._deferredAction(function() {
        resolve({
          duration: This.video.duration,
          currentTime: This.video.currentTime,
          volume: This.video.volume,
          paused: This.video.paused,
          ended: This.video.ended,
          res: {
            w: This.video.videoWidth,
            h: This.video.videoHeight
          }
        });
      });
    });
  },
  setPosterFrame: function(url) {
    this._posterFrame = url;
  },
  setAutoplay: function(auto) {
    this._autoplay = auto;
    if (auto && this.video) {
      this.video.setAttribute("autoplay", auto);
    }
  },
  load: function() {
    var $__2 = this;
    var This = this;
    return new Promise(function(resolve, reject) {
      $__2._loadDeps().then(function() {
        var sources = $__2._stream.sources[$__2._streamName];
        if ($__2._currentQuality === null && $__2._videoQualityStrategy) {
          $__2._currentQuality = $__2._videoQualityStrategy.getQualityIndex(sources);
        }
        var stream = $__2._currentQuality < sources.length ? sources[$__2._currentQuality] : null;
        $__2.video = null;
        $__2.domElement.parentNode.style.backgroundColor = "transparent";
        if (stream) {
          $__2.canvasController = null;
          buildChromaVideoCanvas(stream, $__2.domElement).then(function(canvasController) {
            $__2.canvasController = canvasController;
            $__2.video = canvasController.video;
            $__2.video.pause();
            if (stream.crop) {
              $__2.canvasController.crop = new bg.Vector4(stream.crop.left, stream.crop.top, stream.crop.right, stream.crop.bottom);
            }
            if (stream.displacement) {
              $__2.canvasController.transform = bg.Matrix4.Translation(stream.displacement.x, stream.displacement.y, 0);
            }
            if (stream.chromaColor) {
              $__2.canvasController.chroma = new bg.Color(stream.chromaColor[0], stream.chromaColor[1], stream.chromaColor[2], stream.chromaColor[3]);
            }
            if (stream.chromaBias) {
              $__2.canvasController.bias = stream.chromaBias;
            }
            resolve(stream);
          });
        } else {
          reject(new Error("Could not load video: invalid quality stream index"));
        }
      });
    });
  },
  getQualities: function() {
    var $__2 = this;
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        var result = [];
        var sources = $__2._stream.sources[$__2._streamName];
        var index = -1;
        sources.forEach(function(s) {
          index++;
          result.push($__2._getQualityObject(index, s));
        });
        resolve(result);
      }, 10);
    });
  },
  setQuality: function(index) {
    var $__2 = this;
    return new Promise(function(resolve) {
      var paused = $__2.video.paused;
      var sources = $__2._stream.sources[$__2._streamName];
      $__2._currentQuality = index < sources.length ? index : 0;
      var currentTime = $__2.video.currentTime;
      $__2.freeze().then(function() {
        $__2._ready = false;
        return $__2.load();
      }).then(function() {
        if (!paused) {
          $__2.play();
        }
        $($__2.video).on('seeked', function() {
          $__2.unFreeze();
          resolve();
          $($__2.video).off('seeked');
        });
        $__2.video.currentTime = currentTime;
      });
    });
  },
  getCurrentQuality: function() {
    var $__2 = this;
    return new Promise(function(resolve) {
      resolve($__2._getQualityObject($__2._currentQuality, $__2._stream.sources[$__2._streamName][$__2._currentQuality]));
    });
  },
  play: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      bg.app.MainLoop.singleton.updateMode = bg.app.FrameUpdate.AUTO;
      $__2.video.play();
    });
  },
  pause: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      bg.app.MainLoop.singleton.updateMode = bg.app.FrameUpdate.MANUAL;
      $__2.video.pause();
    });
  },
  isPaused: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      return $__2.video.paused;
    });
  },
  duration: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      return $__2.video.duration;
    });
  },
  setCurrentTime: function(time) {
    var $__2 = this;
    return this._deferredAction(function() {
      $__2.video.currentTime = time;
      $($__2.video).on('seeked', function() {
        $__2.canvasController.postRedisplay();
        $($__2.video).off('seeked');
      });
    });
  },
  currentTime: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      return $__2.video.currentTime;
    });
  },
  setVolume: function(volume) {
    var $__2 = this;
    return this._deferredAction(function() {
      $__2.video.volume = volume;
    });
  },
  volume: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      return $__2.video.volume;
    });
  },
  setPlaybackRate: function(rate) {
    var $__2 = this;
    return this._deferredAction(function() {
      $__2.video.playbackRate = rate;
    });
  },
  playbackRate: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      return $__2.video.playbackRate;
    });
  },
  goFullScreen: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      var elem = $__2.video;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitEnterFullscreen) {
        elem.webkitEnterFullscreen();
      }
    });
  },
  unFreeze: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      var c = document.getElementById($__2.video.className + "canvas");
      $(c).remove();
    });
  },
  freeze: function() {
    var This = this;
    return this._deferredAction(function() {});
  },
  unload: function() {
    this._callUnloadEvent();
    return paella_DeferredNotImplemented();
  },
  getDimensions: function() {
    return paella_DeferredNotImplemented();
  }
});
Class("paella.videoFactories.ChromaVideoFactory", {
  isStreamCompatible: function(streamData) {
    try {
      if (paella.ChromaVideo._loaded) {
        return false;
      }
      if (paella.videoFactories.Html5VideoFactory.s_instances > 0 && base.userAgent.system.iOS) {
        return false;
      }
      for (var key in streamData.sources) {
        if (key == 'chroma')
          return true;
      }
    } catch (e) {}
    return false;
  },
  getVideoObject: function(id, streamData, rect) {
    paella.ChromaVideo._loaded = true;
    ++paella.videoFactories.Html5VideoFactory.s_instances;
    return new paella.ChromaVideo(id, streamData, rect.x, rect.y, rect.w, rect.h);
  }
});

"use strict";
paella.addPlugin(function() {
  return function($__super) {
    function CommentsPlugin() {
      $traceurRuntime.superConstructor(CommentsPlugin).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(CommentsPlugin, {
      get divPublishComment() {
        return this._divPublishComment;
      },
      set divPublishComment(v) {
        this._divPublishComment = v;
      },
      get divComments() {
        return this._divComments;
      },
      set divComments(v) {
        this._divComments = v;
      },
      get publishCommentTextArea() {
        return this._publishCommentTextArea;
      },
      set publishCommentTextArea(v) {
        this._publishCommentTextArea = v;
      },
      get publishCommentButtons() {
        return this._publishCommentButtons;
      },
      set publishCommentButtons(v) {
        this._publishCommentButtons = v;
      },
      get canPublishAComment() {
        return this._canPublishAComment;
      },
      set canPublishAComment(v) {
        this._canPublishAComment = v;
      },
      get comments() {
        return this._comments;
      },
      set comments(v) {
        this._comments = v;
      },
      get commentsTree() {
        return this._commentsTree;
      },
      set commentsTree(v) {
        this._commentsTree = v;
      },
      get domElement() {
        return this._domElement;
      },
      set domElement(v) {
        this._domElement = v;
      },
      getSubclass: function() {
        return "showCommentsTabBar";
      },
      getName: function() {
        return "es.upv.paella.commentsPlugin";
      },
      getTabName: function() {
        return base.dictionary.translate("Comments");
      },
      checkEnabled: function(onSuccess) {
        onSuccess(true);
      },
      getIndex: function() {
        return 40;
      },
      getDefaultToolTip: function() {
        return base.dictionary.translate("Comments");
      },
      action: function(tab) {
        this.loadContent();
      },
      buildContent: function(domElement) {
        this.domElement = domElement;
        this.canPublishAComment = paella.initDelegate.initParams.accessControl.permissions.canWrite;
        this.loadContent();
      },
      loadContent: function() {
        this.divRoot = this.domElement;
        this.divRoot.innerText = "";
        this.divPublishComment = document.createElement('div');
        this.divPublishComment.className = 'CommentPlugin_Publish';
        this.divPublishComment.id = 'CommentPlugin_Publish';
        this.divComments = document.createElement('div');
        this.divComments.className = 'CommentPlugin_Comments';
        this.divComments.id = 'CommentPlugin_Comments';
        if (this.canPublishAComment) {
          this.divRoot.appendChild(this.divPublishComment);
          this.createPublishComment();
        }
        this.divRoot.appendChild(this.divComments);
        this.reloadComments();
      },
      createPublishComment: function() {
        var thisClass = this;
        var rootID = this.divPublishComment.id + "_entry";
        var divEntry;
        divEntry = document.createElement('div');
        divEntry.id = rootID;
        divEntry.className = 'comments_entry';
        var divSil;
        divSil = document.createElement('img');
        divSil.className = "comments_entry_silhouette";
        divSil.style.width = "48px";
        divSil.src = paella.initDelegate.initParams.accessControl.userData.avatar;
        divSil.id = rootID + "_silhouette";
        divEntry.appendChild(divSil);
        var divTextAreaContainer;
        divTextAreaContainer = document.createElement('div');
        divTextAreaContainer.className = "comments_entry_container";
        divTextAreaContainer.id = rootID + "_textarea_container";
        divEntry.appendChild(divTextAreaContainer);
        this.publishCommentTextArea = document.createElement('textarea');
        this.publishCommentTextArea.id = rootID + "_textarea";
        this.publishCommentTextArea.onclick = function() {
          paella.keyManager.enabled = false;
        };
        this.publishCommentTextArea.onblur = function() {
          paella.keyManager.enabled = true;
        };
        divTextAreaContainer.appendChild(this.publishCommentTextArea);
        this.publishCommentButtons = document.createElement('div');
        this.publishCommentButtons.id = rootID + "_buttons_area";
        divTextAreaContainer.appendChild(this.publishCommentButtons);
        var btnAddComment;
        btnAddComment = document.createElement('button');
        btnAddComment.id = rootID + "_btnAddComment";
        btnAddComment.className = "publish";
        btnAddComment.onclick = function() {
          var txtValue = thisClass.publishCommentTextArea.value;
          if (txtValue.replace(/\s/g, '') != "") {
            thisClass.addComment();
          }
        };
        btnAddComment.innerText = base.dictionary.translate("Publish");
        this.publishCommentButtons.appendChild(btnAddComment);
        divTextAreaContainer.commentsTextArea = this.publishCommentTextArea;
        divTextAreaContainer.commentsBtnAddComment = btnAddComment;
        divTextAreaContainer.commentsBtnAddCommentToInstant = this.btnAddCommentToInstant;
        this.divPublishComment.appendChild(divEntry);
      },
      addComment: function() {
        var thisClass = this;
        var txtValue = paella.AntiXSS.htmlEscape(thisClass.publishCommentTextArea.value);
        var now = new Date();
        this.comments.push({
          id: base.uuid(),
          userName: paella.initDelegate.initParams.accessControl.userData.name,
          mode: "normal",
          value: txtValue,
          created: now
        });
        var data = {allComments: this.comments};
        paella.data.write('comments', {id: paella.initDelegate.getId()}, data, function(response, status) {
          if (status) {
            thisClass.loadContent();
          }
        });
      },
      addReply: function(annotationID, domNodeId) {
        var thisClass = this;
        var textArea = document.getElementById(domNodeId);
        var txtValue = paella.AntiXSS.htmlEscape(textArea.value);
        var now = new Date();
        paella.keyManager.enabled = true;
        this.comments.push({
          id: base.uuid(),
          userName: paella.initDelegate.initParams.accessControl.userData.name,
          mode: "reply",
          parent: annotationID,
          value: txtValue,
          created: now
        });
        var data = {allComments: this.comments};
        paella.data.write('comments', {id: paella.initDelegate.getId()}, data, function(response, status) {
          if (status)
            thisClass.reloadComments();
        });
      },
      reloadComments: function() {
        var thisClass = this;
        thisClass.commentsTree = [];
        thisClass.comments = [];
        this.divComments.innerText = "";
        paella.data.read('comments', {id: paella.initDelegate.getId()}, function(data, status) {
          var i;
          var valueText;
          var comment;
          if (data && $traceurRuntime.typeof((data)) == 'object' && data.allComments && data.allComments.length > 0) {
            thisClass.comments = data.allComments;
            var tempDict = {};
            for (i = 0; i < data.allComments.length; ++i) {
              valueText = data.allComments[i].value;
              if (data.allComments[i].mode !== "reply") {
                comment = {};
                comment["id"] = data.allComments[i].id;
                comment["userName"] = data.allComments[i].userName;
                comment["mode"] = data.allComments[i].mode;
                comment["value"] = valueText;
                comment["created"] = data.allComments[i].created;
                comment["replies"] = [];
                thisClass.commentsTree.push(comment);
                tempDict[comment["id"]] = thisClass.commentsTree.length - 1;
              }
            }
            for (i = 0; i < data.allComments.length; ++i) {
              valueText = data.allComments[i].value;
              if (data.allComments[i].mode === "reply") {
                comment = {};
                comment["id"] = data.allComments[i].id;
                comment["userName"] = data.allComments[i].userName;
                comment["mode"] = data.allComments[i].mode;
                comment["value"] = valueText;
                comment["created"] = data.allComments[i].created;
                var index = tempDict[data.allComments[i].parent];
                thisClass.commentsTree[index]["replies"].push(comment);
              }
            }
            thisClass.displayComments();
          }
        });
      },
      displayComments: function() {
        var thisClass = this;
        for (var i = 0; i < thisClass.commentsTree.length; ++i) {
          var comment = thisClass.commentsTree[i];
          var e = thisClass.createACommentEntry(comment);
          thisClass.divComments.appendChild(e);
        }
      },
      createACommentEntry: function(comment) {
        var thisClass = this;
        var rootID = this.divPublishComment.id + "_entry" + comment["id"];
        var users;
        var divEntry;
        divEntry = document.createElement('div');
        divEntry.id = rootID;
        divEntry.className = "comments_entry";
        var divSil;
        divSil = document.createElement('img');
        divSil.className = "comments_entry_silhouette";
        divSil.id = rootID + "_silhouette";
        divEntry.appendChild(divSil);
        var divCommentContainer;
        divCommentContainer = document.createElement('div');
        divCommentContainer.className = "comments_entry_container";
        divCommentContainer.id = rootID + "_comment_container";
        divEntry.appendChild(divCommentContainer);
        var divCommentMetadata;
        divCommentMetadata = document.createElement('div');
        divCommentMetadata.id = rootID + "_comment_metadata";
        divCommentContainer.appendChild(divCommentMetadata);
        var datePublish = "";
        if (comment["created"]) {
          var dateToday = new Date();
          var dateComment = paella.utils.timeParse.matterhornTextDateToDate(comment["created"]);
          datePublish = paella.utils.timeParse.secondsToText((dateToday.getTime() - dateComment.getTime()) / 1000);
        }
        var divCommentValue;
        divCommentValue = document.createElement('div');
        divCommentValue.id = rootID + "_comment_value";
        divCommentValue.className = "comments_entry_comment";
        divCommentContainer.appendChild(divCommentValue);
        divCommentValue.innerText = comment["value"];
        var divCommentReply = document.createElement('div');
        divCommentReply.id = rootID + "_comment_reply";
        divCommentContainer.appendChild(divCommentReply);
        paella.data.read('userInfo', {username: comment["userName"]}, function(data, status) {
          if (data) {
            divSil.src = data.avatar;
            var headLine = "<span class='comments_entry_username'>" + data.name + " " + data.lastname + "</span>";
            headLine += "<span class='comments_entry_datepublish'>" + datePublish + "</span>";
            divCommentMetadata.innerHTML = headLine;
          }
        });
        if (this.canPublishAComment == true) {
          var btnRplyComment = document.createElement('div');
          btnRplyComment.className = "reply_button";
          btnRplyComment.innerText = base.dictionary.translate("Reply");
          btnRplyComment.id = rootID + "_comment_reply_button";
          btnRplyComment.onclick = function() {
            var e = thisClass.createAReplyEntry(comment["id"]);
            this.style.display = "none";
            this.parentElement.parentElement.appendChild(e);
          };
          divCommentReply.appendChild(btnRplyComment);
        }
        for (var i = 0; i < comment.replies.length; ++i) {
          var e = thisClass.createACommentReplyEntry(comment["id"], comment["replies"][i]);
          divCommentContainer.appendChild(e);
        }
        return divEntry;
      },
      createACommentReplyEntry: function(parentID, comment) {
        var thisClass = this;
        var rootID = this.divPublishComment.id + "_entry_" + parentID + "_reply_" + comment["id"];
        var divEntry;
        divEntry = document.createElement('div');
        divEntry.id = rootID;
        divEntry.className = "comments_entry";
        var divSil;
        divSil = document.createElement('img');
        divSil.className = "comments_entry_silhouette";
        divSil.id = rootID + "_silhouette";
        divEntry.appendChild(divSil);
        var divCommentContainer;
        divCommentContainer = document.createElement('div');
        divCommentContainer.className = "comments_entry_container";
        divCommentContainer.id = rootID + "_comment_container";
        divEntry.appendChild(divCommentContainer);
        var divCommentMetadata;
        divCommentMetadata = document.createElement('div');
        divCommentMetadata.id = rootID + "_comment_metadata";
        divCommentContainer.appendChild(divCommentMetadata);
        var datePublish = "";
        if (comment["created"]) {
          var dateToday = new Date();
          var dateComment = paella.utils.timeParse.matterhornTextDateToDate(comment["created"]);
          datePublish = paella.utils.timeParse.secondsToText((dateToday.getTime() - dateComment.getTime()) / 1000);
        }
        var divCommentValue;
        divCommentValue = document.createElement('div');
        divCommentValue.id = rootID + "_comment_value";
        divCommentValue.className = "comments_entry_comment";
        divCommentContainer.appendChild(divCommentValue);
        divCommentValue.innerText = comment["value"];
        paella.data.read('userInfo', {username: comment["userName"]}, function(data, status) {
          if (data) {
            divSil.src = data.avatar;
            var headLine = "<span class='comments_entry_username'>" + data.name + " " + data.lastname + "</span>";
            headLine += "<span class='comments_entry_datepublish'>" + datePublish + "</span>";
            divCommentMetadata.innerHTML = headLine;
          }
        });
        return divEntry;
      },
      createAReplyEntry: function(annotationID) {
        var thisClass = this;
        var rootID = this.divPublishComment.id + "_entry_" + annotationID + "_reply";
        var divEntry;
        divEntry = document.createElement('div');
        divEntry.id = rootID + "_entry";
        divEntry.className = "comments_entry";
        var divSil;
        divSil = document.createElement('img');
        divSil.className = "comments_entry_silhouette";
        divSil.style.width = "48px";
        divSil.id = rootID + "_silhouette";
        divSil.src = paella.initDelegate.initParams.accessControl.userData.avatar;
        divEntry.appendChild(divSil);
        var divCommentContainer;
        divCommentContainer = document.createElement('div');
        divCommentContainer.className = "comments_entry_container comments_reply_container";
        divCommentContainer.id = rootID + "_reply_container";
        divEntry.appendChild(divCommentContainer);
        var textArea;
        textArea = document.createElement('textArea');
        textArea.onclick = function() {
          paella.keyManager.enabled = false;
        };
        textArea.draggable = false;
        textArea.id = rootID + "_textarea";
        divCommentContainer.appendChild(textArea);
        this.publishCommentButtons = document.createElement('div');
        this.publishCommentButtons.id = rootID + "_buttons_area";
        divCommentContainer.appendChild(this.publishCommentButtons);
        var btnAddComment;
        btnAddComment = document.createElement('button');
        btnAddComment.id = rootID + "_btnAddComment";
        btnAddComment.className = "publish";
        btnAddComment.onclick = function() {
          var txtValue = textArea.value;
          if (txtValue.replace(/\s/g, '') != "") {
            thisClass.addReply(annotationID, textArea.id);
          }
        };
        btnAddComment.innerText = base.dictionary.translate("Reply");
        this.publishCommentButtons.appendChild(btnAddComment);
        return divEntry;
      }
    }, {}, $__super);
  }(paella.TabBarPlugin);
});

"use strict";
paella.addPlugin(function() {
  return function($__super) {
    function DescriptionPlugin() {
      $traceurRuntime.superConstructor(DescriptionPlugin).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(DescriptionPlugin, {
      getSubclass: function() {
        return "showDescriptionTabBar";
      },
      getName: function() {
        return "es.upv.paella.descriptionPlugin";
      },
      getTabName: function() {
        return "Descripción";
      },
      get domElement() {
        return this._domElement || null;
      },
      set domElement(d) {
        this._domElement = d;
      },
      buildContent: function(domElement) {
        this.domElement = domElement;
        this.loadContent();
      },
      action: function(tab) {
        this.loadContent();
      },
      loadContent: function() {
        var container = this.domElement;
        container.innerText = "Loading...";
        new paella.Timer(function(t) {
          container.innerText = "Loading done";
        }, 2000);
      }
    }, {}, $__super);
  }(paella.TabBarPlugin);
});

"use strict";
paella.addPlugin(function() {
  return function($__super) {
    function extendedTabAdapterPlugin() {
      $traceurRuntime.superConstructor(extendedTabAdapterPlugin).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(extendedTabAdapterPlugin, {
      get currentUrl() {
        return this._currentUrl;
      },
      set currentUrl(v) {
        this._currentUrl = v;
      },
      get currentMaster() {
        return this._currentMaster;
      },
      set currentMaster(v) {
        this._currentMaster = v;
      },
      get currentSlave() {
        return this._currentSlave;
      },
      set currentSlave(v) {
        this._currentSlave = v;
      },
      get availableMasters() {
        return this._availableMasters;
      },
      set availableMasters(v) {
        this._availableMasters = v;
      },
      get availableSlaves() {
        return this._availableSlaves;
      },
      set availableSlaves(v) {
        this._availableSlaves = v;
      },
      get showWidthRes() {
        return this._showWidthRes;
      },
      set showWidthRes(v) {
        this._showWidthRes = v;
      },
      getAlignment: function() {
        return 'right';
      },
      getSubclass: function() {
        return "extendedTabAdapterPlugin";
      },
      getIconClass: function() {
        return 'icon-folder';
      },
      getIndex: function() {
        return 2030;
      },
      getMinWindowSize: function() {
        return 550;
      },
      getName: function() {
        return "es.upv.paella.extendedTabAdapterPlugin";
      },
      getDefaultToolTip: function() {
        return base.dictionary.translate("Extended Tab Adapter");
      },
      getButtonType: function() {
        return paella.ButtonPlugin.type.popUpButton;
      },
      buildContent: function(domElement) {
        domElement.appendChild(paella.extendedAdapter.bottomContainer);
      }
    }, {}, $__super);
  }(paella.ButtonPlugin);
});

"use strict";
paella.addPlugin(function() {
  return function($__super) {
    function FootPrintsPlugin() {
      $traceurRuntime.superConstructor(FootPrintsPlugin).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(FootPrintsPlugin, {
      get INTERVAL_LENGTH() {
        return this._INTERVAL_LENGTH;
      },
      set INTERVAL_LENGTH(v) {
        this._INTERVAL_LENGTH = v;
      },
      get inPosition() {
        return this._inPosition;
      },
      set inPosition(v) {
        this._inPosition = v;
      },
      get outPosition() {
        return this._outPosition;
      },
      set outPosition(v) {
        this._outPosition = v;
      },
      get canvas() {
        return this._canvas;
      },
      set canvas(v) {
        this._canvas = v;
      },
      get footPrintsTimer() {
        return this._footPrintsTimer;
      },
      set footPrintsTimer(v) {
        this._footPrintsTimer = v;
      },
      get footPrintsData() {
        return this._footPrintsData;
      },
      set footPrintsData(v) {
        this._footPrintsData = v;
      },
      getAlignment: function() {
        return 'right';
      },
      getSubclass: function() {
        return "footPrints";
      },
      getIconClass: function() {
        return 'icon-stats';
      },
      getIndex: function() {
        return 590;
      },
      getDefaultToolTip: function() {
        return base.dictionary.translate("Show statistics");
      },
      getName: function() {
        return "es.upv.paella.footprintsPlugin";
      },
      getButtonType: function() {
        return paella.ButtonPlugin.type.timeLineButton;
      },
      setup: function() {
        this._INTERVAL_LENGTH = 5;
        var thisClass = this;
        paella.events.bind(paella.events.timeUpdate, function(event) {
          thisClass.onTimeUpdate();
        });
        switch (this.config.skin) {
          case 'custom':
            this.fillStyle = this.config.fillStyle;
            this.strokeStyle = this.config.strokeStyle;
            break;
          case 'dark':
            this.fillStyle = '#727272';
            this.strokeStyle = '#424242';
            break;
          case 'light':
            this.fillStyle = '#d8d8d8';
            this.strokeStyle = '#ffffff';
            break;
          default:
            this.fillStyle = '#d8d8d8';
            this.strokeStyle = '#ffffff';
            break;
        }
      },
      checkEnabled: function(onSuccess) {
        onSuccess(!paella.player.isLiveStream());
      },
      buildContent: function(domElement) {
        var container = document.createElement('div');
        container.className = 'footPrintsContainer';
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'footPrintsCanvas';
        this.canvas.className = 'footPrintsCanvas';
        container.appendChild(this.canvas);
        domElement.appendChild(container);
      },
      onTimeUpdate: function() {
        var $__2 = this;
        var currentTime = -1;
        paella.player.videoContainer.currentTime().then(function(c) {
          currentTime = c;
          return paella.player.videoContainer.trimming();
        }).then(function(trimming) {
          var videoCurrentTime = Math.round(currentTime + (trimming.enabled ? trimming.start : 0));
          if ($__2.inPosition <= videoCurrentTime && videoCurrentTime <= $__2.inPosition + $__2.INTERVAL_LENGTH) {
            $__2.outPosition = videoCurrentTime;
            if (($__2.inPosition + $__2.INTERVAL_LENGTH) === $__2.outPosition) {
              $__2.trackFootPrint($__2.inPosition, $__2.outPosition);
              $__2.inPosition = $__2.outPosition;
            }
          } else {
            $__2.trackFootPrint($__2.inPosition, $__2.outPosition);
            $__2.inPosition = videoCurrentTime;
            $__2.outPosition = videoCurrentTime;
          }
        });
      },
      trackFootPrint: function(inPosition, outPosition) {
        var data = {
          "in": inPosition,
          "out": outPosition
        };
        paella.data.write('footprints', {id: paella.initDelegate.getId()}, data);
      },
      willShowContent: function() {
        var thisClass = this;
        this.loadFootprints();
        this.footPrintsTimer = new base.Timer(function(timer) {
          thisClass.loadFootprints();
        }, 5000);
        this.footPrintsTimer.repeat = true;
      },
      didHideContent: function() {
        if (this.footPrintsTimer != null) {
          this.footPrintsTimer.cancel();
          this.footPrintsTimer = null;
        }
      },
      loadFootprints: function() {
        var thisClass = this;
        paella.data.read('footprints', {id: paella.initDelegate.getId()}, function(data, status) {
          var footPrintsData = {};
          paella.player.videoContainer.duration().then(function(duration) {
            var trimStart = Math.floor(paella.player.videoContainer.trimStart());
            var lastPosition = -1;
            var lastViews = 0;
            for (var i = 0; i < data.length; i++) {
              var position = data[i].position - trimStart;
              if (position < duration) {
                var views = data[i].views;
                if (position - 1 != lastPosition) {
                  for (var j = lastPosition + 1; j < position; j++) {
                    footPrintsData[j] = lastViews;
                  }
                }
                footPrintsData[position] = views;
                lastPosition = position;
                lastViews = views;
              }
            }
            thisClass.drawFootPrints(footPrintsData);
          });
        });
      },
      drawFootPrints: function(footPrintsData) {
        if (this.canvas) {
          var duration = Object.keys(footPrintsData).length;
          var ctx = this.canvas.getContext("2d");
          var h = 20;
          var i;
          for (i = 0; i < duration; ++i) {
            if (footPrintsData[i] > h) {
              h = footPrintsData[i];
            }
          }
          this.canvas.setAttribute("width", duration);
          this.canvas.setAttribute("height", h);
          ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          ctx.fillStyle = this.fillStyle;
          ctx.strokeStyle = this.strokeStyle;
          ctx.lineWidth = 2;
          ctx.webkitImageSmoothingEnabled = false;
          ctx.mozImageSmoothingEnabled = false;
          for (i = 0; i < duration - 1; ++i) {
            ctx.beginPath();
            ctx.moveTo(i, h);
            ctx.lineTo(i, h - footPrintsData[i]);
            ctx.lineTo(i + 1, h - footPrintsData[i + 1]);
            ctx.lineTo(i + 1, h);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(i, h - footPrintsData[i]);
            ctx.lineTo(i + 1, h - footPrintsData[i + 1]);
            ctx.closePath();
            ctx.stroke();
          }
        }
      }
    }, {}, $__super);
  }(paella.ButtonPlugin);
});

"use strict";
paella.addPlugin(function() {
  return function($__super) {
    function FrameCaptionsSearchPlugIn() {
      $traceurRuntime.superConstructor(FrameCaptionsSearchPlugIn).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(FrameCaptionsSearchPlugIn, {
      getName: function() {
        return "es.upv.paella.frameCaptionsSearchPlugin";
      },
      search: function(text, next) {
        var re = RegExp(text, "i");
        var results = [];
        for (var key in paella.player.videoLoader.frameList) {
          var value = paella.player.videoLoader.frameList[key];
          if ($traceurRuntime.typeof((value)) == "object") {
            if (re.test(value.caption)) {
              results.push({
                time: key,
                content: value.caption,
                score: 0
              });
            }
          }
        }
        if (next) {
          next(false, results);
        }
      }
    }, {}, $__super);
  }(paella.SearchServicePlugIn);
});
paella.addPlugin(function() {
  return function($__super) {
    function FrameControlPlugin() {
      $traceurRuntime.superConstructor(FrameControlPlugin).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(FrameControlPlugin, {
      get frames() {
        return this._frames;
      },
      set frames(v) {
        this._frames = v;
      },
      get highResFrames() {
        return this._highResFrames;
      },
      set highResFrames(v) {
        this._highResFrames = v;
      },
      get currentFrame() {
        return this._currentFrame;
      },
      set currentFrame(v) {
        this._currentFrame = v;
      },
      get navButtons() {
        return this._navButtons;
      },
      set navButtons(v) {
        this._navButtons = v;
      },
      get buttons() {
        if (!this._buttons) {
          this._buttons = [];
        }
        return this._buttons;
      },
      set buttons(v) {
        this._buttons = v;
      },
      get contx() {
        return this._contx;
      },
      set contx(v) {
        this._contx = v;
      },
      getAlignment: function() {
        return 'right';
      },
      getSubclass: function() {
        return "frameControl";
      },
      getIconClass: function() {
        return 'icon-photo';
      },
      getIndex: function() {
        return 510;
      },
      getMinWindowSize: function() {
        return 450;
      },
      getName: function() {
        return "es.upv.paella.frameControlPlugin";
      },
      getButtonType: function() {
        return paella.ButtonPlugin.type.timeLineButton;
      },
      getDefaultToolTip: function() {
        return base.dictionary.translate("Navigate by slides");
      },
      checkEnabled: function(onSuccess) {
        this._img = null;
        this._searchTimer = null;
        this._searchTimerTime = 250;
        if (paella.initDelegate.initParams.videoLoader.frameList == null)
          onSuccess(false);
        else if (paella.initDelegate.initParams.videoLoader.frameList.length === 0)
          onSuccess(false);
        else if (Object.keys(paella.initDelegate.initParams.videoLoader.frameList).length == 0)
          onSuccess(false);
        else
          onSuccess(true);
      },
      setup: function() {
        this._showFullPreview = this.config.showFullPreview || "auto";
        var thisClass = this;
        var oldClassName;
        var blockCounter = 1;
        var correctJump = 0;
        var selectedItem = -1;
        var jumpAtItem;
        var Keys = {
          Tab: 9,
          Return: 13,
          Esc: 27,
          End: 35,
          Home: 36,
          Left: 37,
          Up: 38,
          Right: 39,
          Down: 40
        };
        $(this.button).keyup(function(event) {
          var visibleItems = Math.floor(thisClass.contx.offsetWidth / 100);
          var rest = thisClass.buttons.length % visibleItems;
          var blocks = Math.floor(thisClass.buttons.length / visibleItems);
          if (thisClass.isPopUpOpen()) {
            if (event.keyCode == Keys.Left) {
              if (selectedItem > 0) {
                thisClass.buttons[selectedItem].className = oldClassName;
                selectedItem--;
                if (blockCounter > blocks)
                  correctJump = visibleItems - rest;
                jumpAtItem = ((visibleItems) * (blockCounter - 1)) - 1 - correctJump;
                if (selectedItem == jumpAtItem && selectedItem != 0) {
                  thisClass.navButtons.left.scrollContainer.scrollLeft -= visibleItems * 105;
                  --blockCounter;
                }
                if (this.hiResFrame)
                  thisClass.removeHiResFrame();
                if (!base.userAgent.browser.IsMobileVersion) {
                  thisClass.buttons[selectedItem].frameControl.onMouseOver(null, thisClass.buttons[selectedItem].frameData);
                }
                oldClassName = thisClass.buttons[selectedItem].className;
                thisClass.buttons[selectedItem].className = 'frameControlItem selected';
              }
            } else if (event.keyCode == Keys.Right) {
              if (selectedItem < thisClass.buttons.length - 1) {
                if (selectedItem >= 0) {
                  thisClass.buttons[selectedItem].className = oldClassName;
                }
                selectedItem++;
                if (blockCounter == 1)
                  correctJump = 0;
                jumpAtItem = (visibleItems) * blockCounter - correctJump;
                if (selectedItem == jumpAtItem) {
                  thisClass.navButtons.left.scrollContainer.scrollLeft += visibleItems * 105;
                  ++blockCounter;
                }
                if (this.hiResFrame)
                  thisClass.removeHiResFrame();
                if (!base.userAgent.browser.IsMobileVersion) {
                  thisClass.buttons[selectedItem].frameControl.onMouseOver(null, thisClass.buttons[selectedItem].frameData);
                }
                oldClassName = thisClass.buttons[selectedItem].className;
                thisClass.buttons[selectedItem].className = 'frameControlItem selected';
              }
            } else if (event.keyCode == Keys.Return) {
              thisClass.buttons[selectedItem].frameControl.onClick(null, thisClass.buttons[selectedItem].frameData);
              oldClassName = 'frameControlItem current';
            } else if (event.keyCode == Keys.Esc) {
              thisClass.removeHiResFrame();
            }
          }
        });
      },
      buildContent: function(domElement) {
        var $__2 = this;
        var thisClass = this;
        this.frames = [];
        var container = document.createElement('div');
        container.className = 'frameControlContainer';
        thisClass.contx = container;
        var content = document.createElement('div');
        content.className = 'frameControlContent';
        this.navButtons = {
          left: document.createElement('div'),
          right: document.createElement('div')
        };
        this.navButtons.left.className = 'frameControl navButton left';
        this.navButtons.right.className = 'frameControl navButton right';
        var frame = this.getFrame(null);
        domElement.appendChild(this.navButtons.left);
        domElement.appendChild(container);
        container.appendChild(content);
        domElement.appendChild(this.navButtons.right);
        this.navButtons.left.scrollContainer = container;
        $(this.navButtons.left).click(function(event) {
          this.scrollContainer.scrollLeft -= 100;
        });
        this.navButtons.right.scrollContainer = container;
        $(this.navButtons.right).click(function(event) {
          this.scrollContainer.scrollLeft += 100;
        });
        content.appendChild(frame);
        var itemWidth = $(frame).outerWidth(true);
        content.innerText = '';
        $(window).mousemove(function(event) {
          if ($(content).offset().top > event.pageY || !$(content).is(":visible") || ($(content).offset().top + $(content).height()) < event.pageY) {
            thisClass.removeHiResFrame();
          }
        });
        var frames = paella.initDelegate.initParams.videoLoader.frameList;
        var numFrames;
        if (frames) {
          var framesKeys = Object.keys(frames);
          numFrames = framesKeys.length;
          framesKeys.map(function(i) {
            return Number(i, 10);
          }).sort(function(a, b) {
            return a - b;
          }).forEach(function(key) {
            var frameItem = thisClass.getFrame(frames[key]);
            content.appendChild(frameItem, 'frameContrlItem_' + numFrames);
            thisClass.frames.push(frameItem);
          });
        }
        $(content).css({width: (numFrames * itemWidth) + 'px'});
        paella.events.bind(paella.events.setTrim, function(event, params) {
          $__2.updateFrameVisibility(params.trimEnabled, params.trimStart, params.trimEnd);
        });
        paella.player.videoContainer.trimming().then(function(trimData) {
          $__2.updateFrameVisibility(trimData.enabled, trimData.start, trimData.end);
        });
        paella.events.bind(paella.events.timeupdate, function(event, params) {
          return $__2.onTimeUpdate(params.currentTime);
        });
      },
      showHiResFrame: function(url, caption) {
        var frameRoot = document.createElement("div");
        var frame = document.createElement("div");
        var hiResImage = document.createElement('img');
        this._img = hiResImage;
        hiResImage.className = 'frameHiRes';
        hiResImage.setAttribute('src', url);
        hiResImage.setAttribute('style', 'width: 100%;');
        $(frame).append(hiResImage);
        $(frameRoot).append(frame);
        frameRoot.setAttribute('style', 'display: table;');
        frame.setAttribute('style', 'display: table-cell; vertical-align:middle;');
        if (this.config.showCaptions === true) {
          var captionContainer = document.createElement('p');
          captionContainer.className = "frameCaption";
          captionContainer.innerText = caption || "";
          frameRoot.append(captionContainer);
          this._caption = captionContainer;
        }
        var overlayContainer = paella.player.videoContainer.overlayContainer;
        switch (this._showFullPreview) {
          case "auto":
            var streams = paella.initDelegate.initParams.videoLoader.streams;
            if (streams.length == 1) {
              overlayContainer.addElement(frameRoot, overlayContainer.getVideoRect(0));
            } else if (streams.length >= 2) {
              overlayContainer.addElement(frameRoot, overlayContainer.getVideoRect(1));
            }
            overlayContainer.enableBackgroundMode();
            this.hiResFrame = frameRoot;
            break;
          case "master":
            overlayContainer.addElement(frameRoot, overlayContainer.getVideoRect(0));
            overlayContainer.enableBackgroundMode();
            this.hiResFrame = frameRoot;
            break;
          case "slave":
            var streams = paella.initDelegate.initParams.videoLoader.streams;
            if (streams.length >= 2) {
              overlayContainer.addElement(frameRoot, overlayContainer.getVideoRect(0));
              overlayContainer.enableBackgroundMode();
              this.hiResFrame = frameRoot;
            }
            break;
        }
      },
      removeHiResFrame: function() {
        var thisClass = this;
        var overlayContainer = paella.player.videoContainer.overlayContainer;
        if (this.hiResFrame) {
          overlayContainer.removeElement(this.hiResFrame);
        }
        overlayContainer.disableBackgroundMode();
        thisClass._img = null;
      },
      updateFrameVisibility: function(trimEnabled, trimStart, trimEnd) {
        var i;
        if (!trimEnabled) {
          for (i = 0; i < this.frames.length; ++i) {
            $(this.frames[i]).show();
          }
        } else {
          for (i = 0; i < this.frames.length; ++i) {
            var frameElem = this.frames[i];
            var frameData = frameElem.frameData;
            if (frameData.time < trimStart) {
              if (this.frames.length > i + 1 && this.frames[i + 1].frameData.time > trimStart) {
                $(frameElem).show();
              } else {
                $(frameElem).hide();
              }
            } else if (frameData.time > trimEnd) {
              $(frameElem).hide();
            } else {
              $(frameElem).show();
            }
          }
        }
      },
      getFrame: function(frameData, id) {
        var frame = document.createElement('div');
        frame.className = 'frameControlItem';
        if (id)
          frame.id = id;
        if (frameData) {
          this.buttons.push(frame);
          frame.frameData = frameData;
          frame.frameControl = this;
          var image = frameData.thumb ? frameData.thumb : frameData.url;
          var labelTime = paella.utils.timeParse.secondsToTime(frameData.time);
          frame.innerHTML = '<img src="' + image + '" alt="" class="frameControlImage" title="' + labelTime + '" aria-label="' + labelTime + '"></img>';
          if (!base.userAgent.browser.IsMobileVersion) {
            $(frame).mouseover(function(event) {
              this.frameControl.onMouseOver(event, this.frameData);
            });
          }
          $(frame).mouseout(function(event) {
            this.frameControl.onMouseOut(event, this.frameData);
          });
          $(frame).click(function(event) {
            this.frameControl.onClick(event, this.frameData);
          });
        }
        return frame;
      },
      onMouseOver: function(event, frameData) {
        var frames = paella.initDelegate.initParams.videoLoader.frameList;
        var frame = frames[frameData.time];
        if (frame) {
          var image = frame.url;
          if (this._img) {
            this._img.setAttribute('src', image);
            if (this.config.showCaptions === true) {
              this._caption.innerText = frame.caption || "";
            }
          } else {
            this.showHiResFrame(image, frame.caption);
          }
        }
        if (this._searchTimer != null) {
          clearTimeout(this._searchTimer);
        }
      },
      onMouseOut: function(event, frameData) {
        var $__2 = this;
        this._searchTimer = setTimeout(function(timer) {
          return $__2.removeHiResFrame();
        }, this._searchTimerTime);
      },
      onClick: function(event, frameData) {
        paella.player.videoContainer.trimming().then(function(trimming) {
          var time = trimming.enabled ? frameData.time - trimming.start : frameData.time;
          if (time > 0) {
            paella.player.videoContainer.seekToTime(time + 1);
          } else {
            paella.player.videoContainer.seekToTime(0);
          }
        });
      },
      onTimeUpdate: function(currentTime) {
        var $__2 = this;
        var frame = null;
        paella.player.videoContainer.trimming().then(function(trimming) {
          var time = trimming.enabled ? currentTime + trimming.start : currentTime;
          for (var i = 0; i < $__2.frames.length; ++i) {
            if ($__2.frames[i].frameData && $__2.frames[i].frameData.time <= time) {
              frame = $__2.frames[i];
            } else {
              break;
            }
          }
          if ($__2.currentFrame != frame && frame) {
            if ($__2.currentFrame)
              $__2.currentFrame.className = 'frameControlItem';
            $__2.currentFrame = frame;
            $__2.currentFrame.className = 'frameControlItem current';
          }
        });
      }
    }, {}, $__super);
  }(paella.ButtonPlugin);
});

"use strict";
paella.addPlugin(function() {
  return function($__super) {
    function FullScreenPlugin() {
      $traceurRuntime.superConstructor(FullScreenPlugin).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(FullScreenPlugin, {
      getIndex: function() {
        return 551;
      },
      getAlignment: function() {
        return 'right';
      },
      getSubclass: function() {
        return "showFullScreenButton";
      },
      getIconClass: function() {
        return 'icon-fullscreen';
      },
      getName: function() {
        return "es.upv.paella.fullScreenButtonPlugin";
      },
      checkEnabled: function(onSuccess) {
        this._reload = null;
        var enabled = paella.player.checkFullScreenCapability();
        onSuccess(enabled);
      },
      getDefaultToolTip: function() {
        return base.dictionary.translate("Go Fullscreen");
      },
      setup: function() {
        var $__2 = this;
        this._reload = this.config.reloadOnFullscreen ? this.config.reloadOnFullscreen.enabled : false;
        paella.events.bind(paella.events.enterFullscreen, function(event) {
          return $__2.onEnterFullscreen();
        });
        paella.events.bind(paella.events.exitFullscreen, function(event) {
          return $__2.onExitFullscreen();
        });
      },
      action: function(button) {
        var $__2 = this;
        if (paella.player.isFullScreen()) {
          paella.player.exitFullScreen();
        } else if ((!paella.player.checkFullScreenCapability() || base.userAgent.browser.Explorer) && window.location !== window.parent.location) {
          var url = window.location.href;
          paella.player.pause();
          paella.player.videoContainer.currentTime().then(function(currentTime) {
            var obj = $__2.secondsToHours(currentTime);
            window.open(url + "&time=" + obj.h + "h" + obj.m + "m" + obj.s + "s&autoplay=true");
          });
          return;
        } else {
          paella.player.goFullScreen();
        }
        if (paella.player.config.player.reloadOnFullscreen && paella.player.videoContainer.supportAutoplay()) {
          setTimeout(function() {
            if ($__2._reload) {
              paella.player.videoContainer.setQuality(null).then(function() {});
            }
          }, 1000);
        }
      },
      secondsToHours: function(sec_numb) {
        var hours = Math.floor(sec_numb / 3600);
        var minutes = Math.floor((sec_numb - (hours * 3600)) / 60);
        var seconds = Math.floor(sec_numb - (hours * 3600) - (minutes * 60));
        var obj = {};
        if (hours < 10) {
          hours = "0" + hours;
        }
        if (minutes < 10) {
          minutes = "0" + minutes;
        }
        if (seconds < 10) {
          seconds = "0" + seconds;
        }
        obj.h = hours;
        obj.m = minutes;
        obj.s = seconds;
        return obj;
      },
      onEnterFullscreen: function() {
        this.setToolTip(base.dictionary.translate("Exit Fullscreen"));
        this.button.className = this.getButtonItemClass(true);
        this.changeIconClass('icon-windowed');
      },
      onExitFullscreen: function() {
        this.setToolTip(base.dictionary.translate("Go Fullscreen"));
        this.button.className = this.getButtonItemClass(false);
        this.changeIconClass('icon-fullscreen');
        setTimeout(function() {
          paella.player.onresize();
        }, 100);
      },
      getButtonItemClass: function(selected) {
        return 'buttonPlugin ' + this.getAlignment() + ' ' + this.getSubclass() + ((selected) ? ' active' : '');
      }
    }, {}, $__super);
  }(paella.ButtonPlugin);
});

"use strict";
paella.addPlugin(function() {
  return function($__super) {
    function HelpPlugin() {
      $traceurRuntime.superConstructor(HelpPlugin).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(HelpPlugin, {
      getIndex: function() {
        return 509;
      },
      getAlignment: function() {
        return 'right';
      },
      getSubclass: function() {
        return "helpButton";
      },
      getIconClass: function() {
        return 'icon-help';
      },
      getName: function() {
        return "es.upv.paella.helpPlugin";
      },
      getMinWindowSize: function() {
        return 650;
      },
      getDefaultToolTip: function() {
        return base.dictionary.translate("Show help") + ' (' + base.dictionary.translate("Paella version:") + ' ' + paella.version + ')';
      },
      checkEnabled: function(onSuccess) {
        var availableLangs = (this.config && this.config.langs) || [];
        onSuccess(availableLangs.length > 0);
      },
      action: function(button) {
        var mylang = base.dictionary.currentLanguage();
        var availableLangs = (this.config && this.config.langs) || [];
        var idx = availableLangs.indexOf(mylang);
        if (idx < 0) {
          idx = 0;
        }
        var url = "resources/style/help/help_" + availableLangs[idx] + ".html";
        if (base.userAgent.browser.IsMobileVersion) {
          window.open(url);
        } else {
          paella.messageBox.showFrame(url);
        }
      }
    }, {}, $__super);
  }(paella.ButtonPlugin);
});

"use strict";
Class("paella.HLSPlayer", paella.Html5Video, {
  initialize: function(id, stream, left, top, width, height) {
    this.parent(id, stream, left, top, width, height, 'hls');
  },
  _loadDeps: function() {
    return new Promise(function(resolve, reject) {
      if (!window.$paella_hls) {
        require(['resources/deps/hls.min.js'], function(hls) {
          window.$paella_hls = hls;
          resolve(window.$paella_hls);
        });
      } else {
        resolve(window.$paella_hls);
      }
    });
  },
  allowZoom: function() {
    return true;
  },
  load: function() {
    var $__2 = this;
    if (this._posterFrame) {
      this.video.setAttribute("poster", this._posterFrame);
    }
    if (base.userAgent.system.iOS) {
      return this.parent();
    } else {
      var This = this;
      return new Promise(function(resolve, reject) {
        var source = $__2._stream.sources.hls;
        if (source && source.length > 0) {
          source = source[0];
          $__2._loadDeps().then(function(Hls) {
            if (Hls.isSupported()) {
              This._hls = new Hls();
              This._hls.loadSource(source.src);
              This._hls.attachMedia(This.video);
              This._hls.config.capLevelToPlayerSize = true;
              This.autoQuality = true;
              This._hls.on(Hls.Events.LEVEL_SWITCHED, function(ev, data) {
                This._qualities = This._qualities || [];
                This.qualityIndex = This.autoQuality ? This._qualities.length - 1 : data.level;
                paella.events.trigger(paella.events.qualityChanged, {});
                if (console && console.log)
                  console.log(("HLS: quality level changed to " + data.level));
              });
              This._hls.on(Hls.Events.ERROR, function(event, data) {
                if (data.type == Hls.ErrorTypes.MEDIA_ERROR) {
                  This._hls.destroy();
                  base.log.error("paella.HLSPlayer: Encountered invalid media file");
                  reject(new Error("invalid media"));
                }
                if (data.fatal) {
                  switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                      base.log.error("paella.HLSPlayer: Fatal network error encountered, try to recover");
                      This._hls.startLoad();
                      break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                      base.log.error("paella.HLSPlayer: Fatal media error encountered, try to recover");
                      This._hls.recoverMediaError();
                      break;
                    default:
                      base.log.error("paella.HLSPlayer: Fatal Error. Can not recover");
                      This._hls.destroy();
                      break;
                  }
                }
              });
              This._hls.on(Hls.Events.MANIFEST_PARSED, function() {
                This._deferredAction(function() {
                  resolve();
                });
              });
            }
          });
        } else {
          reject(new Error("Invalid source"));
        }
      });
    }
  },
  getQualities: function() {
    var $__2 = this;
    if (base.userAgent.system.iOS) {
      return new Promise(function(resolve, reject) {
        resolve([{
          index: 0,
          res: "",
          src: "",
          toString: function() {
            return "auto";
          },
          shortLabel: function() {
            return "auto";
          },
          compare: function(q2) {
            return 0;
          }
        }]);
      });
    } else {
      var This = this;
      return new Promise(function(resolve) {
        if (!$__2._qualities || $__2._qualities.length == 0) {
          This._qualities = [];
          This._hls.levels.forEach(function(q, index) {
            This._qualities.push(This._getQualityObject(index, {
              index: index,
              res: {
                w: q.width,
                h: q.height
              },
              bitrate: q.bitrate
            }));
          });
          This._qualities.push(This._getQualityObject(This._qualities.length, {
            index: This._qualities.length,
            res: {
              w: 0,
              h: 0
            },
            bitrate: 0
          }));
        }
        This.qualityIndex = This._qualities.length - 1;
        resolve(This._qualities);
      });
    }
  },
  printQualityes: function() {
    var $__2 = this;
    return new Promise(function(resolve, reject) {
      $__2.getCurrentQuality().then(function(cq) {
        return $__2.getNextQuality();
      }).then(function(nq) {
        resolve();
      });
    });
  },
  setQuality: function(index) {
    if (base.userAgent.system.iOS) {
      return Promise.resolve();
    } else if (index !== null) {
      try {
        this.qualityIndex = index;
        var level = index;
        this.autoQuality = false;
        if (index == this._qualities.length - 1) {
          level = -1;
          this.autoQuality = true;
        }
        this._hls.currentLevel = level;
      } catch (err) {}
      return Promise.resolve();
    } else {
      return Promise.resolve();
    }
  },
  getNextQuality: function() {
    var $__2 = this;
    return new Promise(function(resolve, reject) {
      var index = $__2.qualityIndex;
      resolve($__2._qualities[index]);
    });
  },
  getCurrentQuality: function() {
    var $__2 = this;
    if (base.userAgent.system.iOS) {
      return Promise.resolve(0);
    } else {
      return new Promise(function(resolve, reject) {
        resolve($__2._qualities[$__2.qualityIndex]);
      });
    }
  }
});
Class("paella.videoFactories.HLSVideoFactory", {
  isStreamCompatible: function(streamData) {
    if (paella.videoFactories.HLSVideoFactory.s_instances === undefined) {
      paella.videoFactories.HLSVideoFactory.s_instances = 0;
    }
    try {
      if (paella.videoFactories.HLSVideoFactory.s_instances > 0 && base.userAgent.system.iOS) {
        return false;
      }
      for (var key in streamData.sources) {
        if (key == 'hls')
          return true;
      }
    } catch (e) {}
    return false;
  },
  getVideoObject: function(id, streamData, rect) {
    ++paella.videoFactories.HLSVideoFactory.s_instances;
    return new paella.HLSPlayer(id, streamData, rect.x, rect.y, rect.w, rect.h);
  }
});

"use strict";
paella.addPlugin(function() {
  return function($__super) {
    function DefaultKeyPlugin() {
      $traceurRuntime.superConstructor(DefaultKeyPlugin).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(DefaultKeyPlugin, {
      checkEnabled: function(onSuccess) {
        onSuccess(true);
      },
      getName: function() {
        return "es.upv.paella.defaultKeysPlugin";
      },
      setup: function() {},
      onKeyPress: function(event) {
        if (event.altKey && event.ctrlKey) {
          if (event.which == paella.Keys.P) {
            this.togglePlayPause();
            return true;
          } else if (event.which == paella.Keys.S) {
            this.pause();
            return true;
          } else if (event.which == paella.Keys.M) {
            this.mute();
            return true;
          } else if (event.which == paella.Keys.U) {
            this.volumeUp();
            return true;
          } else if (event.which == paella.Keys.D) {
            this.volumeDown();
            return true;
          }
        } else {
          if (event.which == paella.Keys.Space) {
            this.togglePlayPause();
            return true;
          } else if (event.which == paella.Keys.Up) {
            this.volumeUp();
            return true;
          } else if (event.which == paella.Keys.Down) {
            this.volumeDown();
            return true;
          } else if (event.which == paella.Keys.M) {
            this.mute();
            return true;
          }
        }
        return false;
      },
      togglePlayPause: function() {
        paella.player.videoContainer.paused().then(function(p) {
          p ? paella.player.play() : paella.player.pause();
        });
      },
      pause: function() {
        paella.player.pause();
      },
      mute: function() {
        var videoContainer = paella.player.videoContainer;
        videoContainer.volume().then(function(volume) {
          var newVolume = 0;
          if (volume == 0) {
            newVolume = 1.0;
          }
          paella.player.videoContainer.setVolume({
            master: newVolume,
            slave: 0
          });
        });
      },
      volumeUp: function() {
        var videoContainer = paella.player.videoContainer;
        videoContainer.volume().then(function(volume) {
          volume += 0.1;
          volume = (volume > 1) ? 1.0 : volume;
          paella.player.videoContainer.setVolume({
            master: volume,
            slave: 0
          });
        });
      },
      volumeDown: function() {
        var videoContainer = paella.player.videoContainer;
        videoContainer.volume().then(function(volume) {
          volume -= 0.1;
          volume = (volume < 0) ? 0.0 : volume;
          paella.player.videoContainer.setVolume({
            master: volume,
            slave: 0
          });
        });
      }
    }, {}, $__super);
  }(paella.KeyPlugin);
});

"use strict";
paella.addPlugin(function() {
  return function($__super) {
    function LegalPlugin() {
      $traceurRuntime.superConstructor(LegalPlugin).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(LegalPlugin, {
      getIndex: function() {
        return 0;
      },
      getSubclass: function() {
        return "legal";
      },
      getAlignment: function() {
        return paella.player.config.plugins.list[this.getName()].position;
      },
      getDefaultToolTip: function() {
        return "";
      },
      checkEnabled: function(onSuccess) {
        onSuccess(true);
      },
      setup: function() {
        var plugin = paella.player.config.plugins.list[this.getName()];
        var title = document.createElement('a');
        title.innerText = plugin.label;
        this._url = plugin.legalUrl;
        title.className = "";
        this.button.appendChild(title);
      },
      action: function(button) {
        window.open(this._url);
      },
      getName: function() {
        return "es.upv.paella.legalPlugin";
      }
    }, {}, $__super);
  }(paella.VideoOverlayButtonPlugin);
});

"use strict";
paella.addPlugin(function() {
  return function($__super) {
    function LiveStreamIndicator() {
      $traceurRuntime.superConstructor(LiveStreamIndicator).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(LiveStreamIndicator, {
      isEditorVisible: function() {
        return paella.editor.instance != null;
      },
      getIndex: function() {
        return 10;
      },
      getSubclass: function() {
        return "liveIndicator";
      },
      getAlignment: function() {
        return 'right';
      },
      getDefaultToolTip: function() {
        return base.dictionary.translate("This video is a live stream");
      },
      getName: function() {
        return "es.upv.paella.liveStreamingIndicatorPlugin";
      },
      checkEnabled: function(onSuccess) {
        onSuccess(paella.player.isLiveStream());
      },
      setup: function() {},
      action: function(button) {
        paella.messageBox.showMessage(base.dictionary.translate("Live streaming mode: This is a live video, so, some capabilities of the player are disabled"));
      }
    }, {}, $__super);
  }(paella.VideoOverlayButtonPlugin);
});

"use strict";
Class("paella.MpegDashVideo", paella.Html5Video, {
  _posterFrame: null,
  _player: null,
  initialize: function(id, stream, left, top, width, height) {
    this.parent(id, stream, left, top, width, height);
    var This = this;
  },
  _loadDeps: function() {
    return new Promise(function(resolve, reject) {
      if (!window.$paella_mpd) {
        require(['resources/deps/dash.all.js'], function() {
          window.$paella_mpd = true;
          resolve(window.$paella_mpd);
        });
      } else {
        resolve(window.$paella_mpd);
      }
    });
  },
  _getQualityObject: function(item, index, bitrates) {
    var total = bitrates.length;
    var percent = Math.round(index * 100 / total);
    var label = index == 0 ? "min" : (index == total - 1 ? "max" : percent + "%");
    return {
      index: index,
      res: {
        w: null,
        h: null
      },
      bitrate: item.bitrate,
      src: null,
      toString: function() {
        return percent;
      },
      shortLabel: function() {
        return label;
      },
      compare: function(q2) {
        return this.bitrate - q2.bitrate;
      }
    };
  },
  load: function() {
    var $__3 = this;
    var This = this;
    return new Promise(function(resolve, reject) {
      var source = $__3._stream.sources.mpd;
      if (source && source.length > 0) {
        source = source[0];
        $__3._loadDeps().then(function() {
          var context = dashContext;
          var player = dashjs.MediaPlayer().create();
          var dashContext = context;
          player.initialize(This.video, source.src, true);
          player.getDebug().setLogToBrowserConsole(false);
          This._player = player;
          player.on(dashjs.MediaPlayer.events.STREAM_INITIALIZED, function(a, b) {
            var bitrates = player.getBitrateInfoListFor("video");
            This._deferredAction(function() {
              if (!This._firstPlay) {
                This._player.pause();
                This._firstPlay = true;
              }
              resolve();
            });
          });
        });
      } else {
        reject(new Error("Invalid source"));
      }
    });
  },
  supportAutoplay: function() {
    return true;
  },
  getQualities: function() {
    var $__3 = this;
    return new Promise(function(resolve) {
      $__3._deferredAction(function() {
        if (!$__3._qualities) {
          $__3._qualities = [];
          $__3._player.getBitrateInfoListFor("video").sort(function(a, b) {
            return a.bitrate - b.bitrate;
          }).forEach(function(item, index, bitrates) {
            $__3._qualities.push($__3._getQualityObject(item, index, bitrates));
          });
          $__3.autoQualityIndex = $__3._qualities.length;
          $__3._qualities.push({
            index: $__3.autoQualityIndex,
            res: {
              w: null,
              h: null
            },
            bitrate: -1,
            src: null,
            toString: function() {
              return "auto";
            },
            shortLabel: function() {
              return "auto";
            },
            compare: function(q2) {
              return this.bitrate - q2.bitrate;
            }
          });
        }
        resolve($__3._qualities);
      });
    });
  },
  setQuality: function(index) {
    var $__3 = this;
    return new Promise(function(resolve, reject) {
      var currentQuality = $__3._player.getQualityFor("video");
      if (index == $__3.autoQualityIndex) {
        $__3._player.setAutoSwitchQuality(true);
        resolve();
      } else if (index != currentQuality) {
        $__3._player.setAutoSwitchQuality(false);
        $__3._player.off(dashjs.MediaPlayer.events.METRIC_CHANGED);
        $__3._player.on(dashjs.MediaPlayer.events.METRIC_CHANGED, function(a, b) {
          if (a.type == "metricchanged") {
            if (currentQuality != $__3._player.getQualityFor("video")) {
              currentQuality = $__3._player.getQualityFor("video");
              resolve();
            }
          }
        });
        $__3._player.setQualityFor("video", index);
      } else {
        resolve();
      }
    });
  },
  getCurrentQuality: function() {
    var $__3 = this;
    return new Promise(function(resolve, reject) {
      if ($__3._player.getAutoSwitchQuality()) {
        resolve({
          index: $__3.autoQualityIndex,
          res: {
            w: null,
            h: null
          },
          bitrate: -1,
          src: null,
          toString: function() {
            return "auto";
          },
          shortLabel: function() {
            return "auto";
          },
          compare: function(q2) {
            return this.bitrate - q2.bitrate;
          }
        });
      } else {
        var index = $__3._player.getQualityFor("video");
        resolve($__3._getQualityObject($__3._qualities[index], index, $__3._player.getBitrateInfoListFor("video")));
      }
    });
  },
  unFreeze: function() {
    return paella_DeferredNotImplemented();
  },
  freeze: function() {
    return paella_DeferredNotImplemented();
  },
  unload: function() {
    this._callUnloadEvent();
    return paella_DeferredNotImplemented();
  }
});
Class("paella.videoFactories.MpegDashVideoFactory", {
  isStreamCompatible: function(streamData) {
    try {
      if (base.userAgent.system.iOS) {
        return false;
      }
      for (var key in streamData.sources) {
        if (key == 'mpd')
          return true;
      }
    } catch (e) {}
    return false;
  },
  getVideoObject: function(id, streamData, rect) {
    ++paella.videoFactories.Html5VideoFactory.s_instances;
    return new paella.MpegDashVideo(id, streamData, rect.x, rect.y, rect.w, rect.h);
  }
});

"use strict";
paella.addPlugin(function() {
  return function($__super) {
    function MultipleQualitiesPlugin() {
      $traceurRuntime.superConstructor(MultipleQualitiesPlugin).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(MultipleQualitiesPlugin, {
      getAlignment: function() {
        return 'right';
      },
      getSubclass: function() {
        return "showMultipleQualitiesPlugin";
      },
      getIconClass: function() {
        return 'icon-screen';
      },
      getIndex: function() {
        return 2030;
      },
      getMinWindowSize: function() {
        return 550;
      },
      getName: function() {
        return "es.upv.paella.multipleQualitiesPlugin";
      },
      getDefaultToolTip: function() {
        return base.dictionary.translate("Change video quality");
      },
      closeOnMouseOut: function() {
        return true;
      },
      checkEnabled: function(onSuccess) {
        var $__1 = this;
        this._available = [];
        paella.player.videoContainer.getQualities().then(function(q) {
          $__1._available = q;
          onSuccess(q.length > 1);
        });
      },
      setup: function() {
        var $__1 = this;
        this.setQualityLabel();
        paella.events.bind(paella.events.qualityChanged, function(event) {
          return $__1.setQualityLabel();
        });
      },
      getButtonType: function() {
        return paella.ButtonPlugin.type.popUpButton;
      },
      buildContent: function(domElement) {
        var $__1 = this;
        this._available.forEach(function(q) {
          var title = q.shortLabel();
          domElement.appendChild($__1.getItemButton(q));
        });
      },
      getItemButton: function(quality) {
        var $__1 = this;
        var elem = document.createElement('div');
        var This = this;
        paella.player.videoContainer.getCurrentQuality().then(function(currentIndex, currentData) {
          var label = quality.shortLabel();
          elem.className = $__1.getButtonItemClass(label, quality.index == currentIndex);
          elem.id = label;
          elem.innerText = label;
          elem.data = quality;
          $(elem).click(function(event) {
            $('.multipleQualityItem').removeClass('selected');
            $('.multipleQualityItem.' + this.data.toString()).addClass('selected');
            paella.player.videoContainer.setQuality(this.data.index).then(function() {
              paella.player.controls.hidePopUp(This.getName());
              This.setQualityLabel();
            });
          });
        });
        return elem;
      },
      setQualityLabel: function() {
        var $__1 = this;
        paella.player.videoContainer.getCurrentQuality().then(function(q) {
          $__1.setText(q.shortLabel());
        });
      },
      getButtonItemClass: function(profileName, selected) {
        return 'multipleQualityItem ' + profileName + ((selected) ? ' selected' : '');
      }
    }, {}, $__super);
  }(paella.ButtonPlugin);
});

"use strict";
paella.addPlugin(function() {
  return function($__super) {
    function PIPModePlugin() {
      $traceurRuntime.superConstructor(PIPModePlugin).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(PIPModePlugin, {
      getIndex: function() {
        return 551;
      },
      getAlignment: function() {
        return 'right';
      },
      getSubclass: function() {
        return "PIPModeButton";
      },
      getIconClass: function() {
        return 'icon-pip';
      },
      getName: function() {
        return "es.upv.paella.pipModePlugin";
      },
      checkEnabled: function(onSuccess) {
        var mainVideo = paella.player.videoContainer.masterVideo();
        var video = mainVideo.video;
        if (video && video.webkitSetPresentationMode) {
          onSuccess(true);
        } else {
          onSuccess(false);
        }
      },
      getDefaultToolTip: function() {
        return base.dictionary.translate("Set picture-in-picture mode.");
      },
      setup: function() {},
      action: function(button) {
        var video = paella.player.videoContainer.masterVideo().video;
        if (video.webkitPresentationMode == "picture-in-picture") {
          video.webkitSetPresentationMode("inline");
        } else {
          video.webkitSetPresentationMode("picture-in-picture");
        }
      }
    }, {}, $__super);
  }(paella.ButtonPlugin);
});

"use strict";
paella.addPlugin(function() {
  return function($__super) {
    function PlayPauseButtonPlugin() {
      $traceurRuntime.superConstructor(PlayPauseButtonPlugin).call(this);
      this.playIconClass = 'icon-play';
      this.pauseIconClass = 'icon-pause';
      this.playSubclass = 'playButton';
      this.pauseSubclass = 'pauseButton';
    }
    return ($traceurRuntime.createClass)(PlayPauseButtonPlugin, {
      getAlignment: function() {
        return 'left';
      },
      getSubclass: function() {
        return this.playSubclass;
      },
      getIconClass: function() {
        return this.playIconClass;
      },
      getName: function() {
        return "es.upv.paella.playPauseButtonPlugin";
      },
      getDefaultToolTip: function() {
        return base.dictionary.translate("Play");
      },
      getIndex: function() {
        return 110;
      },
      checkEnabled: function(onSuccess) {
        onSuccess(true);
      },
      setup: function() {
        var $__1 = this;
        if (paella.player.playing()) {
          this.changeIconClass(this.playIconClass);
        }
        paella.events.bind(paella.events.play, function(event) {
          $__1.changeIconClass($__1.pauseIconClass);
          $__1.changeSubclass($__1.pauseSubclass);
          $__1.setToolTip(paella.dictionary.translate("Pause"));
        });
        paella.events.bind(paella.events.pause, function(event) {
          $__1.changeIconClass($__1.playIconClass);
          $__1.changeSubclass($__1.playSubclass);
          $__1.setToolTip(paella.dictionary.translate("Play"));
        });
      },
      action: function(button) {
        paella.player.videoContainer.paused().then(function(paused) {
          if (paused) {
            paella.player.play();
          } else {
            paella.player.pause();
          }
        });
      }
    }, {}, $__super);
  }(paella.ButtonPlugin);
});

"use strict";
paella.addPlugin(function() {
  return function($__super) {
    function PlayButtonOnScreen() {
      $traceurRuntime.superConstructor(PlayButtonOnScreen).call(this);
      this.containerId = 'paella_plugin_PlayButtonOnScreen';
      this.container = null;
      this.enabled = true;
      this.isPlaying = false;
      this.showIcon = true;
      this.firstPlay = false;
    }
    return ($traceurRuntime.createClass)(PlayButtonOnScreen, {
      checkEnabled: function(onSuccess) {
        onSuccess(!paella.player.isLiveStream() || base.userAgent.system.Android || base.userAgent.system.iOS || !paella.player.videoContainer.supportAutoplay());
      },
      getIndex: function() {
        return 1010;
      },
      getName: function() {
        return "es.upv.paella.playButtonOnScreenPlugin";
      },
      setup: function() {
        var thisClass = this;
        this.container = document.createElement('div');
        this.container.className = "playButtonOnScreen";
        this.container.id = this.containerId;
        this.container.style.width = "100%";
        this.container.style.height = "100%";
        paella.player.videoContainer.domElement.appendChild(this.container);
        $(this.container).click(function(event) {
          thisClass.onPlayButtonClick();
        });
        var icon = document.createElement('canvas');
        icon.className = "playButtonOnScreenIcon";
        this.container.appendChild(icon);
        function repaintCanvas() {
          var width = jQuery(thisClass.container).innerWidth();
          var height = jQuery(thisClass.container).innerHeight();
          icon.width = width;
          icon.height = height;
          var iconSize = (width < height) ? width / 3 : height / 3;
          var ctx = icon.getContext('2d');
          ctx.translate((width - iconSize) / 2, (height - iconSize) / 2);
          ctx.beginPath();
          ctx.arc(iconSize / 2, iconSize / 2, iconSize / 2, 0, 2 * Math.PI, true);
          ctx.closePath();
          ctx.strokeStyle = 'white';
          ctx.lineWidth = 10;
          ctx.stroke();
          ctx.fillStyle = '#8f8f8f';
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(iconSize / 3, iconSize / 4);
          ctx.lineTo(3 * iconSize / 4, iconSize / 2);
          ctx.lineTo(iconSize / 3, 3 * iconSize / 4);
          ctx.lineTo(iconSize / 3, iconSize / 4);
          ctx.closePath();
          ctx.fillStyle = 'white';
          ctx.fill();
          ctx.stroke();
        }
        paella.events.bind(paella.events.resize, repaintCanvas);
        repaintCanvas();
      },
      getEvents: function() {
        return [paella.events.endVideo, paella.events.play, paella.events.pause, paella.events.showEditor, paella.events.hideEditor];
      },
      onEvent: function(eventType, params) {
        switch (eventType) {
          case paella.events.endVideo:
            this.endVideo();
            break;
          case paella.events.play:
            this.play();
            break;
          case paella.events.pause:
            this.pause();
            break;
          case paella.events.showEditor:
            this.showEditor();
            break;
          case paella.events.hideEditor:
            this.hideEditor();
            break;
        }
      },
      onPlayButtonClick: function() {
        this.firstPlay = true;
        this.checkStatus();
      },
      endVideo: function() {
        this.isPlaying = false;
        this.checkStatus();
      },
      play: function() {
        this.isPlaying = true;
        this.showIcon = false;
        this.checkStatus();
      },
      pause: function() {
        this.isPlaying = false;
        this.showIcon = true;
        this.checkStatus();
      },
      showEditor: function() {
        this.enabled = false;
        this.checkStatus();
      },
      hideEditor: function() {
        this.enabled = true;
        this.checkStatus();
      },
      checkStatus: function() {
        if ((this.enabled && this.isPlaying) || !this.enabled || !this.showIcon) {
          $(this.container).hide();
        } else {
          $(this.container).show();
        }
      }
    }, {}, $__super);
  }(paella.EventDrivenPlugin);
});

"use strict";
paella.addPlugin(function() {
  return function($__super) {
    function PlaybackRate() {
      $traceurRuntime.superConstructor(PlaybackRate).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(PlaybackRate, {
      getAlignment: function() {
        return 'left';
      },
      getSubclass: function() {
        return "showPlaybackRateButton";
      },
      getIconClass: function() {
        return 'icon-screen';
      },
      getIndex: function() {
        return 140;
      },
      getMinWindowSize: function() {
        return 500;
      },
      getName: function() {
        return "es.upv.paella.playbackRatePlugin";
      },
      getButtonType: function() {
        return paella.ButtonPlugin.type.popUpButton;
      },
      getDefaultToolTip: function() {
        return base.dictionary.translate("Set playback rate");
      },
      checkEnabled: function(onSuccess) {
        this.buttonItems = null;
        this.buttons = [];
        this.selected_button = null;
        this.defaultRate = null;
        this._domElement = null;
        this.available_rates = null;
        var enabled = (!base.userAgent.browser.IsMobileVersion && dynamic_cast("paella.Html5Video", paella.player.videoContainer.masterVideo()) != null);
        onSuccess(enabled);
      },
      closeOnMouseOut: function() {
        return true;
      },
      setup: function() {
        this.defaultRate = 1.0;
        this.available_rates = this.config.availableRates || [0.75, 1, 1.25, 1.5];
      },
      buildContent: function(domElement) {
        var $__2 = this;
        this._domElement = domElement;
        this.buttonItems = {};
        this.available_rates.forEach(function(rate) {
          domElement.appendChild($__2.getItemButton(rate + "x", rate));
        });
      },
      getItemButton: function(label, rate) {
        var elem = document.createElement('div');
        if (rate == 1.0) {
          elem.className = this.getButtonItemClass(label, true);
        } else {
          elem.className = this.getButtonItemClass(label, false);
        }
        elem.id = label + '_button';
        elem.innerText = label;
        elem.data = {
          label: label,
          rate: rate,
          plugin: this
        };
        $(elem).click(function(event) {
          this.data.plugin.onItemClick(this, this.data.label, this.data.rate);
        });
        return elem;
      },
      onItemClick: function(button, label, rate) {
        var self = this;
        paella.player.videoContainer.setPlaybackRate(rate);
        this.setText(label);
        paella.player.controls.hidePopUp(this.getName());
        var arr = self._domElement.children;
        for (var i = 0; i < arr.length; i++) {
          arr[i].className = self.getButtonItemClass(i, false);
        }
        button.className = self.getButtonItemClass(i, true);
      },
      getText: function() {
        return "1x";
      },
      getProfileItemButton: function(profile, profileData) {
        var elem = document.createElement('div');
        elem.className = this.getButtonItemClass(profile, false);
        elem.id = profile + '_button';
        elem.data = {
          profile: profile,
          profileData: profileData,
          plugin: this
        };
        $(elem).click(function(event) {
          this.data.plugin.onItemClick(this, this.data.profile, this.data.profileData);
        });
        return elem;
      },
      getButtonItemClass: function(profileName, selected) {
        return 'playbackRateItem ' + profileName + ((selected) ? ' selected' : '');
      }
    }, {}, $__super);
  }(paella.ButtonPlugin);
});

"use strict";
paella.addPlugin(function() {
  return function($__super) {
    function RatePlugin() {
      $traceurRuntime.superConstructor(RatePlugin).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(RatePlugin, {
      getAlignment: function() {
        return 'right';
      },
      getSubclass: function() {
        return "rateButtonPlugin";
      },
      getIconClass: function() {
        return 'icon-star';
      },
      getIndex: function() {
        return 540;
      },
      getMinWindowSize: function() {
        return 500;
      },
      getName: function() {
        return "es.upv.paella.ratePlugin";
      },
      getButtonType: function() {
        return paella.ButtonPlugin.type.popUpButton;
      },
      getDefaultToolTip: function() {
        return base.dictionary.translate("Rate this video");
      },
      checkEnabled: function(onSuccess) {
        var $__2 = this;
        this.buttonItems = null;
        this.buttons = [];
        this.selected_button = null;
        this.score = 0;
        this.count = 0;
        this.myScore = 0;
        this.canVote = false;
        this.scoreContainer = {
          header: null,
          rateButtons: null
        };
        paella.data.read('rate', {id: paella.initDelegate.getId()}, function(data, status) {
          if (data && $traceurRuntime.typeof((data)) == 'object') {
            $__2.score = Number(data.mean).toFixed(1);
            $__2.count = data.count;
            $__2.myScore = data.myScore;
            $__2.canVote = data.canVote;
          }
          onSuccess(status);
        });
      },
      setup: function() {},
      setScore: function(s) {
        this.score = s;
        this.updateScore();
      },
      closeOnMouseOut: function() {
        return true;
      },
      updateHeader: function() {
        var score = base.dictionary.translate("Not rated");
        if (this.count > 0) {
          score = '<i class="glyphicon glyphicon-star"></i>';
          score += (" " + this.score + " " + this.count + " " + base.dictionary.translate('votes'));
        }
        this.scoreContainer.header.innerHTML = ("\n\t\t\t<div>\n\t\t\t\t<h4>" + base.dictionary.translate('Video score') + ":</h4>\n\t\t\t\t<h5>\n\t\t\t\t\t" + score + "\n\t\t\t\t</h5>\n\t\t\t\t</h4>\n\t\t\t\t<h4>" + base.dictionary.translate('Vote:') + "</h4>\n\t\t\t</div>\n\t\t\t");
      },
      updateRateButtons: function() {
        this.scoreContainer.rateButtons.className = "rateButtons";
        this.buttons = [];
        if (this.canVote) {
          this.scoreContainer.rateButtons.innerText = "";
          for (var i = 0; i < 5; ++i) {
            var btn = this.getStarButton(i + 1);
            this.buttons.push(btn);
            this.scoreContainer.rateButtons.appendChild(btn);
          }
        } else {
          this.scoreContainer.rateButtons.innerHTML = ("<h5>" + base.dictionary.translate('Login to vote') + "</h5>");
        }
        this.updateVote();
      },
      buildContent: function(domElement) {
        var This = this;
        This._domElement = domElement;
        var header = document.createElement('div');
        domElement.appendChild(header);
        header.className = "rateContainerHeader";
        this.scoreContainer.header = header;
        this.updateHeader();
        var rateButtons = document.createElement('div');
        this.scoreContainer.rateButtons = rateButtons;
        domElement.appendChild(rateButtons);
        this.updateRateButtons();
      },
      getStarButton: function(score) {
        var This = this;
        var elem = document.createElement('i');
        elem.data = {
          score: score,
          active: false
        };
        elem.className = "starButton glyphicon glyphicon-star-empty";
        $(elem).click(function(event) {
          This.vote(this.data.score);
        });
        return elem;
      },
      vote: function(score) {
        var $__2 = this;
        this.myScore = score;
        var data = {
          mean: this.score,
          count: this.count,
          myScore: score,
          canVote: this.canVote
        };
        paella.data.write('rate', {id: paella.initDelegate.getId()}, data, function(result) {
          paella.data.read('rate', {id: paella.initDelegate.getId()}, function(data, status) {
            if (data && $traceurRuntime.typeof((data)) == 'object') {
              $__2.score = Number(data.mean).toFixed(1);
              $__2.count = data.count;
              $__2.myScore = data.myScore;
              $__2.canVote = data.canVote;
            }
            $__2.updateHeader();
            $__2.updateRateButtons();
          });
        });
      },
      updateVote: function() {
        var $__2 = this;
        this.buttons.forEach(function(item, index) {
          item.className = index < $__2.myScore ? "starButton glyphicon glyphicon-star" : "starButton glyphicon glyphicon-star-empty";
        });
      }
    }, {}, $__super);
  }(paella.ButtonPlugin);
});

"use strict";
Class("paella.RTMPVideo", paella.VideoElementBase, {
  _posterFrame: null,
  _currentQuality: null,
  _duration: 0,
  _paused: true,
  _streamName: null,
  _flashId: null,
  _swfContainer: null,
  _flashVideo: null,
  _volume: 1,
  initialize: function(id, stream, left, top, width, height) {
    this.parent(id, stream, 'div', left, top, width, height);
    this._flashId = id + 'Movie';
    this._streamName = 'rtmp';
    var This = this;
    this._stream.sources.rtmp.sort(function(a, b) {
      return a.res.h - b.res.h;
    });
    var processEvent = function(eventName, params) {
      if (eventName != "loadedmetadata" && eventName != "pause" && !This._isReady) {
        This._isReady = true;
        This._duration = params.duration;
        $(This.swfContainer).trigger("paella:flashvideoready");
      }
      if (eventName == "progress") {
        try {
          This.flashVideo.setVolume(This._volume);
        } catch (e) {}
        base.log.debug("Flash video event: " + eventName + ", progress: " + This.flashVideo.currentProgress());
      } else if (eventName == "ended") {
        base.log.debug("Flash video event: " + eventName);
        paella.events.trigger(paella.events.pause);
        paella.player.controls.showControls();
      } else {
        base.log.debug("Flash video event: " + eventName);
      }
    };
    var eventReceived = function(eventName, params) {
      params = params.split(",");
      var processedParams = {};
      for (var i = 0; i < params.length; ++i) {
        var splitted = params[i].split(":");
        var key = splitted[0];
        var value = splitted[1];
        if (value == "NaN") {
          value = NaN;
        } else if (/^true$/i.test(value)) {
          value = true;
        } else if (/^false$/i.test(value)) {
          value = false;
        } else if (!isNaN(parseFloat(value))) {
          value = parseFloat(value);
        }
        processedParams[key] = value;
      }
      processEvent(eventName, processedParams);
    };
    paella.events.bind(paella.events.flashVideoEvent, function(event, params) {
      if (This.flashId == params.source) {
        eventReceived(params.eventName, params.values);
      }
    });
    Object.defineProperty(this, 'swfContainer', {get: function() {
        return This._swfContainer;
      }});
    Object.defineProperty(this, 'flashId', {get: function() {
        return This._flashId;
      }});
    Object.defineProperty(this, 'flashVideo', {get: function() {
        return This._flashVideo;
      }});
  },
  _createSwfObject: function(swfFile, flashVars) {
    var id = this.identifier;
    var parameters = {wmode: 'transparent'};
    var domElement = document.createElement('div');
    this.domElement.appendChild(domElement);
    domElement.id = id + "Movie";
    this._swfContainer = domElement;
    if (swfobject.hasFlashPlayerVersion("9.0.0")) {
      swfobject.embedSWF(swfFile, domElement.id, "100%", "100%", "9.0.0", "", flashVars, parameters, null, function callbackFn(e) {
        if (e.success == false) {
          var message = document.createElement('div');
          var header = document.createElement('h3');
          header.innerText = base.dictionary.translate("Flash player problem");
          var text = document.createElement('div');
          text.innerHTML = base.dictionary.translate("A problem occurred trying to load flash player.") + "<br>" + base.dictionary.translate("Please go to {0} and install it.").replace("{0}", "<a style='color: #800000; text-decoration: underline;' href='http://www.adobe.com/go/getflash'>http://www.adobe.com/go/getflash</a>") + '<br>' + base.dictionary.translate("If the problem presist, contact us.");
          var link = document.createElement('a');
          link.setAttribute("href", "http://www.adobe.com/go/getflash");
          link.innerHTML = '<img style="margin:5px;" src="http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif" alt="Obtener Adobe Flash Player" />';
          message.appendChild(header);
          message.appendChild(text);
          message.appendChild(link);
          paella.messageBox.showError(message.innerHTML);
        }
      });
    } else {
      var message = document.createElement('div');
      var header = document.createElement('h3');
      header.innerText = base.dictionary.translate("Flash player needed");
      var text = document.createElement('div');
      text.innerHTML = base.dictionary.translate("You need at least Flash player 9 installed.") + "<br>" + base.dictionary.translate("Please go to {0} and install it.").replace("{0}", "<a style='color: #800000; text-decoration: underline;' href='http://www.adobe.com/go/getflash'>http://www.adobe.com/go/getflash</a>");
      var link = document.createElement('a');
      link.setAttribute("href", "http://www.adobe.com/go/getflash");
      link.innerHTML = '<img style="margin:5px;" src="http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif" alt="Obtener Adobe Flash Player" />';
      message.appendChild(header);
      message.appendChild(text);
      message.appendChild(link);
      paella.messageBox.showError(message.innerHTML);
    }
    var flashObj = $('#' + domElement.id)[0];
    return flashObj;
  },
  _deferredAction: function(action) {
    var $__2 = this;
    return new Promise(function(resolve, reject) {
      if ($__2.ready) {
        resolve(action());
      } else {
        $($__2.swfContainer).bind('paella:flashvideoready', function() {
          $__2._ready = true;
          resolve(action());
        });
      }
    });
  },
  _getQualityObject: function(index, s) {
    return {
      index: index,
      res: s.res,
      src: s.src,
      toString: function() {
        return this.res.w + "x" + this.res.h;
      },
      shortLabel: function() {
        return this.res.h + "p";
      },
      compare: function(q2) {
        return this.res.w * this.res.h - q2.res.w * q2.res.h;
      }
    };
  },
  getVideoData: function() {
    var $__2 = this;
    var FlashVideoPlugin = this;
    return new Promise(function(resolve, reject) {
      $__2._deferredAction(function() {
        var videoData = {
          duration: FlashVideoPlugin.flashVideo.duration(),
          currentTime: FlashVideoPlugin.flashVideo.getCurrentTime(),
          volume: FlashVideoPlugin.flashVideo.getVolume(),
          paused: FlashVideoPlugin._paused,
          ended: FlashVideoPlugin._ended,
          res: {
            w: FlashVideoPlugin.flashVideo.getWidth(),
            h: FlashVideoPlugin.flashVideo.getHeight()
          }
        };
        resolve(videoData);
      });
    });
  },
  setPosterFrame: function(url) {
    if (this._posterFrame == null) {
      this._posterFrame = url;
      var posterFrame = document.createElement('img');
      posterFrame.src = url;
      posterFrame.className = "videoPosterFrameImage";
      posterFrame.alt = "poster frame";
      this.domElement.appendChild(posterFrame);
      this._posterFrameElement = posterFrame;
    }
  },
  setAutoplay: function(auto) {
    this._autoplay = auto;
  },
  load: function() {
    var This = this;
    var sources = this._stream.sources.rtmp;
    if (this._currentQuality === null && this._videoQualityStrategy) {
      this._currentQuality = this._videoQualityStrategy.getQualityIndex(sources);
    }
    var isValid = function(stream) {
      return stream.src && $traceurRuntime.typeof((stream.src)) == 'object' && stream.src.server && stream.src.stream;
    };
    var stream = this._currentQuality < sources.length ? sources[this._currentQuality] : null;
    if (stream) {
      if (!isValid(stream)) {
        return paella_DeferredRejected(new Error("Invalid video data"));
      } else {
        var subscription = false;
        if (stream.src.requiresSubscription === undefined && paella.player.config.player.rtmpSettings) {
          subscription = paella.player.config.player.rtmpSettings.requiresSubscription || false;
        } else if (stream.src.requiresSubscription) {
          subscription = stream.src.requiresSubscription;
        }
        var parameters = {};
        var swfName = 'resources/deps/player_streaming.swf';
        if (this._autoplay) {
          parameters.autoplay = this._autoplay;
        }
        if (base.parameters.get('debug') == "true") {
          parameters.debugMode = true;
        }
        parameters.playerId = this.flashId;
        parameters.isLiveStream = stream.isLiveStream !== undefined ? stream.isLiveStream : false;
        parameters.server = stream.src.server;
        parameters.stream = stream.src.stream;
        parameters.subscribe = subscription;
        if (paella.player.config.player.rtmpSettings && paella.player.config.player.rtmpSettings.bufferTime !== undefined) {
          parameters.bufferTime = paella.player.config.player.rtmpSettings.bufferTime;
        }
        this._flashVideo = this._createSwfObject(swfName, parameters);
        $(this.swfContainer).trigger("paella:flashvideoready");
        return this._deferredAction(function() {
          return stream;
        });
      }
    } else {
      return paella_DeferredRejected(new Error("Could not load video: invalid quality stream index"));
    }
  },
  getQualities: function() {
    var $__2 = this;
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        var result = [];
        var sources = $__2._stream.sources.rtmp;
        var index = -1;
        sources.forEach(function(s) {
          index++;
          result.push($__2._getQualityObject(index, s));
        });
        resolve(result);
      }, 50);
    });
  },
  setQuality: function(index) {
    var $__2 = this;
    index = index !== undefined && index !== null ? index : 0;
    return new Promise(function(resolve, reject) {
      var paused = $__2._paused;
      var sources = $__2._stream.sources.rtmp;
      $__2._currentQuality = index < sources.length ? index : 0;
      var source = sources[index];
      $__2._ready = false;
      $__2._isReady = false;
      $__2.load().then(function() {
        resolve();
      });
    });
  },
  getCurrentQuality: function() {
    var $__2 = this;
    return new Promise(function(resolve, reject) {
      resolve($__2._getQualityObject($__2._currentQuality, $__2._stream.sources.rtmp[$__2._currentQuality]));
    });
  },
  play: function() {
    var This = this;
    return this._deferredAction(function() {
      if (This._posterFrameElement) {
        This._posterFrameElement.parentNode.removeChild(This._posterFrameElement);
        This._posterFrameElement = null;
      }
      This._paused = false;
      This.flashVideo.play();
    });
  },
  pause: function() {
    var This = this;
    return this._deferredAction(function() {
      This._paused = true;
      This.flashVideo.pause();
    });
  },
  isPaused: function() {
    var This = this;
    return this._deferredAction(function() {
      return This._paused;
    });
  },
  duration: function() {
    var This = this;
    return this._deferredAction(function() {
      return This.flashVideo.duration();
    });
  },
  setCurrentTime: function(time) {
    var This = this;
    return this._deferredAction(function() {
      var duration = This.flashVideo.duration();
      This.flashVideo.seekTo(time * 100 / duration);
    });
  },
  currentTime: function() {
    var This = this;
    return this._deferredAction(function() {
      return This.flashVideo.getCurrentTime();
    });
  },
  setVolume: function(volume) {
    var This = this;
    this._volume = volume;
    return this._deferredAction(function() {
      This.flashVideo.setVolume(volume);
    });
  },
  volume: function() {
    var This = this;
    return this._deferredAction(function() {
      return This.flashVideo.getVolume();
    });
  },
  setPlaybackRate: function(rate) {
    var This = this;
    return this._deferredAction(function() {
      This._playbackRate = rate;
    });
  },
  playbackRate: function() {
    var This = this;
    return this._deferredAction(function() {
      return This._playbackRate;
    });
  },
  goFullScreen: function() {
    return paella_DeferredNotImplemented();
  },
  unFreeze: function() {
    return this._deferredAction(function() {});
  },
  freeze: function() {
    return this._deferredAction(function() {});
  },
  unload: function() {
    this._callUnloadEvent();
    return paella_DeferredNotImplemented();
  },
  getDimensions: function() {
    return paella_DeferredNotImplemented();
  }
});
Class("paella.videoFactories.RTMPVideoFactory", {
  isStreamCompatible: function(streamData) {
    try {
      if (base.userAgent.system.iOS || base.userAgent.system.Android) {
        return false;
      }
      for (var key in streamData.sources) {
        if (key == 'rtmp')
          return true;
      }
    } catch (e) {}
    return false;
  },
  getVideoObject: function(id, streamData, rect) {
    return new paella.RTMPVideo(id, streamData, rect.x, rect.y, rect.w, rect.h);
  }
});

"use strict";
paella.addPlugin(function() {
  return function($__super) {
    function CaptionsSearchPlugIn() {
      $traceurRuntime.superConstructor(CaptionsSearchPlugIn).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(CaptionsSearchPlugIn, {
      getName: function() {
        return "es.upv.paella.search.captionsSearchPlugin";
      },
      search: function(text, next) {
        paella.captions.search(text, next);
      }
    }, {}, $__super);
  }(paella.SearchServicePlugIn);
});

"use strict";
paella.addPlugin(function() {
  return function($__super) {
    function SearchPlugin() {
      $traceurRuntime.superConstructor(SearchPlugin).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(SearchPlugin, {
      getAlignment: function() {
        return 'right';
      },
      getSubclass: function() {
        return 'searchButton';
      },
      getIconClass: function() {
        return 'icon-binoculars';
      },
      getMinWindowSize: function() {
        return 550;
      },
      getName: function() {
        return "es.upv.paella.searchPlugin";
      },
      getButtonType: function() {
        return paella.ButtonPlugin.type.popUpButton;
      },
      getDefaultToolTip: function() {
        return base.dictionary.translate("Search");
      },
      getIndex: function() {
        return 510;
      },
      closeOnMouseOut: function() {
        return true;
      },
      checkEnabled: function(onSuccess) {
        this._open = false;
        this._sortDefault = 'time';
        this._colorSearch = false;
        this._localImages = null;
        this._searchTimer = null;
        this._searchTimerTime = 1500;
        this._searchBody = null;
        this._trimming = null;
        onSuccess(true);
      },
      setup: function() {
        var self = this;
        $('.searchButton').click(function(event) {
          if (self._open) {
            self._open = false;
          } else {
            self._open = true;
            setTimeout(function() {
              $("#searchBarInput").focus();
            }, 0);
          }
        });
        self._localImages = paella.initDelegate.initParams.videoLoader.frameList;
        self._colorSearch = self.config.colorSearch || false;
        self._sortDefault = self.config.sortType || "time";
        paella.events.bind(paella.events.controlBarWillHide, function(evt) {
          if (self._open)
            paella.player.controls.cancelHideBar();
        });
        paella.player.videoContainer.trimming().then(function(trimData) {
          self._trimming = trimData;
        });
      },
      prettyTime: function(seconds) {
        var hou = Math.floor(seconds / 3600) % 24;
        hou = ("00" + hou).slice(hou.toString().length);
        var min = Math.floor(seconds / 60) % 60;
        min = ("00" + min).slice(min.toString().length);
        var sec = Math.floor(seconds % 60);
        sec = ("00" + sec).slice(sec.toString().length);
        var timestr = (hou + ":" + min + ":" + sec);
        return timestr;
      },
      search: function(text, cb) {
        paella.searchService.search(text, cb);
      },
      getPreviewImage: function(time) {
        var thisClass = this;
        var keys = Object.keys(thisClass._localImages);
        keys.push(time);
        keys.sort(function(a, b) {
          return parseInt(a) - parseInt(b);
        });
        var n = keys.indexOf(time) - 1;
        n = (n > 0) ? n : 0;
        var i = keys[n];
        i = parseInt(i);
        return thisClass._localImages[i].url;
      },
      createLoadingElement: function(parent) {
        var loadingResults = document.createElement('div');
        loadingResults.className = "loader";
        var htmlLoader = "<svg version=\"1.1\" id=\"loader-1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"40px\" height=\"40px\" viewBox=\"0 0 50 50\" style=\"enable-background:new 0 0 50 50;\" xml:space=\"preserve\">" + "<path fill=\"#000\" d=\"M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z\">" + "<animateTransform attributeType=\"xml\"" + "attributeName=\"transform\"" + "type=\"rotate\"" + "from=\"0 25 25\"" + "to=\"360 25 25\"" + "dur=\"0.6s\"" + "repeatCount=\"indefinite\"/>" + "</path>" + "</svg>";
        loadingResults.innerHTML = htmlLoader;
        parent.appendChild(loadingResults);
        var sBodyText = document.createElement('p');
        sBodyText.className = 'sBodyText';
        sBodyText.innerText = base.dictionary.translate("Searching") + "...";
        parent.appendChild(sBodyText);
      },
      createNotResultsFound: function(parent) {
        var noResults = document.createElement('div');
        noResults.className = "noResults";
        noResults.innerText = base.dictionary.translate("Sorry! No results found.");
        parent.appendChild(noResults);
      },
      doSearch: function(txt, searchBody) {
        var thisClass = this;
        $(searchBody).empty();
        thisClass.createLoadingElement(searchBody);
        thisClass.search(txt, function(err, results) {
          $(searchBody).empty();
          if (!err) {
            if (results.length == 0) {
              thisClass.createNotResultsFound(searchBody);
            } else {
              for (var i = 0; i < results.length; i++) {
                if (thisClass._trimming.enabled && results[i].time <= thisClass._trimming.start) {
                  continue;
                }
                if (thisClass._sortDefault == 'score') {
                  results.sort(function(a, b) {
                    return b.score - a.score;
                  });
                }
                if (thisClass._sortDefault == 'time') {
                  results.sort(function(a, b) {
                    return a.time - b.time;
                  });
                }
                var sBodyInnerContainer = document.createElement('div');
                sBodyInnerContainer.className = 'sBodyInnerContainer';
                if (thisClass._colorSearch) {
                  if (results[i].score <= 0.3) {
                    $(sBodyInnerContainer).addClass('redScore');
                  }
                  if (results[i].score >= 0.7) {
                    $(sBodyInnerContainer).addClass('greenScore');
                  }
                }
                var TimePicContainer = document.createElement('div');
                TimePicContainer.className = 'TimePicContainer';
                var sBodyPicture = document.createElement('img');
                sBodyPicture.className = 'sBodyPicture';
                sBodyPicture.src = thisClass.getPreviewImage(results[i].time);
                var sBodyText = document.createElement('p');
                sBodyText.className = 'sBodyText';
                var time = thisClass._trimming.enabled ? results[i].time - thisClass._trimming.start : results[i].time;
                sBodyText.innerHTML = "<span class='timeSpan'>" + thisClass.prettyTime(time) + "</span>" + paella.AntiXSS.htmlEscape(results[i].content);
                TimePicContainer.appendChild(sBodyPicture);
                sBodyInnerContainer.appendChild(TimePicContainer);
                sBodyInnerContainer.appendChild(sBodyText);
                searchBody.appendChild(sBodyInnerContainer);
                sBodyInnerContainer.setAttribute('sec', time);
                $(sBodyInnerContainer).hover(function() {
                  $(this).css('background-color', '#faa166');
                }, function() {
                  $(this).removeAttr('style');
                });
                $(sBodyInnerContainer).click(function() {
                  var sec = $(this).attr("sec");
                  paella.player.videoContainer.seekToTime(parseInt(sec));
                  paella.player.play();
                });
              }
            }
          }
        });
      },
      buildContent: function(domElement) {
        var thisClass = this;
        var myUrl = null;
        var searchPluginContainer = document.createElement('div');
        searchPluginContainer.className = 'searchPluginContainer';
        var searchBody = document.createElement('div');
        searchBody.className = 'searchBody';
        searchPluginContainer.appendChild(searchBody);
        thisClass._searchBody = searchBody;
        var searchBar = document.createElement('div');
        searchBar.className = 'searchBar';
        searchPluginContainer.appendChild(searchBar);
        var input = document.createElement("input");
        input.className = "searchBarInput";
        input.type = "text";
        input.id = "searchBarInput";
        input.name = "searchString";
        input.placeholder = base.dictionary.translate("Search");
        searchBar.appendChild(input);
        $(input).change(function() {
          var text = $(input).val();
          if (thisClass._searchTimer != null) {
            thisClass._searchTimer.cancel();
          }
          if (text != "") {
            thisClass.doSearch(text, searchBody);
          }
        });
        $(input).keyup(function(event) {
          if (event.keyCode != 13) {
            var text = $(input).val();
            if (thisClass._searchTimer != null) {
              thisClass._searchTimer.cancel();
            }
            if (text != "") {
              thisClass._searchTimer = new base.Timer(function(timer) {
                thisClass.doSearch(text, searchBody);
              }, thisClass._searchTimerTime);
            } else {
              $(thisClass._searchBody).empty();
            }
          }
        });
        $(input).focus(function() {
          paella.keyManager.enabled = false;
        });
        $(input).focusout(function() {
          paella.keyManager.enabled = true;
        });
        domElement.appendChild(searchPluginContainer);
      }
    }, {}, $__super);
  }(paella.ButtonPlugin);
});

"use strict";
paella.addPlugin(function() {
  return function($__super) {
    function ShowEditorPlugin() {
      $traceurRuntime.superConstructor(ShowEditorPlugin).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(ShowEditorPlugin, {
      getName: function() {
        return "es.upv.paella.showEditorPlugin";
      },
      getSubclass: function() {
        return "showEditorButton";
      },
      getIconClass: function() {
        return 'icon-pencil';
      },
      getAlignment: function() {
        return 'right';
      },
      getIndex: function() {
        return 10;
      },
      getDefaultToolTip: function() {
        return base.dictionary.translate("Enter editor mode");
      },
      checkEnabled: function(onSuccess) {
        if (this.config.editorUrl) {
          paella.initDelegate.initParams.accessControl.canWrite().then(function(canWrite) {
            var enabled = (canWrite);
            onSuccess(enabled);
          });
        } else {
          onSuccess(false);
        }
      },
      action: function(button) {
        var editorUrl = this.config.editorUrl.replace("{id}", paella.player.videoIdentifier);
        window.location.href = editorUrl;
      }
    }, {}, $__super);
  }(paella.VideoOverlayButtonPlugin);
});

"use strict";
paella.addPlugin(function() {
  return function($__super) {
    function SocialPlugin() {
      $traceurRuntime.superConstructor(SocialPlugin).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(SocialPlugin, {
      getAlignment: function() {
        return 'right';
      },
      getSubclass: function() {
        return "showSocialPluginButton";
      },
      getIconClass: function() {
        return 'icon-social';
      },
      getIndex: function() {
        return 560;
      },
      getMinWindowSize: function() {
        return 600;
      },
      getName: function() {
        return "es.upv.paella.socialPlugin";
      },
      checkEnabled: function(onSuccess) {
        onSuccess(true);
      },
      getDefaultToolTip: function() {
        return base.dictionary.translate("Share this video");
      },
      getButtonType: function() {
        return paella.ButtonPlugin.type.popUpButton;
      },
      closeOnMouseOut: function() {
        return true;
      },
      setup: function() {
        this.buttonItems = null;
        this.socialMedia = null;
        this.buttons = [];
        this.selected_button = null;
        if (base.dictionary.currentLanguage() == 'es') {
          var esDict = {
            'Custom size:': 'Tamaño personalizado:',
            'Choose your embed size. Copy the text and paste it in your html page.': 'Elija el tamaño del video a embeber. Copie el texto y péguelo en su página html.',
            'Width:': 'Ancho:',
            'Height:': 'Alto:'
          };
          base.dictionary.addDictionary(esDict);
        }
        var thisClass = this;
        var Keys = {
          Tab: 9,
          Return: 13,
          Esc: 27,
          End: 35,
          Home: 36,
          Left: 37,
          Up: 38,
          Right: 39,
          Down: 40
        };
        $(this.button).keyup(function(event) {
          if (thisClass.isPopUpOpen()) {
            if (event.keyCode == Keys.Up) {
              if (thisClass.selected_button > 0) {
                if (thisClass.selected_button < thisClass.buttons.length)
                  thisClass.buttons[thisClass.selected_button].className = 'socialItemButton ' + thisClass.buttons[thisClass.selected_button].data.mediaData;
                thisClass.selected_button--;
                thisClass.buttons[thisClass.selected_button].className = thisClass.buttons[thisClass.selected_button].className + ' selected';
              }
            } else if (event.keyCode == Keys.Down) {
              if (thisClass.selected_button < thisClass.buttons.length - 1) {
                if (thisClass.selected_button >= 0)
                  thisClass.buttons[thisClass.selected_button].className = 'socialItemButton ' + thisClass.buttons[thisClass.selected_button].data.mediaData;
                thisClass.selected_button++;
                thisClass.buttons[thisClass.selected_button].className = thisClass.buttons[thisClass.selected_button].className + ' selected';
              }
            } else if (event.keyCode == Keys.Return) {
              thisClass.onItemClick(thisClass.buttons[thisClass.selected_button].data.mediaData);
            }
          }
        });
      },
      buildContent: function(domElement) {
        var $__2 = this;
        this.buttonItems = {};
        this.socialMedia = ['facebook', 'twitter', 'embed'];
        this.socialMedia.forEach(function(mediaData) {
          var buttonItem = $__2.getSocialMediaItemButton(mediaData);
          $__2.buttonItems[$__2.socialMedia.indexOf(mediaData)] = buttonItem;
          domElement.appendChild(buttonItem);
          $__2.buttons.push(buttonItem);
        });
        this.selected_button = this.buttons.length;
      },
      getSocialMediaItemButton: function(mediaData) {
        var elem = document.createElement('div');
        elem.className = 'socialItemButton ' + mediaData;
        elem.id = mediaData + '_button';
        elem.data = {
          mediaData: mediaData,
          plugin: this
        };
        $(elem).click(function(event) {
          this.data.plugin.onItemClick(this.data.mediaData);
        });
        return elem;
      },
      onItemClick: function(mediaData) {
        var url = this.getVideoUrl();
        switch (mediaData) {
          case ('twitter'):
            window.open('http://twitter.com/home?status=' + url);
            break;
          case ('facebook'):
            window.open('http://www.facebook.com/sharer.php?u=' + url);
            break;
          case ('embed'):
            this.embedPress();
            break;
        }
        paella.player.controls.hidePopUp(this.getName());
      },
      getVideoUrl: function() {
        var url = document.location.href;
        return url;
      },
      embedPress: function() {
        var host = document.location.protocol + "//" + document.location.host;
        var pathname = document.location.pathname;
        var p = pathname.split("/");
        if (p.length > 0) {
          p[p.length - 1] = "embed.html";
        }
        var id = paella.initDelegate.getId();
        var url = host + p.join("/") + "?id=" + id;
        var divSelectSize = "<div style='display:inline-block;'> " + "    <div class='embedSizeButton' style='width:110px; height:73px;'> <span style='display:flex; align-items:center; justify-content:center; width:100%; height:100%;'> 620x349 </span></div>" + "    <div class='embedSizeButton' style='width:100px; height:65px;'> <span style='display:flex; align-items:center; justify-content:center; width:100%; height:100%;'> 540x304 </span></div>" + "    <div class='embedSizeButton' style='width:90px;  height:58px;'> <span style='display:flex; align-items:center; justify-content:center; width:100%; height:100%;'> 460x259 </span></div>" + "    <div class='embedSizeButton' style='width:80px;  height:50px;'> <span style='display:flex; align-items:center; justify-content:center; width:100%; height:100%;'> 380x214 </span></div>" + "    <div class='embedSizeButton' style='width:70px;  height:42px;'> <span style='display:flex; align-items:center; justify-content:center; width:100%; height:100%;'> 300x169 </span></div>" + "</div><div style='display:inline-block; vertical-align:bottom; margin-left:10px;'>" + "    <div>" + base.dictionary.translate("Custom size:") + "</div>" + "    <div>" + base.dictionary.translate("Width:") + " <input id='social_embed_width-input' class='embedSizeInput' maxlength='4' type='text' name='Costum width min 300px' alt='Costum width min 300px' title='Costum width min 300px' value=''></div>" + "    <div>" + base.dictionary.translate("Height:") + " <input id='social_embed_height-input' class='embedSizeInput' maxlength='4' type='text' name='Costum width min 300px' alt='Costum width min 300px' title='Costum width min 300px' value=''></div>" + "</div>";
        var divEmbed = "<div id='embedContent' style='text-align:left; font-size:14px; color:black;'><div id=''>" + divSelectSize + "</div> <div id=''>" + base.dictionary.translate("Choose your embed size. Copy the text and paste it in your html page.") + "</div> <div id=''><textarea id='social_embed-textarea' class='social_embed-textarea' rows='4' cols='1' style='font-size:12px; width:95%; overflow:auto; margin-top:5px; color:black;'></textarea></div>  </div>";
        paella.messageBox.showMessage(divEmbed, {
          closeButton: true,
          width: '750px',
          height: '210px',
          onClose: function() {}
        });
        var w_e = $('#social_embed_width-input')[0];
        var h_e = $('#social_embed_height-input')[0];
        w_e.onkeyup = function(event) {
          var width = parseInt(w_e.value);
          var height = parseInt(h_e.value);
          if (isNaN(width)) {
            w_e.value = "";
          } else {
            if (width < 300) {
              $("#social_embed-textarea")[0].value = "Embed width too low. The minimum value is a width of 300.";
            } else {
              if (isNaN(height)) {
                height = (width / (16 / 9)).toFixed();
                h_e.value = height;
              }
              $("#social_embed-textarea")[0].value = '<iframe allowfullscreen src="' + url + '" style="border:0px #FFFFFF none;" name="Paella Player" scrolling="no" frameborder="0" marginheight="0px" marginwidth="0px" width="' + width + '" height="' + height + '"></iframe>';
            }
          }
        };
        var embs = $(".embedSizeButton");
        for (var i = 0; i < embs.length; i = i + 1) {
          var e = embs[i];
          e.onclick = function(event) {
            var value = event.target ? event.target.textContent : event.toElement.textContent;
            if (value) {
              var size = value.trim().split("x");
              w_e.value = size[0];
              h_e.value = size[1];
              $("#social_embed-textarea")[0].value = '<iframe allowfullscreen src="' + url + '" style="border:0px #FFFFFF none;" name="Paella Player" scrolling="no" frameborder="0" marginheight="0px" marginwidth="0px" width="' + size[0] + '" height="' + size[1] + '"></iframe>';
            }
          };
        }
      }
    }, {}, $__super);
  }(paella.ButtonPlugin);
});

"use strict";
paella.addPlugin(function() {
  return function($__super) {
    function VideoLoadTestPlugin() {
      $traceurRuntime.superConstructor(VideoLoadTestPlugin).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(VideoLoadTestPlugin, {
      getName: function() {
        return 'es.upv.paella.test.videoLoadPlugin';
      },
      checkEnabled: function(onSuccess) {
        this.startTime = 0;
        this.endTime = 0;
        this.startTime = Date.now();
        if (base.dictionary.currentLanguage() == 'es') {
          var esDict = {'Video loaded in {0} seconds': 'Video cargado en {0} segundos'};
          base.dictionary.addDictionary(esDict);
        }
        onSuccess(true);
      },
      getEvents: function() {
        return [paella.events.loadComplete];
      },
      onEvent: function(eventType, params) {
        switch (eventType) {
          case paella.events.loadComplete:
            this.onLoadComplete();
            break;
        }
      },
      onLoadComplete: function() {
        this.endTime = Date.now();
        var bench = (this.endTime - this.startTime) / 1000.0;
        this.showOverlayMessage(base.dictionary.translate("Video loaded in {0} seconds").replace(/\{0\}/g, bench));
      },
      showOverlayMessage: function(message) {
        var overlayContainer = paella.player.videoContainer.overlayContainer;
        var rect = {
          left: 40,
          top: 50,
          width: 430,
          height: 80
        };
        var root = document.createElement("div");
        root.className = 'videoLoadTestOverlay';
        var button = document.createElement("div");
        button.className = "btn";
        button.innerText = "X";
        button.onclick = function() {
          overlayContainer.removeElement(root);
        };
        var element = document.createElement("div");
        element.className = 'videoLoadTest';
        element.innerText = message;
        element.appendChild(button);
        root.appendChild(element);
        overlayContainer.addElement(root, rect);
      }
    }, {}, $__super);
  }(paella.EventDrivenPlugin);
});

"use strict";
paella.addPlugin(function() {
  return function($__super) {
    function ThemeChooserPlugin() {
      $traceurRuntime.superConstructor(ThemeChooserPlugin).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(ThemeChooserPlugin, {
      getAlignment: function() {
        return 'right';
      },
      getSubclass: function() {
        return "themeChooserPlugin";
      },
      getIconClass: function() {
        return 'icon-paintbrush';
      },
      getIndex: function() {
        return 2030;
      },
      getMinWindowSize: function() {
        return 600;
      },
      getName: function() {
        return "es.upv.paella.themeChooserPlugin";
      },
      getDefaultToolTip: function() {
        return base.dictionary.translate("Change theme");
      },
      getButtonType: function() {
        return paella.ButtonPlugin.type.popUpButton;
      },
      checkEnabled: function(onSuccess) {
        this.currentUrl = null;
        this.currentMaster = null;
        this.currentSlave = null;
        this.availableMasters = [];
        this.availableSlaves = [];
        if (paella.player.config.skin && paella.player.config.skin.available && (paella.player.config.skin.available instanceof Array) && (paella.player.config.skin.available.length > 0)) {
          onSuccess(true);
        } else {
          onSuccess(false);
        }
      },
      buildContent: function(domElement) {
        var This = this;
        paella.player.config.skin.available.forEach(function(item) {
          var elem = document.createElement('div');
          elem.className = "themebutton";
          elem.innerText = item.replace('-', ' ').replace('_', ' ');
          $(elem).click(function(event) {
            paella.utils.skin.set(item);
            paella.player.controls.hidePopUp(This.getName());
          });
          domElement.appendChild(elem);
        });
      }
    }, {}, $__super);
  }(paella.ButtonPlugin);
});

"use strict";
paella.addDataDelegate("cameraTrack", function() {
  return function($__super) {
    function TrackCameraDataDelegate() {
      $traceurRuntime.superConstructor(TrackCameraDataDelegate).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(TrackCameraDataDelegate, {
      read: function(context, params, onSuccess) {
        var videoUrl = paella.player.videoLoader.getVideoUrl();
        if (videoUrl) {
          videoUrl += 'trackhd.json';
          paella.utils.ajax.get({url: videoUrl}, function(data) {
            if (typeof(data) === "string") {
              try {
                data = JSON.parse(data);
              } catch (err) {}
            }
            data.positions.sort(function(a, b) {
              return a.time - b.time;
            });
            onSuccess(data);
          }, function() {
            return onSuccess(null);
          });
        } else {
          onSuccess(null);
        }
      },
      write: function(context, params, value, onSuccess) {},
      remove: function(context, params, onSuccess) {}
    }, {}, $__super);
  }(paella.DataDelegate);
});
(function() {
  var g_track4kPlugin = null;
  function updatePosition(positionData, nextFrameData) {
    var twinTime = nextFrameData ? (nextFrameData.time - positionData.time) * 1000 : 100;
    if (twinTime > 2000)
      twinTime = 2000;
    var rect = (positionData && positionData.rect) || [0, 0, 0, 0];
    var offset_x = Math.abs(rect[0]);
    var offset_y = Math.abs(rect[1]);
    var view_width = rect[2];
    var view_height = rect[3];
    var zoom = this._videoData.originalWidth / view_width;
    var left = offset_x / this._videoData.originalWidth;
    var top = offset_y / this._videoData.originalHeight;
    paella.player.videoContainer.masterVideo().setZoom(zoom * 100, left * zoom * 100, top * zoom * 100, twinTime);
  }
  function nextFrame(time) {
    var index = -1;
    time = Math.round(time);
    this._trackData.some(function(data, i) {
      if (data.time >= time) {
        index = i;
      }
      return index !== -1;
    });
    if (this._trackData.length > index + 1) {
      return this._trackData[index + 1];
    } else {
      return null;
    }
  }
  function prevFrame(time) {
    var frame = this._trackData[0];
    time = Math.round(time);
    this._trackData.some(function(data, i, frames) {
      if (frames[i + 1]) {
        if (data.time <= time && frames[i + 1].time > time) {
          return true;
        }
      } else {
        return true;
      }
      frame = data;
      return false;
    });
    return frame;
  }
  function curFrame(time) {
    var frameRect = null;
    time = Math.round(time);
    this._trackData.some(function(data, i, frames) {
      if (data.time <= time) {
        if (frames[i + 1]) {
          if (frames[i + 1].time > time) {
            frameRect = data;
          }
        } else {
          frameRect = data;
        }
      }
      return frameRect !== null;
    });
    return frameRect;
  }
  paella.addPlugin(function() {
    return function($__super) {
      function Track4KPlugin() {
        $traceurRuntime.superConstructor(Track4KPlugin).call(this);
        g_track4kPlugin = this;
        this._videoData = {};
        this._trackData = [];
        this._enabled = true;
      }
      return ($traceurRuntime.createClass)(Track4KPlugin, {
        checkEnabled: function(cb) {
          var $__2 = this;
          paella.data.read('cameraTrack', {id: paella.initDelegate.getId()}, function(data) {
            if (data) {
              $__2._videoData.width = data.width;
              $__2._videoData.height = data.height;
              $__2._videoData.originalWidth = data.originalWidth;
              $__2._videoData.originalHeight = data.originalHeight;
              $__2._trackData = data.positions;
              $__2._enabled = true;
            } else {
              $__2._enabled = false;
            }
            cb($__2._enabled);
          });
        },
        get enabled() {
          return this._enabled;
        },
        set enabled(e) {
          this._enabled = e;
          if (this._enabled) {
            var thisClass = this;
            paella.player.videoContainer.currentTime().then(function(time) {
              thisClass.updateZoom(time);
            });
          }
        },
        getName: function() {
          return "es.upv.paella.track4kPlugin";
        },
        getEvents: function() {
          return [paella.events.timeupdate, paella.events.play, paella.events.seekToTime];
        },
        onEvent: function(eventType, data) {
          if (!this._trackData.length)
            return;
          if (eventType === paella.events.play) {} else if (eventType === paella.events.timeupdate) {
            this.updateZoom(data.currentTime);
          } else if (eventType === paella.events.seekToTime) {
            this.seekTo(data.newPosition);
          }
        },
        updateZoom: function(currentTime) {
          if (this._enabled) {
            var data = curFrame.apply(this, [currentTime]);
            var nextFrameData = nextFrame.apply(this, [currentTime]);
            if (data && this._lastPosition !== data) {
              this._lastPosition = data;
              updatePosition.apply(this, [data, nextFrameData]);
            }
          }
        },
        seekTo: function(time) {
          var data = prevFrame.apply(this, [time]);
          if (data && this._enabled) {
            this._lastPosition = data;
            updatePosition.apply(this, [data]);
          }
        }
      }, {}, $__super);
    }(paella.EventDrivenPlugin);
  });
  paella.addPlugin(function() {
    return function($__super) {
      function VideoZoomTrack4KPlugin() {
        $traceurRuntime.superConstructor(VideoZoomTrack4KPlugin).apply(this, arguments);
      }
      return ($traceurRuntime.createClass)(VideoZoomTrack4KPlugin, {
        getAlignment: function() {
          return 'right';
        },
        getSubclass: function() {
          return "videoZoomToolbar";
        },
        getIconClass: function() {
          return 'icon-screen';
        },
        closeOnMouseOut: function() {
          return true;
        },
        getIndex: function() {
          return 2030;
        },
        getMinWindowSize: function() {
          return (paella.player.config.player && paella.player.config.player.videoZoom && paella.player.config.player.videoZoom.minWindowSize) || 600;
        },
        getName: function() {
          return "es.upv.paella.videoZoomTrack4kPlugin";
        },
        getDefaultToolTip: function() {
          return base.dictionary.translate("Set video zoom");
        },
        getButtonType: function() {
          return paella.ButtonPlugin.type.popUpButton;
        },
        checkEnabled: function(onSuccess) {
          var players = paella.player.videoContainer.streamProvider.videoPlayers;
          var pluginData = paella.player.config.plugins.list[this.getName()];
          var playerIndex = pluginData.targetStreamIndex;
          var autoByDefault = pluginData.autoModeByDefault;
          this.targetPlayer = players.length > playerIndex ? players[playerIndex] : null;
          g_track4kPlugin.enabled = autoByDefault;
          onSuccess(paella.player.config.player.videoZoom.enabled && this.targetPlayer && this.targetPlayer.allowZoom());
        },
        setup: function() {
          console.log(this.config);
          if (this.config.autoModeByDefault) {
            this.zoomAuto();
          } else {
            this.resetZoom();
          }
        },
        buildContent: function(domElement) {
          var $__2 = this;
          this.changeIconClass("icon-mini-zoom-in");
          g_track4kPlugin.updateTrackingStatus = function() {
            if (g_track4kPlugin.enabled) {
              $('.zoom-auto').addClass("autoTrackingActivated");
              $('.icon-mini-zoom-in').addClass("autoTrackingActivated");
            } else {
              $('.zoom-auto').removeClass("autoTrackingActivated");
              $('.icon-mini-zoom-in').removeClass("autoTrackingActivated");
            }
          };
          paella.events.bind(paella.events.videoZoomChanged, function(evt, target) {
            g_track4kPlugin.updateTrackingStatus;
          });
          g_track4kPlugin.updateTrackingStatus;
          function getZoomButton(className, onClick, content) {
            var btn = document.createElement('div');
            btn.className = ("videoZoomToolbarItem " + className);
            if (content) {
              btn.innerText = content;
            } else {
              btn.innerHTML = ("<i class=\"glyphicon glyphicon-" + className + "\"></i>");
            }
            $(btn).click(onClick);
            return btn;
          }
          domElement.appendChild(getZoomButton('zoom-in', function(evt) {
            $__2.zoomIn();
          }));
          domElement.appendChild(getZoomButton('zoom-out', function(evt) {
            $__2.zoomOut();
          }));
          domElement.appendChild(getZoomButton('picture', function(evt) {
            $__2.resetZoom();
          }));
          domElement.appendChild(getZoomButton('zoom-auto', function(evt) {
            $__2.zoomAuto();
            paella.player.controls.hidePopUp($__2.getName());
          }, "auto"));
        },
        zoomIn: function() {
          g_track4kPlugin.enabled = false;
          this.targetPlayer.zoomIn();
        },
        zoomOut: function() {
          g_track4kPlugin.enabled = false;
          this.targetPlayer.zoomOut();
        },
        resetZoom: function() {
          g_track4kPlugin.enabled = false;
          this.targetPlayer.setZoom(100, 0, 0, 500);
          if (g_track4kPlugin.updateTrackingStatus)
            g_track4kPlugin.updateTrackingStatus();
        },
        zoomAuto: function() {
          g_track4kPlugin.enabled = !g_track4kPlugin.enabled;
          if (g_track4kPlugin.updateTrackingStatus)
            g_track4kPlugin.updateTrackingStatus();
        }
      }, {}, $__super);
    }(paella.ButtonPlugin);
  });
})();

"use strict";
paella.plugins.translectures = {};
Class("paella.captions.translectures.Caption", paella.captions.Caption, {
  initialize: function(id, format, url, lang, editURL, next) {
    this.parent(id, format, url, lang, next);
    this._captionsProvider = "translecturesCaptionsProvider";
    this._editURL = editURL;
  },
  canEdit: function(next) {
    next(false, ((this._editURL != undefined) && (this._editURL != "")));
  },
  goToEdit: function() {
    var self = this;
    paella.player.auth.userData().then(function(userData) {
      if (userData.isAnonymous == true) {
        self.askForAnonymousOrLoginEdit();
      } else {
        self.doEdit();
      }
    });
  },
  doEdit: function() {
    window.location.href = this._editURL;
  },
  doLoginAndEdit: function() {
    paella.player.auth.login(this._editURL);
  },
  askForAnonymousOrLoginEdit: function() {
    var self = this;
    var messageBoxElem = document.createElement('div');
    messageBoxElem.className = "translecturesCaptionsMessageBox";
    var messageBoxTitle = document.createElement('div');
    messageBoxTitle.className = "title";
    messageBoxTitle.innerText = base.dictionary.translate("You are trying to modify the transcriptions, but you are not Logged in!");
    messageBoxElem.appendChild(messageBoxTitle);
    var messageBoxAuthContainer = document.createElement('div');
    messageBoxAuthContainer.className = "authMethodsContainer";
    messageBoxElem.appendChild(messageBoxAuthContainer);
    var messageBoxAuth = document.createElement('div');
    messageBoxAuth.className = "authMethod";
    messageBoxAuthContainer.appendChild(messageBoxAuth);
    var messageBoxAuthLink = document.createElement('a');
    messageBoxAuthLink.href = "#";
    messageBoxAuthLink.style.color = "#004488";
    messageBoxAuth.appendChild(messageBoxAuthLink);
    var messageBoxAuthLinkImg = document.createElement('img');
    messageBoxAuthLinkImg.src = "resources/style/caption_mlangs_anonymous.png";
    messageBoxAuthLinkImg.alt = "Anonymous";
    messageBoxAuthLinkImg.style.height = "100px";
    messageBoxAuthLink.appendChild(messageBoxAuthLinkImg);
    var messageBoxAuthLinkText = document.createElement('p');
    messageBoxAuthLinkText.innerText = base.dictionary.translate("Continue editing the transcriptions anonymously");
    messageBoxAuthLink.appendChild(messageBoxAuthLinkText);
    $(messageBoxAuthLink).click(function() {
      self.doEdit();
    });
    messageBoxAuth = document.createElement('div');
    messageBoxAuth.className = "authMethod";
    messageBoxAuthContainer.appendChild(messageBoxAuth);
    messageBoxAuthLink = document.createElement('a');
    messageBoxAuthLink.href = "#";
    messageBoxAuthLink.style.color = "#004488";
    messageBoxAuth.appendChild(messageBoxAuthLink);
    messageBoxAuthLinkImg = document.createElement('img');
    messageBoxAuthLinkImg.src = "resources/style/caption_mlangs_lock.png";
    messageBoxAuthLinkImg.alt = "Login";
    messageBoxAuthLinkImg.style.height = "100px";
    messageBoxAuthLink.appendChild(messageBoxAuthLinkImg);
    messageBoxAuthLinkText = document.createElement('p');
    messageBoxAuthLinkText.innerText = base.dictionary.translate("Log in and edit the transcriptions");
    messageBoxAuthLink.appendChild(messageBoxAuthLinkText);
    $(messageBoxAuthLink).click(function() {
      self.doLoginAndEdit();
    });
    paella.messageBox.showElement(messageBoxElem);
  }
});
Class("paella.plugins.translectures.CaptionsPlugIn", paella.EventDrivenPlugin, {
  getName: function() {
    return "es.upv.paella.translecture.captionsPlugin";
  },
  getEvents: function() {
    return [];
  },
  onEvent: function(eventType, params) {},
  checkEnabled: function(onSuccess) {
    var self = this;
    var video_id = paella.player.videoIdentifier;
    if ((this.config.tLServer == undefined) || (this.config.tLdb == undefined)) {
      base.log.warning(this.getName() + " plugin not configured!");
      onSuccess(false);
    } else {
      var langs_url = (this.config.tLServer + "/langs?db=${tLdb}&id=${videoId}").replace(/\$\{videoId\}/ig, video_id).replace(/\$\{tLdb\}/ig, this.config.tLdb);
      base.ajax.get({url: langs_url}, function(data, contentType, returnCode, dataRaw) {
        if (data.scode == 0) {
          data.langs.forEach(function(l) {
            var l_get_url = (self.config.tLServer + "/dfxp?format=1&pol=0&db=${tLdb}&id=${videoId}&lang=${tl.lang.code}").replace(/\$\{videoId\}/ig, video_id).replace(/\$\{tLdb\}/ig, self.config.tLdb).replace(/\$\{tl.lang.code\}/ig, l.code);
            var l_edit_url;
            if (self.config.tLEdit) {
              l_edit_url = self.config.tLEdit.replace(/\$\{videoId\}/ig, video_id).replace(/\$\{tLdb\}/ig, self.config.tLdb).replace(/\$\{tl.lang.code\}/ig, l.code);
            }
            var l_txt = l.value;
            switch (l.type) {
              case 0:
                l_txt += " (" + paella.dictionary.translate("Auto") + ")";
                break;
              case 1:
                l_txt += " (" + paella.dictionary.translate("Under review") + ")";
                break;
            }
            var c = new paella.captions.translectures.Caption(l.code, "dfxp", l_get_url, {
              code: l.code,
              txt: l_txt
            }, l_edit_url);
            paella.captions.addCaptions(c);
          });
          onSuccess(false);
        } else {
          base.log.debug("Error getting available captions from translectures: " + langs_url);
          onSuccess(false);
        }
      }, function(data, contentType, returnCode) {
        base.log.debug("Error getting available captions from translectures: " + langs_url);
        onSuccess(false);
      });
    }
  }
});
new paella.plugins.translectures.CaptionsPlugIn();

"use strict";
paella.addPlugin(function() {
  return function($__super) {
    function ElasticsearchSaverPlugin() {
      $traceurRuntime.superConstructor(ElasticsearchSaverPlugin).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(ElasticsearchSaverPlugin, {
      getName: function() {
        return "es.upv.paella.usertracking.elasticsearchSaverPlugin";
      },
      checkEnabled: function(onSuccess) {
        this.type = 'userTrackingSaverPlugIn';
        this._url = this.config.url;
        this._index = this.config.index || "paellaplayer";
        this._type = this.config.type || "usertracking";
        var enabled = true;
        if (this._url == undefined) {
          enabled = false;
          base.log.debug("No ElasticSearch URL found in config file. Disabling ElasticSearch PlugIn");
        }
        onSuccess(enabled);
      },
      log: function(event, params) {
        var $__2 = this;
        var p = params;
        if ($traceurRuntime.typeof((p)) != "object") {
          p = {value: p};
        }
        var currentTime = 0;
        paella.player.videoContainer.currentTime().then(function(t) {
          currentTime = t;
          return paella.player.videoContainer.paused();
        }).then(function(paused) {
          var log = {
            date: new Date(),
            video: paella.initDelegate.getId(),
            playing: !paused,
            time: parseInt(currentTime + paella.player.videoContainer.trimStart()),
            event: event,
            params: p
          };
          paella.ajax.post({
            url: $__2._url + "/" + $__2._index + "/" + $__2._type + "/",
            params: JSON.stringify(log)
          });
        });
      }
    }, {}, $__super);
  }(paella.userTracking.SaverPlugIn);
});

"use strict";
paella.addPlugin(function() {
  return function($__super) {
    function GoogleAnalyticsTracking() {
      $traceurRuntime.superConstructor(GoogleAnalyticsTracking).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(GoogleAnalyticsTracking, {
      getName: function() {
        return "es.upv.paella.usertracking.GoogleAnalyticsSaverPlugin";
      },
      checkEnabled: function(onSuccess) {
        var trackingID = this.config.trackingID;
        var domain = this.config.domain || "auto";
        if (trackingID) {
          base.log.debug("Google Analitycs Enabled");
          (function(i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r;
            i[r] = i[r] || function() {
              (i[r].q = i[r].q || []).push(arguments);
            }, i[r].l = 1 * new Date();
            a = s.createElement(o), m = s.getElementsByTagName(o)[0];
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m);
          })(window, document, 'script', '//www.google-analytics.com/analytics.js', '__gaTracker');
          __gaTracker('create', trackingID, domain);
          __gaTracker('send', 'pageview');
          onSuccess(true);
        } else {
          base.log.debug("No Google Tracking ID found in config file. Disabling Google Analitycs PlugIn");
          onSuccess(false);
        }
      },
      log: function(event, params) {
        if ((this.config.category === undefined) || (this.config.category === true)) {
          var category = this.config.category || "PaellaPlayer";
          var action = event;
          var label = "";
          try {
            label = JSON.stringify(params);
          } catch (e) {}
          __gaTracker('send', 'event', category, action, label);
        }
      }
    }, {}, $__super);
  }(paella.userTracking.SaverPlugIn);
});

"use strict";
var _paq = _paq || [];
paella.addPlugin(function() {
  return function($__super) {
    function PiwikAnalyticsTracking() {
      $traceurRuntime.superConstructor(PiwikAnalyticsTracking).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(PiwikAnalyticsTracking, {
      getName: function() {
        return "es.upv.paella.usertracking.piwikSaverPlugIn";
      },
      checkEnabled: function(onSuccess) {
        if (this.config.tracker && this.config.siteId) {
          _paq.push(['trackPageView']);
          _paq.push(['enableLinkTracking']);
          (function() {
            var u = this.config.tracker;
            _paq.push(['setTrackerUrl', u + '/piwik.php']);
            _paq.push(['setSiteId', this.config.siteId]);
            var d = document,
                g = d.createElement('script'),
                s = d.getElementsByTagName('script')[0];
            g.type = 'text/javascript';
            g.async = true;
            g.defer = true;
            g.src = u + 'piwik.js';
            s.parentNode.insertBefore(g, s);
            onSuccess(true);
          })();
        } else {
          onSuccess(false);
        }
      },
      log: function(event, params) {
        var category = this.config.category || "PaellaPlayer";
        var action = event;
        var label = "";
        try {
          label = JSON.stringify(params);
        } catch (e) {}
        _paq.push(['trackEvent', category, action, label]);
      }
    }, {}, $__super);
  }(paella.userTracking.SaverPlugIn);
});

"use strict";
function buildVideo360Canvas(stream, canvas) {
  var Video360Canvas = function($__super) {
    function Video360Canvas(stream) {
      $traceurRuntime.superConstructor(Video360Canvas).call(this);
      this.stream = stream;
    }
    return ($traceurRuntime.createClass)(Video360Canvas, {
      get video() {
        return this.texture ? this.texture.video : null;
      },
      loaded: function() {
        var $__2 = this;
        return new Promise(function(resolve) {
          var checkLoaded = function() {
            if ($__2.video) {
              resolve($__2);
            } else {
              setTimeout(checkLoaded, 100);
            }
          };
          checkLoaded();
        });
      },
      buildScene: function() {
        var $__2 = this;
        this._root = new bg.scene.Node(this.gl, "Root node");
        bg.base.Loader.RegisterPlugin(new bg.base.TextureLoaderPlugin());
        bg.base.Loader.RegisterPlugin(new bg.base.VideoTextureLoaderPlugin());
        bg.base.Loader.RegisterPlugin(new bg.base.VWGLBLoaderPlugin());
        bg.base.Loader.Load(this.gl, this.stream.src).then(function(texture) {
          $__2.texture = texture;
          var sphere = bg.scene.PrimitiveFactory.Sphere($__2.gl, 1, 50);
          var sphereNode = new bg.scene.Node($__2.gl);
          sphereNode.addComponent(sphere);
          sphere.getMaterial(0).texture = texture;
          sphere.getMaterial(0).lightEmission = 1.0;
          sphere.getMaterial(0).lightEmissionMaskInvert = true;
          sphere.getMaterial(0).cullFace = false;
          $__2._root.addChild(sphereNode);
          $__2.postRedisplay();
        });
        var lightNode = new bg.scene.Node(this.gl, "Light");
        this._root.addChild(lightNode);
        this._camera = new bg.scene.Camera();
        var cameraNode = new bg.scene.Node("Camera");
        cameraNode.addComponent(this._camera);
        cameraNode.addComponent(new bg.scene.Transform());
        var oc = new bg.manipulation.OrbitCameraController();
        cameraNode.addComponent(oc);
        oc.maxPitch = 90;
        oc.minPitch = -90;
        oc.maxDistance = 0;
        oc.minDistace = 0;
        this._root.addChild(cameraNode);
      },
      init: function() {
        bg.Engine.Set(new bg.webgl1.Engine(this.gl));
        this.buildScene();
        this._renderer = bg.render.Renderer.Create(this.gl, bg.render.RenderPath.FORWARD);
        this._inputVisitor = new bg.scene.InputVisitor();
      },
      frame: function(delta) {
        if (this.texture) {
          this.texture.update();
        }
        this._renderer.frame(this._root, delta);
      },
      display: function() {
        this._renderer.display(this._root, this._camera);
      },
      reshape: function(width, height) {
        this._camera.viewport = new bg.Viewport(0, 0, width, height);
        this._camera.projection.perspective(60, this._camera.viewport.aspectRatio, 0.1, 100);
      },
      mouseDown: function(evt) {
        this._inputVisitor.mouseDown(this._root, evt);
      },
      mouseDrag: function(evt) {
        this._inputVisitor.mouseDrag(this._root, evt);
        this.postRedisplay();
      },
      mouseWheel: function(evt) {
        this._inputVisitor.mouseWheel(this._root, evt);
        this.postRedisplay();
      },
      touchStart: function(evt) {
        this._inputVisitor.touchStart(this._root, evt);
      },
      touchMove: function(evt) {
        this._inputVisitor.touchMove(this._root, evt);
        this.postRedisplay();
      },
      mouseUp: function(evt) {
        this._inputVisitor.mouseUp(this._root, evt);
      },
      mouseMove: function(evt) {
        this._inputVisitor.mouseMove(this._root, evt);
      },
      mouseOut: function(evt) {
        this._inputVisitor.mouseOut(this._root, evt);
      },
      touchEnd: function(evt) {
        this._inputVisitor.touchEnd(this._root, evt);
      }
    }, {}, $__super);
  }(bg.app.WindowController);
  var controller = new Video360Canvas(stream);
  var mainLoop = bg.app.MainLoop.singleton;
  mainLoop.updateMode = bg.app.FrameUpdate.AUTO;
  mainLoop.canvas = canvas;
  mainLoop.run(controller);
  return controller.loaded();
}
Class("paella.Video360", paella.VideoElementBase, {
  _posterFrame: null,
  _currentQuality: null,
  _autoplay: false,
  _streamName: null,
  initialize: function(id, stream, left, top, width, height, streamName) {
    this.parent(id, stream, 'canvas', 0, 0, 1280, 720);
    this._streamName = streamName || 'video360';
    var This = this;
    paella.player.videoContainer.disablePlayOnClick();
    if (this._stream.sources[this._streamName]) {
      this._stream.sources[this._streamName].sort(function(a, b) {
        return a.res.h - b.res.h;
      });
    }
    this.video = null;
    function onProgress(event) {
      if (!This._ready && This.video.readyState == 4) {
        This._ready = true;
        if (This._initialCurrentTipe !== undefined) {
          This.video.currentTime = This._initialCurrentTime;
          delete This._initialCurrentTime;
        }
        This._callReadyEvent();
      }
    }
    function evtCallback(event) {
      onProgress.apply(This, event);
    }
    function onUpdateSize() {
      if (This.canvasController) {
        var canvas = This.canvasController.canvas.domElement;
      }
    }
    var timer = new paella.Timer(function(timer) {
      onUpdateSize();
    }, 500);
    timer.repeat = true;
  },
  defaultProfile: function() {
    return 'chroma';
  },
  _setVideoElem: function(video) {
    $(this.video).bind('progress', evtCallback);
    $(this.video).bind('loadstart', evtCallback);
    $(this.video).bind('loadedmetadata', evtCallback);
    $(this.video).bind('canplay', evtCallback);
    $(this.video).bind('oncanplay', evtCallback);
  },
  _loadDeps: function() {
    return new Promise(function(resolve, reject) {
      if (!window.$paella_bg2e) {
        paella.require(paella.baseUrl + 'resources/deps/bg2e.js').then(function() {
          window.$paella_bg2e = bg;
          resolve(window.$paella_bg2e);
        }).catch(function(err) {
          console.error(err.message);
          reject();
        });
      } else {
        defer.resolve(window.$paella_bg2e);
      }
    });
  },
  _deferredAction: function(action) {
    var $__2 = this;
    return new Promise(function(resolve, reject) {
      if ($__2.video) {
        resolve(action());
      } else {
        $($__2.video).bind('canplay', function() {
          $__2._ready = true;
          resolve(action());
        });
      }
    });
  },
  _getQualityObject: function(index, s) {
    return {
      index: index,
      res: s.res,
      src: s.src,
      toString: function() {
        return this.res.w + "x" + this.res.h;
      },
      shortLabel: function() {
        return this.res.h + "p";
      },
      compare: function(q2) {
        return this.res.w * this.res.h - q2.res.w * q2.res.h;
      }
    };
  },
  allowZoom: function() {
    return false;
  },
  getVideoData: function() {
    var $__2 = this;
    var This = this;
    return new Promise(function(resolve, reject) {
      $__2._deferredAction(function() {
        resolve({
          duration: This.video.duration,
          currentTime: This.video.currentTime,
          volume: This.video.volume,
          paused: This.video.paused,
          ended: This.video.ended,
          res: {
            w: This.video.videoWidth,
            h: This.video.videoHeight
          }
        });
      });
    });
  },
  setPosterFrame: function(url) {
    this._posterFrame = url;
  },
  setAutoplay: function(auto) {
    this._autoplay = auto;
    if (auto && this.video) {
      this.video.setAttribute("autoplay", auto);
    }
  },
  load: function() {
    var $__2 = this;
    var This = this;
    return new Promise(function(resolve, reject) {
      $__2._loadDeps().then(function() {
        var sources = $__2._stream.sources[$__2._streamName];
        if ($__2._currentQuality === null && $__2._videoQualityStrategy) {
          $__2._currentQuality = $__2._videoQualityStrategy.getQualityIndex(sources);
        }
        var stream = $__2._currentQuality < sources.length ? sources[$__2._currentQuality] : null;
        $__2.video = null;
        if (stream) {
          $__2.canvasController = null;
          buildVideo360Canvas(stream, $__2.domElement).then(function(canvasController) {
            $__2.canvasController = canvasController;
            $__2.video = canvasController.video;
            $__2.video.pause();
            $__2.disableEventCapture();
            resolve(stream);
          });
        } else {
          reject(new Error("Could not load video: invalid quality stream index"));
        }
      });
    });
  },
  getQualities: function() {
    var $__2 = this;
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        var result = [];
        var sources = $__2._stream.sources[$__2._streamName];
        var index = -1;
        sources.forEach(function(s) {
          index++;
          result.push($__2._getQualityObject(index, s));
        });
        resolve(result);
      }, 10);
    });
  },
  setQuality: function(index) {
    var $__2 = this;
    return new Promise(function(resolve) {
      var paused = $__2.video.paused;
      var sources = $__2._stream.sources[$__2._streamName];
      $__2._currentQuality = index < sources.length ? index : 0;
      var currentTime = $__2.video.currentTime;
      $__2.freeze().then(function() {
        $__2._ready = false;
        return $__2.load();
      }).then(function() {
        if (!paused) {
          $__2.play();
        }
        $($__2.video).on('seeked', function() {
          $__2.unFreeze();
          resolve();
          $($__2.video).off('seeked');
        });
        $__2.video.currentTime = currentTime;
      });
    });
  },
  getCurrentQuality: function() {
    var $__2 = this;
    return new Promise(function(resolve) {
      resolve($__2._getQualityObject($__2._currentQuality, $__2._stream.sources[$__2._streamName][$__2._currentQuality]));
    });
  },
  play: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      bg.app.MainLoop.singleton.updateMode = bg.app.FrameUpdate.AUTO;
      $__2.video.play();
    });
  },
  pause: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      bg.app.MainLoop.singleton.updateMode = bg.app.FrameUpdate.MANUAL;
      $__2.video.pause();
    });
  },
  isPaused: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      return $__2.video.paused;
    });
  },
  duration: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      return $__2.video.duration;
    });
  },
  setCurrentTime: function(time) {
    var $__2 = this;
    return this._deferredAction(function() {
      $__2.video.currentTime = time;
      $($__2.video).on('seeked', function() {
        $__2.canvasController.postRedisplay();
        $($__2.video).off('seeked');
      });
    });
  },
  currentTime: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      return $__2.video.currentTime;
    });
  },
  setVolume: function(volume) {
    var $__2 = this;
    return this._deferredAction(function() {
      $__2.video.volume = volume;
    });
  },
  volume: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      return $__2.video.volume;
    });
  },
  setPlaybackRate: function(rate) {
    var $__2 = this;
    return this._deferredAction(function() {
      $__2.video.playbackRate = rate;
    });
  },
  playbackRate: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      return $__2.video.playbackRate;
    });
  },
  goFullScreen: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      var elem = $__2.video;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitEnterFullscreen) {
        elem.webkitEnterFullscreen();
      }
    });
  },
  unFreeze: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      var c = document.getElementById($__2.video.className + "canvas");
      $(c).remove();
    });
  },
  freeze: function() {
    var This = this;
    return this._deferredAction(function() {});
  },
  unload: function() {
    this._callUnloadEvent();
    return paella_DeferredNotImplemented();
  },
  getDimensions: function() {
    return paella_DeferredNotImplemented();
  }
});
Class("paella.videoFactories.Video360Factory", {
  isStreamCompatible: function(streamData) {
    try {
      if (paella.ChromaVideo._loaded) {
        return false;
      }
      if (paella.videoFactories.Html5VideoFactory.s_instances > 0 && base.userAgent.system.iOS) {
        return false;
      }
      for (var key in streamData.sources) {
        if (key == 'video360')
          return true;
      }
    } catch (e) {}
    return false;
  },
  getVideoObject: function(id, streamData, rect) {
    paella.ChromaVideo._loaded = true;
    ++paella.videoFactories.Html5VideoFactory.s_instances;
    return new paella.Video360(id, streamData, rect.x, rect.y, rect.w, rect.h);
  }
});

"use strict";
function buildVideo360ThetaCanvas(stream, canvas) {
  function cyln2world(a, e) {
    return (new bg.Vector3(Math.cos(e) * Math.cos(a), Math.cos(e) * Math.sin(a), Math.sin(e)));
  }
  function world2fish(x, y, z) {
    var nz = z;
    if (z < -1.0)
      nz = -1.0;
    else if (z > 1.0)
      nz = 1.0;
    return (new bg.Vector2(Math.atan2(y, x), Math.acos(nz) / Math.PI));
  }
  function calcTexUv(i, j, lens) {
    var world = cyln2world(((i + 90) / 180.0 - 1.0) * Math.PI, (0.5 - j / 180.0) * Math.PI);
    var ar = world2fish(Math.sin(-0.5 * Math.PI) * world.z + Math.cos(-0.5 * Math.PI) * world.x, world.y, Math.cos(-0.5 * Math.PI) * world.z - Math.sin(-0.5 * Math.PI) * world.x);
    var fishRad = 0.883;
    var fishRad2 = fishRad * 0.88888888888888;
    var fishCenter = 1.0 - 0.44444444444444;
    var x = (lens === 0) ? fishRad * ar.y * Math.cos(ar.x) * 0.5 + 0.25 : fishRad * (1.0 - ar.y) * Math.cos(-1.0 * ar.x + Math.PI) * 0.5 + 0.75;
    var y = (lens === 0) ? fishRad2 * ar.y * Math.sin(ar.x) + fishCenter : fishRad2 * (1.0 - ar.y) * Math.sin(-1.0 * ar.x + Math.PI) + fishCenter;
    return (new bg.Vector2(x, y));
  }
  function buildViewerNode(ctx) {
    var radius = 1;
    var node = new bg.scene.Node(ctx);
    var drw = new bg.scene.Drawable();
    node.addComponent(drw);
    var plist = new bg.base.PolyList(ctx);
    var vertex = [];
    var normals = [];
    var uvs = [];
    var index = [];
    for (var j = 0; j <= 180; j += 5) {
      for (var i = 0; i <= 360; i += 5) {
        vertex.push(new bg.Vector3(Math.sin(Math.PI * j / 180.0) * Math.sin(Math.PI * i / 180.0) * radius, Math.cos(Math.PI * j / 180.0) * radius, Math.sin(Math.PI * j / 180.0) * Math.cos(Math.PI * i / 180.0) * radius));
        normals.push(new bg.Vector3(0, 0, -1));
      }
      for (var k = 0; k <= 180; k += 5) {
        uvs.push(calcTexUv(k, j, 0));
      }
      for (var l = 180; l <= 360; l += 5) {
        uvs.push(calcTexUv(l, j, 1));
      }
    }
    function addFace(v0, v1, v2, n0, n1, n2, uv0, uv1, uv2) {
      plist.vertex.push(v0.x);
      plist.vertex.push(v0.y);
      plist.vertex.push(v0.z);
      plist.vertex.push(v1.x);
      plist.vertex.push(v1.y);
      plist.vertex.push(v1.z);
      plist.vertex.push(v2.x);
      plist.vertex.push(v2.y);
      plist.vertex.push(v2.z);
      plist.normal.push(n0.x);
      plist.normal.push(n0.y);
      plist.normal.push(n0.z);
      plist.normal.push(n1.x);
      plist.normal.push(n1.y);
      plist.normal.push(n1.z);
      plist.normal.push(n2.x);
      plist.normal.push(n2.z);
      plist.normal.push(n2.z);
      plist.texCoord0.push(uv0.x);
      plist.texCoord0.push(uv0.y);
      plist.texCoord0.push(uv1.x);
      plist.texCoord0.push(uv1.y);
      plist.texCoord0.push(uv2.x);
      plist.texCoord0.push(uv2.y);
      plist.index.push(plist.index.length);
      plist.index.push(plist.index.length);
      plist.index.push(plist.index.length);
    }
    for (var m = 0; m < 36; m++) {
      for (var n = 0; n < 72; n++) {
        var v = m * 73 + n;
        var t = (n < 36) ? m * 74 + n : m * 74 + n + 1;
        ([uvs[t + 0], uvs[t + 1], uvs[t + 74]], [uvs[t + 1], uvs[t + 75], uvs[t + 74]]);
        var v0 = vertex[v + 0];
        var n0 = normals[v + 0];
        var uv0 = uvs[t + 0];
        var v1 = vertex[v + 1];
        var n1 = normals[v + 1];
        var uv1 = uvs[t + 1];
        var v2 = vertex[v + 73];
        var n2 = normals[v + 73];
        var uv2 = uvs[t + 74];
        var v3 = vertex[v + 74];
        var n3 = normals[v + 74];
        var uv3 = uvs[t + 75];
        addFace(v0, v1, v2, n0, n1, n2, uv0, uv1, uv2);
        addFace(v1, v3, v2, n1, n3, n2, uv1, uv3, uv2);
      }
    }
    plist.build();
    drw.addPolyList(plist);
    var trx = bg.Matrix4.Scale(-1, 1, 1);
    node.addComponent(new bg.scene.Transform(trx));
    return node;
  }
  var Video360ThetaCanvas = function($__super) {
    function Video360ThetaCanvas(stream) {
      $traceurRuntime.superConstructor(Video360ThetaCanvas).call(this);
      this.stream = stream;
    }
    return ($traceurRuntime.createClass)(Video360ThetaCanvas, {
      get video() {
        return this.texture ? this.texture.video : null;
      },
      loaded: function() {
        var $__2 = this;
        return new Promise(function(resolve) {
          var checkLoaded = function() {
            if ($__2.video) {
              resolve($__2);
            } else {
              setTimeout(checkLoaded, 100);
            }
          };
          checkLoaded();
        });
      },
      buildScene: function() {
        var $__2 = this;
        this._root = new bg.scene.Node(this.gl, "Root node");
        bg.base.Loader.RegisterPlugin(new bg.base.TextureLoaderPlugin());
        bg.base.Loader.RegisterPlugin(new bg.base.VideoTextureLoaderPlugin());
        bg.base.Loader.RegisterPlugin(new bg.base.VWGLBLoaderPlugin());
        bg.base.Loader.Load(this.gl, this.stream.src).then(function(texture) {
          $__2.texture = texture;
          var viewerNode = buildViewerNode($__2.gl);
          var sphere = viewerNode.component("bg.scene.Drawable");
          sphere.getMaterial(0).texture = texture;
          sphere.getMaterial(0).lightEmission = 1.0;
          sphere.getMaterial(0).lightEmissionMaskInvert = true;
          sphere.getMaterial(0).cullFace = false;
          $__2._root.addChild(viewerNode);
          $__2.postRedisplay();
        });
        var lightNode = new bg.scene.Node(this.gl, "Light");
        this._root.addChild(lightNode);
        this._camera = new bg.scene.Camera();
        var cameraNode = new bg.scene.Node("Camera");
        cameraNode.addComponent(this._camera);
        cameraNode.addComponent(new bg.scene.Transform());
        var oc = new bg.manipulation.OrbitCameraController();
        cameraNode.addComponent(oc);
        oc.maxPitch = 90;
        oc.minPitch = -90;
        oc.maxDistance = 0;
        oc.minDistace = 0;
        this._root.addChild(cameraNode);
      },
      init: function() {
        bg.Engine.Set(new bg.webgl1.Engine(this.gl));
        this.buildScene();
        this._renderer = bg.render.Renderer.Create(this.gl, bg.render.RenderPath.FORWARD);
        this._inputVisitor = new bg.scene.InputVisitor();
      },
      frame: function(delta) {
        if (this.texture) {
          this.texture.update();
        }
        this._renderer.frame(this._root, delta);
      },
      display: function() {
        this._renderer.display(this._root, this._camera);
      },
      reshape: function(width, height) {
        this._camera.viewport = new bg.Viewport(0, 0, width, height);
        this._camera.projection.perspective(60, this._camera.viewport.aspectRatio, 0.1, 100);
      },
      mouseDown: function(evt) {
        this._inputVisitor.mouseDown(this._root, evt);
      },
      mouseDrag: function(evt) {
        this._inputVisitor.mouseDrag(this._root, evt);
        this.postRedisplay();
      },
      mouseWheel: function(evt) {
        this._inputVisitor.mouseWheel(this._root, evt);
        this.postRedisplay();
      },
      touchStart: function(evt) {
        this._inputVisitor.touchStart(this._root, evt);
      },
      touchMove: function(evt) {
        this._inputVisitor.touchMove(this._root, evt);
        this.postRedisplay();
      },
      mouseUp: function(evt) {
        this._inputVisitor.mouseUp(this._root, evt);
      },
      mouseMove: function(evt) {
        this._inputVisitor.mouseMove(this._root, evt);
      },
      mouseOut: function(evt) {
        this._inputVisitor.mouseOut(this._root, evt);
      },
      touchEnd: function(evt) {
        this._inputVisitor.touchEnd(this._root, evt);
      }
    }, {}, $__super);
  }(bg.app.WindowController);
  var controller = new Video360ThetaCanvas(stream);
  var mainLoop = bg.app.MainLoop.singleton;
  mainLoop.updateMode = bg.app.FrameUpdate.AUTO;
  mainLoop.canvas = canvas;
  mainLoop.run(controller);
  return controller.loaded();
}
Class("paella.Video360Theta", paella.VideoElementBase, {
  _posterFrame: null,
  _currentQuality: null,
  _autoplay: false,
  _streamName: null,
  initialize: function(id, stream, left, top, width, height, streamName) {
    this.parent(id, stream, 'canvas', 0, 0, 1280, 720);
    this._streamName = streamName || 'video360theta';
    var This = this;
    paella.player.videoContainer.disablePlayOnClick();
    if (this._stream.sources[this._streamName]) {
      this._stream.sources[this._streamName].sort(function(a, b) {
        return a.res.h - b.res.h;
      });
    }
    this.video = null;
    function onProgress(event) {
      if (!This._ready && This.video.readyState == 4) {
        This._ready = true;
        if (This._initialCurrentTipe !== undefined) {
          This.video.currentTime = This._initialCurrentTime;
          delete This._initialCurrentTime;
        }
        This._callReadyEvent();
      }
    }
    function evtCallback(event) {
      onProgress.apply(This, event);
    }
    function onUpdateSize() {
      if (This.canvasController) {
        var canvas = This.canvasController.canvas.domElement;
      }
    }
    var timer = new paella.Timer(function(timer) {
      onUpdateSize();
    }, 500);
    timer.repeat = true;
  },
  defaultProfile: function() {
    return 'chroma';
  },
  _setVideoElem: function(video) {
    $(this.video).bind('progress', evtCallback);
    $(this.video).bind('loadstart', evtCallback);
    $(this.video).bind('loadedmetadata', evtCallback);
    $(this.video).bind('canplay', evtCallback);
    $(this.video).bind('oncanplay', evtCallback);
  },
  _loadDeps: function() {
    return new Promise(function(resolve, reject) {
      if (!window.$paella_bg2e) {
        paella.require(paella.baseUrl + 'resources/deps/bg2e.js').then(function() {
          window.$paella_bg2e = bg;
          resolve(window.$paella_bg2e);
        }).catch(function(err) {
          console.error(err.message);
          reject();
        });
      } else {
        defer.resolve(window.$paella_bg2e);
      }
    });
  },
  _deferredAction: function(action) {
    var $__2 = this;
    return new Promise(function(resolve, reject) {
      if ($__2.video) {
        resolve(action());
      } else {
        $($__2.video).bind('canplay', function() {
          $__2._ready = true;
          resolve(action());
        });
      }
    });
  },
  _getQualityObject: function(index, s) {
    return {
      index: index,
      res: s.res,
      src: s.src,
      toString: function() {
        return this.res.w + "x" + this.res.h;
      },
      shortLabel: function() {
        return this.res.h + "p";
      },
      compare: function(q2) {
        return this.res.w * this.res.h - q2.res.w * q2.res.h;
      }
    };
  },
  allowZoom: function() {
    return false;
  },
  getVideoData: function() {
    var $__2 = this;
    var This = this;
    return new Promise(function(resolve, reject) {
      $__2._deferredAction(function() {
        resolve({
          duration: This.video.duration,
          currentTime: This.video.currentTime,
          volume: This.video.volume,
          paused: This.video.paused,
          ended: This.video.ended,
          res: {
            w: This.video.videoWidth,
            h: This.video.videoHeight
          }
        });
      });
    });
  },
  setPosterFrame: function(url) {
    this._posterFrame = url;
  },
  setAutoplay: function(auto) {
    this._autoplay = auto;
    if (auto && this.video) {
      this.video.setAttribute("autoplay", auto);
    }
  },
  load: function() {
    var $__2 = this;
    var This = this;
    return new Promise(function(resolve, reject) {
      $__2._loadDeps().then(function() {
        var sources = $__2._stream.sources[$__2._streamName];
        if ($__2._currentQuality === null && $__2._videoQualityStrategy) {
          $__2._currentQuality = $__2._videoQualityStrategy.getQualityIndex(sources);
        }
        var stream = $__2._currentQuality < sources.length ? sources[$__2._currentQuality] : null;
        $__2.video = null;
        if (stream) {
          $__2.canvasController = null;
          buildVideo360ThetaCanvas(stream, $__2.domElement).then(function(canvasController) {
            $__2.canvasController = canvasController;
            $__2.video = canvasController.video;
            $__2.video.pause();
            $__2.disableEventCapture();
            resolve(stream);
          });
        } else {
          reject(new Error("Could not load video: invalid quality stream index"));
        }
      });
    });
  },
  getQualities: function() {
    var $__2 = this;
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        var result = [];
        var sources = $__2._stream.sources[$__2._streamName];
        var index = -1;
        sources.forEach(function(s) {
          index++;
          result.push($__2._getQualityObject(index, s));
        });
        resolve(result);
      }, 10);
    });
  },
  setQuality: function(index) {
    var $__2 = this;
    return new Promise(function(resolve) {
      var paused = $__2.video.paused;
      var sources = $__2._stream.sources[$__2._streamName];
      $__2._currentQuality = index < sources.length ? index : 0;
      var currentTime = $__2.video.currentTime;
      $__2.freeze().then(function() {
        $__2._ready = false;
        return $__2.load();
      }).then(function() {
        if (!paused) {
          $__2.play();
        }
        $($__2.video).on('seeked', function() {
          $__2.unFreeze();
          resolve();
          $($__2.video).off('seeked');
        });
        $__2.video.currentTime = currentTime;
      });
    });
  },
  getCurrentQuality: function() {
    var $__2 = this;
    return new Promise(function(resolve) {
      resolve($__2._getQualityObject($__2._currentQuality, $__2._stream.sources[$__2._streamName][$__2._currentQuality]));
    });
  },
  play: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      bg.app.MainLoop.singleton.updateMode = bg.app.FrameUpdate.AUTO;
      $__2.video.play();
    });
  },
  pause: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      bg.app.MainLoop.singleton.updateMode = bg.app.FrameUpdate.MANUAL;
      $__2.video.pause();
    });
  },
  isPaused: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      return $__2.video.paused;
    });
  },
  duration: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      return $__2.video.duration;
    });
  },
  setCurrentTime: function(time) {
    var $__2 = this;
    return this._deferredAction(function() {
      $__2.video.currentTime = time;
      $($__2.video).on('seeked', function() {
        $__2.canvasController.postRedisplay();
        $($__2.video).off('seeked');
      });
    });
  },
  currentTime: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      return $__2.video.currentTime;
    });
  },
  setVolume: function(volume) {
    var $__2 = this;
    return this._deferredAction(function() {
      $__2.video.volume = volume;
    });
  },
  volume: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      return $__2.video.volume;
    });
  },
  setPlaybackRate: function(rate) {
    var $__2 = this;
    return this._deferredAction(function() {
      $__2.video.playbackRate = rate;
    });
  },
  playbackRate: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      return $__2.video.playbackRate;
    });
  },
  goFullScreen: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      var elem = $__2.video;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitEnterFullscreen) {
        elem.webkitEnterFullscreen();
      }
    });
  },
  unFreeze: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      var c = document.getElementById($__2.video.className + "canvas");
      $(c).remove();
    });
  },
  freeze: function() {
    var This = this;
    return this._deferredAction(function() {});
  },
  unload: function() {
    this._callUnloadEvent();
    return paella_DeferredNotImplemented();
  },
  getDimensions: function() {
    return paella_DeferredNotImplemented();
  }
});
Class("paella.videoFactories.Video360ThetaFactory", {
  isStreamCompatible: function(streamData) {
    try {
      if (paella.ChromaVideo._loaded) {
        return false;
      }
      if (paella.videoFactories.Html5VideoFactory.s_instances > 0 && base.userAgent.system.iOS) {
        return false;
      }
      for (var key in streamData.sources) {
        if (key == 'video360theta')
          return true;
      }
    } catch (e) {}
    return false;
  },
  getVideoObject: function(id, streamData, rect) {
    paella.ChromaVideo._loaded = true;
    ++paella.videoFactories.Html5VideoFactory.s_instances;
    return new paella.Video360Theta(id, streamData, rect.x, rect.y, rect.w, rect.h);
  }
});

"use strict";
paella.addDataDelegate('metadata', function() {
  return function($__super) {
    function VideoManifestMetadataDataDelegate() {
      $traceurRuntime.superConstructor(VideoManifestMetadataDataDelegate).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(VideoManifestMetadataDataDelegate, {
      read: function(context, params, onSuccess) {
        var metadata = paella.player.videoLoader.getMetadata();
        onSuccess(metadata[params], true);
      },
      write: function(context, params, value, onSuccess) {
        onSuccess({}, true);
      },
      remove: function(context, params, onSuccess) {
        onSuccess({}, true);
      }
    }, {}, $__super);
  }(paella.DataDelegate);
});
paella.addPlugin(function() {
  return function($__super) {
    function VideoDataPlugin() {
      $traceurRuntime.superConstructor(VideoDataPlugin).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(VideoDataPlugin, {
      getIndex: function() {
        return 10;
      },
      getSubclass: function() {
        return "videoData";
      },
      getAlignment: function() {
        return 'left';
      },
      getDefaultToolTip: function() {
        return "";
      },
      checkEnabled: function(onSuccess) {
        var plugin = paella.player.config.plugins.list["es.upv.paella.videoDataPlugin"];
        var exclude = (plugin && plugin.excludeLocations) || [];
        var excludeParent = (plugin && plugin.excludeParentLocations) || [];
        var excluded = exclude.some(function(url) {
          var re = RegExp(url, "i");
          return re.test(location.href);
        });
        if (window != window.parent) {
          excluded = excluded || excludeParent.some(function(url) {
            var re = RegExp(url, "i");
            try {
              return re.test(parent.location.href);
            } catch (e) {
              return false;
            }
          });
        }
        onSuccess(!excluded);
      },
      setup: function() {
        var title = document.createElement("h1");
        title.innerText = "";
        title.className = "videoTitle";
        this.button.appendChild(title);
        paella.data.read("metadata", "title", function(data) {
          title.innerText = data;
        });
      },
      action: function(button) {},
      getName: function() {
        return "es.upv.paella.videoDataPlugin";
      }
    }, {}, $__super);
  }(paella.VideoOverlayButtonPlugin);
});

"use strict";
paella.addPlugin(function() {
  var g_canvasWidth = 320;
  var g_canvasHeight = 180;
  function getThumbnailContainer(videoIndex) {
    var container = document.createElement('canvas');
    container.width = g_canvasWidth;
    container.height = g_canvasHeight;
    container.className = "zoom-thumbnail";
    container.id = "zoomContainer" + videoIndex;
    return container;
  }
  function getZoomRect() {
    var zoomRect = document.createElement('div');
    zoomRect.className = "zoom-rect";
    return zoomRect;
  }
  function updateThumbnail(thumbElem) {
    var player = thumbElem.player;
    var canvas = thumbElem.canvas;
    player.captureFrame().then(function(frameData) {
      var ctx = canvas.getContext("2d");
      ctx.drawImage(frameData.source, 0, 0, g_canvasWidth, g_canvasHeight);
    });
  }
  function setupButtons(videoPlayer) {
    var wrapper = videoPlayer.parent;
    var wrapperDom = wrapper.domElement;
    var zoomButton = document.createElement('button');
    wrapperDom.appendChild(zoomButton);
    zoomButton.className = "videoZoomButton btn zoomIn";
    zoomButton.innerHTML = '<i class="glyphicon glyphicon-zoom-in"></i>';
    $(zoomButton).on('mousedown', function() {
      paella.player.videoContainer.disablePlayOnClick();
      videoPlayer.zoomIn();
    });
    $(zoomButton).on('mouseup', function() {
      setTimeout(function() {
        return paella.player.videoContainer.enablePlayOnClick();
      }, 10);
    });
    zoomButton = document.createElement('button');
    wrapperDom.appendChild(zoomButton);
    zoomButton.className = "videoZoomButton btn zoomOut";
    zoomButton.innerHTML = '<i class="glyphicon glyphicon-zoom-out"></i>';
    $(zoomButton).on('mousedown', function() {
      paella.player.videoContainer.disablePlayOnClick();
      videoPlayer.zoomOut();
    });
    $(zoomButton).on('mouseup', function() {
      setTimeout(function() {
        return paella.player.videoContainer.enablePlayOnClick();
      }, 10);
    });
  }
  return function($__super) {
    function VideoZoomPlugin() {
      $traceurRuntime.superConstructor(VideoZoomPlugin).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(VideoZoomPlugin, {
      getIndex: function() {
        return 10;
      },
      getSubclass: function() {
        return "videoZoom";
      },
      getAlignment: function() {
        return 'right';
      },
      getDefaultToolTip: function() {
        return "";
      },
      checkEnabled: function(onSuccess) {
        onSuccess(true);
      },
      setup: function() {
        var $__2 = this;
        var thisClass = this;
        this._thumbnails = [];
        this._visible = false;
        this._available = false;
        function checkVisibility() {
          var buttons = $('.videoZoomButton');
          var thumbs = $('.videoZoom');
          if (this._visible && this._available) {
            buttons.show();
            thumbs.show();
          } else {
            buttons.hide();
            thumbs.hide();
          }
        }
        var players = paella.player.videoContainer.streamProvider.videoPlayers;
        players.forEach(function(player, index) {
          if (player.allowZoom()) {
            $__2._available = player.zoomAvailable();
            $__2._visible = $__2._available;
            setupButtons.apply($__2, [player]);
            player.supportsCaptureFrame().then(function(supports) {
              if (supports) {
                var thumbContainer = document.createElement('div');
                thumbContainer.className = "zoom-container";
                var thumb = getThumbnailContainer.apply($__2, [index]);
                var zoomRect = getZoomRect.apply($__2);
                $__2.button.appendChild(thumbContainer);
                thumbContainer.appendChild(thumb);
                thumbContainer.appendChild(zoomRect);
                $(thumbContainer).hide();
                $__2._thumbnails.push({
                  player: player,
                  thumbContainer: thumbContainer,
                  zoomRect: zoomRect,
                  canvas: thumb
                });
                checkVisibility.apply($__2);
              }
            });
          }
        });
        var update = false;
        paella.events.bind(paella.events.play, function(evt) {
          var updateThumbs = function() {
            $__2._thumbnails.forEach(function(item) {
              updateThumbnail(item);
            });
            if (update) {
              setTimeout(function() {
                updateThumbs();
              }, 2000);
            }
          };
          update = true;
          updateThumbs();
        });
        paella.events.bind(paella.events.pause, function(evt) {
          update = false;
        });
        paella.events.bind(paella.events.videoZoomChanged, function(evt, target) {
          $__2._thumbnails.some(function(thumb) {
            if (thumb.player == target.video) {
              if (thumb.player.zoom > 100) {
                $(thumb.thumbContainer).show();
                var x = target.video.zoomOffset.x * 100 / target.video.zoom;
                var y = target.video.zoomOffset.y * 100 / target.video.zoom;
                var zoomRect = thumb.zoomRect;
                $(zoomRect).css({
                  left: x + '%',
                  top: y + '%',
                  width: (10000 / target.video.zoom) + '%',
                  height: (10000 / target.video.zoom) + '%'
                });
              } else {
                $(thumb.thumbContainer).hide();
              }
              return true;
            }
          });
        });
        paella.events.bind(paella.events.zoomAvailabilityChanged, function(evt, target) {
          $__2._available = target.available;
          $__2._visible = target.available;
          checkVisibility.apply($__2);
        });
        paella.events.bind(paella.events.controlBarDidHide, function() {
          $__2._visible = false;
          checkVisibility.apply($__2);
        });
        paella.events.bind(paella.events.controlBarDidShow, function() {
          $__2._visible = true;
          checkVisibility.apply($__2);
        });
      },
      action: function(button) {},
      getName: function() {
        return "es.upv.paella.videoZoomPlugin";
      }
    }, {}, $__super);
  }(paella.VideoOverlayButtonPlugin);
});
paella.addPlugin(function() {
  return function($__super) {
    function VideoZoomToolbarPlugin() {
      $traceurRuntime.superConstructor(VideoZoomToolbarPlugin).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(VideoZoomToolbarPlugin, {
      getAlignment: function() {
        return 'right';
      },
      getSubclass: function() {
        return "videoZoomToolbar";
      },
      getIconClass: function() {
        return 'icon-screen';
      },
      getIndex: function() {
        return 2030;
      },
      getMinWindowSize: function() {
        return (paella.player.config.player && paella.player.config.player.videoZoom && paella.player.config.player.videoZoom.minWindowSize) || 600;
      },
      getName: function() {
        return "es.upv.paella.videoZoomToolbarPlugin";
      },
      getDefaultToolTip: function() {
        return base.dictionary.translate("Set video zoom");
      },
      getButtonType: function() {
        return paella.ButtonPlugin.type.popUpButton;
      },
      checkEnabled: function(onSuccess) {
        var players = paella.player.videoContainer.streamProvider.videoPlayers;
        var pluginData = paella.player.config.plugins.list["es.upv.paella.videoZoomToolbarPlugin"];
        var playerIndex = pluginData.targetStreamIndex;
        this.targetPlayer = players.length > playerIndex ? players[playerIndex] : null;
        onSuccess(paella.player.config.player.videoZoom.enabled && this.targetPlayer && this.targetPlayer.allowZoom());
      },
      buildContent: function(domElement) {
        var $__2 = this;
        paella.events.bind(paella.events.videoZoomChanged, function(evt, target) {
          $__2.setText(Math.round(target.video.zoom) + "%");
        });
        this.setText("100%");
        function getZoomButton(className, onClick) {
          var btn = document.createElement('div');
          btn.className = ("videoZoomToolbarItem " + className);
          btn.innerHTML = ("<i class=\"glyphicon glyphicon-" + className + "\"></i>");
          $(btn).click(onClick);
          return btn;
        }
        domElement.appendChild(getZoomButton('zoom-in', function(evt) {
          $__2.targetPlayer.zoomIn();
        }));
        domElement.appendChild(getZoomButton('zoom-out', function(evt) {
          $__2.targetPlayer.zoomOut();
        }));
      }
    }, {}, $__super);
  }(paella.ButtonPlugin);
});

"use strict";
paella.addPlugin(function() {
  return function($__super) {
    function ViewModePlugin() {
      $traceurRuntime.superConstructor(ViewModePlugin).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(ViewModePlugin, {
      getAlignment: function() {
        return 'right';
      },
      getSubclass: function() {
        return "showViewModeButton";
      },
      getIconClass: function() {
        return 'icon-presentation-mode';
      },
      getIndex: function() {
        return 540;
      },
      getMinWindowSize: function() {
        return 300;
      },
      getName: function() {
        return "es.upv.paella.viewModePlugin";
      },
      getButtonType: function() {
        return paella.ButtonPlugin.type.popUpButton;
      },
      getDefaultToolTip: function() {
        return base.dictionary.translate("Change video layout");
      },
      checkEnabled: function(onSuccess) {
        this.buttonItems = null;
        this.buttons = [];
        this.selected_button = null;
        this.active_profiles = null;
        this.active_profiles = this.config.activeProfiles;
        onSuccess(!paella.player.videoContainer.isMonostream);
      },
      closeOnMouseOut: function() {
        return true;
      },
      setup: function() {
        var thisClass = this;
        var Keys = {
          Tab: 9,
          Return: 13,
          Esc: 27,
          End: 35,
          Home: 36,
          Left: 37,
          Up: 38,
          Right: 39,
          Down: 40
        };
        paella.events.bind(paella.events.setProfile, function(event, params) {
          thisClass.onProfileChange(params.profileName);
        });
        $(this.button).keyup(function(event) {
          if (thisClass.isPopUpOpen()) {
            if (event.keyCode == Keys.Up) {
              if (thisClass.selected_button > 0) {
                if (thisClass.selected_button < thisClass.buttons.length)
                  thisClass.buttons[thisClass.selected_button].className = 'viewModeItemButton ' + thisClass.buttons[thisClass.selected_button].data.profile;
                thisClass.selected_button--;
                thisClass.buttons[thisClass.selected_button].className = thisClass.buttons[thisClass.selected_button].className + ' selected';
              }
            } else if (event.keyCode == Keys.Down) {
              if (thisClass.selected_button < thisClass.buttons.length - 1) {
                if (thisClass.selected_button >= 0)
                  thisClass.buttons[thisClass.selected_button].className = 'viewModeItemButton ' + thisClass.buttons[thisClass.selected_button].data.profile;
                thisClass.selected_button++;
                thisClass.buttons[thisClass.selected_button].className = thisClass.buttons[thisClass.selected_button].className + ' selected';
              }
            } else if (event.keyCode == Keys.Return) {
              thisClass.onItemClick(thisClass.buttons[thisClass.selected_button], thisClass.buttons[thisClass.selected_button].data.profile, thisClass.buttons[thisClass.selected_button].data.profile);
            }
          }
        });
      },
      rebuildProfileList: function() {
        var $__2 = this;
        this.buttonItems = {};
        this.domElement.innerText = "";
        paella.profiles.profileList.forEach(function(profileData) {
          if (profileData.hidden)
            return;
          if ($__2.active_profiles) {
            var active = false;
            $__2.active_profiles.forEach(function(ap) {
              if (ap == profile) {
                active = true;
              }
            });
            if (active == false) {
              return;
            }
          }
          var buttonItem = $__2.getProfileItemButton(profileData.id, profileData);
          $__2.buttonItems[profileData.id] = buttonItem;
          $__2.domElement.appendChild(buttonItem);
          $__2.buttons.push(buttonItem);
          if (paella.player.selectedProfile == profileData.id) {
            $__2.buttonItems[profileData.id].className = $__2.getButtonItemClass(profileData.id, true);
          }
        });
        this.selected_button = this.buttons.length;
      },
      buildContent: function(domElement) {
        var $__2 = this;
        var thisClass = this;
        this.domElement = domElement;
        this.rebuildProfileList();
        paella.events.bind(paella.events.profileListChanged, function() {
          $__2.rebuildProfileList();
        });
      },
      getProfileItemButton: function(profile, profileData) {
        var elem = document.createElement('div');
        elem.className = this.getButtonItemClass(profile, false);
        var url = this.getButtonItemIcon(profileData);
        url = url.replace(/\\/ig, '/');
        elem.style.backgroundImage = ("url(" + url + ")");
        elem.id = profile + '_button';
        elem.data = {
          profile: profile,
          profileData: profileData,
          plugin: this
        };
        $(elem).click(function(event) {
          this.data.plugin.onItemClick(this, this.data.profile, this.data.profileData);
        });
        return elem;
      },
      onProfileChange: function(profileName) {
        var thisClass = this;
        var ButtonItem = this.buttonItems[profileName];
        var n = this.buttonItems;
        var arr = Object.keys(n);
        arr.forEach(function(i) {
          thisClass.buttonItems[i].className = thisClass.getButtonItemClass(i, false);
        });
        if (ButtonItem) {
          ButtonItem.className = thisClass.getButtonItemClass(profileName, true);
        }
      },
      onItemClick: function(button, profile, profileData) {
        var ButtonItem = this.buttonItems[profile];
        if (ButtonItem) {
          paella.player.setProfile(profile);
        }
        paella.player.controls.hidePopUp(this.getName());
      },
      getButtonItemClass: function(profileName, selected) {
        return 'viewModeItemButton ' + profileName + ((selected) ? ' selected' : '');
      },
      getButtonItemIcon: function(profileData) {
        return (paella.baseUrl + "resources/style/" + profileData.icon);
      }
    }, {}, $__super);
  }(paella.ButtonPlugin);
});

"use strict";
paella.addPlugin(function() {
  return function($__super) {
    function VolumeRangePlugin() {
      $traceurRuntime.superConstructor(VolumeRangePlugin).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(VolumeRangePlugin, {
      getAlignment: function() {
        return 'left';
      },
      getSubclass: function() {
        return 'volumeRangeButton';
      },
      getIconClass: function() {
        return 'icon-volume-high';
      },
      getName: function() {
        return "es.upv.paella.volumeRangePlugin";
      },
      getButtonType: function() {
        return paella.ButtonPlugin.type.popUpButton;
      },
      getDefaultToolTip: function() {
        return base.dictionary.translate("Volume");
      },
      getIndex: function() {
        return 120;
      },
      closeOnMouseOut: function() {
        return true;
      },
      checkEnabled: function(onSuccess) {
        this._tempMasterVolume = 0;
        this._inputMaster = null;
        this._control_NotMyselfEvent = true;
        this._storedValue = false;
        var enabled = !base.userAgent.browser.IsMobileVersion;
        onSuccess(enabled);
      },
      setup: function() {
        var self = this;
        paella.events.bind(paella.events.videoUnloaded, function(event, params) {
          self.storeVolume();
        });
        paella.events.bind(paella.events.singleVideoReady, function(event, params) {
          self.loadStoredVolume(params);
        });
        paella.events.bind(paella.events.setVolume, function(evt, par) {
          self.updateVolumeOnEvent(par);
        });
      },
      updateVolumeOnEvent: function(volume) {
        var thisClass = this;
        if (thisClass._control_NotMyselfEvent) {
          thisClass._inputMaster = volume.master;
        } else {
          thisClass._control_NotMyselfEvent = true;
        }
      },
      storeVolume: function() {
        var This = this;
        paella.player.videoContainer.streamProvider.mainAudioPlayer.volume().then(function(v) {
          This._tempMasterVolume = v;
          This._storedValue = true;
        });
      },
      loadStoredVolume: function(params) {
        if (this._storedValue == false) {
          this.storeVolume();
        }
        if (this._tempMasterVolume) {
          paella.player.videoContainer.setVolume(this._tempMasterVolume);
        }
        this._storedValue = false;
      },
      buildContent: function(domElement) {
        var $__2 = this;
        var thisClass = this;
        var videoRangeContainer = document.createElement('div');
        videoRangeContainer.className = 'videoRangeContainer';
        var rangeMaster = document.createElement('div');
        rangeMaster.className = "range";
        var rangeImageMaster = document.createElement('div');
        rangeImageMaster.className = "image master";
        var rangeInputMaster = document.createElement('input');
        thisClass._inputMaster = rangeInputMaster;
        rangeInputMaster.type = "range";
        rangeInputMaster.min = 0;
        rangeInputMaster.max = 1;
        rangeInputMaster.step = 0.01;
        paella.player.videoContainer.audioPlayer.volume().then(function(vol) {
          rangeInputMaster.value = vol;
        });
        function updateMasterVolume() {
          var masterVolume = $(rangeInputMaster).val();
          var slaveVolume = 0;
          thisClass._control_NotMyselfEvent = false;
          paella.player.videoContainer.setVolume(masterVolume);
        }
        ;
        $(rangeInputMaster).bind('input', function(e) {
          updateMasterVolume();
        });
        $(rangeInputMaster).change(function() {
          updateMasterVolume();
        });
        rangeMaster.appendChild(rangeImageMaster);
        rangeMaster.appendChild(rangeInputMaster);
        videoRangeContainer.appendChild(rangeMaster);
        paella.events.bind(paella.events.setVolume, function(event, params) {
          rangeInputMaster.value = params.master;
          $__2.updateClass();
        });
        domElement.appendChild(videoRangeContainer);
        thisClass.updateClass();
        var Keys = {
          Tab: 9,
          Return: 13,
          Esc: 27,
          End: 35,
          Home: 36,
          Left: 37,
          Up: 38,
          Right: 39,
          Down: 40
        };
        $(this.button).keyup(function(event) {
          if (thisClass.isPopUpOpen()) {
            paella.player.videoContainer.volume().then(function(v) {
              var newvol = -1;
              if (event.keyCode == Keys.Left) {
                newvol = v - 0.1;
              } else if (event.keyCode == Keys.Right) {
                newvol = v + 0.1;
              }
              if (newvol != -1) {
                newvol = newvol < 0 ? 0 : newvol > 1 ? 1 : newvol;
                paella.player.videoContainer.setVolume(newvol).then(function(v) {});
              }
            });
          }
        });
      },
      updateClass: function() {
        var $__2 = this;
        var selected = '';
        var self = this;
        paella.player.videoContainer.volume().then(function(volume) {
          if (volume === undefined) {
            selected = 'icon-volume-mid';
          } else if (volume == 0) {
            selected = 'icon-volume-mute';
          } else if (volume < 0.33) {
            selected = 'icon-volume-low';
          } else if (volume < 0.66) {
            selected = 'icon-volume-mid';
          } else {
            selected = 'icon-volume-high';
          }
          $__2.changeIconClass(selected);
        });
      }
    }, {}, $__super);
  }(paella.ButtonPlugin);
});

"use strict";
Class("paella.videoFactories.WebmVideoFactory", {
  webmCapable: function() {
    var testEl = document.createElement("video");
    if (testEl.canPlayType) {
      return "" !== testEl.canPlayType('video/webm; codecs="vp8, vorbis"');
    } else {
      return false;
    }
  },
  isStreamCompatible: function(streamData) {
    try {
      if (!this.webmCapable())
        return false;
      for (var key in streamData.sources) {
        if (key == 'webm')
          return true;
      }
    } catch (e) {}
    return false;
  },
  getVideoObject: function(id, streamData, rect) {
    return new paella.Html5Video(id, streamData, rect.x, rect.y, rect.w, rect.h, 'webm');
  }
});

"use strict";
paella.addPlugin(function() {
  return function($__super) {
    function WindowTitlePlugin() {
      $traceurRuntime.superConstructor(WindowTitlePlugin).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(WindowTitlePlugin, {
      getName: function() {
        return "es.upv.paella.windowTitlePlugin";
      },
      checkEnabled: function(onSuccess) {
        var $__1 = this;
        this._initDone = false;
        paella.player.videoContainer.masterVideo().duration().then(function(d) {
          $__1.loadTitle();
        });
        onSuccess(true);
      },
      loadTitle: function() {
        var title = paella.player.videoLoader.getMetadata() && paella.player.videoLoader.getMetadata().title;
        document.title = title || document.title;
        this._initDone = true;
      }
    }, {}, $__super);
  }(paella.EventDrivenPlugin);
});

"use strict";
Class("paella.YoutubeVideo", paella.VideoElementBase, {
  _posterFrame: null,
  _currentQuality: null,
  _autoplay: false,
  _readyPromise: null,
  initialize: function(id, stream, left, top, width, height) {
    this.parent(id, stream, 'div', left, top, width, height);
    var This = this;
    this._readyPromise = $.Deferred();
    Object.defineProperty(this, 'video', {get: function() {
        return This._youtubePlayer;
      }});
  },
  _deferredAction: function(action) {
    var $__2 = this;
    return new Promise(function(resolve, reject) {
      $__2._readyPromise.then(function() {
        resolve(action());
      }, function() {
        reject();
      });
    });
  },
  _getQualityObject: function(index, s) {
    var level = 0;
    switch (s) {
      case 'small':
        level = 1;
        break;
      case 'medium':
        level = 2;
        break;
      case 'large':
        level = 3;
        break;
      case 'hd720':
        level = 4;
        break;
      case 'hd1080':
        level = 5;
        break;
      case 'highres':
        level = 6;
        break;
    }
    return {
      index: index,
      res: {
        w: null,
        h: null
      },
      src: null,
      label: s,
      level: level,
      bitrate: level,
      toString: function() {
        return this.label;
      },
      shortLabel: function() {
        return this.label;
      },
      compare: function(q2) {
        return this.level - q2.level;
      }
    };
  },
  _onStateChanged: function(e) {
    console.log("On state changed");
  },
  getVideoData: function() {
    var $__2 = this;
    var This = this;
    return new Promise(function(resolve, reject) {
      var stream = $__2._stream.sources.youtube[0];
      $__2._deferredAction(function() {
        var videoData = {
          duration: This.video.getDuration(),
          currentTime: This.video.getCurrentTime(),
          volume: This.video.getVolume(),
          paused: !This._playing,
          ended: This.video.ended,
          res: {
            w: stream.res.w,
            h: stream.res.h
          }
        };
        resolve(videoData);
      });
    });
  },
  setPosterFrame: function(url) {
    this._posterFrame = url;
  },
  setAutoplay: function(auto) {
    this._autoplay = auto;
  },
  setRect: function(rect, animate) {
    this._rect = JSON.parse(JSON.stringify(rect));
    var relativeSize = new paella.RelativeVideoSize();
    var percentTop = relativeSize.percentVSize(rect.top) + '%';
    var percentLeft = relativeSize.percentWSize(rect.left) + '%';
    var percentWidth = relativeSize.percentWSize(rect.width) + '%';
    var percentHeight = relativeSize.percentVSize(rect.height) + '%';
    var style = {
      top: percentTop,
      left: percentLeft,
      width: percentWidth,
      height: percentHeight,
      position: 'absolute'
    };
    if (animate) {
      this.disableClassName();
      var thisClass = this;
      $('#' + this.identifier).animate(style, 400, function() {
        thisClass.enableClassName();
        paella.events.trigger(paella.events.setComposition, {video: thisClass});
      });
      this.enableClassNameAfter(400);
    } else {
      $('#' + this.identifier).css(style);
      paella.events.trigger(paella.events.setComposition, {video: this});
    }
  },
  setVisible: function(visible, animate) {
    if (visible == "true" && animate) {
      $('#' + this.identifier).show();
      $('#' + this.identifier).animate({opacity: 1.0}, 300);
    } else if (visible == "true" && !animate) {
      $('#' + this.identifier).show();
    } else if (visible == "false" && animate) {
      $('#' + this.identifier).animate({opacity: 0.0}, 300);
    } else if (visible == "false" && !animate) {
      $('#' + this.identifier).hide();
    }
  },
  setLayer: function(layer) {
    $('#' + this.identifier).css({zIndex: layer});
  },
  load: function() {
    var $__2 = this;
    var This = this;
    return new Promise(function(resolve, reject) {
      $__2._qualityListReadyPromise = $.Deferred();
      paella.youtubePlayerVars.apiReadyPromise.then(function() {
        var stream = $__2._stream.sources.youtube[0];
        if (stream) {
          $__2._youtubePlayer = new YT.Player(This.identifier, {
            height: '390',
            width: '640',
            videoId: stream.id,
            playerVars: {
              controls: 0,
              disablekb: 1
            },
            events: {
              onReady: function(e) {
                This._readyPromise.resolve();
              },
              onStateChanged: function(e) {
                console.log("state changed");
              },
              onPlayerStateChange: function(e) {
                console.log("state changed");
              }
            }
          });
          resolve();
        } else {
          reject(new Error("Could not load video: invalid quality stream index"));
        }
      });
    });
  },
  getQualities: function() {
    var This = this;
    return new Promise(function(resolve, reject) {
      This._qualityListReadyPromise.then(function(q) {
        var result = [];
        var index = -1;
        This._qualities = {};
        q.forEach(function(item) {
          index++;
          This._qualities[item] = This._getQualityObject(index, item);
          result.push(This._qualities[item]);
        });
        resolve(result);
      });
    });
  },
  setQuality: function(index) {
    var $__2 = this;
    return new Promise(function(resolve, reject) {
      $__2._qualityListReadyPromise.then(function(q) {
        for (var key in $__2._qualities) {
          var searchQ = $__2._qualities[key];
          if ($traceurRuntime.typeof((searchQ)) == "object" && searchQ.index == index) {
            $__2.video.setPlaybackQuality(searchQ.label);
            break;
          }
        }
        resolve();
      });
    });
  },
  getCurrentQuality: function() {
    var $__2 = this;
    return new Promise(function(resolve, reject) {
      $__2._qualityListReadyPromise.then(function(q) {
        resolve($__2._qualities[$__2.video.getPlaybackQuality()]);
      });
    });
  },
  play: function() {
    var $__2 = this;
    var This = this;
    return new Promise(function(resolve, reject) {
      This._playing = true;
      This.video.playVideo();
      new base.Timer(function(timer) {
        var q = $__2.video.getAvailableQualityLevels();
        if (q.length) {
          timer.repeat = false;
          $__2._qualityListReadyPromise.resolve(q);
          resolve();
        } else {
          timer.repeat = true;
        }
      }, 500);
    });
  },
  pause: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      $__2._playing = false;
      $__2.video.pauseVideo();
    });
  },
  isPaused: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      return !$__2._playing;
    });
  },
  duration: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      return $__2.video.getDuration();
    });
  },
  setCurrentTime: function(time) {
    var $__2 = this;
    return this._deferredAction(function() {
      $__2.video.seekTo(time);
    });
  },
  currentTime: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      return $__2.video.getCurrentTime();
    });
  },
  setVolume: function(volume) {
    var $__2 = this;
    return this._deferredAction(function() {
      $__2.video.setVolume && $__2.video.setVolume(volume * 100);
    });
  },
  volume: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      return $__2.video.getVolume() / 100;
    });
  },
  setPlaybackRate: function(rate) {
    var $__2 = this;
    return this._deferredAction(function() {
      $__2.video.playbackRate = rate;
    });
  },
  playbackRate: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      return $__2.video.playbackRate;
    });
  },
  goFullScreen: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      var elem = $__2.video;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitEnterFullscreen) {
        elem.webkitEnterFullscreen();
      }
    });
  },
  unFreeze: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      var c = document.getElementById($__2.video.className + "canvas");
      $(c).remove();
    });
  },
  freeze: function() {
    var $__2 = this;
    return this._deferredAction(function() {
      var canvas = document.createElement("canvas");
      canvas.id = $__2.video.className + "canvas";
      canvas.width = $__2.video.videoWidth;
      canvas.height = $__2.video.videoHeight;
      canvas.style.cssText = $__2.video.style.cssText;
      canvas.style.zIndex = 2;
      var ctx = canvas.getContext("2d");
      ctx.drawImage($__2.video, 0, 0, Math.ceil(canvas.width / 16) * 16, Math.ceil(canvas.height / 16) * 16);
      $__2.video.parentElement.appendChild(canvas);
    });
  },
  unload: function() {
    this._callUnloadEvent();
    return paella_DeferredNotImplemented();
  },
  getDimensions: function() {
    return paella_DeferredNotImplemented();
  }
});
Class("paella.videoFactories.YoutubeVideoFactory", {
  initYoutubeApi: function() {
    if (!this._initialized) {
      var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      paella.youtubePlayerVars = {apiReadyPromise: new $.Deferred()};
      this._initialized = true;
    }
  },
  isStreamCompatible: function(streamData) {
    try {
      for (var key in streamData.sources) {
        if (key == 'youtube')
          return true;
      }
    } catch (e) {}
    return false;
  },
  getVideoObject: function(id, streamData, rect) {
    this.initYoutubeApi();
    return new paella.YoutubeVideo(id, streamData, rect.x, rect.y, rect.w, rect.h);
  }
});
function onYouTubeIframeAPIReady() {
  paella.youtubePlayerVars.apiReadyPromise.resolve();
}

"use strict";
paella.addPlugin(function() {
  return function($__super) {
    function ZoomPlugin() {
      $traceurRuntime.superConstructor(ZoomPlugin).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(ZoomPlugin, {
      getIndex: function() {
        return 20;
      },
      getAlignment: function() {
        return 'right';
      },
      getSubclass: function() {
        return "zoomButton";
      },
      getDefaultToolTip: function() {
        return base.dictionary.translate("Zoom");
      },
      getEvents: function() {
        return [paella.events.timeUpdate, paella.events.setComposition, paella.events.loadPlugins, paella.events.play];
      },
      onEvent: function(event, params) {
        switch (event) {
          case paella.events.timeUpdate:
            this.imageUpdate(event, params);
            break;
          case paella.events.setComposition:
            this.compositionChanged(event, params);
            break;
          case paella.events.loadPlugins:
            this.loadPlugin(event, params);
            break;
          case paella.events.play:
            this.exitPhotoMode();
            break;
        }
      },
      checkEnabled: function(onSuccess) {
        if (paella.player.videoContainer.sourceData.length < 2) {
          this._zImages = null;
          this._imageNumber = null;
          this._isActivated = false;
          this._isCreated = false;
          this._keys = null;
          this._ant = null;
          this._next = null;
          this._videoLength = null;
          this._compChanged = false;
          this._restartPlugin = false;
          this._actualImage = null;
          this._zoomIncr = null;
          this._maxZoom = null;
          this._minZoom = null;
          this._dragMode = false;
          this._mouseDownPosition = null;
          onSuccess(false);
          return;
        }
        var n = paella.player.videoContainer.sourceData[0].sources;
        if (n.hasOwnProperty("image"))
          onSuccess(true);
        else
          onSuccess(false);
      },
      setupIcons: function() {
        var $__2 = this;
        var width = $('.zoomFrame').width();
        var arrowsLeft = document.createElement("div");
        arrowsLeft.className = "arrowsLeft";
        arrowsLeft.style.display = 'none';
        var arrowsRight = document.createElement("div");
        arrowsRight.className = "arrowsRight";
        arrowsRight.style.display = 'none';
        arrowsRight.style.left = (width - 24) + 'px';
        $(arrowsLeft).click(function() {
          $__2.arrowCallLeft();
          event.stopPropagation();
        });
        $(arrowsRight).click(function() {
          $__2.arrowCallRight();
          event.stopPropagation();
        });
        var iconsFrame = document.createElement("div");
        iconsFrame.className = "iconsFrame";
        var buttonZoomIn = document.createElement("button");
        buttonZoomIn.className = "zoomActionButton buttonZoomIn";
        buttonZoomIn.style.display = 'none';
        var buttonZoomOut = document.createElement("button");
        buttonZoomOut.className = "zoomActionButton buttonZoomOut";
        buttonZoomOut.style.display = 'none';
        var buttonSnapshot = document.createElement("button");
        buttonSnapshot.className = "zoomActionButton buttonSnapshot";
        buttonSnapshot.style.display = 'none';
        var buttonZoomOn = document.createElement("button");
        buttonZoomOn.className = "zoomActionButton buttonZoomOn";
        $(iconsFrame).append(buttonZoomOn);
        $(iconsFrame).append(buttonSnapshot);
        $(iconsFrame).append(buttonZoomIn);
        $(iconsFrame).append(buttonZoomOut);
        $(".newframe").append(iconsFrame);
        $(".newframe").append(arrowsLeft);
        $(".newframe").append(arrowsRight);
        $(buttonZoomOn).click(function() {
          if ($__2._isActivated) {
            $__2.exitPhotoMode();
            $('.zoomActionButton.buttonZoomOn').removeClass("clicked");
          } else {
            $__2.enterPhotoMode();
            $('.zoomActionButton.buttonZoomOn').addClass("clicked");
          }
          event.stopPropagation();
        });
        $(buttonSnapshot).click(function() {
          if ($__2._actualImage != null)
            window.open($__2._actualImage, "_blank");
          event.stopPropagation();
        });
        $(buttonZoomIn).click(function() {
          $__2.zoomIn();
          event.stopPropagation();
        });
        $(buttonZoomOut).click(function() {
          $__2.zoomOut();
          event.stopPropagation();
        });
      },
      enterPhotoMode: function() {
        $(".zoomFrame").show();
        $(".zoomFrame").css('opacity', '1');
        this._isActivated = true;
        $('.buttonSnapshot').show();
        $('.buttonZoomOut').show();
        $('.buttonZoomIn').show();
        $('.arrowsRight').show();
        $('.arrowsLeft').show();
        paella.player.pause();
        if (this._imageNumber <= 1)
          $('.arrowsLeft').hide();
        else if (this._isActivated)
          $('.arrowsLeft').show();
        if (this._imageNumber >= this._keys.length - 2)
          $('.arrowsRight').hide();
        else if (this._isActivated)
          $('.arrowsRight').show();
      },
      exitPhotoMode: function() {
        $(".zoomFrame").hide();
        this._isActivated = false;
        $('.buttonSnapshot').hide();
        $('.buttonZoomOut').hide();
        $('.buttonZoomIn').hide();
        $('.arrowsRight').hide();
        $('.arrowsLeft').hide();
        $('.zoomActionButton.buttonZoomOn').removeClass("clicked");
      },
      setup: function() {
        this._maxZoom = this.config.maxZoom || 500;
        this._minZoom = this.config.minZoom || 100;
        this._zoomIncr = this.config.zoomIncr || 10;
        this._zImages = {};
        this._zImages = paella.player.videoContainer.sourceData[0].sources.image[0].frames;
        this._videoLength = paella.player.videoContainer.sourceData[0].sources.image[0].duration;
        this._keys = Object.keys(this._zImages);
        this._keys = this._keys.sort(function(a, b) {
          a = a.slice(6);
          b = b.slice(6);
          return parseInt(a) - parseInt(b);
        });
        this._next = 0;
        this._ant = 0;
      },
      loadPlugin: function() {
        if (this._isCreated == false) {
          this.createOverlay();
          this.setupIcons();
          $(".zoomFrame").hide();
          this._isActivated = false;
          this._isCreated = true;
        }
      },
      imageUpdate: function(event, params) {
        var sec = Math.round(params.currentTime);
        var src = $(".zoomFrame").css('background-image');
        if ($('.newframe').length > 0) {
          if (this._zImages.hasOwnProperty("frame_" + sec)) {
            if (src == this._zImages["frame_" + sec])
              return;
            else
              src = this._zImages["frame_" + sec];
          } else if (sec > this._next || sec < this._ant || this._compChanged) {
            if (this._compChanged)
              this._compChanged = false;
            src = this.returnSrc(sec);
          } else
            return;
          $("#photo_01").attr('src', src).load();
          var image = new Image();
          image.onload = function() {
            $(".zoomFrame").css('background-image', 'url(' + src + ')');
          };
          image.src = src;
          this._actualImage = src;
          if (this._imageNumber <= 1)
            $('.arrowsLeft').hide();
          else if (this._isActivated)
            $('.arrowsLeft').show();
          if (this._imageNumber >= this._keys.length - 2)
            $('.arrowsRight').hide();
          else if (this._isActivated)
            $('.arrowsRight').show();
        }
      },
      returnSrc: function(sec) {
        var ant = 0;
        for (i = 0; i < this._keys.length; i++) {
          var id = parseInt(this._keys[i].slice(6));
          var lastId = parseInt(this._keys[(this._keys.length - 1)].slice(6));
          if (sec < id) {
            this._next = id;
            this._ant = ant;
            this._imageNumber = i - 1;
            return this._zImages["frame_" + ant];
          } else if (sec > lastId && sec < this._videoLength) {
            this._next = this._videoLength;
            this._ant = lastId;
            return this._zImages["frame_" + ant];
          } else
            ant = id;
        }
      },
      arrowCallLeft: function() {
        if (this._imageNumber - 1 >= 0) {
          var frame = this._keys[this._imageNumber - 1];
          this._imageNumber -= 1;
          paella.player.videoContainer.seekToTime(parseInt(frame.slice(6)));
        }
      },
      arrowCallRight: function() {
        if (this._imageNumber + 1 <= this._keys.length) {
          var frame = this._keys[this._imageNumber + 1];
          this._imageNumber += 1;
          paella.player.videoContainer.seekToTime(parseInt(frame.slice(6)));
        }
      },
      createOverlay: function() {
        var $__2 = this;
        var newframe = document.createElement("div");
        newframe.className = "newframe";
        overlayContainer = paella.player.videoContainer.overlayContainer;
        overlayContainer.addElement(newframe, overlayContainer.getVideoRect(0));
        var zoomframe = document.createElement("div");
        zoomframe.className = "zoomFrame";
        newframe.insertBefore(zoomframe, newframe.firstChild);
        $(zoomframe).click(function(event) {
          event.stopPropagation();
        });
        $(zoomframe).bind('mousewheel', function(e) {
          if (e.originalEvent.wheelDelta / 120 > 0) {
            $__2.zoomIn();
          } else {
            $__2.zoomOut();
          }
        });
        $(zoomframe).mousedown(function(event) {
          $__2.mouseDown(event.clientX, event.clientY);
        });
        $(zoomframe).mouseup(function(event) {
          $__2.mouseUp();
        });
        $(zoomframe).mouseleave(function(event) {
          $__2.mouseLeave();
        });
        $(zoomframe).mousemove(function(event) {
          $__2.mouseMove(event.clientX, event.clientY);
        });
      },
      mouseDown: function(x, y) {
        this._dragMode = true;
        this._mouseDownPosition = {
          x: x,
          y: y
        };
      },
      mouseUp: function() {
        this._dragMode = false;
      },
      mouseLeave: function() {
        this._dragMode = false;
      },
      mouseMove: function(x, y) {
        if (this._dragMode) {
          var p = $(".zoomFrame")[0];
          var pos = this._backgroundPosition ? this._backgroundPosition : {
            left: 0,
            top: 0
          };
          var width = $('.zoomFrame').width();
          var height = $('.zoomFrame').height();
          var px = this._mouseDownPosition.x - x;
          var py = this._mouseDownPosition.y - y;
          var positionx = pos.left + px;
          var positiony = pos.top + py;
          positionx = positionx >= 0 ? positionx : 0;
          positionx = positionx <= 100 ? positionx : 100;
          positiony = positiony >= 0 ? positiony : 0;
          positiony = positiony <= 100 ? positiony : 100;
          $('.zoomFrame').css('background-position', positionx + "% " + positiony + "%");
          this._backgroundPosition = {
            left: positionx,
            top: positiony
          };
          this._mouseDownPosition.x = x;
          this._mouseDownPosition.y = y;
        }
      },
      zoomIn: function() {
        var z = $('.zoomFrame').css('background-size');
        z = z.split(" ");
        z = parseInt(z[0]);
        if (z < this._maxZoom) {
          $('.zoomFrame').css('background-size', z + this._zoomIncr + "% auto");
        }
      },
      zoomOut: function() {
        var z = $('.zoomFrame').css('background-size');
        z = z.split(" ");
        z = parseInt(z[0]);
        if (z > this._minZoom) {
          $('.zoomFrame').css('background-size', z - this._zoomIncr + "% auto");
        }
      },
      imageUpdateOnPause: function(params) {
        var sec = Math.round(params);
        var src = $(".zoomFrame").css('background-image');
        if ($('.newframe').length > 0 && src != this._actualImage) {
          if (this._zImages.hasOwnProperty("frame_" + sec)) {
            if (src == this._zImages["frame_" + sec])
              return;
            else
              src = this._zImages["frame_" + sec];
          } else {
            this._compChanged = false;
            src = this.returnSrc(sec);
          }
          $("#photo_01").attr('src', src).load();
          var image = new Image();
          image.onload = function() {
            $(".zoomFrame").css('background-image', 'url(' + src + ')');
          };
          image.src = src;
          this._actualImage = src;
        }
      },
      compositionChanged: function(event, params) {
        var $__2 = this;
        $(".newframe").remove();
        this._isCreated = false;
        if (paella.player.videoContainer.getMasterVideoRect().visible) {
          this.loadPlugin();
          if (paella.player.paused()) {
            paella.player.videoContainer.currentTime().then(function(currentTime) {
              $__2.imageUpdateOnPause(currentTime);
            });
          }
        }
        this._compChanged = true;
      },
      getName: function() {
        return "es.upv.paella.zoomPlugin";
      }
    }, {}, $__super);
  }(paella.EventDrivenPlugin);
});

"use strict";
paella.addPlugin(function() {
  return function($__super) {
    function MatomoTracking() {
      $traceurRuntime.superConstructor(MatomoTracking).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(MatomoTracking, {
      getName: function() {
        return "org.opencast.usertracking.MatomoSaverPlugIn";
      },
      checkEnabled: function(onSuccess) {
        var site_id = this.config.site_id,
            server = this.config.server,
            heartbeat = this.config.heartbeat,
            thisClass = this;
        if (server && site_id) {
          if (server.substr(-1) != '/')
            server += '/';
          require([server + "piwik.js"], function(matomo) {
            base.log.debug("Matomo Analytics Enabled");
            paella.userTracking.matomotracker = Piwik.getAsyncTracker(server + "piwik.php", site_id);
            paella.userTracking.matomotracker.client_id = thisClass.config.client_id;
            if (heartbeat && heartbeat > 0)
              paella.userTracking.matomotracker.enableHeartBeatTimer(heartbeat);
            if (Piwik && Piwik.MediaAnalytics) {
              paella.events.bind(paella.events.videoReady, function() {
                Piwik.MediaAnalytics.scanForMedia();
              });
            }
            thisClass.registerVisit();
          });
          onSuccess(true);
        } else {
          base.log.debug("No Matomo Site ID found in config file. Disabling Matomo Analytics PlugIn");
          onSuccess(false);
        }
      },
      registerVisit: function() {
        var title,
            event_id,
            series_title,
            series_id,
            presenter,
            view_mode;
        if (paella.opencast && paella.opencast._episode) {
          title = paella.opencast._episode.dcTitle;
          event_id = paella.opencast._episode.id;
          presenter = paella.opencast._episode.dcCreator;
          paella.userTracking.matomotracker.setCustomVariable(5, "client", (paella.userTracking.matomotracker.client_id || "Paella Opencast"));
        } else {
          paella.userTracking.matomotracker.setCustomVariable(5, "client", (paella.userTracking.matomotracker.client_id || "Paella Standalone"));
        }
        if (paella.opencast && paella.opencast._episode && paella.opencast._episode.mediapackage) {
          series_id = paella.opencast._episode.mediapackage.series;
          series_title = paella.opencast._episode.mediapackage.seriestitle;
        }
        if (title)
          paella.userTracking.matomotracker.setCustomVariable(1, "event", title + " (" + event_id + ")", "page");
        if (series_title)
          paella.userTracking.matomotracker.setCustomVariable(2, "series", series_title + " (" + series_id + ")", "page");
        if (presenter)
          paella.userTracking.matomotracker.setCustomVariable(3, "presenter", presenter, "page");
        paella.userTracking.matomotracker.setCustomVariable(4, "view_mode", view_mode, "page");
        if (title && presenter) {
          paella.userTracking.matomotracker.setDocumentTitle(title + " - " + (presenter || "Unknown"));
          paella.userTracking.matomotracker.trackPageView(title + " - " + (presenter || "Unknown"));
        } else {
          paella.userTracking.matomotracker.trackPageView();
        }
      },
      log: function(event, params) {
        if (paella.userTracking.matomotracker === undefined) {
          base.log.debug("Matomo Tracker is missing");
          return;
        }
        if ((this.config.category === undefined) || (this.config.category === true)) {
          var value = "";
          try {
            value = JSON.stringify(params);
          } catch (e) {}
          switch (event) {
            case paella.events.play:
              paella.userTracking.matomotracker.trackEvent("Player.Controls", "Play");
              break;
            case paella.events.pause:
              paella.userTracking.matomotracker.trackEvent("Player.Controls", "Pause");
              break;
            case paella.events.endVideo:
              paella.userTracking.matomotracker.trackEvent("Player.Status", "Ended");
              break;
            case paella.events.showEditor:
              paella.userTracking.matomotracker.trackEvent("Player.Editor", "Show");
              break;
            case paella.events.hideEditor:
              paella.userTracking.matomotracker.trackEvent("Player.Editor", "Hide");
              break;
            case paella.events.enterFullscreen:
              paella.userTracking.matomotracker.trackEvent("Player.View", "Fullscreen");
              break;
            case paella.events.exitFullscreen:
              paella.userTracking.matomotracker.trackEvent("Player.View", "ExitFullscreen");
              break;
            case paella.events.loadComplete:
              paella.userTracking.matomotracker.trackEvent("Player.Status", "LoadComplete");
              break;
            case paella.events.showPopUp:
              paella.userTracking.matomotracker.trackEvent("Player.PopUp", "Show", value);
              break;
            case paella.events.hidePopUp:
              paella.userTracking.matomotracker.trackEvent("Player.PopUp", "Hide", value);
              break;
            case paella.events.captionsEnabled:
              paella.userTracking.matomotracker.trackEvent("Player.Captions", "Enabled", value);
              break;
            case paella.events.captionsDisabled:
              paella.userTracking.matomotracker.trackEvent("Player.Captions", "Disabled", value);
              break;
            case paella.events.setProfile:
              paella.userTracking.matomotracker.trackEvent("Player.View", "Profile", value);
              break;
            case paella.events.seekTo:
            case paella.events.seekToTime:
              paella.userTracking.matomotracker.trackEvent("Player.Controls", "Seek", value);
              break;
            case paella.events.setVolume:
              paella.userTracking.matomotracker.trackEvent("Player.Settings", "Volume", value);
              break;
            case paella.events.resize:
              paella.userTracking.matomotracker.trackEvent("Player.View", "resize", value);
              break;
            case paella.events.setPlaybackRate:
              paella.userTracking.matomotracker.trackEvent("Player.Controls", "PlaybackRate", value);
              break;
          }
        }
      }
    }, {}, $__super);
  }(paella.userTracking.SaverPlugIn);
});
