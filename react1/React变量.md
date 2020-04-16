# React 变量分析

## MODE
```js
var NoMode = 0;
var StrictMode = 1;
var BatchedMode = 2;
var ConcurrentMode = 4;
var ProfileMode = 8;
```

```js
//使用 31 位二进制是为了兼容 32位的操作系统
var MAX_SIGNED_31_BIT_INT = 1073741823;

var NoWork = 0;
var Never = 1;
var Sync = MAX_SIGNED_31_BIT_INT;
var Batched = Sync - 1;

var UNIT_SIZE = 10;
var MAGIC_NUMBER_OFFSET = Batched - 1;
```
## fiber 相关
```js
// Used by Fiber to simulate a try-catch.
var hasError = false;
var caughtError = null;

var root = null;
var startText = null;
var fallbackText = null;

var EVENT_POOL_SIZE = 10;

var current = null;
var phase = null;

// Don't change these two values. They're used by React Dev Tools.
var NoEffect = /*              */0;
var PerformedWork = /*         */1;

// You can change the rest (and add more).
var Placement = /*             */2;
var Update = /*                */4;
var PlacementAndUpdate = /*    */6;
var Deletion = /*              */8;
var ContentReset = /*          */16;
var Callback = /*              */32;
var DidCapture = /*            */64;
var Ref = /*                   */128;
var Snapshot = /*              */256;
var Passive = /*               */512;

// Passive & Update & Callback & Ref & Snapshot
var LifecycleEffectMask = /*   */932;

// Union of all host effects
var HostEffectMask = /*        */1023;

var Incomplete = /*            */1024;
var ShouldCapture = /*         */2048;

var ReactCurrentOwner$1 = ReactSharedInternals.ReactCurrentOwner;

var MOUNTING = 1;
var MOUNTED = 2;
var UNMOUNTED = 3;

var currentFiber = null;
var currentPhase = null;
var currentPhaseFiber = null;
var isCommitting = false;
var hasScheduledUpdateInCurrentCommit = false;
var hasScheduledUpdateInCurrentPhase = false;
var commitCountInCurrentWorkLoop = 0;
var effectCountInCurrentCommit = 0;
var isWaitingForCallback = false;
var labelsInCurrentCommit = new Set();

var valueStack = [];
fiberStack = [];
var index = -1;

warnedAboutMissingGetChildContext = {};
var emptyContextObject = {};
{
  Object.freeze(emptyContextObject);
}

var contextStackCursor = createCursor(emptyContextObject);
var didPerformWorkStackCursor = createCursor(false);
var previousContext = emptyContextObject;

var LegacyRoot = 0;
var BatchedRoot = 1;
var ConcurrentRoot = 2;

var fakeCallbackNode = {};

var ImmediatePriority = 99;
var UserBlockingPriority$2 = 98;
var NormalPriority = 97;
var LowPriority = 96;
var IdlePriority = 95;
var NoPriority = 90;

var shouldYield = Scheduler_shouldYield;
var requestPaint =
Scheduler_requestPaint !== undefined ? Scheduler_requestPaint : function () {};

var syncQueue = null;
var immediateQueueCallbackNode = null;
var isFlushingSyncQueue = false;
var initialTimeMs = Scheduler_now();

var LOW_PRIORITY_EXPIRATION = 5000;
var LOW_PRIORITY_BATCH_SIZE = 250;
var HIGH_PRIORITY_EXPIRATION = 500;
var HIGH_PRIORITY_BATCH_SIZE = 100;

var pendingComponentWillMountWarnings = [];
var pendingUNSAFE_ComponentWillMountWarnings = [];
var pendingComponentWillReceivePropsWarnings = [];
var pendingUNSAFE_ComponentWillReceivePropsWarnings = [];
var pendingComponentWillUpdateWarnings = [];
var pendingUNSAFE_ComponentWillUpdateWarnings = [];

var didWarnAboutUnsafeLifecycles = new Set();
var pendingLegacyContextWarning = new Map();
var didWarnAboutLegacyContext = new Set();

var valueCursor = createCursor(null);
var rendererSigil = {};
var currentlyRenderingFiber = null;
var lastContextDependency = null;
var lastContextWithAllBitsObserved = null;

var isDisallowedContextReadInDEV = false;
```

