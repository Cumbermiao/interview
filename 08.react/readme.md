# React
```js
var React = {
  Children: {
    map: mapChildren,
    forEach: forEachChildren,
    count: countChildren,
    toArray: toArray,
    only: onlyChild
  },

  createRef: createRef,
  Component: Component,
  PureComponent: PureComponent,

  createContext: createContext,
  forwardRef: forwardRef,
  lazy: lazy,
  memo: memo,

  useCallback: useCallback,
  useContext: useContext,
  useEffect: useEffect,
  useImperativeHandle: useImperativeHandle,
  useDebugValue: useDebugValue,
  useLayoutEffect: useLayoutEffect,
  useMemo: useMemo,
  useReducer: useReducer,
  useRef: useRef,
  useState: useState,

  Fragment: REACT_FRAGMENT_TYPE,
  Profiler: REACT_PROFILER_TYPE,
  StrictMode: REACT_STRICT_MODE_TYPE,
  Suspense: REACT_SUSPENSE_TYPE,
  unstable_SuspenseList: REACT_SUSPENSE_LIST_TYPE,

  createElement: createElementWithValidation,
  cloneElement: cloneElementWithValidation,
  createFactory: createFactoryWithValidation,
  isValidElement: isValidElement,

  version: ReactVersion,

  unstable_withSuspenseConfig: withSuspenseConfig,

  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: ReactSharedInternals$2
};

if (enableFlareAPI) {
  React.unstable_useResponder = useResponder;
  React.unstable_createResponder = createEventResponder;
}

if (enableFundamentalAPI) {
  React.unstable_createFundamental = createFundamentalComponent;
}

// Note: some APIs are added with feature flags.
// Make sure that stable builds for open source
// don't modify the React object to avoid deopts.
// Also let's not expose their names in stable builds.

if (enableJSXTransformAPI) {
  {
    React.jsxDEV = jsxWithValidation;
    React.jsx = jsxWithValidationDynamic;
    React.jsxs = jsxWithValidationStatic;
  }
}
```



# ReactDOM
```js
var  ReactDOM = {
  createPortal: createPortal$$1,
  findDOMNode: function (componentOrElement){},
  hydrate: function (element, container, callback){},
  render: function (element, container, callback){},
  unstable_renderSubtreeIntoContainer: function (parentComponent, element, containerNode, callback) {},
  unmountComponentAtNode: function (container){},
  unstable_createPortal: function (){},
  unstable_batchedUpdates: batchedUpdates$1,
  unstable_interactiveUpdates: function (fn, a, b, c){},
  unstable_discreteUpdates: discreteUpdates$1,
  unstable_flushDiscreteUpdates: flushDiscreteUpdates,

  flushSync: flushSync,

  unstable_createRoot: createRoot,
  unstable_createSyncRoot: createSyncRoot,
  unstable_flushControlled: flushControlled,
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:{}
}
```


## setState
```js
Component.prototype.setState = function (partialState, callback) {
  (function () {
    if (!(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null)) {
      {
        throw ReactError(Error('setState(...): takes an object of state variables to update or a function which returns an object of state variables.'));
      }
    }
  })();
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};
```
此处需要了解下 updater , updater 是用来操作更新队列 (update queue) 的 api， react 中有一个 ReactNoopUpdateQueue , reactDOM 中有一个 classComponentUpdater , 我们只需要关注 clasComponentUpdater 。
```js
var classComponentUpdater = {
  isMounted: isMounted,
  enqueueSetState: function (inst, payload, callback) {
    var fiber = get(inst);
    var currentTime = requestCurrentTime();
    var suspenseConfig = requestCurrentSuspenseConfig();
    var expirationTime = computeExpirationForFiber(currentTime, fiber, suspenseConfig);

    var update = createUpdate(expirationTime, suspenseConfig);
    update.payload = payload;
    if (callback !== undefined && callback !== null) {
      {
        warnOnInvalidCallback$1(callback, 'setState');
      }
      update.callback = callback;
    }

    if (revertPassiveEffectsChange) {
      flushPassiveEffects();
    }
    enqueueUpdate(fiber, update);
    scheduleWork(fiber, expirationTime);
  },
  enqueueReplaceState: function (inst, payload, callback) {},
  enqueueForceUpdate: function (inst, callback) {}
};
```
以上为 updater 结构， 此处我们只关注 enqueueSetState ， 其实这三个方法代码基本一样，区别在 enqueueUpdate(fiber, update) 中的 update ， 下面两个方法都通过 update.tag = xxx 的方式在 enqueueUpdate 中标记。


## Need to konw
- react 与 reactDOM
- fiber
- schduler
- fiber树与 Vituiral DOM 树
- 复用机制


fiber 树


