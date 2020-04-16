> 逐行解析 react-dom.development.js
首先 `npm run dev` 运行程序， 打开控制台你会看到页面初始化时所有执行的函数，下面就按照函数执行顺序逐步解析。

1. makePrefixMap
```js
/**
 * Generate a mapping of standard vendor prefixes using the defined style property and event name.
 *
 * @param {string} styleProp
 * @param {string} eventName
 * @returns {object}
 */
function makePrefixMap(styleProp, eventName) {
  var prefixes = {};

  prefixes[styleProp.toLowerCase()] = eventName.toLowerCase();
  prefixes['Webkit' + styleProp] = 'webkit' + eventName;
  prefixes['Moz' + styleProp] = 'moz' + eventName;
  return prefixes;
}

/**
 * A list of event names to a configurable list of vendor prefixes.
 */
var vendorPrefixes = {
  animationend: makePrefixMap('Animation', 'AnimationEnd'),
  animationiteration: makePrefixMap('Animation', 'AnimationIteration'),
  animationstart: makePrefixMap('Animation', 'AnimationStart'),
  transitionend: makePrefixMap('Transition', 'TransitionEnd')
};
```
相关代码如上， makePrefixMap 主要是生成带有前缀的事件名称， 包含如上的四个事件。

2. unsafeCastStringToDOMTopLevelType & getVendorPrefixedEventName
```js
function unsafeCastStringToDOMTopLevelType(topLevelType) {
  return topLevelType;
}

/**
 * Attempts to determine the correct vendor prefixed event name.
 *
 * @param {string} eventName
 * @returns {string}
 */
function getVendorPrefixedEventName(eventName) {
  if (prefixedEventNames[eventName]) {
    return prefixedEventNames[eventName];
  } else if (!vendorPrefixes[eventName]) {
    return eventName;
  }

  var prefixMap = vendorPrefixes[eventName];

  for (var styleProp in prefixMap) {
    if (prefixMap.hasOwnProperty(styleProp) && styleProp in style) {
      return prefixedEventNames[eventName] = prefixMap[styleProp];
    }
  }

  return eventName;
}

/**
 * To identify top level events in ReactDOM, we use constants defined by this
 * module. This is the only module that uses the unsafe* methods to express
 * that the constants actually correspond to the browser event names. This lets
 * us save some bundle size by avoiding a top level type -> event name map.
 * The rest of ReactDOM code should import top level types from this file.
 */
var TOP_ABORT = unsafeCastStringToDOMTopLevelType('abort');
var TOP_ANIMATION_END = unsafeCastStringToDOMTopLevelType(getVendorPrefixedEventName('animationend'));
var TOP_ANIMATION_ITERATION = unsafeCastStringToDOMTopLevelType(getVendorPrefixedEventName('animationiteration'));
var TOP_ANIMATION_START = unsafeCastStringToDOMTopLevelType(getVendorPrefixedEventName('animationstart'));
var TOP_BLUR = unsafeCastStringToDOMTopLevelType('blur');
var TOP_CAN_PLAY = unsafeCastStringToDOMTopLevelType('canplay');
var TOP_CAN_PLAY_THROUGH = unsafeCastStringToDOMTopLevelType('canplaythrough');
var TOP_CANCEL = unsafeCastStringToDOMTopLevelType('cancel');
var TOP_CHANGE = unsafeCastStringToDOMTopLevelType('change');
var TOP_CLICK = unsafeCastStringToDOMTopLevelType('click');
var TOP_CLOSE = unsafeCastStringToDOMTopLevelType('close');
var TOP_COMPOSITION_END = unsafeCastStringToDOMTopLevelType('compositionend');
var TOP_COMPOSITION_START = unsafeCastStringToDOMTopLevelType('compositionstart');
var TOP_COMPOSITION_UPDATE = unsafeCastStringToDOMTopLevelType('compositionupdate');
var TOP_CONTEXT_MENU = unsafeCastStringToDOMTopLevelType('contextmenu');
var TOP_COPY = unsafeCastStringToDOMTopLevelType('copy');
var TOP_CUT = unsafeCastStringToDOMTopLevelType('cut');
var TOP_DOUBLE_CLICK = unsafeCastStringToDOMTopLevelType('dblclick');
var TOP_AUX_CLICK = unsafeCastStringToDOMTopLevelType('auxclick');
var TOP_DRAG = unsafeCastStringToDOMTopLevelType('drag');
var TOP_DRAG_END = unsafeCastStringToDOMTopLevelType('dragend');
var TOP_DRAG_ENTER = unsafeCastStringToDOMTopLevelType('dragenter');
var TOP_DRAG_EXIT = unsafeCastStringToDOMTopLevelType('dragexit');
var TOP_DRAG_LEAVE = unsafeCastStringToDOMTopLevelType('dragleave');
var TOP_DRAG_OVER = unsafeCastStringToDOMTopLevelType('dragover');
var TOP_DRAG_START = unsafeCastStringToDOMTopLevelType('dragstart');
var TOP_DROP = unsafeCastStringToDOMTopLevelType('drop');
var TOP_DURATION_CHANGE = unsafeCastStringToDOMTopLevelType('durationchange');
var TOP_EMPTIED = unsafeCastStringToDOMTopLevelType('emptied');
var TOP_ENCRYPTED = unsafeCastStringToDOMTopLevelType('encrypted');
var TOP_ENDED = unsafeCastStringToDOMTopLevelType('ended');
var TOP_ERROR = unsafeCastStringToDOMTopLevelType('error');
var TOP_FOCUS = unsafeCastStringToDOMTopLevelType('focus');
var TOP_GOT_POINTER_CAPTURE = unsafeCastStringToDOMTopLevelType('gotpointercapture');
var TOP_INPUT = unsafeCastStringToDOMTopLevelType('input');
var TOP_INVALID = unsafeCastStringToDOMTopLevelType('invalid');
var TOP_KEY_DOWN = unsafeCastStringToDOMTopLevelType('keydown');
var TOP_KEY_PRESS = unsafeCastStringToDOMTopLevelType('keypress');
var TOP_KEY_UP = unsafeCastStringToDOMTopLevelType('keyup');
var TOP_LOAD = unsafeCastStringToDOMTopLevelType('load');
var TOP_LOAD_START = unsafeCastStringToDOMTopLevelType('loadstart');
var TOP_LOADED_DATA = unsafeCastStringToDOMTopLevelType('loadeddata');
var TOP_LOADED_METADATA = unsafeCastStringToDOMTopLevelType('loadedmetadata');
var TOP_LOST_POINTER_CAPTURE = unsafeCastStringToDOMTopLevelType('lostpointercapture');
var TOP_MOUSE_DOWN = unsafeCastStringToDOMTopLevelType('mousedown');
var TOP_MOUSE_MOVE = unsafeCastStringToDOMTopLevelType('mousemove');
var TOP_MOUSE_OUT = unsafeCastStringToDOMTopLevelType('mouseout');
var TOP_MOUSE_OVER = unsafeCastStringToDOMTopLevelType('mouseover');
var TOP_MOUSE_UP = unsafeCastStringToDOMTopLevelType('mouseup');
var TOP_PASTE = unsafeCastStringToDOMTopLevelType('paste');
var TOP_PAUSE = unsafeCastStringToDOMTopLevelType('pause');
var TOP_PLAY = unsafeCastStringToDOMTopLevelType('play');
var TOP_PLAYING = unsafeCastStringToDOMTopLevelType('playing');
var TOP_POINTER_CANCEL = unsafeCastStringToDOMTopLevelType('pointercancel');
var TOP_POINTER_DOWN = unsafeCastStringToDOMTopLevelType('pointerdown');


var TOP_POINTER_MOVE = unsafeCastStringToDOMTopLevelType('pointermove');
var TOP_POINTER_OUT = unsafeCastStringToDOMTopLevelType('pointerout');
var TOP_POINTER_OVER = unsafeCastStringToDOMTopLevelType('pointerover');
var TOP_POINTER_UP = unsafeCastStringToDOMTopLevelType('pointerup');
var TOP_PROGRESS = unsafeCastStringToDOMTopLevelType('progress');
var TOP_RATE_CHANGE = unsafeCastStringToDOMTopLevelType('ratechange');
var TOP_RESET = unsafeCastStringToDOMTopLevelType('reset');
var TOP_SCROLL = unsafeCastStringToDOMTopLevelType('scroll');
var TOP_SEEKED = unsafeCastStringToDOMTopLevelType('seeked');
var TOP_SEEKING = unsafeCastStringToDOMTopLevelType('seeking');
var TOP_SELECTION_CHANGE = unsafeCastStringToDOMTopLevelType('selectionchange');
var TOP_STALLED = unsafeCastStringToDOMTopLevelType('stalled');
var TOP_SUBMIT = unsafeCastStringToDOMTopLevelType('submit');
var TOP_SUSPEND = unsafeCastStringToDOMTopLevelType('suspend');
var TOP_TEXT_INPUT = unsafeCastStringToDOMTopLevelType('textInput');
var TOP_TIME_UPDATE = unsafeCastStringToDOMTopLevelType('timeupdate');
var TOP_TOGGLE = unsafeCastStringToDOMTopLevelType('toggle');
var TOP_TOUCH_CANCEL = unsafeCastStringToDOMTopLevelType('touchcancel');
var TOP_TOUCH_END = unsafeCastStringToDOMTopLevelType('touchend');
var TOP_TOUCH_MOVE = unsafeCastStringToDOMTopLevelType('touchmove');
var TOP_TOUCH_START = unsafeCastStringToDOMTopLevelType('touchstart');
var TOP_TRANSITION_END = unsafeCastStringToDOMTopLevelType(getVendorPrefixedEventName('transitionend'));
var TOP_VOLUME_CHANGE = unsafeCastStringToDOMTopLevelType('volumechange');
var TOP_WAITING = unsafeCastStringToDOMTopLevelType('waiting');
var TOP_WHEEL = unsafeCastStringToDOMTopLevelType('wheel');

// List of events that need to be individually attached to media elements.
// Note that events in this list will *not* be listened to at the top level
// unless they're explicitly whitelisted in `ReactBrowserEventEmitter.listenTo`.
var mediaEventTypes = [TOP_ABORT, TOP_CAN_PLAY, TOP_CAN_PLAY_THROUGH, TOP_DURATION_CHANGE, TOP_EMPTIED, TOP_ENCRYPTED, TOP_ENDED, TOP_ERROR, TOP_LOADED_DATA, TOP_LOADED_METADATA, TOP_LOAD_START, TOP_PAUSE, TOP_PLAY, TOP_PLAYING, TOP_PROGRESS, TOP_RATE_CHANGE, TOP_SEEKED, TOP_SEEKING, TOP_STALLED, TOP_SUSPEND, TOP_TIME_UPDATE, TOP_VOLUME_CHANGE, TOP_WAITING];
```
相关代码如上， unsafeCastStringToDOMTopLevelType 函数返回的就是传入参数的值， getVendorPrefixedEventName 返回带有前缀的事件， 此处定义了事件常量以供其他地方使用。