## Queue
```js
var UpdateState = 0;
var ReplaceState = 1;
var ForceUpdate = 2;
var CaptureUpdate = 3;

var hasForceUpdate = false;

didWarnUpdateInsideUpdate = false;
currentlyProcessingQueue = null;

var fakeInternalInstance = {};
didWarnAboutStateAssignmentForComponent = new Set();
didWarnAboutUninitializedState = new Set();
didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate = new Set();
didWarnAboutLegacyLifecyclesAndDerivedState = new Set();
didWarnAboutDirectlyAssigningPropsToState = new Set();
didWarnAboutUndefinedDerivedState = new Set();
didWarnAboutContextTypeAndContextTypes = new Set();
didWarnAboutInvalidateContextType = new Set();

var didWarnOnInvalidCallback = new Set();
```

## Event相关
```js
var plugins = [];
var eventNameDispatchConfigs = {};
var registrationNameModules = {};
var registrationNameDependencies = {};
var possibleRegistrationNames = {};

// Used by event system to capture/rethrow the first error.
var hasRethrowError = false;
var rethrowError = null;

var eventQueue = null;

var END_KEYCODES = [9, 13, 27, 32]; // Tab, Return, Esc, Space
var START_KEYCODE = 229;
var SPACEBAR_CODE = 32;
var SPACEBAR_CHAR = String.fromCharCode(SPACEBAR_CODE);

//用来区分 IE 版本
var documentMode = null;

var hasSpaceKeypress = false;

// Track the current IME composition status, if any.
var isComposing = false;

// Use to restore controlled state after a change event has fired.
var restoreImpl = null;
var restoreTarget = null;
var restoreQueue = null;

var eventTypes$1 = {
  change: {
    phasedRegistrationNames: {
      bubbled: 'onChange',
      captured: 'onChangeCapture'
    },
    dependencies: [TOP_BLUR, TOP_CHANGE, TOP_CLICK, TOP_FOCUS, TOP_INPUT, TOP_KEY_DOWN, TOP_KEY_UP, TOP_SELECTION_CHANGE]
  }
};

var activeElement = null;
var activeElementInst = null;

var previousScreenX = 0;
var previousScreenY = 0;
// Use flags to signal movementX/Y has already been set
var isMovementXSet = false;
var isMovementYSet = false;

var PLUGIN_EVENT_SYSTEM = 1;
var RESPONDER_EVENT_SYSTEM = 1 << 1;
var IS_PASSIVE = 1 << 2;
var IS_ACTIVE = 1 << 3;
var PASSIVE_NOT_SUPPORTED = 1 << 4;

var DiscreteEvent = 0;
var UserBlockingEvent = 1;
var ContinuousEvent = 2;

var activeTimeouts = new Map();
var rootEventTypesToEventResponderInstances = new Map();
var ownershipChangeListeners = new Set();

var globalOwner = null;

var currentTimeStamp = 0;
var currentTimers = new Map();
var currentInstance = null;
var currentEventQueue = null;
var currentEventQueuePriority = ContinuousEvent;
var currentTimerIDCounter = 0;
var currentDocument = null;

var eventTypes$4 = {};
var topLevelEventsToDispatchConfig = {};
var passiveBrowserEventsSupported = false;

var CALLBACK_BOOKKEEPING_POOL_SIZE = 10;
var callbackBookkeepingPool = [];
```

