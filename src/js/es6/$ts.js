'use strict';

(function () {
  //////////////////////
  // DOM 생성 및 제거 //
  //////////////////////
  // createElement

  /*
  * name: ce,
  * description: HTML element 만드는 함수,
  * arguments:
  opts = {
      tag: 태그명 (type: string) (ex. "div"),
      id: id (type: string) (ex. "myId"),
      class: 부여할 클래스(들) (type: string) (ex. "class1 class2"),
      parent: append 될 부모 element (type: HTMLelement) (ex. document.getElementById("parentDiv")),
      attr: 속성들 (type: object) (ex. { src: "myImg.png", type: "text/css" }),
      insertBeforeRefEl: insertBefore 시 기준이 될 element (type: HTMLelement) (ex. document.getElementById("refDiv"))
  }
  */
  function ce(opts) {
    var element, classArray, classArrayLen;
    element = document.createElement(opts.tag);
    if (opts.id) element.setAttribute('id', opts.id);

    if (opts.class) {
      if (opts.class.indexOf(' ') > -1) {
        classArray = opts.class.split(' ');
        classArrayLen = classArray.length;

        for (var i = 0; i < classArrayLen; i++) {
          element.classList.add(classArray[i]);
        }
      } else {
        element.classList.add(opts.class);
      }
    }

    if (opts.parent) opts.parent.appendChild(element);

    if (opts.attr) {
      for (var attrName in opts.attr) {
        element.setAttribute(attrName, opts.attr[attrName]);
      }
    }

    if (opts.parent && opts.insertBeforeRefEl) opts.parent.insertBefore(element, opts.insertBeforeRefEl);
    return element;
  } // create svg element


  function ceSvg(tag, parent) {
    var svgElement = document.createElementNS('http://www.w3.org/2000/svg', tag);
    if (parent) parent.appendChild(svgElement);
    return svgElement;
  } // remove element


  function re(element) {
    if (element) element.parentNode.removeChild(element);
  } // script file 로드


  function loadScriptFile(scriptSrc, callBack) {
    var script = document.createElement('script');
    script.src = scriptSrc;

    if (callBack) {
      script.onload = function (object) {
        callBack(object);
      };
    }

    document.body.appendChild(script);
  } // css file 로드


  function loadCssFile(cssSrc, callBack) {
    var css = document.createElement("link");
    css.setAttribute("rel", "stylesheet");
    css.setAttribute("type", "text/css");
    css.setAttribute("href", cssSrc);

    if (callBack) {
      css.onload = function () {
        callBack();
      };
    }

    document.head.appendChild(css);
  } ////////////////////////
  // DOM 선택(selector) //
  ////////////////////////
  // getElement(s)

  /*
  * name: getEl,
  * description: getElementById && getElementsByTagName && getElementsByClassName 합쳐놓은 함수,
  * arguments:
  [selector, parent]
  - selector: id인 경우 '#id', tag인 경우 'tagName', class인 경우 'className1 className2 ...'
  - parent: (optional) 부모 element, default: document
  */


  function getEl(selector) {
    var parentElement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document,
        index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null,
        result,
        len;

    if (typeof selector === 'string') {
      if (selector.indexOf(' ') > -1 || selector.indexOf('>') > -1 || selector.indexOf('[') > -1 || selector.indexOf(']') > -1 || selector.indexOf('.') > 0) {
        result = qs(selector, parentElement, index);
        if (result == null) return;
      } else if (selector.indexOf('#') > -1) {
        result = parentElement.getElementById(selector.slice(1, selector.length));
        index = null;
      } else if (selector.indexOf('.') > -1) {
        var classNameArray = selector.split('.');

        if (classNameArray.length === 1) {
          result = parentElement.getElementsByClassName(classNameArray[0]);
        } else {
          result = parentElement.getElementsByClassName(classNameArray.join(' '));
        }
      } else {
        result = parentElement.getElementsByTagName(selector);
      }
    } else {
      console.error('$ts.getEl: ' + selector + '가 string이 아닙니다.');
      return;
    }

    if (result == null) {
      console.error('$ts.getEl: query에 해당하는 element 없음');
      return;
    } else {
      len = result.length;

      if (len) {
        var array = [];

        for (var i = 0; i < len; i++) {
          array.push(result[i]);
        }

        result = array;
      }

      return index || index === 0 ? result[index] : result;
    }
  } // querySelector & querySelectorAll


  function qs(query) {
    var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document,
        index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null,
        result = parent.querySelectorAll(query),
        len = result.length,
        array = [];

    switch (len) {
      case 0:
        /*console.error('$ts.qs: '+ query +'에 해당하는 element 없음');*/
        result = null;
        break;
      // case 1 : result = result[0]; break;

      default:
        for (var i = 0; i < len; i++) array.push(result[i]);

        result = array;
        break;
    } // return (index || index === 0) ? result[index] : result;


    return result;
  } ///////////////////
  // DOM 속성 제어 //
  ///////////////////
  // class 추가


  function addClass(target, className) {
    className = className.split(' ');
    var len = className.length;

    if (!target) {
      console.error('$ts.addClass: target이 없습니다.');
    } else if (!target.length) {
      target = [target];
    }

    if (len === 0) {
      console.error('$ts.addClass: className이 없습니다.');
    } else {
      for (var j = 0; j < target.length; j++) {
        for (var i = 0; i < className.length; i++) target[j].classList.add(className[i]);
      }
    }
  } // class 제거


  function removeClass(target, className) {
    className = className.split(' ');
    var len = className.length;

    if (!target) {
      console.error('$ts.removeClass: target이 없습니다.');
    } else if (!target.length) {
      target = [target];
    }

    if (len === 0) {
      console.error('$ts.removeClass: className이 없습니다.');
    } else {
      for (var j = 0; j < target.length; j++) {
        for (var i = 0; i < className.length; i++) target[j].classList.remove(className[i]);
      }
    }
  } // class 판단


  function hasClass(target, className) {
    return target.classList.contains(className);
  } // inline style 추가


  function setStyles(target, styles) {
    for (var prop in styles) {
      target.style[prop] = styles[prop];
    }
  } //////////////
  // DOM 판단 //
  //////////////
  // document 또는 parent에 query에 해당하는 element가 있는가?


  function isThere(query) {
    var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
    return !!this.qs(query, parent);
  } // object가 빈 값인가?


  function isEmpty(object) {
    return object === undefined || object === null || object.length === 0 || Number.isNaN(object);
  } ////////////////
  // DOM 이벤트 //
  ////////////////
  // down 이벤트 추가하기


  function addDownEvents(target, opts) {
    var className = opts && opts.className ? opts.className : 'clicked',
        addClass = this.addClass ? this.addClass : addClass,
        removeClass = this.removeClass ? this.removeClass : removeClass;

    function addEvent(eType, classType) {
      target.addEventListener(eType, function (e) {
        if (opts && opts.preventDefault) e.preventDefault();

        if (classType === 'add') {
          addClass(target, className);
          if (opts && opts.addCallback) opts.addCallback(target);
        } else {
          removeClass(target, className);
          if (opts && opts.removeCallback) opts.removeCallback(target);
        }
      }, false);
    }

    ;
    addEvent('mousedown', 'add');
    addEvent('touchstart', 'add');
    addEvent('mouseleave', 'remove');
    addEvent('touchcancel', 'remove');
    addEvent('mouseup', 'remove');
    addEvent('touchend', 'remove');
  } // hover 이벤트 추가하기


  function addHoverEvents(target, opts) {
    var className = opts && opts.className ? opts.className : 'hover',
        addClass = this.addClass ? this.addClass : addClass,
        removeClass = this.removeClass ? this.removeClass : removeClass,
        isTouchDevice = 'ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch;

    function addEvent(eType, classType) {
      target.addEventListener(eType, function (e) {
        if (opts && opts.preventDefault) e.preventDefault(); // 터치 디바이스에서 마우스 이벤트 실행 안함

        if (isTouchDevice && e.type == 'mouseover') return;

        if (classType === 'add') {
          addClass(target, className);
          if (opts && opts.addCallback) opts.addCallback(target);
        } else {
          removeClass(target, className);
          if (opts && opts.removeCallback) opts.removeCallback(target);
        }
      }, false);
    }

    ; // addEvent('mouseenter', 'add');

    addEvent('mouseover', 'add');
    addEvent('touchstart', 'add'); // addEvent('mouseleave', 'remove');

    addEvent('mouseout', 'remove');
    addEvent('touchend', 'remove');
  } // focus 이벤트 추가하기


  function addFocusEvents(target, opts) {
    var className = opts && opts.className ? opts.className : 'focused',
        addClass = this.addClass ? this.addClass : addClass,
        removeClass = this.removeClass ? this.removeClass : removeClass;

    function addEvent(eType, classType) {
      target.addEventListener(eType, function (e) {
        if (opts && opts.preventDefault) e.preventDefault();

        if (classType === 'add') {
          addClass(target, className);
          if (opts && opts.addCallback) opts.addCallback(target);
        } else {
          removeClass(target, className);
          if (opts && opts.removeCallback) opts.removeCallback(target);
        }
      }, false);
    }

    ;
    addEvent('focus', 'add');
    addEvent('blur', 'remove');
  } //////////////
  // DOM ETC. //
  //////////////
  // getBoundingClineRect


  function getSize(target) {
    return target.getBoundingClientRect();
  } // getStyles


  function getStyles(target) {
    return window.getComputedStyle(target);
  } ///////////////////////////
  // number, array, string //
  ///////////////////////////
  // 천 단위마다 comma 찍는 함수


  function insertComma(text) {
    text = text.toString();
    var output = '';

    do {
      if (text.length % 3 != 0) {
        output += text.slice(0, text.length % 3) + ',';
        text = text.slice(text.length % 3, text.length);
      } else {
        output += text.slice(0, 3) + ',';
        text = text.slice(3, text.length);
      }
    } while (text.length >= 4);

    output += text;
    return output;
  } // 랜덤 숫자 만들기


  function getRandomNumber(max) {
    var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    return Math.floor(Math.random() * max) + min;
  } // 랜덤 숫자 배열 만들기


  function makeRandomArray(min, length) {
    var randomNumber = 0,
        inspector = '',
        array = [];

    do {
      randomNumber = Math.floor(Math.random() * length) + min;
      if (inspector.indexOf(randomNumber) < 0) array.push(randomNumber);
      inspector += randomNumber.toString();
    } while (array.length !== length);

    return array;
  } // 배열 숫자 합치기


  function sumNumberArray(array) {
    return array.reduce(function (accumulator, currentValue) {
      return accumulator + currentValue;
    });
  } // array 순서 섞어주는 함수


  function stirArray(elements, length) {
    var numArray,
        newElements = [];
    numArray = length ? makeRandomArray(0, length) : makeRandomArray(0, elements.length);
    newElements = newElements.concat(elements);
    numArray.forEach(function (randomNumber, index) {
      newElements[index] = elements[randomNumber];
    });
    return newElements;
  } // 배열 여러 개 합치기


  function concatArrays(arrays) {
    var newArray = [];

    for (var i = 0; i < arrays.length; i++) newArray = newArray.concat(arrays[i]);

    return newArray;
  } ////////////////////////////////////////////
  // DOM 요소 target으로 만들어 method 활용 //
  ////////////////////////////////////////////


  function makeTarget(target) {
    var addClass = this.addClass,
        removeClass = this.removeClass,
        hasClass = this.hasClass,
        getSize = this.getSize,
        getStyles = this.getStyles;

    target.addClass = function (className) {
      addClass(target, className);
    };

    target.removeClass = function (className) {
      removeClass(target, className);
    };

    target.hasClass = function (className) {
      return hasClass(target, className);
    };

    Object.defineProperty(target, 'getSize', {
      get: function () {
        return getSize(target);
      }
    });
    Object.defineProperty(target, 'getStyles', {
      get: function () {
        return getStyles(target);
      }
    });
    return target;
  } ////////////////////////////////////
  // data(image, JSON 등) 제어 함수 //
  ////////////////////////////////////
  // load JSON


  function loadJSON(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);

    rawFile.onreadystatechange = function () {
      if (rawFile.readyState === 4 && rawFile.status == "200") {
        callback(rawFile.responseText);
      }
    };

    rawFile.send(null);
  } // img sprite (간단한)


  function imgSprite(target, imgArray, intervalTime) {
    this.target = target;
    this.imgArray = imgArray;
    this.intervalTime = intervalTime;
    this.len_imgArray = this.imgArray.length;
    this.imgSrcCnt = 0;
    this.intervalID = undefined;
    this.isWorking = false;

    this.start = function () {
      var self = this;
      if (this.isWorking) return;
      this.isWorking = true;
      this.intervalID = window.setInterval(function () {
        if (self.imgSrcCnt === self.len_imgArray) {
          self.imgSrcCnt = 0;
        }

        self.changeSrc();
        self.imgSrcCnt++;
      }, self.intervalTime);
    };

    this.changeSrc = function (index) {
      if (typeof index === "number") {
        this.imgSrcCnt = index;
      }

      this.target.src = this.imgArray[this.imgSrcCnt].src;
    };

    this.stop = function () {
      if (!this.isWorking) return;
      window.clearInterval(this.intervalID);
      this.changeSrc(0);
      this.isWorking = false;
    };
  } // img preload (간단한)


  function imgPreload(imgPath, imgCnt, fileType, callback) {
    var wrap, loadingContainer, preloadedImgsDiv, preloadedImgsArray, loadedCnt, imgTag, intervalID;
    wrap = $ts.getEl("#wrap");
    preloadedImgsDiv = $ts.getEl("#preloadedImgs");
    preloadedImgsDiv.style.position = "absolute";
    preloadedImgsDiv.style.top = "-1px";
    preloadedImgsDiv.style.left = "-1px";
    preloadedImgsDiv.style.width = "1px";
    preloadedImgsDiv.style.height = "1px";
    preloadedImgsDiv.style.overflow = "hidden";
    preloadedImgsArray = [];
    loadedCnt = imgCnt;

    for (var i = 1; i <= imgCnt; i++) {
      imgTag = $ts.ce({
        tag: "img",
        parent: preloadedImgsDiv
      });
      imgTag.addEventListener("load", function (e) {
        loadedCnt--;
      });

      if (i < 10) {
        imgTag.src = imgPath + "/00" + i + "." + fileType;
      } else if (i >= 100) {
        imgTag.src = imgPath + "/" + i + "." + fileType;
      } else {
        imgTag.src = imgPath + "/0" + i + "." + fileType;
      }

      preloadedImgsArray.push(imgTag);
    }

    intervalID = window.setInterval(function () {
      if (!loadedCnt) {
        window.clearInterval(intervalID);
        console.info("imgPreload: all imgs loaded...");
        if (callback) callback(preloadedImgsArray);
      } else {
        console.info("imgPreload: img is loading...");
      }
    });
  } // create audio


  var createAudio = function () {
    return {
      set: function (src) {
        const audio = new Audio();
        audio.src = src;
        audio.load();
        return audio;
      },
      interval: function (req, callBack) {
        const ani = setInterval(function () {
          if (req) {
            clearInterval(ani);
            if (callBack) callBack();
          }
        });
      }
    };
  }(); // function  (src) {
  //     var audio = new Audio,
  //         source = document.createElement('source');
  //     audio.appendChild(source);
  //     source.src = src;
  //     audio.load();
  //     audio.preload = 'none';
  //     return audio;
  // }


  var $ts = {
    // DOM 생성 및 제거
    ce: ce,
    ceSvg: ceSvg,
    re: re,
    loadScriptFile: loadScriptFile,
    loadCssFile: loadCssFile,
    // DOM 선택(selector)
    getEl: getEl,
    qs: qs,
    // DOM 속성 제어
    addClass: addClass,
    removeClass: removeClass,
    hasClass: hasClass,
    setStyles: setStyles,
    // DOM 판단
    isThere: isThere,
    isEmpty: isEmpty,
    // DOM 이벤트
    addDownEvents: addDownEvents,
    addHoverEvents: addHoverEvents,
    addFocusEvents: addFocusEvents,
    // DOM ETC.
    getSize: getSize,
    getStyles: getStyles,
    // number, array, string
    insertComma: insertComma,
    getRandomNumber: getRandomNumber,
    makeRandomArray: makeRandomArray,
    sumNumberArray: sumNumberArray,
    stirArray: stirArray,
    concatArrays: concatArrays,
    // DOM 요소 target으로 만들어 method 활용
    makeTarget: makeTarget,
    // data(image, JSON 등) 제어 함수
    loadJSON: loadJSON,
    imgSprite: imgSprite,
    imgPreload: imgPreload,
    // audio 생성
    createAudio: createAudio,

    get timeNow() {
      return new Date().getTime();
    }

  };

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    console.log(module);
    module.exports = $ts;
  } else {
    window.$ts = $ts;
  }
})();