3. addEventPoolingTo
```js
function addEventPoolingTo(EventConstructor) {
  EventConstructor.eventPool = [];
  EventConstructor.getPooled = getPooledEvent;
  EventConstructor.release = releasePooledEvent;
}

addEventPoolingTo(SyntheticEvent);
```
代码如上， addEventPoolingTo 给合成事件 SyntheticEvent 添加事件池， 并提供了 getPooled, release 方法

4. SyntheticEvent

5. PropertyInfoRecord
```js
/**
 * RESERVED = 0             react预留的属性，由react单独处理
 * STRING = 1               字符串属性
 * BOOLEANISH_STRING = 2    接收字符串 "true" "false" 的属性
 * BOOLEAN = 3              如 disabled 的属性，有该属性时为true，没有时为false
 * OVERLOADED_BOOLEAN = 4   与 BOOLEAN 类似，但value可以为其他值
 * NUMERIC = 5
 * POSITIVE_NUMERIC = 6
*/

function PropertyInfoRecord(name, type, mustUseProperty, attributeName, attributeNamespace, sanitizeURL) {
  this.acceptsBooleans = type === BOOLEANISH_STRING || type === BOOLEAN || type === OVERLOADED_BOOLEAN;
  this.attributeName = attributeName;
  this.attributeNamespace = attributeNamespace;
  this.mustUseProperty = mustUseProperty;
  this.propertyName = name;
  this.type = type;
  this.sanitizeURL = sanitizeURL;
}
// When adding attributes to this list, be sure to also add them to
// the `possibleStandardNames` module to ensure casing and incorrect
// name warnings.
var properties = {};

// These props are reserved by React. They shouldn't be written to the DOM.
['children', 'dangerouslySetInnerHTML',
// TODO: This prevents the assignment of defaultValue to regular
// elements (not just inputs). Now that ReactDOMInput assigns to the
// defaultValue property -- do we need this?
'defaultValue', 'defaultChecked', 'innerHTML', 'suppressContentEditableWarning', 'suppressHydrationWarning', 'style'].forEach(function (name) {
  properties[name] = new PropertyInfoRecord(name, RESERVED, false, // mustUseProperty
  name, // attributeName
  null, // attributeNamespace
  false);
} // sanitizeURL
);
```
上面只展示了部分属性， properties 用于记录所有的属性， 属性类为 PropertyInfoRecord ， PropertyInfoRecord 里面包含了属性值的类型等信息。 properties 里面还包含了 react 所映射的一些属性如 className htmlFor 等。

6. isEventSupported 
```js
/**
 * Checks if an event is supported in the current execution environment.
 *
 * NOTE: This will not work correctly for non-generic events such as `change`,
 * `reset`, `load`, `error`, and `select`.
 *
 * Borrows from Modernizr.
 *
 * @param {string} eventNameSuffix Event name, e.g. "click".
 * @return {boolean} True if the event is supported.
 * @internal
 * @license Modernizr 3.0.0pre (Custom Build) | MIT
 */
function isEventSupported(eventNameSuffix) {
  if (!canUseDOM) {
    return false;
  }

  var eventName = 'on' + eventNameSuffix;
  var isSupported = eventName in document;

  if (!isSupported) {
    var element = document.createElement('div');
    element.setAttribute(eventName, 'return;');
    isSupported = typeof element[eventName] === 'function';
  }

  return isSupported;
}

var isInputEventSupported = false;
if (canUseDOM) {
  // IE9 claims to support the input event but fails to trigger it when
  // deleting text, so we ignore its input events.
  isInputEventSupported = isEventSupported('input') && (!document.documentMode || document.documentMode > 9);
}
```
如上面注释所说， isEventSupported 用于检测当前环境是否支持某个事件， 上面还提示了对于某些事件 change reset 等无法检测。
代码中与 input 事件进行了检测，IE9及以下版本不支持 input 事件。 canUseDOM 标识当前是否是浏览器环境， document.documentMode 是 IE 特有的属性， 值为数字， 代表当前IE版本。 