## dom properties
```js
//存储加了前缀的事件名称， 在合成事件中会被初始化
var prefixedEventNames = {};
//与 prefixedEventNames 类似， 对应样式名
var style = {};

var properties = {};
var CAMELIZE = /[\-\:]([a-z])/g;

var ELEMENT_NODE = 1;
var TEXT_NODE = 3;
var COMMENT_NODE = 8;
var DOCUMENT_NODE = 9;
var DOCUMENT_FRAGMENT_NODE = 11;

//react属性如 clasname 不应该被写入元素属性
var RESERVED = 0;
//值为字符串属性
var STRING = 1;
//值为字符串 true|false 的属性
var BOOLEANISH_STRING = 2;
//值为 boolean true|false 的属性
var BOOLEAN = 3;
//值可以为 boolean 或者其他值的属性
var OVERLOADED_BOOLEAN = 4;
//值为数字的属性
var NUMERIC = 5;
//值必须为正数的属性
var POSITIVE_NUMERIC = 6;

var ATTRIBUTE_NAME_START_CHAR = ':A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD';
var ATTRIBUTE_NAME_CHAR = ATTRIBUTE_NAME_START_CHAR + '\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040';

//TODO: no find in root; react 挂载的根元素会有该属性，标识
var ROOT_ATTRIBUTE_NAME = 'data-reactroot';
var VALID_ATTRIBUTE_NAME_REGEX = new RegExp('^[' + ATTRIBUTE_NAME_START_CHAR + '][' + ATTRIBUTE_NAME_CHAR + ']*$');

var hasOwnProperty = Object.prototype.hasOwnProperty;
var illegalAttributeNameCache = {};
var validatedAttributeNameCache = {};

var prefixes = ['Webkit', 'ms', 'Moz', 'O'];

var uppercasePattern = /([A-Z])/g;
var msPattern = /^ms-/;

var warnedProperties = {};
var rARIA = new RegExp('^(aria)-[' + ATTRIBUTE_NAME_CHAR + ']*$');
var rARIACamel = new RegExp('^(aria)[A-Z][' + ATTRIBUTE_NAME_CHAR + ']*$');

var didWarnValueNull = false;

var didWarnInvalidHydration = false;
var didWarnShadyDOM = false;

var DANGEROUSLY_SET_INNER_HTML = 'dangerouslySetInnerHTML';
var SUPPRESS_CONTENT_EDITABLE_WARNING = 'suppressContentEditableWarning';
var SUPPRESS_HYDRATION_WARNING$1 = 'suppressHydrationWarning';
var AUTOFOCUS = 'autoFocus';
var CHILDREN = 'children';
var STYLE$1 = 'style';
var HTML = '__html';
var LISTENERS = 'listeners';

var HTML_NAMESPACE = Namespaces.html;


var warnedUnknownTags = void 0;
var suppressHydrationWarning = void 0;

var validatePropertiesInDevelopment = void 0;
var warnForTextDifference = void 0;
var warnForPropDifference = void 0;
var warnForExtraAttributes = void 0;
var warnForInvalidEventListener = void 0;
var canDiffStyleForHydrationWarning = void 0;

var normalizeMarkupForTextOrAttribute = void 0;
var normalizeHTML = void 0;
```