```js
render => return legacyRenderSubtreeIntoContainer(null, element, container, false, callback);


legacyRenderSubtreeIntoContainer => {
  if(!root){
    //initial mount
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(container, forceHydrate);
    unbatchedUpdates(function () {
      updateContainer(children, fiberRoot, parentComponent, callback);
    });
  }else{
    //update
    updateContainer(children, fiberRoot, parentComponent, callback);
  }
  return getPublicRootInstance(fiberRoot);
}


legacyCreateRootFromDOMContainer =>{
   if (!shouldHydrate) {
    var warned = false;
    var rootSibling = void 0;
    // while 遍历所有子节点并删除
    while (rootSibling = container.lastChild) {
      container.removeChild(rootSibling);
    }
  }
  //LegacyRoot = 0
  return new ReactSyncRoot(container, LegacyRoot, shouldHydrate);
}


ReactSyncRoot =>{
  // Tag is either LegacyRoot or Concurrent Root
  var root = createContainer(container, tag, hydrate);
  this._internalRoot = root;
}


function createContainer(containerInfo, tag, hydrate) {
  return createFiberRoot(containerInfo, tag, hydrate);
}


function createFiberRoot(containerInfo, tag, hydrate) {
  var root = new FiberRootNode(containerInfo, tag, hydrate);
  var uninitializedFiber = createHostRootFiber(tag);
  root.current = uninitializedFiber;
  uninitializedFiber.stateNode = root;
  return root;
}


updateContainer=>{
  var suspenseConfig = requestCurrentSuspenseConfig();
  var expirationTime = computeExpirationForFiber(currentTime, current$$1, suspenseConfig);
  return updateContainerAtExpirationTime(element, container, parentComponent, expirationTime, suspenseConfig, callback);
}


updateContainerAtExpirationTime =>{
  if (container.context === null) {
    //initial mount
    container.context = context;
  } else {
    container.pendingContext = context;
  }
  return scheduleRootUpdate(current$$1, element, expirationTime, suspenseConfig, callback);
}


scheduleRootUpdate =>{
  // set priority while create
  var update = createUpdate(expirationTime, suspenseConfig);
  enqueueUpdate(current$$1, update);
  scheduleWork(current$$1, expirationTime);
  return expirationTime;
}


function createUpdate(expirationTime, suspenseConfig) {
  var update = {
    expirationTime: expirationTime,
    suspenseConfig: suspenseConfig,
    tag: UpdateState,
    payload: null,
    callback: null,
    next: null,
    nextEffect: null
  };
  // ImmediatePriority = 99;
  // UserBlockingPriority$2 = 98;
  // NormalPriority = 97;
  // LowPriority = 96;
  // IdlePriority = 95;
  // NoPriority = 90;
  update.priority = getCurrentPriorityLevel();
  return update;
}


enqueueUpdate =>{
  //TODO: 分析 queue1 & queue2
  createUpdateQueue(fiber.memoizedState);
  appendUpdateToQueue(queue1, update);
}


function createUpdateQueue(baseState) {
  var queue = {
    baseState: baseState,
    firstUpdate: null,
    lastUpdate: null,
    firstCapturedUpdate: null,
    lastCapturedUpdate: null,
    firstEffect: null,
    lastEffect: null,
    firstCapturedEffect: null,
    lastCapturedEffect: null
  };
  return queue;
}


function appendUpdateToQueue(queue, update) {
  if (queue.lastUpdate === null) {
    queue.firstUpdate = queue.lastUpdate = update;
  } else {
    queue.lastUpdate.next = update;
    queue.lastUpdate = update;
  }
}


scheduleWork = scheduleUpdateOnFiber =>{
  //TODO:
  
  checkForNestedUpdates();
  warnAboutInvalidUpdatesOnClassComponentsInDEV(fiber);
  //更新当前fiber节点以及其父节点至fiberRoot节点的 expirationTime & childExpirationTime， root = fiber.stateNode
  var root = markUpdateTimeFromFiberToRoot(fiber, expirationTime);
  if (root === null) {
    warnAboutUpdateOnUnmountedFiberInDEV(fiber);
    return;
  }
  root.pingTime = NoWork;
  //检查当前的 fiberNode 的 update 中的渲染所需要的时间是否小于剩余的过期时间， 小于则 interruptedBy = fiber;
  checkForInterruption(fiber, expirationTime);
  //修改 hasScheduledUpdateInCurrentCommit
  recordScheduleUpdate();
  var priorityLevel = getCurrentPriorityLevel();
  if (expirationTime === Sync) {
    if (
    (executionContext & LegacyUnbatchedContext) !== NoContext &&
    (executionContext & (RenderContext | CommitContext)) === NoContext) {
      schedulePendingInteractions(root, expirationTime);
      var callback = renderRoot(root, Sync, true);
      while (callback !== null) {
        callback = callback(true);
      }
    } else {
      scheduleCallbackForRoot(root, ImmediatePriority, Sync);
      if (executionContext === NoContext) {
        flushSyncCallbackQueue();
      }
    }
  } else {
    scheduleCallbackForRoot(root, priorityLevel, expirationTime);
  }

  if ((executionContext & DiscreteEventContext) !== NoContext && (
  priorityLevel === UserBlockingPriority$2 || priorityLevel === ImmediatePriority)) {
    if (rootsWithPendingDiscreteUpdates === null) {
      rootsWithPendingDiscreteUpdates = new Map([[root, expirationTime]]);
    } else {
      var lastDiscreteTime = rootsWithPendingDiscreteUpdates.get(root);
      if (lastDiscreteTime === undefined || lastDiscreteTime > expirationTime) {
        rootsWithPendingDiscreteUpdates.set(root, expirationTime);
      }
    }
  }
}
```


react 更新过程:
首次渲染: 调用 legacyRenderSubtreeIntoContainer 