7. 
```js
/**
 * DiscreteEvent = 0
 * UserBlockingEvent = 1
 * ContinuousEvent = 2
 * /
/**
 * Turns
 * ['abort', ...]
 * into
 * eventTypes = {
 *   'abort': {
 *     phasedRegistrationNames: {
 *       bubbled: 'onAbort',
 *       captured: 'onAbortCapture',
 *     },
 *     dependencies: [TOP_ABORT],
 *   },
 *   ...
 * };
 * topLevelEventsToDispatchConfig = new Map([
 *   [TOP_ABORT, { sameConfig }],
 * ]);
 */

var eventTuples = [
// Discrete events
[TOP_BLUR, 'blur', DiscreteEvent], [TOP_CANCEL, 'cancel', DiscreteEvent], [TOP_CLICK, 'click', DiscreteEvent], [TOP_CLOSE, 'close', DiscreteEvent], [TOP_CONTEXT_MENU, 'contextMenu', DiscreteEvent], [TOP_COPY, 'copy', DiscreteEvent], [TOP_CUT, 'cut', DiscreteEvent], [TOP_AUX_CLICK, 'auxClick', DiscreteEvent], [TOP_DOUBLE_CLICK, 'doubleClick', DiscreteEvent], [TOP_DRAG_END, 'dragEnd', DiscreteEvent], [TOP_DRAG_START, 'dragStart', DiscreteEvent], [TOP_DROP, 'drop', DiscreteEvent], [TOP_FOCUS, 'focus', DiscreteEvent], [TOP_INPUT, 'input', DiscreteEvent], [TOP_INVALID, 'invalid', DiscreteEvent], [TOP_KEY_DOWN, 'keyDown', DiscreteEvent], [TOP_KEY_PRESS, 'keyPress', DiscreteEvent], [TOP_KEY_UP, 'keyUp', DiscreteEvent], [TOP_MOUSE_DOWN, 'mouseDown', DiscreteEvent], [TOP_MOUSE_UP, 'mouseUp', DiscreteEvent], [TOP_PASTE, 'paste', DiscreteEvent], [TOP_PAUSE, 'pause', DiscreteEvent], [TOP_PLAY, 'play', DiscreteEvent], [TOP_POINTER_CANCEL, 'pointerCancel', DiscreteEvent], [TOP_POINTER_DOWN, 'pointerDown', DiscreteEvent], [TOP_POINTER_UP, 'pointerUp', DiscreteEvent], [TOP_RATE_CHANGE, 'rateChange', DiscreteEvent], [TOP_RESET, 'reset', DiscreteEvent], [TOP_SEEKED, 'seeked', DiscreteEvent], [TOP_SUBMIT, 'submit', DiscreteEvent], [TOP_TOUCH_CANCEL, 'touchCancel', DiscreteEvent], [TOP_TOUCH_END, 'touchEnd', DiscreteEvent], [TOP_TOUCH_START, 'touchStart', DiscreteEvent], [TOP_VOLUME_CHANGE, 'volumeChange', DiscreteEvent],

// User-blocking events
[TOP_DRAG, 'drag', UserBlockingEvent], [TOP_DRAG_ENTER, 'dragEnter', UserBlockingEvent], [TOP_DRAG_EXIT, 'dragExit', UserBlockingEvent], [TOP_DRAG_LEAVE, 'dragLeave', UserBlockingEvent], [TOP_DRAG_OVER, 'dragOver', UserBlockingEvent], [TOP_MOUSE_MOVE, 'mouseMove', UserBlockingEvent], [TOP_MOUSE_OUT, 'mouseOut', UserBlockingEvent], [TOP_MOUSE_OVER, 'mouseOver', UserBlockingEvent], [TOP_POINTER_MOVE, 'pointerMove', UserBlockingEvent], [TOP_POINTER_OUT, 'pointerOut', UserBlockingEvent], [TOP_POINTER_OVER, 'pointerOver', UserBlockingEvent], [TOP_SCROLL, 'scroll', UserBlockingEvent], [TOP_TOGGLE, 'toggle', UserBlockingEvent], [TOP_TOUCH_MOVE, 'touchMove', UserBlockingEvent], [TOP_WHEEL, 'wheel', UserBlockingEvent],

// Continuous events
[TOP_ABORT, 'abort', ContinuousEvent], [TOP_ANIMATION_END, 'animationEnd', ContinuousEvent], [TOP_ANIMATION_ITERATION, 'animationIteration', ContinuousEvent], [TOP_ANIMATION_START, 'animationStart', ContinuousEvent], [TOP_CAN_PLAY, 'canPlay', ContinuousEvent], [TOP_CAN_PLAY_THROUGH, 'canPlayThrough', ContinuousEvent], [TOP_DURATION_CHANGE, 'durationChange', ContinuousEvent], [TOP_EMPTIED, 'emptied', ContinuousEvent], [TOP_ENCRYPTED, 'encrypted', ContinuousEvent], [TOP_ENDED, 'ended', ContinuousEvent], [TOP_ERROR, 'error', ContinuousEvent], [TOP_GOT_POINTER_CAPTURE, 'gotPointerCapture', ContinuousEvent], [TOP_LOAD, 'load', ContinuousEvent], [TOP_LOADED_DATA, 'loadedData', ContinuousEvent], [TOP_LOADED_METADATA, 'loadedMetadata', ContinuousEvent], [TOP_LOAD_START, 'loadStart', ContinuousEvent], [TOP_LOST_POINTER_CAPTURE, 'lostPointerCapture', ContinuousEvent], [TOP_PLAYING, 'playing', ContinuousEvent], [TOP_PROGRESS, 'progress', ContinuousEvent], [TOP_SEEKING, 'seeking', ContinuousEvent], [TOP_STALLED, 'stalled', ContinuousEvent], [TOP_SUSPEND, 'suspend', ContinuousEvent], [TOP_TIME_UPDATE, 'timeUpdate', ContinuousEvent], [TOP_TRANSITION_END, 'transitionEnd', ContinuousEvent], [TOP_WAITING, 'waiting', ContinuousEvent]];

var eventTypes$4 = {};
var topLevelEventsToDispatchConfig = {};

for (var i = 0; i < eventTuples.length; i++) {
  var eventTuple = eventTuples[i];
  var topEvent = eventTuple[0];
  var event = eventTuple[1];
  var eventPriority = eventTuple[2];

  var capitalizedEvent = event[0].toUpperCase() + event.slice(1);
  var onEvent = 'on' + capitalizedEvent;

  var config = {
    phasedRegistrationNames: {
      bubbled: onEvent,
      captured: onEvent + 'Capture'
    },
    dependencies: [topEvent],
    eventPriority: eventPriority
  };
  eventTypes$4[event] = config;
  topLevelEventsToDispatchConfig[topEvent] = config;
}
```
此处对事件进行分类及格式化， 我们知道 react 中的更新都是有重要性的， 此处 eventPriority 应该也是用于区分 update 重要性的因素。

8. injectEventPluginOrder
```js
/**
 * DOMEventPluginOrder = ['ResponderEventPlugin', 'SimpleEventPlugin', 'EnterLeaveEventPlugin', 'ChangeEventPlugin', 'SelectEventPlugin', 'BeforeInputEventPlugin']
 * 
*/

/**
 * Methods for injecting dependencies.
 */
var injection = {
  /**
   * @param {array} InjectedEventPluginOrder
   * @public
   */
  injectEventPluginOrder: injectEventPluginOrder,

  /**
   * @param {object} injectedNamesToPlugins Map from names to plugin modules.
   */
  injectEventPluginsByName: injectEventPluginsByName
};
/**
 * Injects an ordering of plugins (by plugin name). This allows the ordering
 * to be decoupled from injection of the actual plugins so that ordering is
 * always deterministic regardless of packaging, on-the-fly injection, etc.
 *
 * @param {array} InjectedEventPluginOrder
 * @internal
 * @see {EventPluginHub.injection.injectEventPluginOrder}
 */
function injectEventPluginOrder(injectedEventPluginOrder) {
  (function () {
    if (!!eventPluginOrder) {
      {
        throw ReactError(Error('EventPluginRegistry: Cannot inject event plugin ordering more than once. You are likely trying to load more than one copy of React.'));
      }
    }
  })();
  // Clone the ordering so it cannot be dynamically mutated.
  eventPluginOrder = Array.prototype.slice.call(injectedEventPluginOrder);
  recomputePluginOrdering();
}
injection.injectEventPluginOrder(DOMEventPluginOrder);
```