```js
var FunctionComponent = 0;
var ClassComponent = 1;
var IndeterminateComponent = 2; // Before we know whether it is function or class
var HostRoot = 3; // Root of a host tree. Could be nested inside another node.
var HostPortal = 4; // A subtree. Could be an entry point to a different renderer.
var HostComponent = 5;
var HostText = 6;
var Fragment = 7;
var Mode = 8;
var ContextConsumer = 9;
var ContextProvider = 10;
var ForwardRef = 11;
var Profiler = 12;
var SuspenseComponent = 13;
var MemoComponent = 14;
var SimpleMemoComponent = 15;
var LazyComponent = 16;
var IncompleteClassComponent = 17;
var DehydratedSuspenseComponent = 18;
var SuspenseListComponent = 19;
var FundamentalComponent = 20;

var randomKey = Math.random().toString(36).slice(2);
var internalInstanceKey = '__reactInternalInstance$' + randomKey;
var internalEventHandlersKey = '__reactEventHandlers$' + randomKey;

var canUseDOM = !!(typeof window !== 'undefined' && typeof window.document !== 'undefined' && typeof window.document.createElement !== 'undefined');


var enableUserTimingAPI = true;
var debugRenderPhaseSideEffects = false;
var debugRenderPhaseSideEffectsForStrictMode = true;
var replayFailedUnitOfWorkWithInvokeGuardedCallback = true;
var warnAboutDeprecatedLifecycles = true;
var enableProfilerTimer = true;
var enableSchedulerTracing = true;
var enableSuspenseServerRenderer = false;
var disableJavaScriptURLs = false;
var disableInputAttributeSyncing = false;
var enableStableConcurrentModeAPIs = false;
var warnAboutShorthandPropertyCollision = false;
var enableFlareAPI = false;
var enableFundamentalAPI = false;
var warnAboutUnmockedScheduler = false;
var revertPassiveEffectsChange = false;
var flushSuspenseFallbacksInTests = true;
var enableUserBlockingEvents = false;
var enableSuspenseCallback = false;
var warnAboutDefaultPropsOnFunctionComponents = false;
var disableLegacyContext = false;
var disableSchedulerTimeoutBasedOnReactExpirationTime = false;

var isInsideEventHandler = false;

var lastFlushedEventTimeStamp = 0;

var ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
var BEFORE_SLASH_RE = /^(.*)[\\\/]/;

var hasSymbol = typeof Symbol === 'function' && Symbol.for;

var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace;
// TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
// (unstable) APIs that have been removed. Can we remove the symbols?

var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;

var MAYBE_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
var FAUX_ITERATOR_SYMBOL = '@@iterator';

var Pending = 0;
var Resolved = 1;
var Rejected = 2;

ReactDebugCurrentFrame$2 = ReactSharedInternals.ReactDebugCurrentFrame;

var _enabled = true;

var PossiblyWeakMap = typeof WeakMap === 'function' ? WeakMap : Map;
var elementListeningSets = new PossiblyWeakMap();

var skipSelectionChangeEvent = canUseDOM && 'documentMode' in document && document.documentMode <= 11;
var eventTypes$3 = {
  select: {
    phasedRegistrationNames: {
      bubbled: 'onSelect',
      captured: 'onSelectCapture'
    },
    dependencies: [TOP_BLUR, TOP_CONTEXT_MENU, TOP_DRAG_END, TOP_FOCUS, TOP_KEY_DOWN, TOP_KEY_UP, TOP_MOUSE_DOWN, TOP_MOUSE_UP, TOP_SELECTION_CHANGE]
  }
};

var activeElement$1 = null;
var activeElementInst$1 = null;
var lastSelection = null;
var mouseDown = false;

var didWarnSelectedSetOnOption = false;
var didWarnInvalidChild = false;
var didWarnValueDefaultValue$1 = false;

var valuePropNames = ['value', 'defaultValue'];
var didWarnValDefaultVal = false;

var HTML_NAMESPACE$1 = 'http://www.w3.org/1999/xhtml';
var MATH_NAMESPACE = 'http://www.w3.org/1998/Math/MathML';
var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

var Namespaces = {
  html: HTML_NAMESPACE$1,
  mathml: MATH_NAMESPACE,
  svg: SVG_NAMESPACE
};


// SVG temp container for IE lacking innerHTML
var reusableSVGContainer = void 0;

// 'msTransform' is correct, but the other prefixes should be capitalized
var badVendoredStyleNamePattern = /^(?:webkit|moz|o)[A-Z]/;
var msPattern$1 = /^-ms-/;
var hyphenPattern = /-(.)/g;

// style values shouldn't contain a semicolon
var badStyleValueWithSemicolonPattern = /;\s*$/;

var warnedStyleNames = {};
var warnedStyleValues = {};
var warnedForNaNValue = false;
var warnedForInfinityValue = false;

var HTML$1 = '__html';

var ReactDebugCurrentFrame$3 = null;

// Persistence (when unsupported)
var supportsPersistence = false;
var cloneInstance = shim;
var cloneFundamentalInstance = shim;
var createContainerChildSet = shim;
var appendChildToContainerChildSet = shim;
var finalizeContainerChildren = shim;
var replaceContainerChildren = shim;
var cloneHiddenInstance = shim;
var cloneHiddenTextInstance = shim;

var SUPPRESS_HYDRATION_WARNING = void 0;
{
  SUPPRESS_HYDRATION_WARNING = 'suppressHydrationWarning';
}

var SUSPENSE_START_DATA = '$';
var SUSPENSE_END_DATA = '/$';
var SUSPENSE_PENDING_START_DATA = '$?';
var SUSPENSE_FALLBACK_START_DATA = '$!';

var STYLE = 'style';

var eventsEnabled = null;
var selectionInformation = null;

var isPrimaryRenderer = true;
var warnsIfNotActing = true;
// This initialization code may run even on server environments
// if a component just imports ReactDOM (e.g. for findDOMNode).
// Some environments might not have setTimeout or clearTimeout.
var scheduleTimeout = typeof setTimeout === 'function' ? setTimeout : undefined;
var cancelTimeout = typeof clearTimeout === 'function' ? clearTimeout : undefined;
var noTimeout = -1;
var supportsMutation = true;

var reactEmoji = '\u269B';
var warningEmoji = '\u26D4';
var supportsUserTiming = typeof performance !== 'undefined' && typeof performance.mark === 'function' && typeof performance.clearMarks === 'function' && typeof performance.measure === 'function' && typeof performance.clearMeasures === 'function';

var resolveFamily = null;
// $FlowFixMe Flow gets confused by a WeakSet feature check below.
var failedBoundaries = null;
var setRefreshHandler = function (handler) {
  {
    resolveFamily = handler;
  }
};
```

## hydration
```js
var supportsHydration = true;
```

