## workLoopSync
render 阶段所有的 fiber 节点的处理都是在 workLoop 中处理的。
下面我们大概了解下 workLoop 里做了啥。 
```js
function workLoopSync() {
  // Already timed out, so perform work without checking if we need to yield.
  while (workInProgress !== null) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}
```
执行流程参考下面图片
![](https://pic2.zhimg.com/v2-4d6d43020835a41fd20492f29aea1a41_b.webp)

## performUnitOfWork
这里我们要明确一下概念 UnitWork 的单位是 fiber 节点。
performUnitOfWork 接收一个 unitwork ， 上面 workLoop 传入的是 workInProgress , 
实际上处理的是 current 。 

beginWork 暂时不深究， 此处我们只要知道在 beginWork 返回的是 unitOfWork.child 。 
此处用的是深度优先遍历， 只有当 unitWork 所有的子节点全部遍历之后才会执行 completeUnitOfWork 结束当前的 unitWork。 
```js
function performUnitOfWork(unitOfWork: Fiber): Fiber | null {
  // The current, flushed, state of this fiber is the alternate. Ideally
  // nothing should rely on this, but relying on it here means that we don't
  // need an additional field on the work in progress.
  const current = unitOfWork.alternate;

  startWorkTimer(unitOfWork);
  setCurrentDebugFiberInDEV(unitOfWork);

  let next;
  if (enableProfilerTimer && (unitOfWork.mode & ProfileMode) !== NoMode) {
    startProfilerTimer(unitOfWork);
    next = beginWork(current, unitOfWork, renderExpirationTime);
    stopProfilerTimerIfRunningAndRecordDelta(unitOfWork, true);
  } else {
    next = beginWork(current, unitOfWork, renderExpirationTime);
  }

  resetCurrentDebugFiberInDEV();
  unitOfWork.memoizedProps = unitOfWork.pendingProps;
  if (next === null) {
    // If this doesn't spawn new work, complete the current work.
    next = completeUnitOfWork(unitOfWork);
  }

  ReactCurrentOwner.current = null;
  return next;
}
```

## beginWork
> ReactFiberBeginWork 文件中有三千多行的代码， 此处就不贴详细代码了， 就了解下在该阶段主要做了什么。

```js
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderExpirationTime: ExpirationTime,
): Fiber | null{
  if (current !== null) {
    const oldProps = current.memoizedProps;
    const newProps = workInProgress.pendingProps;
    if(oldProps !== newProps ||hasLegacyContextChanged()){
      didReceiveUpdate = true;
    }else if(updateExpirationTime < renderExpirationTime){
      didReceiveUpdate = false;
      switch (workInProgress.tag){
        //...
      }
      return bailoutOnAlreadyFinishedWork(
        current,
        workInProgress,
        renderExpirationTime,
      );
    }else {
      didReceiveUpdate = false;
    }
  }else {
    didReceiveUpdate = false;
  }

  switch (workInProgress.tag) {
    case IndeterminateComponent: {
      return mountIndeterminateComponent(
        current,
        workInProgress,
        workInProgress.type,
        renderExpirationTime,
      );
    }
    case FunctionComponent:{
      //...
      return updateFunctionComponent(
        current,
        workInProgress,
        Component,
        resolvedProps,
        renderExpirationTime,
      );
    }
    // ...
  }
}
```
上面是简化之后的代码，里面先是比较了 current.memoizedProps 与 workInProgress.pendingProps ， 以及判断 context 是否改变，用于标记 didReceiveUpdate 。 这个 didReceiveUpdate 具体不知道表示什么。 

bailoutOnAlreadyFinishedWork 中会通过 childExpirationTime 判断子节点是否有更新， 没有就 return null , 否则克隆子节点并返回子节点，继续子节点的 work。

下面就开始根据 tag 来挂载或者更新对应的节点了。 
TODO: 通过 updateFunctionComponent 分析 reconcileChildren 。


## completeUnitOfWork
```js
function completeUnitOfWork(unitOfWork: Fiber): Fiber | null {
  workInProgress = unitOfWork;
  do {
    const current = workInProgress.alternate;
    const returnFiber = workInProgress.return;
    //effectTag:1~2048 Incomplete=1024 NoEffect=0 , 只要 workInProgress 的 effectTag 不是 Incomplete ,与上 Incomplete 就是 0, 表示当前没有更新，不需要处理。进入 completeWork
    if ((workInProgress.effectTag & Incomplete) === NoEffect) {
      let next;
      next = completeWork(current, workInProgress, renderExpirationTime);
      stopWorkTimer(workInProgress);
      resetCurrentDebugFiberInDEV();
      resetChildExpirationTime(workInProgress);

      
      if (next !== null) {
        return next;
      }

      //effect list 处理

      //(returnFiber.effectTag & Incomplete) === NoEffect 为 true， 即当前不为根节点。
      // Incomplete 表示是否有错误发生并被捕获。
      if (returnFiber !== null &&(returnFiber.effectTag & Incomplete) === NoEffect) {
        if (returnFiber.firstEffect === null) {
          returnFiber.firstEffect = workInProgress.firstEffect;
        }
        //当前 fiber 节点的子节点存在更新
        if (workInProgress.lastEffect !== null) {
          //如果父节点的其他子节点也存在更新，将父节点的 nextEffect 指向该子节点的 firstEffect
          if (returnFiber.lastEffect !== null) {
            returnFiber.lastEffect.nextEffect = workInProgress.firstEffect;
          }
          //其他子节点无更新， 直接指向该子节点的 lastEffect
          returnFiber.lastEffect = workInProgress.lastEffect;
        }
        //TODO: PerformedWork = 1, 代表什么
        const effectTag = workInProgress.effectTag;
        if (effectTag > PerformedWork) {
          if (returnFiber.lastEffect !== null) {
            returnFiber.lastEffect.nextEffect = workInProgress;
          } else {
            returnFiber.firstEffect = workInProgress;
          }
          returnFiber.lastEffect = workInProgress;
        }
      }
    } else {
      const next = unwindWork(workInProgress, renderExpirationTime);
      if (
        enableProfilerTimer &&
        (workInProgress.mode & ProfileMode) !== NoMode
      ) {
        // Record the render duration for the fiber that errored.
        stopProfilerTimerIfRunningAndRecordDelta(workInProgress, false);

        let actualDuration = workInProgress.actualDuration;
        let child = workInProgress.child;
        while (child !== null) {
          actualDuration += child.actualDuration;
          child = child.sibling;
        }
        workInProgress.actualDuration = actualDuration;
      }

      if (next !== null) {
        stopFailedWorkTimer(workInProgress);
        next.effectTag &= HostEffectMask;
        return next;
      }
      stopWorkTimer(workInProgress);

      if (returnFiber !== null) {
        // Mark the parent fiber as incomplete and clear its effect list.
        returnFiber.firstEffect = returnFiber.lastEffect = null;
        returnFiber.effectTag |= Incomplete;
      }
    }

    const siblingFiber = workInProgress.sibling;
    if (siblingFiber !== null) {
      // If there is more work to do in this returnFiber, do that next.
      return siblingFiber;
    }
    // Otherwise, return to the parent
    workInProgress = returnFiber;
  } while (workInProgress !== null);

  // We've reached the root.
  if (workInProgressRootExitStatus === RootIncomplete) {
    workInProgressRootExitStatus = RootCompleted;
  }
  return null;
}
```