8. recomputePluginOrdering
```js
/**
 * Recomputes the plugin list using the injected plugins and plugin ordering.
 *
 * @private
 */
function recomputePluginOrdering() {
  if (!eventPluginOrder) {
    // Wait until an `eventPluginOrder` is injected.
    return;
  }
  for (var pluginName in namesToPlugins) {
    var pluginModule = namesToPlugins[pluginName];
    var pluginIndex = eventPluginOrder.indexOf(pluginName);
    (function () {
      if (!(pluginIndex > -1)) {
        {
          throw ReactError(Error('EventPluginRegistry: Cannot inject event plugins that do not exist in the plugin ordering, `' + pluginName + '`.'));
        }
      }
    })();
    if (plugins[pluginIndex]) {
      continue;
    }
    (function () {
      if (!pluginModule.extractEvents) {
        {
          throw ReactError(Error('EventPluginRegistry: Event plugins must implement an `extractEvents` method, but `' + pluginName + '` does not.'));
        }
      }
    })();
    plugins[pluginIndex] = pluginModule;
    var publishedEvents = pluginModule.eventTypes;
    for (var eventName in publishedEvents) {
      (function () {
        if (!publishEventForPlugin(publishedEvents[eventName], pluginModule, eventName)) {
          {
            throw ReactError(Error('EventPluginRegistry: Failed to publish event `' + eventName + '` for plugin `' + pluginName + '`.'));
          }
        }
      })();
    }
  }
}
```
如上代码所示， recomputePluginOrdering 按照 DOMEventPluginOrder 中的 plugin 顺序重新给 plugins 中的 plugin 函数重新排序。

9. setComponentTree
```js
function getFiberCurrentPropsFromNode$1(node) {
  return node[internalEventHandlersKey] || null;
}

function getInstanceFromNode$1(node) {
  var inst = node[internalInstanceKey];
  if (inst) {
    if (inst.tag === HostComponent || inst.tag === HostText) {
      return inst;
    } else {
      return null;
    }
  }
  return null;
}

/**
 * Given a ReactDOMComponent or ReactDOMTextComponent, return the corresponding
 * DOM node.
 */
function getNodeFromInstance$1(inst) {
  if (inst.tag === HostComponent || inst.tag === HostText) {
    // In Fiber this, is just the state node right now. We assume it will be
    // a host component or host text.
    return inst.stateNode;
  }

  // Without this first invariant, passing a non-DOM-component triggers the next
  // invariant for a missing parent, which is super confusing.
  (function () {
    {
      {
        throw ReactError(Error('getNodeFromInstance: Invalid argument.'));
      }
    }
  })();
}

setComponentTree(getFiberCurrentPropsFromNode$1, getInstanceFromNode$1, getNodeFromInstance$1);

function setComponentTree(getFiberCurrentPropsFromNodeImpl, getInstanceFromNodeImpl, getNodeFromInstanceImpl) {
  getFiberCurrentPropsFromNode = getFiberCurrentPropsFromNodeImpl;
  getInstanceFromNode = getInstanceFromNodeImpl;
  getNodeFromInstance = getNodeFromInstanceImpl;
  {
    !(getNodeFromInstance && getInstanceFromNode) ? warningWithoutStack$1(false, 'EventPluginUtils.setComponentTree(...): Injected ' + 'module is missing getNodeFromInstance or getInstanceFromNode.') : void 0;
  }
}
```
如上面代码所示， setComponentTree 给 getFiberCurrentPropsFromNode getInstanceFromNode getNodeFromInstance 赋值。

10. injectEventPluginsByName
```js
/**
 * Injects plugins to be used by `EventPluginHub`. The plugin names must be
 * in the ordering injected by `injectEventPluginOrder`.
 *
 * Plugins can be injected as part of page initialization or on-the-fly.
 *
 * @param {object} injectedNamesToPlugins Map from names to plugin modules.
 * @internal
 * @see {EventPluginHub.injection.injectEventPluginsByName}
 */
function injectEventPluginsByName(injectedNamesToPlugins) {
  debugger;
  var isOrderingDirty = false;
  for (var pluginName in injectedNamesToPlugins) {
    if (!injectedNamesToPlugins.hasOwnProperty(pluginName)) {
      continue;
    }
    var pluginModule = injectedNamesToPlugins[pluginName];
    if (!namesToPlugins.hasOwnProperty(pluginName) || namesToPlugins[pluginName] !== pluginModule) {
      (function () {
        if (!!namesToPlugins[pluginName]) {
          {
            throw ReactError(Error('EventPluginRegistry: Cannot inject two different event plugins using the same name, `' + pluginName + '`.'));
          }
        }
      })();
      namesToPlugins[pluginName] = pluginModule;
      isOrderingDirty = true;
    }
  }
  if (isOrderingDirty) {
    recomputePluginOrdering();
  }
}

/**
 * Some important event plugins included by default (without having to require
 * them).
 */
injection.injectEventPluginsByName({
  SimpleEventPlugin: SimpleEventPlugin,
  EnterLeaveEventPlugin: EnterLeaveEventPlugin,
  ChangeEventPlugin: ChangeEventPlugin,
  SelectEventPlugin: SelectEventPlugin,
  BeforeInputEventPlugin: BeforeInputEventPlugin
});
```
如上代码所示， injectEventPluginsByName 方法会根据 plugin 的名称重新修改 namesToPlugins 中的 pluginName ， 如果造成顺序改变需要调用 recomputePluginOrdering 重新排序。

11. publishEventForPlugin
```js
/**
 * Publishes an event so that it can be dispatched by the supplied plugin.
 *
 * @param {object} dispatchConfig Dispatch configuration for the event.
 * @param {object} PluginModule Plugin publishing the event.
 * @return {boolean} True if the event was successfully published.
 * @private
 */
function publishEventForPlugin(dispatchConfig, pluginModule, eventName) {
  (function () {
    if (!!eventNameDispatchConfigs.hasOwnProperty(eventName)) {
      {
        throw ReactError(Error('EventPluginHub: More than one plugin attempted to publish the same event name, `' + eventName + '`.'));
      }
    }
  })();
  eventNameDispatchConfigs[eventName] = dispatchConfig;

  var phasedRegistrationNames = dispatchConfig.phasedRegistrationNames;
  if (phasedRegistrationNames) {
    for (var phaseName in phasedRegistrationNames) {
      if (phasedRegistrationNames.hasOwnProperty(phaseName)) {
        var phasedRegistrationName = phasedRegistrationNames[phaseName];
        publishRegistrationName(phasedRegistrationName, pluginModule, eventName);
      }
    }
    return true;
  } else if (dispatchConfig.registrationName) {
    publishRegistrationName(dispatchConfig.registrationName, pluginModule, eventName);
    return true;
  }
  return false;
}
```
如上代码所示， publishEventForPlugin 将 dispatchConfig 挂载到 eventNameDispatchConfigs 上， 并调用 publishRegistrationName 将 phasedRegistrationNames 中的事件名(bubbled,captured)注册到对应的事件上。 

