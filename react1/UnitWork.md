## WorkLoop
```js
function workLoopSync() {
  // Already timed out, so perform work without checking if we need to yield.
  while (workInProgress !== null) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}

function workLoop() {
  // Perform work until Scheduler asks us to yield
  while (workInProgress !== null && !shouldYield()) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}

```

## performUnitOfWork
```js
function performUnitOfWork(unitOfWork) {
  // The current, flushed, state of this fiber is the alternate. Ideally
  // nothing should rely on this, but relying on it here means that we don't
  // need an additional field on the work in progress.
  var current$$1 = unitOfWork.alternate;

  startWorkTimer(unitOfWork);
  setCurrentFiber(unitOfWork);

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

## beginWork
```js
beginWork$$1 = function (current$$1, unitOfWork, expirationTime) {
  // If a component throws an error, we replay it again in a synchronously
  // dispatched event, so that the debugger will treat it as an uncaught
  // error See ReactErrorUtils for more information.

  // Before entering the begin phase, copy the work-in-progress onto a dummy
  // fiber. If beginWork throws, we'll use this to reset the state.
  var originalWorkInProgressCopy = assignFiberPropertiesInDEV(dummyFiber, unitOfWork);
  try {
    return beginWork$1(current$$1, unitOfWork, expirationTime);
  } catch (originalError) {
    if (originalError !== null && typeof originalError === 'object' && typeof originalError.then === 'function') {
      // Don't replay promises. Treat everything else like an error.
      throw originalError;
    }

    // Keep this code in sync with renderRoot; any changes here must have
    // corresponding changes there.
    resetContextDependencies();
    resetHooks();

    // Unwind the failed stack frame
    unwindInterruptedWork(unitOfWork);

    // Restore the original properties of the fiber.
    assignFiberPropertiesInDEV(unitOfWork, originalWorkInProgressCopy);

    if (enableProfilerTimer && unitOfWork.mode & ProfileMode) {
      // Reset the profiler timer.
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

function beginWork$1(current$$1, workInProgress, renderExpirationTime) {
  var updateExpirationTime = workInProgress.expirationTime;

  {
    if (workInProgress._debugNeedsRemount && current$$1 !== null) {
      // This will restart the begin phase with a new fiber.
      return remountFiber(current$$1, workInProgress, createFiberFromTypeAndProps(workInProgress.type, workInProgress.key, workInProgress.pendingProps, workInProgress._debugOwner || null, workInProgress.mode, workInProgress.expirationTime));
    }
  }

  if (current$$1 !== null) {
    var oldProps = current$$1.memoizedProps;
    var newProps = workInProgress.pendingProps;

    if (oldProps !== newProps || hasContextChanged() || (
    // Force a re-render if the implementation changed due to hot reload:
    workInProgress.type !== current$$1.type)) {
      // If props or context changed, mark the fiber as having performed work.
      // This may be unset if the props are determined to be equal later (memo).
      didReceiveUpdate = true;
    } else if (updateExpirationTime < renderExpirationTime) {
      didReceiveUpdate = false;
      // This fiber does not have any pending work. Bailout without entering
      // the begin phase. There's still some bookkeeping we that needs to be done
      // in this optimized path, mostly pushing stuff onto the stack.
      switch (workInProgress.tag) {
        case HostRoot:
          pushHostRootContext(workInProgress);
          resetHydrationState();
          break;
        case HostComponent:
          pushHostContext(workInProgress);
          if (workInProgress.mode & ConcurrentMode && renderExpirationTime !== Never && shouldDeprioritizeSubtree(workInProgress.type, newProps)) {
            if (enableSchedulerTracing) {
              markSpawnedWork(Never);
            }
            // Schedule this fiber to re-render at offscreen priority. Then bailout.
            workInProgress.expirationTime = workInProgress.childExpirationTime = Never;
            return null;
          }
          break;
        case ClassComponent:
          {
            var Component = workInProgress.type;
            if (isContextProvider(Component)) {
              pushContextProvider(workInProgress);
            }
            break;
          }
        case HostPortal:
          pushHostContainer(workInProgress, workInProgress.stateNode.containerInfo);
          break;
        case ContextProvider:
          {
            var newValue = workInProgress.memoizedProps.value;
            pushProvider(workInProgress, newValue);
            break;
          }
        case Profiler:
          if (enableProfilerTimer) {
            workInProgress.effectTag |= Update;
          }
          break;
        case SuspenseComponent:
          {
            var state = workInProgress.memoizedState;
            var didTimeout = state !== null;
            if (didTimeout) {
              // If this boundary is currently timed out, we need to decide
              // whether to retry the primary children, or to skip over it and
              // go straight to the fallback. Check the priority of the primary
              var primaryChildFragment = workInProgress.child;
              var primaryChildExpirationTime = primaryChildFragment.childExpirationTime;
              if (primaryChildExpirationTime !== NoWork && primaryChildExpirationTime >= renderExpirationTime) {
                // The primary children have pending work. Use the normal path
                // to attempt to render the primary children again.
                return updateSuspenseComponent(current$$1, workInProgress, renderExpirationTime);
              } else {
                pushSuspenseContext(workInProgress, setDefaultShallowSuspenseContext(suspenseStackCursor.current));
                // The primary children do not have pending work with sufficient
                // priority. Bailout.
                var child = bailoutOnAlreadyFinishedWork(current$$1, workInProgress, renderExpirationTime);
                if (child !== null) {
                  // The fallback children have pending work. Skip over the
                  // primary children and work on the fallback.
                  return child.sibling;
                } else {
                  return null;
                }
              }
            } else {
              pushSuspenseContext(workInProgress, setDefaultShallowSuspenseContext(suspenseStackCursor.current));
            }
            break;
          }
        case DehydratedSuspenseComponent:
          {
            if (enableSuspenseServerRenderer) {
              pushSuspenseContext(workInProgress, setDefaultShallowSuspenseContext(suspenseStackCursor.current));
              // We know that this component will suspend again because if it has
              // been unsuspended it has committed as a regular Suspense component.
              // If it needs to be retried, it should have work scheduled on it.
              workInProgress.effectTag |= DidCapture;
            }
            break;
          }
        case SuspenseListComponent:
          {
            var didSuspendBefore = (current$$1.effectTag & DidCapture) !== NoEffect;

            var hasChildWork = workInProgress.childExpirationTime >= renderExpirationTime;

            if (didSuspendBefore) {
              if (hasChildWork) {
                // If something was in fallback state last time, and we have all the
                // same children then we're still in progressive loading state.
                // Something might get unblocked by state updates or retries in the
                // tree which will affect the tail. So we need to use the normal
                // path to compute the correct tail.
                return updateSuspenseListComponent(current$$1, workInProgress, renderExpirationTime);
              }
              // If none of the children had any work, that means that none of
              // them got retried so they'll still be blocked in the same way
              // as before. We can fast bail out.
              workInProgress.effectTag |= DidCapture;
            }

            // If nothing suspended before and we're rendering the same children,
            // then the tail doesn't matter. Anything new that suspends will work
            // in the "together" mode, so we can continue from the state we had.
            var renderState = workInProgress.memoizedState;
            if (renderState !== null) {
              // Reset to the "together" mode in case we've started a different
              // update in the past but didn't complete it.
              renderState.rendering = null;
              renderState.tail = null;
            }
            pushSuspenseContext(workInProgress, suspenseStackCursor.current);

            if (hasChildWork) {
              break;
            } else {
              // If none of the children had any work, that means that none of
              // them got retried so they'll still be blocked in the same way
              // as before. We can fast bail out.
              return null;
            }
          }
      }
      return bailoutOnAlreadyFinishedWork(current$$1, workInProgress, renderExpirationTime);
    }
  } else {
    didReceiveUpdate = false;
  }

  // Before entering the begin phase, clear the expiration time.
  workInProgress.expirationTime = NoWork;

  switch (workInProgress.tag) {
    case IndeterminateComponent:
      {
        return mountIndeterminateComponent(current$$1, workInProgress, workInProgress.type, renderExpirationTime);
      }
    case LazyComponent:
      {
        var elementType = workInProgress.elementType;
        return mountLazyComponent(current$$1, workInProgress, elementType, updateExpirationTime, renderExpirationTime);
      }
    case FunctionComponent:
      {
        var _Component = workInProgress.type;
        var unresolvedProps = workInProgress.pendingProps;
        var resolvedProps = workInProgress.elementType === _Component ? unresolvedProps : resolveDefaultProps(_Component, unresolvedProps);
        return updateFunctionComponent(current$$1, workInProgress, _Component, resolvedProps, renderExpirationTime);
      }
    case ClassComponent:
      {
        var _Component2 = workInProgress.type;
        var _unresolvedProps = workInProgress.pendingProps;
        var _resolvedProps = workInProgress.elementType === _Component2 ? _unresolvedProps : resolveDefaultProps(_Component2, _unresolvedProps);
        return updateClassComponent(current$$1, workInProgress, _Component2, _resolvedProps, renderExpirationTime);
      }
    case HostRoot:
      return updateHostRoot(current$$1, workInProgress, renderExpirationTime);
    case HostComponent:
      return updateHostComponent(current$$1, workInProgress, renderExpirationTime);
    case HostText:
      return updateHostText(current$$1, workInProgress);
    case SuspenseComponent:
      return updateSuspenseComponent(current$$1, workInProgress, renderExpirationTime);
    case HostPortal:
      return updatePortalComponent(current$$1, workInProgress, renderExpirationTime);
    case ForwardRef:
      {
        var type = workInProgress.type;
        var _unresolvedProps2 = workInProgress.pendingProps;
        var _resolvedProps2 = workInProgress.elementType === type ? _unresolvedProps2 : resolveDefaultProps(type, _unresolvedProps2);
        return updateForwardRef(current$$1, workInProgress, type, _resolvedProps2, renderExpirationTime);
      }
    case Fragment:
      return updateFragment(current$$1, workInProgress, renderExpirationTime);
    case Mode:
      return updateMode(current$$1, workInProgress, renderExpirationTime);
    case Profiler:
      return updateProfiler(current$$1, workInProgress, renderExpirationTime);
    case ContextProvider:
      return updateContextProvider(current$$1, workInProgress, renderExpirationTime);
    case ContextConsumer:
      return updateContextConsumer(current$$1, workInProgress, renderExpirationTime);
    case MemoComponent:
      {
        var _type2 = workInProgress.type;
        var _unresolvedProps3 = workInProgress.pendingProps;
        // Resolve outer props first, then resolve inner props.
        var _resolvedProps3 = resolveDefaultProps(_type2, _unresolvedProps3);
        {
          if (workInProgress.type !== workInProgress.elementType) {
            var outerPropTypes = _type2.propTypes;
            if (outerPropTypes) {
              checkPropTypes(outerPropTypes, _resolvedProps3, // Resolved for outer only
              'prop', getComponentName(_type2), getCurrentFiberStackInDev);
            }
          }
        }
        _resolvedProps3 = resolveDefaultProps(_type2.type, _resolvedProps3);
        return updateMemoComponent(current$$1, workInProgress, _type2, _resolvedProps3, updateExpirationTime, renderExpirationTime);
      }
    case SimpleMemoComponent:
      {
        return updateSimpleMemoComponent(current$$1, workInProgress, workInProgress.type, workInProgress.pendingProps, updateExpirationTime, renderExpirationTime);
      }
    case IncompleteClassComponent:
      {
        var _Component3 = workInProgress.type;
        var _unresolvedProps4 = workInProgress.pendingProps;
        var _resolvedProps4 = workInProgress.elementType === _Component3 ? _unresolvedProps4 : resolveDefaultProps(_Component3, _unresolvedProps4);
        return mountIncompleteClassComponent(current$$1, workInProgress, _Component3, _resolvedProps4, renderExpirationTime);
      }
    case DehydratedSuspenseComponent:
      {
        if (enableSuspenseServerRenderer) {
          return updateDehydratedSuspenseComponent(current$$1, workInProgress, renderExpirationTime);
        }
        break;
      }
    case SuspenseListComponent:
      {
        return updateSuspenseListComponent(current$$1, workInProgress, renderExpirationTime);
      }
    case FundamentalComponent:
      {
        if (enableFundamentalAPI) {
          return updateFundamentalComponent$1(current$$1, workInProgress, renderExpirationTime);
        }
        break;
      }
  }
  (function () {
    {
      {
        throw ReactError(Error('Unknown unit of work tag. This error is likely caused by a bug in React. Please file an issue.'));
      }
    }
  })();
}
```

## completeUnitOfWork
```js
function completeUnitOfWork(unitOfWork) {
  // Attempt to complete the current unit of work, then move to the next
  // sibling. If there are no more siblings, return to the parent fiber.
  workInProgress = unitOfWork;
  do {
    // The current, flushed, state of this fiber is the alternate. Ideally
    // nothing should rely on this, but relying on it here means that we don't
    // need an additional field on the work in progress.
    var current$$1 = workInProgress.alternate;
    var returnFiber = workInProgress.return;

    // Check if the work completed or if something threw.
    if ((workInProgress.effectTag & Incomplete) === NoEffect) {
      setCurrentFiber(workInProgress);
      var next = void 0;
      if (!enableProfilerTimer || (workInProgress.mode & ProfileMode) === NoMode) {
        next = completeWork(current$$1, workInProgress, renderExpirationTime);
      } else {
        startProfilerTimer(workInProgress);
        next = completeWork(current$$1, workInProgress, renderExpirationTime);
        // Update render duration assuming we didn't error.
        stopProfilerTimerIfRunningAndRecordDelta(workInProgress, false);
      }
      stopWorkTimer(workInProgress);
      resetCurrentFiber();
      resetChildExpirationTime(workInProgress);

      if (next !== null) {
        // Completing this fiber spawned new work. Work on that next.
        return next;
      }

      if (returnFiber !== null &&
      // Do not append effects to parents if a sibling failed to complete
      (returnFiber.effectTag & Incomplete) === NoEffect) {
        // Append all the effects of the subtree and this fiber onto the effect
        // list of the parent. The completion order of the children affects the
        // side-effect order.
        if (returnFiber.firstEffect === null) {
          returnFiber.firstEffect = workInProgress.firstEffect;
        }
        if (workInProgress.lastEffect !== null) {
          if (returnFiber.lastEffect !== null) {
            returnFiber.lastEffect.nextEffect = workInProgress.firstEffect;
          }
          returnFiber.lastEffect = workInProgress.lastEffect;
        }

        // If this fiber had side-effects, we append it AFTER the children's
        // side-effects. We can perform certain side-effects earlier if needed,
        // by doing multiple passes over the effect list. We don't want to
        // schedule our own side-effect on our own list because if end up
        // reusing children we'll schedule this effect onto itself since we're
        // at the end.
        var effectTag = workInProgress.effectTag;

        // Skip both NoWork and PerformedWork tags when creating the effect
        // list. PerformedWork effect is read by React DevTools but shouldn't be
        // committed.
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
      // This fiber did not complete because something threw. Pop values off
      // the stack without entering the complete phase. If this is a boundary,
      // capture values if possible.
      var _next = unwindWork(workInProgress, renderExpirationTime);

      // Because this fiber did not complete, don't reset its expiration time.

      if (enableProfilerTimer && (workInProgress.mode & ProfileMode) !== NoMode) {
        // Record the render duration for the fiber that errored.
        stopProfilerTimerIfRunningAndRecordDelta(workInProgress, false);

        // Include the time spent working on failed children before continuing.
        var actualDuration = workInProgress.actualDuration;
        var child = workInProgress.child;
        while (child !== null) {
          actualDuration += child.actualDuration;
          child = child.sibling;
        }
        workInProgress.actualDuration = actualDuration;
      }

      if (_next !== null) {
        // If completing this work spawned new work, do that next. We'll come
        // back here again.
        // Since we're restarting, remove anything that is not a host effect
        // from the effect tag.
        // TODO: The name stopFailedWorkTimer is misleading because Suspense
        // also captures and restarts.
        stopFailedWorkTimer(workInProgress);
        _next.effectTag &= HostEffectMask;
        return _next;
      }
      stopWorkTimer(workInProgress);

      if (returnFiber !== null) {
        // Mark the parent fiber as incomplete and clear its effect list.
        returnFiber.firstEffect = returnFiber.lastEffect = null;
        returnFiber.effectTag |= Incomplete;
      }
    }

    var siblingFiber = workInProgress.sibling;
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

## completeWork
```js
function completeWork(current, workInProgress, renderExpirationTime) {
  var newProps = workInProgress.pendingProps;

  switch (workInProgress.tag) {
    case IndeterminateComponent:
      break;
    case LazyComponent:
      break;
    case SimpleMemoComponent:
    case FunctionComponent:
      break;
    case ClassComponent:
      {
        var Component = workInProgress.type;
        if (isContextProvider(Component)) {
          popContext(workInProgress);
        }
        break;
      }
    case HostRoot:
      {
        popHostContainer(workInProgress);
        popTopLevelContextObject(workInProgress);
        var fiberRoot = workInProgress.stateNode;
        if (fiberRoot.pendingContext) {
          fiberRoot.context = fiberRoot.pendingContext;
          fiberRoot.pendingContext = null;
        }
        if (current === null || current.child === null) {
          // If we hydrated, pop so that we can delete any remaining children
          // that weren't hydrated.
          popHydrationState(workInProgress);
          // This resets the hacky state to fix isMounted before committing.
          // TODO: Delete this when we delete isMounted and findDOMNode.
          workInProgress.effectTag &= ~Placement;
        }
        updateHostContainer(workInProgress);
        break;
      }
    case HostComponent:
      {
        popHostContext(workInProgress);
        var rootContainerInstance = getRootHostContainer();
        var type = workInProgress.type;
        if (current !== null && workInProgress.stateNode != null) {
          updateHostComponent$1(current, workInProgress, type, newProps, rootContainerInstance);

          if (enableFlareAPI) {
            var prevListeners = current.memoizedProps.listeners;
            var nextListeners = newProps.listeners;
            var instance = workInProgress.stateNode;
            if (prevListeners !== nextListeners) {
              updateEventListeners(nextListeners, instance, rootContainerInstance, workInProgress);
            }
          }

          if (current.ref !== workInProgress.ref) {
            markRef$1(workInProgress);
          }
        } else {
          if (!newProps) {
            (function () {
              if (!(workInProgress.stateNode !== null)) {
                {
                  throw ReactError(Error('We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.'));
                }
              }
            })();
            // This can happen when we abort work.
            break;
          }

          var currentHostContext = getHostContext();
          // TODO: Move createInstance to beginWork and keep it on a context
          // "stack" as the parent. Then append children as we go in beginWork
          // or completeWork depending on we want to add then top->down or
          // bottom->up. Top->down is faster in IE11.
          var wasHydrated = popHydrationState(workInProgress);
          if (wasHydrated) {
            // TODO: Move this and createInstance step into the beginPhase
            // to consolidate.
            if (prepareToHydrateHostInstance(workInProgress, rootContainerInstance, currentHostContext)) {
              // If changes to the hydrated node needs to be applied at the
              // commit-phase we mark this as such.
              markUpdate(workInProgress);
            }
          } else {
            var _instance5 = createInstance(type, newProps, rootContainerInstance, currentHostContext, workInProgress);

            appendAllChildren(_instance5, workInProgress, false, false);

            if (enableFlareAPI) {
              var listeners = newProps.listeners;
              if (listeners != null) {
                updateEventListeners(listeners, _instance5, rootContainerInstance, workInProgress);
              }
            }

            // Certain renderers require commit-time effects for initial mount.
            // (eg DOM renderer supports auto-focus for certain elements).
            // Make sure such renderers get scheduled for later work.
            if (finalizeInitialChildren(_instance5, type, newProps, rootContainerInstance, currentHostContext)) {
              markUpdate(workInProgress);
            }
            workInProgress.stateNode = _instance5;
          }

          if (workInProgress.ref !== null) {
            // If there is a ref on a host node we need to schedule a callback
            markRef$1(workInProgress);
          }
        }
        break;
      }
    case HostText:
      {
        var newText = newProps;
        if (current && workInProgress.stateNode != null) {
          var oldText = current.memoizedProps;
          // If we have an alternate, that means this is an update and we need
          // to schedule a side-effect to do the updates.
          updateHostText$1(current, workInProgress, oldText, newText);
        } else {
          if (typeof newText !== 'string') {
            (function () {
              if (!(workInProgress.stateNode !== null)) {
                {
                  throw ReactError(Error('We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.'));
                }
              }
            })();
            // This can happen when we abort work.
          }
          var _rootContainerInstance = getRootHostContainer();
          var _currentHostContext = getHostContext();
          var _wasHydrated = popHydrationState(workInProgress);
          if (_wasHydrated) {
            if (prepareToHydrateHostTextInstance(workInProgress)) {
              markUpdate(workInProgress);
            }
          } else {
            workInProgress.stateNode = createTextInstance(newText, _rootContainerInstance, _currentHostContext, workInProgress);
          }
        }
        break;
      }
    case ForwardRef:
      break;
    case SuspenseComponent:
      {
        popSuspenseContext(workInProgress);
        var nextState = workInProgress.memoizedState;
        if ((workInProgress.effectTag & DidCapture) !== NoEffect) {
          // Something suspended. Re-render with the fallback children.
          workInProgress.expirationTime = renderExpirationTime;
          // Do not reset the effect list.
          return workInProgress;
        }

        var nextDidTimeout = nextState !== null;
        var prevDidTimeout = false;
        if (current === null) {
          // In cases where we didn't find a suitable hydration boundary we never
          // downgraded this to a DehydratedSuspenseComponent, but we still need to
          // pop the hydration state since we might be inside the insertion tree.
          popHydrationState(workInProgress);
        } else {
          var prevState = current.memoizedState;
          prevDidTimeout = prevState !== null;
          if (!nextDidTimeout && prevState !== null) {
            // We just switched from the fallback to the normal children.
            // Delete the fallback.
            // TODO: Would it be better to store the fallback fragment on
            var currentFallbackChild = current.child.sibling;
            if (currentFallbackChild !== null) {
              // Deletions go at the beginning of the return fiber's effect list
              var first = workInProgress.firstEffect;
              if (first !== null) {
                workInProgress.firstEffect = currentFallbackChild;
                currentFallbackChild.nextEffect = first;
              } else {
                workInProgress.firstEffect = workInProgress.lastEffect = currentFallbackChild;
                currentFallbackChild.nextEffect = null;
              }
              currentFallbackChild.effectTag = Deletion;
            }
          }
        }

        if (nextDidTimeout && !prevDidTimeout) {
          // If this subtreee is running in batched mode we can suspend,
          // otherwise we won't suspend.
          // TODO: This will still suspend a synchronous tree if anything
          // in the concurrent tree already suspended during this render.
          // This is a known bug.
          if ((workInProgress.mode & BatchedMode) !== NoMode) {
            // TODO: Move this back to throwException because this is too late
            // if this is a large tree which is common for initial loads. We
            // don't know if we should restart a render or not until we get
            // this marker, and this is too late.
            // If this render already had a ping or lower pri updates,
            // and this is the first time we know we're going to suspend we
            // should be able to immediately restart from within throwException.
            var hasInvisibleChildContext = current === null && workInProgress.memoizedProps.unstable_avoidThisFallback !== true;
            if (hasInvisibleChildContext || hasSuspenseContext(suspenseStackCursor.current, InvisibleParentSuspenseContext)) {
              // If this was in an invisible tree or a new render, then showing
              // this boundary is ok.
              renderDidSuspend();
            } else {
              // Otherwise, we're going to have to hide content so we should
              // suspend for longer if possible.
              renderDidSuspendDelayIfPossible();
            }
          }
        }

        if (supportsPersistence) {
          // TODO: Only schedule updates if not prevDidTimeout.
          if (nextDidTimeout) {
            // If this boundary just timed out, schedule an effect to attach a
            // retry listener to the proimse. This flag is also used to hide the
            // primary children.
            workInProgress.effectTag |= Update;
          }
        }
        if (supportsMutation) {
          // TODO: Only schedule updates if these values are non equal, i.e. it changed.
          if (nextDidTimeout || prevDidTimeout) {
            // If this boundary just timed out, schedule an effect to attach a
            // retry listener to the proimse. This flag is also used to hide the
            // primary children. In mutation mode, we also need the flag to
            // *unhide* children that were previously hidden, so check if the
            // is currently timed out, too.
            workInProgress.effectTag |= Update;
          }
        }
        if (enableSuspenseCallback && workInProgress.updateQueue !== null && workInProgress.memoizedProps.suspenseCallback != null) {
          // Always notify the callback
          workInProgress.effectTag |= Update;
        }
        break;
      }
    case Fragment:
      break;
    case Mode:
      break;
    case Profiler:
      break;
    case HostPortal:
      popHostContainer(workInProgress);
      updateHostContainer(workInProgress);
      break;
    case ContextProvider:
      // Pop provider fiber
      popProvider(workInProgress);
      break;
    case ContextConsumer:
      break;
    case MemoComponent:
      break;
    case IncompleteClassComponent:
      {
        // Same as class component case. I put it down here so that the tags are
        // sequential to ensure this switch is compiled to a jump table.
        var _Component = workInProgress.type;
        if (isContextProvider(_Component)) {
          popContext(workInProgress);
        }
        break;
      }
    case DehydratedSuspenseComponent:
      {
        if (enableSuspenseServerRenderer) {
          popSuspenseContext(workInProgress);
          if (current === null) {
            var _wasHydrated2 = popHydrationState(workInProgress);
            (function () {
              if (!_wasHydrated2) {
                {
                  throw ReactError(Error('A dehydrated suspense component was completed without a hydrated node. This is probably a bug in React.'));
                }
              }
            })();
            if (enableSchedulerTracing) {
              markSpawnedWork(Never);
            }
            skipPastDehydratedSuspenseInstance(workInProgress);
          } else if ((workInProgress.effectTag & DidCapture) === NoEffect) {
            // This boundary did not suspend so it's now hydrated.
            // To handle any future suspense cases, we're going to now upgrade it
            // to a Suspense component. We detach it from the existing current fiber.
            current.alternate = null;
            workInProgress.alternate = null;
            workInProgress.tag = SuspenseComponent;
            workInProgress.memoizedState = null;
            workInProgress.stateNode = null;
          }
        }
        break;
      }
    case SuspenseListComponent:
      {
        popSuspenseContext(workInProgress);

        var renderState = workInProgress.memoizedState;

        if (renderState === null) {
          // We're running in the default, "independent" mode. We don't do anything
          // in this mode.
          break;
        }

        var didSuspendAlready = (workInProgress.effectTag & DidCapture) !== NoEffect;

        var renderedTail = renderState.rendering;
        if (renderedTail === null) {
          // We just rendered the head.
          if (!didSuspendAlready) {
            // This is the first pass. We need to figure out if anything is still
            // suspended in the rendered set.

            // If new content unsuspended, but there's still some content that
            // didn't. Then we need to do a second pass that forces everything
            // to keep showing their fallbacks.

            // We might be suspended if something in this render pass suspended, or
            // something in the previous committed pass suspended. Otherwise,
            // there's no chance so we can skip the expensive call to
            // findFirstSuspended.
            var cannotBeSuspended = renderHasNotSuspendedYet() && (current === null || (current.effectTag & DidCapture) === NoEffect);
            if (!cannotBeSuspended) {
              var row = workInProgress.child;
              while (row !== null) {
                var suspended = findFirstSuspended(row);
                if (suspended !== null) {
                  didSuspendAlready = true;
                  workInProgress.effectTag |= DidCapture;
                  cutOffTailIfNeeded(renderState, false);

                  // If this is a newly suspended tree, it might not get committed as
                  // part of the second pass. In that case nothing will subscribe to
                  // its thennables. Instead, we'll transfer its thennables to the
                  // SuspenseList so that it can retry if they resolve.
                  // There might be multiple of these in the list but since we're
                  // going to wait for all of them anyway, it doesn't really matter
                  // which ones gets to ping. In theory we could get clever and keep
                  // track of how many dependencies remain but it gets tricky because
                  // in the meantime, we can add/remove/change items and dependencies.
                  // We might bail out of the loop before finding any but that
                  // doesn't matter since that means that the other boundaries that
                  // we did find already has their listeners attached.
                  var newThennables = suspended.updateQueue;
                  if (newThennables !== null) {
                    workInProgress.updateQueue = newThennables;
                    workInProgress.effectTag |= Update;
                  }

                  // Rerender the whole list, but this time, we'll force fallbacks
                  // to stay in place.
                  // Reset the effect list before doing the second pass since that's now invalid.
                  workInProgress.firstEffect = workInProgress.lastEffect = null;
                  // Reset the child fibers to their original state.
                  resetChildFibers(workInProgress, renderExpirationTime);

                  // Set up the Suspense Context to force suspense and immediately
                  // rerender the children.
                  pushSuspenseContext(workInProgress, setShallowSuspenseContext(suspenseStackCursor.current, ForceSuspenseFallback));
                  return workInProgress.child;
                }
                row = row.sibling;
              }
            }
          } else {
            cutOffTailIfNeeded(renderState, false);
          }
          // Next we're going to render the tail.
        } else {
          // Append the rendered row to the child list.
          if (!didSuspendAlready) {
            var _suspended = findFirstSuspended(renderedTail);
            if (_suspended !== null) {
              workInProgress.effectTag |= DidCapture;
              didSuspendAlready = true;
              cutOffTailIfNeeded(renderState, true);
              // This might have been modified.
              if (renderState.tail === null && renderState.tailMode === 'hidden') {
                // We need to delete the row we just rendered.
                // Ensure we transfer the update queue to the parent.
                var _newThennables = _suspended.updateQueue;
                if (_newThennables !== null) {
                  workInProgress.updateQueue = _newThennables;
                  workInProgress.effectTag |= Update;
                }
                // Reset the effect list to what it w as before we rendered this
                // child. The nested children have already appended themselves.
                var lastEffect = workInProgress.lastEffect = renderState.lastEffect;
                // Remove any effects that were appended after this point.
                if (lastEffect !== null) {
                  lastEffect.nextEffect = null;
                }
                // We're done.
                return null;
              }
            } else if (now() > renderState.tailExpiration && renderExpirationTime > Never) {
              // We have now passed our CPU deadline and we'll just give up further
              // attempts to render the main content and only render fallbacks.
              // The assumption is that this is usually faster.
              workInProgress.effectTag |= DidCapture;
              didSuspendAlready = true;

              cutOffTailIfNeeded(renderState, false);

              // Since nothing actually suspended, there will nothing to ping this
              // to get it started back up to attempt the next item. If we can show
              // them, then they really have the same priority as this render.
              // So we'll pick it back up the very next render pass once we've had
              // an opportunity to yield for paint.

              var nextPriority = renderExpirationTime - 1;
              workInProgress.expirationTime = workInProgress.childExpirationTime = nextPriority;
              if (enableSchedulerTracing) {
                markSpawnedWork(nextPriority);
              }
            }
          }
          if (renderState.isBackwards) {
            // The effect list of the backwards tail will have been added
            // to the end. This breaks the guarantee that life-cycles fire in
            // sibling order but that isn't a strong guarantee promised by React.
            // Especially since these might also just pop in during future commits.
            // Append to the beginning of the list.
            renderedTail.sibling = workInProgress.child;
            workInProgress.child = renderedTail;
          } else {
            var previousSibling = renderState.last;
            if (previousSibling !== null) {
              previousSibling.sibling = renderedTail;
            } else {
              workInProgress.child = renderedTail;
            }
            renderState.last = renderedTail;
          }
        }

        if (renderState.tail !== null) {
          // We still have tail rows to render.
          if (renderState.tailExpiration === 0) {
            // Heuristic for how long we're willing to spend rendering rows
            // until we just give up and show what we have so far.
            var TAIL_EXPIRATION_TIMEOUT_MS = 500;
            renderState.tailExpiration = now() + TAIL_EXPIRATION_TIMEOUT_MS;
          }
          // Pop a row.
          var next = renderState.tail;
          renderState.rendering = next;
          renderState.tail = next.sibling;
          renderState.lastEffect = workInProgress.lastEffect;
          next.sibling = null;

          // Restore the context.
          // TODO: We can probably just avoid popping it instead and only
          // setting it the first time we go from not suspended to suspended.
          var suspenseContext = suspenseStackCursor.current;
          if (didSuspendAlready) {
            suspenseContext = setShallowSuspenseContext(suspenseContext, ForceSuspenseFallback);
          } else {
            suspenseContext = setDefaultShallowSuspenseContext(suspenseContext);
          }
          pushSuspenseContext(workInProgress, suspenseContext);
          // Do a pass over the next row.
          return next;
        }
        break;
      }
    case FundamentalComponent:
      {
        if (enableFundamentalAPI) {
          var fundamentalImpl = workInProgress.type.impl;
          var fundamentalInstance = workInProgress.stateNode;

          if (fundamentalInstance === null) {
            var getInitialState = fundamentalImpl.getInitialState;
            var fundamentalState = void 0;
            if (getInitialState !== undefined) {
              fundamentalState = getInitialState(newProps);
            }
            fundamentalInstance = workInProgress.stateNode = createFundamentalStateInstance(workInProgress, newProps, fundamentalImpl, fundamentalState || {});
            var _instance6 = getFundamentalComponentInstance(fundamentalInstance);
            fundamentalInstance.instance = _instance6;
            if (fundamentalImpl.reconcileChildren === false) {
              return null;
            }
            appendAllChildren(_instance6, workInProgress, false, false);
            mountFundamentalComponent(fundamentalInstance);
          } else {
            // We fire update in commit phase
            var prevProps = fundamentalInstance.props;
            fundamentalInstance.prevProps = prevProps;
            fundamentalInstance.props = newProps;
            fundamentalInstance.currentFiber = workInProgress;
            if (supportsPersistence) {
              var _instance7 = cloneFundamentalInstance(fundamentalInstance);
              fundamentalInstance.instance = _instance7;
              appendAllChildren(_instance7, workInProgress, false, false);
            }
            var shouldUpdate = shouldUpdateFundamentalComponent(fundamentalInstance);
            if (shouldUpdate) {
              markUpdate(workInProgress);
            }
          }
        }
        break;
      }
    default:
      (function () {
        {
          {
            throw ReactError(Error('Unknown unit of work tag. This error is likely caused by a bug in React. Please file an issue.'));
          }
        }
      })();
  }

  return null;
}
```