12. publishRegistrationName
```js
/**
 * Publishes a registration name that is used to identify dispatched events.
 *
 * @param {string} registrationName Registration name to add.
 * @param {object} PluginModule Plugin publishing the event.
 * @private
 */
function publishRegistrationName(registrationName, pluginModule, eventName) {
  (function () {
    if (!!registrationNameModules[registrationName]) {
      {
        throw ReactError(Error('EventPluginHub: More than one plugin attempted to publish the same registration name, `' + registrationName + '`.'));
      }
    }
  })();
  registrationNameModules[registrationName] = pluginModule;
  registrationNameDependencies[registrationName] = pluginModule.eventTypes[eventName].dependencies;

  {
    var lowerCasedName = registrationName.toLowerCase();
    possibleRegistrationNames[lowerCasedName] = registrationName;

    if (registrationName === 'onDoubleClick') {
      possibleRegistrationNames.ondblclick = registrationName;
    }
  }
}
```
如上代码所示， publishRegistrationName 将 plugin 函数注册到对应的 registrationNameModules 上， 将 dependencies 注册到 registrationNameDependencies 上， 并注册对应的 possibleRegistrationNames 。 

13. prefixKey
```js
/**
 * @param {string} prefix vendor-specific prefix, eg: Webkit
 * @param {string} key style name, eg: transitionDuration
 * @return {string} style name prefixed with `prefix`, properly camelCased, eg:
 * WebkitTransitionDuration
 */
function prefixKey(prefix, key) {
  return prefix + key.charAt(0).toUpperCase() + key.substring(1);
}

/**
 * Support style names that may come passed in prefixed by adding permutations
 * of vendor prefixes.
 */
var prefixes = ['Webkit', 'ms', 'Moz', 'O'];

// Using Object.keys here, or else the vanilla for-in loop makes IE8 go into an
// infinite loop, because it iterates over the newly added props too.
Object.keys(isUnitlessNumber).forEach(function (prop) {
  prefixes.forEach(function (prefix) {
    isUnitlessNumber[prefixKey(prefix, prop)] = isUnitlessNumber[prop];
  });
});
```
如上代码所示， prefixKey 为 isUnitlessNumber 中的属性生成带有各个浏览器的前缀的属性， 并赋值。

14. createCursor
```js
function createCursor(defaultValue) {
  return {
    current: defaultValue
  };
}

var emptyContextObject = {};
{
  Object.freeze(emptyContextObject);
}
// A cursor to the current merged context object on the stack.
var contextStackCursor = createCursor(emptyContextObject);
// A cursor to a boolean indicating whether the context has changed.
var didPerformWorkStackCursor = createCursor(false);

var valueCursor = createCursor(null);
```
如上代码所示， createCursor 将传入的参数使用 current 包裹一层

15. Component
```js
var emptyObject = {};
{
  Object.freeze(emptyObject);
}

/**
 * Base class helpers for the updating state of a component.
 */
function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  // If a component has string refs, we will assign a different object later.
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue;
}

// React.Component uses a shared frozen object by default.
// We'll use it to determine whether we need to initialize legacy refs.
var emptyRefsObject = new React.Component().refs;
```
此处只是获取 Component 默认的 refs ， 因为改对象使用 Object.freeze 冻结了。

16. ChildReconciler
```js
function ChildReconciler(shouldTrackSideEffects) {
  //省略声明的函数
  function reconcileChildFibers(returnFiber, currentFirstChild, newChild, expirationTime) {
    // 省略内部实现
  }
  return reconcileChildFibers
}

var reconcileChildFibers = ChildReconciler(true);
var mountChildFibers = ChildReconciler(false);
```
由于代码较多此处，省略的大部分代码，  ChildReconciler 执行返回 reconcileChildFibers

17. setRestoreImplementation 
```js
function restoreControlledState$1(domElement, tag, props) {
  switch (tag) {
    case 'input':
      restoreControlledState(domElement, props);
      return;
    case 'textarea':
      restoreControlledState$3(domElement, props);
      return;
    case 'select':
      restoreControlledState$2(domElement, props);
      return;
  }
}

setRestoreImplementation(restoreControlledState$1);
```

18. restoreControlledState restoreControlledState$3 restoreControlledState$2
```js
function restoreControlledState(element, props) {
  var node = element;
  updateWrapper(node, props);
  updateNamedCousins(node, props);
}


function restoreControlledState$2(element, props) {
  var node = element;
  var value = props.value;

  if (value != null) {
    updateOptions(node, !!props.multiple, value, false);
  }
}

function restoreControlledState$3(element, props) {
  // DOM component is still mounted; update
  updateWrapper$1(element, props);
}
```

19. updateWrapper updateNamedCousins updateOptions updateWrapper$1

20. setBatchingImplementation
```js
function setBatchingImplementation(_batchedUpdatesImpl, _discreteUpdatesImpl, _flushDiscreteUpdatesImpl, _batchedEventUpdatesImpl) {
  batchedUpdatesImpl = _batchedUpdatesImpl;
  discreteUpdatesImpl = _discreteUpdatesImpl;
  flushDiscreteUpdatesImpl = _flushDiscreteUpdatesImpl;
  batchedEventUpdatesImpl = _batchedEventUpdatesImpl;
}

setBatchingImplementation(batchedUpdates$1, discreteUpdates$1, flushDiscreteUpdates, batchedEventUpdates$1);
```

<!-- render -->
21. createElement
```js
ReactDOM.render(<App/>,document.getElementById('root'));
```
此处需要注意， 在遇到 <App/> 的时候会调用 createElementWithValidation 方法创建组件， 创建之后才是 render 的过程
```js
function createElementWithValidation(type, props, children) {
  var validType = isValidElementType(type);

  // We warn in this case but don't throw. We expect the element creation to
  // succeed and there will likely be errors in render.
  if (!validType) {
    var info = '';
    if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
      info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
    }

    var sourceInfo = getSourceInfoErrorAddendumForProps(props);
    if (sourceInfo) {
      info += sourceInfo;
    } else {
      info += getDeclarationErrorAddendum();
    }

    var typeString = void 0;
    if (type === null) {
      typeString = 'null';
    } else if (Array.isArray(type)) {
      typeString = 'array';
    } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
      typeString = '<' + (getComponentName(type.type) || 'Unknown') + ' />';
      info = ' Did you accidentally export a JSX literal instead of a component?';
    } else {
      typeString = typeof type;
    }

    warning$1(false, 'React.createElement: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', typeString, info);
  }

  var element = createElement.apply(this, arguments);

  if (element == null) {
    return element;
  }

  if (validType) {
    for (var i = 2; i < arguments.length; i++) {
      validateChildKeys(arguments[i], type);
    }
  }

  if (type === REACT_FRAGMENT_TYPE) {
    validateFragmentProps(element);
  } else {
    validatePropTypes(element);
  }

  return element;
}
```
createElementWithValidation => isValidElementType => if(valid)  createElement => if(hasChildren) validateChildKeys => validateFragmentProps or validatePropTypes


render : isValidContainer

- legacyCreateRootFromDOMContainer
```js
function legacyCreateRootFromDOMContainer(container, forceHydrate) {
  var shouldHydrate = forceHydrate || shouldHydrateDueToLegacyHeuristic(container);
  // First clear any existing content.
  if (!shouldHydrate) {
    var warned = false;
    var rootSibling = void 0;
    while (rootSibling = container.lastChild) {
      {
        if (!warned && rootSibling.nodeType === ELEMENT_NODE && rootSibling.hasAttribute(ROOT_ATTRIBUTE_NAME)) {
          warned = true;
          warningWithoutStack$1(false, 'render(): Target node has markup rendered by React, but there ' + 'are unrelated nodes as well. This is most commonly caused by ' + 'white-space inserted around server-rendered markup.');
        }
      }
      container.removeChild(rootSibling);
    }
  }
  {
    if (shouldHydrate && !forceHydrate && !warnedAboutHydrateAPI) {
      warnedAboutHydrateAPI = true;
      lowPriorityWarning$1(false, 'render(): Calling ReactDOM.render() to hydrate server-rendered markup ' + 'will stop working in React v17. Replace the ReactDOM.render() call ' + 'with ReactDOM.hydrate() if you want React to attach to the server HTML.');
    }
  }

  // Legacy roots are not batched.
  return new ReactSyncRoot(container, LegacyRoot, shouldHydrate);
}
```
如上代码所示， legacyCreateRootFromDOMContainer 中通过 shouldHydrate 判断是否要清空 根节点中的子节点， 最终通过 ReactSyncRoot 构建 Fiber 节点


- unbatchedUpdates
```js
// NoContext = /*                    */0;
// BatchedContext = /*               */1;
// EventContext = /*                 */2;
// DiscreteEventContext = /*         */4;
// LegacyUnbatchedContext = /*       */8;
// RenderContext = /*                */16;
// CommitContext = /*                */32;

function unbatchedUpdates(fn, a) {
  debugger;
  var prevExecutionContext = executionContext;
  executionContext &= ~BatchedContext;
  executionContext |= LegacyUnbatchedContext;
  try {
    return fn(a);
  } finally {
    executionContext = prevExecutionContext;
    if (executionContext === NoContext) {
      // Flush the immediate callbacks that were scheduled during this batch
      flushSyncCallbackQueue();
    }
  }
}
```
此处需要了解下二进制位运算， `executionContext &= ~BatchedContext` ， BatchedContext 二进制为 0001 ， 进行非运算 1110 ， 再进行与运算， 关闭 executionContext 的第 0 位运算。
`executionContext |= LegacyUnbatchedContext` ，  LegacyUnbatchedContext 二进制位为 1000 , executionContext 与其进行或运算， 开启 executionContext 的第 3 位运算。


- createFiberRoot
```js
function createFiberRoot(containerInfo, tag, hydrate) {
  var root = new FiberRootNode(containerInfo, tag, hydrate);

  // Cyclic construction. This cheats the type system right now because
  // stateNode is any.
  var uninitializedFiber = createHostRootFiber(tag);
  root.current = uninitializedFiber;
  uninitializedFiber.stateNode = root;

  return root;
}
```
如上代码所示， createFiberRoot 中初始化了 Fiber根节点， root 和 uninitializedFiber 通过 current 和 stateNode 进行了循环引用


- prepareFreshStack
> prepareFreshStack 做了一些清空操作， 此处使用 createWorkInProgress 创建了 workInProgress 树，并给 workInProgress 相关的一些全局变量都赋值。
```js
function prepareFreshStack(root, expirationTime) {
  root.finishedWork = null;
  root.finishedExpirationTime = NoWork;

  var timeoutHandle = root.timeoutHandle;
  if (timeoutHandle !== noTimeout) {
    // The root previous suspended and scheduled a timeout to commit a fallback
    // state. Now that we have additional work, cancel the timeout.
    root.timeoutHandle = noTimeout;
    // $FlowFixMe Complains noTimeout is not a TimeoutID, despite the check above
    cancelTimeout(timeoutHandle);
  }

  if (workInProgress !== null) {
    var interruptedWork = workInProgress.return;
    while (interruptedWork !== null) {
      unwindInterruptedWork(interruptedWork);
      interruptedWork = interruptedWork.return;
    }
  }
  workInProgressRoot = root;
  workInProgress = createWorkInProgress(root.current, null, expirationTime);
  renderExpirationTime = expirationTime;
  workInProgressRootExitStatus = RootIncomplete;
  workInProgressRootLatestProcessedExpirationTime = Sync;
  workInProgressRootLatestSuspenseTimeout = Sync;
  workInProgressRootCanSuspendUsingConfig = null;
  workInProgressRootHasPendingPing = false;

  if (enableSchedulerTracing) {
    spawnedWorkDuringRender = null;
  }

  {
    ReactStrictModeWarnings.discardPendingWarnings();
    componentsThatTriggeredHighPriSuspend = null;
  }
}
```

- startWorkOnPendingInteractions
> initial mount 时 root.pendingInteractionMap.size()=0, 该函数执行过程可以忽略。
```js
function startWorkOnPendingInteractions(root, expirationTime) {
  // This is called when new work is started on a root.
  if (!enableSchedulerTracing) {
    return;
  }

  // Determine which interactions this batch of work currently includes, So that
  // we can accurately attribute time spent working on it, And so that cascading
  // work triggered during the render phase will be associated with it.
  var interactions = new Set();
  root.pendingInteractionMap.forEach(function (scheduledInteractions, scheduledExpirationTime) {
    if (scheduledExpirationTime >= expirationTime) {
      scheduledInteractions.forEach(function (interaction) {
        return interactions.add(interaction);
      });
    }
  });

  // Store the current set of interactions on the FiberRoot for a few reasons:
  // We can re-use it in hot functions like renderRoot() without having to
  // recalculate it. We will also use it in commitWork() to pass to any Profiler
  // onRender() hooks. This also provides DevTools with a way to access it when
  // the onCommitRoot() hook is called.
  root.memoizedInteractions = interactions;

  if (interactions.size > 0) {
    var subscriber = tracing.__subscriberRef.current;
    if (subscriber !== null) {
      var threadID = computeThreadID(root, expirationTime);
      try {
        subscriber.onWorkStarted(interactions, threadID);
      } catch (error) {
        // If the subscriber throws, rethrow it in a separate task
        scheduleCallback(ImmediatePriority, function () {
          throw error;
        });
      }
    }
  }
}
```

- startWorkLoopTimer
```js
function startWorkLoopTimer(nextUnitOfWork) {
  if (enableUserTimingAPI) {
    currentFiber = nextUnitOfWork;
    if (!supportsUserTiming) {
      return;
    }
    commitCountInCurrentWorkLoop = 0;
    
    // 在 perform 中标记 (React Tree Reconciliation)
    beginMark('(React Tree Reconciliation)');
    // initial mount 阶段该函数执行过程可以忽略
    resumeTimers();
  }
}
```

- resumeTimers & resumeTimersRecursively
> initial mount 阶段 `fiber._debugIsCurrentlyTiming=false`, `currentFiber = workInProgress` , 可以忽略执行过程。
```js
var resumeTimersRecursively = function (fiber) {
  if (fiber.return !== null) {
    resumeTimersRecursively(fiber.return);
  }
  if (fiber._debugIsCurrentlyTiming) {
    beginFiberMark(fiber, null);
  }
};

var resumeTimers = function () {
  if (currentFiber !== null) {
    resumeTimersRecursively(currentFiber);
  }
};
```

- workLoopSync
```js
function workLoopSync() {
  // 
  while (workInProgress !== null) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}
```
- startWorkTimer
```js
function startWorkTimer(fiber) {
  if (enableUserTimingAPI) {
    if (!supportsUserTiming || shouldIgnoreFiber(fiber)) {
      return;
    }
    // If we pause, this is the fiber to unwind from.
    currentFiber = fiber;
    if (!beginFiberMark(fiber, null)) {
      return;
    }
    fiber._debugIsCurrentlyTiming = true;
  }
}
```
- setCurrentFiber
```js
function setCurrentFiber(fiber) {
  {
    ReactDebugCurrentFrame.getCurrentStack = getCurrentFiberStackInDev;
    current = fiber;
    phase = null;
  }
}
```

- getStateFromUpdate
> 从 update 对象等参数中， 获取数据并返回计算之后的 state 
```js
function getStateFromUpdate(workInProgress, queue, update, prevState, nextProps, instance) {
  switch (update.tag) {
    case ReplaceState:
      {
        var _payload = update.payload;
        if (typeof _payload === 'function') {
          // Updater function
          {
            enterDisallowedContextReadInDEV();
            if (debugRenderPhaseSideEffects || debugRenderPhaseSideEffectsForStrictMode && workInProgress.mode & StrictMode) {
              _payload.call(instance, prevState, nextProps);
            }
          }
          var nextState = _payload.call(instance, prevState, nextProps);
          {
            exitDisallowedContextReadInDEV();
          }
          return nextState;
        }
        // State object
        return _payload;
      }
    case CaptureUpdate:
      {
        workInProgress.effectTag = workInProgress.effectTag & ~ShouldCapture | DidCapture;
      }
    // Intentional fallthrough
    case UpdateState:
      {
        var _payload2 = update.payload;
        var partialState = void 0;
        if (typeof _payload2 === 'function') {
          // Updater function
          {
            enterDisallowedContextReadInDEV();
            if (debugRenderPhaseSideEffects || debugRenderPhaseSideEffectsForStrictMode && workInProgress.mode & StrictMode) {
              _payload2.call(instance, prevState, nextProps);
            }
          }
          partialState = _payload2.call(instance, prevState, nextProps);
          {
            exitDisallowedContextReadInDEV();
          }
        } else {
          // Partial state object
          partialState = _payload2;
        }
        if (partialState === null || partialState === undefined) {
          // Null and undefined are treated as no-ops.
          return prevState;
        }
        // Merge the partial state and the previous state.
        return _assign({}, prevState, partialState);
      }
    case ForceUpdate:
      {
        hasForceUpdate = true;
        return prevState;
      }
  }
  return prevState;
}
```

- pushTopLevelContextObject
> push 将全局的 index ++
再往 valueStack 中压入 cursor.current ,  FiberStack 压入 fiber 。最后给 cursor.current 赋值为 value。

- markRenderEventTimeAndConfig
> 更新 workInProgress 相关全部变量， 在 initMount 阶段可以忽略改过程。
```js
function markRenderEventTimeAndConfig(expirationTime, suspenseConfig) {
  if (expirationTime < workInProgressRootLatestProcessedExpirationTime && expirationTime > Never) {
    workInProgressRootLatestProcessedExpirationTime = expirationTime;
  }
  if (suspenseConfig !== null) {
    if (expirationTime < workInProgressRootLatestSuspenseTimeout && expirationTime > Never) {
      workInProgressRootLatestSuspenseTimeout = expirationTime;
      // Most of the time we only have one config and getting wrong is not bad.
      workInProgressRootCanSuspendUsingConfig = suspenseConfig;
    }
  }
}
```

- beginWork$$1
replayFailedUnitOfWorkWithInvokeGuardedCallback = true 
<!-- TODO: -->
```js
beginWork$$1 = function (current$$1, unitOfWork, expirationTime) {
    var originalWorkInProgressCopy = assignFiberPropertiesInDEV(dummyFiber, unitOfWork);
    try {
      return beginWork$1(current$$1, unitOfWork, expirationTime);
    } catch (originalError) {
      if (originalError !== null && typeof originalError === 'object' && typeof originalError.then === 'function') {
        throw originalError;
      }
      resetContextDependencies();
      resetHooks();

      unwindInterruptedWork(unitOfWork);

      assignFiberPropertiesInDEV(unitOfWork, originalWorkInProgressCopy);

      if (enableProfilerTimer && unitOfWork.mode & ProfileMode) {
        startProfilerTimer(unitOfWork);
      }

      // Run beginWork again.
      invokeGuardedCallback(null, beginWork$1, null, current$$1, unitOfWork, expirationTime);

      if (hasCaughtError()) {
        var replayError = clearCaughtError();
        // `invokeGuardedCallback` sometimes sets an expando `_suppressLogging`.
        // Rethrow this error instead of the original one.
        throw replayError;
      } else {
        // This branch is reachable if the render phase is impure.
        throw originalError;
      }
    }
  };
  ```
- performUnitOfWork
```js
function performUnitOfWork(unitOfWork) {
  // unitOfWork.alternate 指向 Fiber tree 中的对应节点
  var current$$1 = unitOfWork.alternate;

  // 设置 currentFiber = fiber;fiber._debugIsCurrentlyTiming = true;
  startWorkTimer(unitOfWork);
  // 设置 current = filber ， phase = null
  setCurrentFiber(unitOfWork);


  //此处 profiler 相关的代码可以忽略， 只需关注 beginWork$$1
  var next = void 0;
  if (enableProfilerTimer && (unitOfWork.mode & ProfileMode) !== NoMode) {
    startProfilerTimer(unitOfWork);
    next = beginWork$$1(current$$1, unitOfWork, renderExpirationTime);
    stopProfilerTimerIfRunningAndRecordDelta(unitOfWork, true);
  } else {
    next = beginWork$$1(current$$1, unitOfWork, renderExpirationTime);
  }

  resetCurrentFiber();
  unitOfWork.memoizedProps = unitOfWork.pendingProps;
  if (next === null) {
    // If this doesn't spawn new work, complete the current work.
    next = completeUnitOfWork(unitOfWork);
  }

  ReactCurrentOwner$2.current = null;
  return next;
}
```

- renderRoot
renderRoot 中代码比较长，此处先解析下initial mount 时的流程。 
首先前面的 if 语句一直到 flushPassiveEffects() 都不会执行， flushPassiveEffects 执行也是什么都没做直接返回了 false。 下面会进入到 if 语句中的第一判断， 此时 `workInProgressRoot=null` , `expirationTime=MAX_SIGNED_31_BIT_INT`, `renderExpirationTime=0`。 而后进入了 prepareFreshStack 创建了 workInProgress 树以及给相关变量赋值。 startWorkOnPendingInteractions 此处执行过程可以忽略。

```js
function renderRoot(root, expirationTime, isSync) {
  (function () {
    if (!((executionContext & (RenderContext | CommitContext)) === NoContext)) {
      {
        throw ReactError(Error('Should not already be working.'));
      }
    }
  })();

  if (enableUserTimingAPI && expirationTime !== Sync) {
    var didExpire = isSync;
    stopRequestCallbackTimer(didExpire);
  }

  if (root.firstPendingTime < expirationTime) {
    return null;
  }

  if (isSync && root.finishedExpirationTime === expirationTime) {
    return commitRoot.bind(null, root);
  }

  flushPassiveEffects();
  if (root !== workInProgressRoot || expirationTime !== renderExpirationTime) {
    prepareFreshStack(root, expirationTime);
    startWorkOnPendingInteractions(root, expirationTime);
  } else if (workInProgressRootExitStatus === RootSuspendedWithDelay) {
    if (workInProgressRootHasPendingPing) {
      prepareFreshStack(root, expirationTime);
    } else {
      var lastPendingTime = root.lastPendingTime;
      if (lastPendingTime < expirationTime) {
        return renderRoot.bind(null, root, lastPendingTime);
      }
    }
  }
  //此处 workInProgress 在 prepareFreshStack 中已经创建， 进入该代码块。
  if (workInProgress !== null) {
    var prevExecutionContext = executionContext;
    executionContext |= RenderContext;
    var prevDispatcher = ReactCurrentDispatcher.current;
    if (prevDispatcher === null) {
      prevDispatcher = ContextOnlyDispatcher;
    }
    ReactCurrentDispatcher.current = ContextOnlyDispatcher;
    var prevInteractions = null;
    if (enableSchedulerTracing) {
      prevInteractions = tracing.__interactionsRef.current;
      tracing.__interactionsRef.current = root.memoizedInteractions;
    }
    //上面一段在 initial mount 时有意义的只有 ReactCurrentDispatcher.current = ContextOnlyDispatcher。

    startWorkLoopTimer(workInProgress);

    // initial mount 阶段 isSync = true， expirationTime = Sync ， 直接进入 do while 代码块
    if (isSync) {
      if (expirationTime !== Sync) {
        var currentTime = requestCurrentTime();
        if (currentTime < expirationTime) {
          // Restart at the current time.
          executionContext = prevExecutionContext;
          resetContextDependencies();
          ReactCurrentDispatcher.current = prevDispatcher;
          if (enableSchedulerTracing) {
            tracing.__interactionsRef.current = prevInteractions;
          }
          return renderRoot.bind(null, root, currentTime);
        }
      }
    } else {
      // Since we know we're in a React event, we can clear the current
      // event time. The next update will compute a new event time.
      currentEventTime = NoWork;
    }

    //此处执行 workLoopSync
    do {
      try {
        if (isSync) {
          workLoopSync();
        } else {
          workLoop();
        }
        break;
      } catch (thrownValue) {
        // Reset module-level state that was set during the render phase.
        resetContextDependencies();
        resetHooks();

        var sourceFiber = workInProgress;
        if (sourceFiber === null || sourceFiber.return === null) {
          prepareFreshStack(root, expirationTime);
          executionContext = prevExecutionContext;
          throw thrownValue;
        }

        if (enableProfilerTimer && sourceFiber.mode & ProfileMode) {
          stopProfilerTimerIfRunningAndRecordDelta(sourceFiber, true);
        }

        var returnFiber = sourceFiber.return;
        throwException(root, returnFiber, sourceFiber, thrownValue, renderExpirationTime);
        workInProgress = completeUnitOfWork(sourceFiber);
      }
    } while (true);

    executionContext = prevExecutionContext;
    resetContextDependencies();
    ReactCurrentDispatcher.current = prevDispatcher;
    if (enableSchedulerTracing) {
      tracing.__interactionsRef.current = prevInteractions;
    }

    if (workInProgress !== null) {
      // There's still work left over. Return a continuation.
      stopInterruptedWorkLoopTimer();
      if (expirationTime !== Sync) {
        startRequestCallbackTimer();
      }
      return renderRoot.bind(null, root, expirationTime);
    }
  }

  stopFinishedWorkLoopTimer();

  root.finishedWork = root.current.alternate;
  root.finishedExpirationTime = expirationTime;

  var isLocked = resolveLocksOnRoot(root, expirationTime);
  if (isLocked) {
    return null;
  }

  workInProgressRoot = null;

  switch (workInProgressRootExitStatus) {
    case RootIncomplete:
      {
        (function () {
          {
            {
              throw ReactError(Error('Should have a work-in-progress.'));
            }
          }
        })();
      }
    case RootErrored:
      {
        var _lastPendingTime = root.lastPendingTime;
        if (_lastPendingTime < expirationTime) {
          return renderRoot.bind(null, root, _lastPendingTime);
        }
        if (!isSync) {
          prepareFreshStack(root, expirationTime);
          scheduleSyncCallback(renderRoot.bind(null, root, expirationTime));
          return null;
        }
        // If we're already rendering synchronously, commit the root in its
        // errored state.
        return commitRoot.bind(null, root);
      }
    case RootSuspended:
      {
        flushSuspensePriorityWarningInDEV();
        var hasNotProcessedNewUpdates = workInProgressRootLatestProcessedExpirationTime === Sync;
        if (hasNotProcessedNewUpdates && !isSync &&
        // do not delay if we're inside an act() scope
        !(true && flushSuspenseFallbacksInTests && IsThisRendererActing.current)) {
          var msUntilTimeout = globalMostRecentFallbackTime + FALLBACK_THROTTLE_MS - now();
          if (msUntilTimeout > 10) {
            if (workInProgressRootHasPendingPing) {
              prepareFreshStack(root, expirationTime);
              return renderRoot.bind(null, root, expirationTime);
            }
            var _lastPendingTime2 = root.lastPendingTime;
            if (_lastPendingTime2 < expirationTime) {
              return renderRoot.bind(null, root, _lastPendingTime2);
            }
            root.timeoutHandle = scheduleTimeout(commitRoot.bind(null, root), msUntilTimeout);
            return null;
          }
        }
        // The work expired. Commit immediately.
        return commitRoot.bind(null, root);
      }
    case RootSuspendedWithDelay:
      {
        flushSuspensePriorityWarningInDEV();

        if (!isSync &&
        // do not delay if we're inside an act() scope
        !(true && flushSuspenseFallbacksInTests && IsThisRendererActing.current)) {
          if (workInProgressRootHasPendingPing) {
            prepareFreshStack(root, expirationTime);
            return renderRoot.bind(null, root, expirationTime);
          }
          var _lastPendingTime3 = root.lastPendingTime;
          if (_lastPendingTime3 < expirationTime) {
            return renderRoot.bind(null, root, _lastPendingTime3);
          }

          var _msUntilTimeout = void 0;
          if (workInProgressRootLatestSuspenseTimeout !== Sync) {
            _msUntilTimeout = expirationTimeToMs(workInProgressRootLatestSuspenseTimeout) - now();
          } else if (workInProgressRootLatestProcessedExpirationTime === Sync) {
            _msUntilTimeout = 0;
          } else {
            // If we don't have a suspense config, we're going to use a heuristic to
            var eventTimeMs = inferTimeFromExpirationTime(workInProgressRootLatestProcessedExpirationTime);
            var currentTimeMs = now();
            var timeUntilExpirationMs = expirationTimeToMs(expirationTime) - currentTimeMs;
            var timeElapsed = currentTimeMs - eventTimeMs;
            if (timeElapsed < 0) {
              // We get this wrong some time since we estimate the time.
              timeElapsed = 0;
            }
            _msUntilTimeout = jnd(timeElapsed) - timeElapsed;
            if (timeUntilExpirationMs < _msUntilTimeout) {
              _msUntilTimeout = timeUntilExpirationMs;
            }
          }
          if (_msUntilTimeout > 10) {
            root.timeoutHandle = scheduleTimeout(commitRoot.bind(null, root), _msUntilTimeout);
            return null;
          }
        }
        return commitRoot.bind(null, root);
      }
    case RootCompleted:
      {
        if (!isSync &&
        // do not delay if we're inside an act() scope
        !(true && flushSuspenseFallbacksInTests && IsThisRendererActing.current) && workInProgressRootLatestProcessedExpirationTime !== Sync && workInProgressRootCanSuspendUsingConfig !== null) {
          // If we have exceeded the minimum loading delay, which probably
          // means we have shown a spinner already, we might have to suspend
          // a bit longer to ensure that the spinner is shown for enough time.
          var _msUntilTimeout2 = computeMsUntilSuspenseLoadingDelay(workInProgressRootLatestProcessedExpirationTime, expirationTime, workInProgressRootCanSuspendUsingConfig);
          if (_msUntilTimeout2 > 10) {
            root.timeoutHandle = scheduleTimeout(commitRoot.bind(null, root), _msUntilTimeout2);
            return null;
          }
        }
        return commitRoot.bind(null, root);
      }
    default:
      {
        (function () {
          {
            {
              throw ReactError(Error('Unknown root exit status.'));
            }
          }
        })();
      }
  }
}
```