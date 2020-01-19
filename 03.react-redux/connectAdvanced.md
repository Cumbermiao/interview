connect 是 react-redux 最为核心的代码， 其也比较复杂， 下面我们尝试着梳理一下 connect 的流程。

首先 `connect = createConnect()` , createConnect 返回的就是我们所使用的的 connect 函数。 下面是删减过后的代码。
```js
export function createConnect() {
  return function connect(mapStateToProps, mapDispatchToProps, mergeProps, _ref2) {
    var initMapStateToProps = match(mapStateToProps, mapStateToPropsFactories, 'mapStateToProps');
    var initMapDispatchToProps = match(mapDispatchToProps, mapDispatchToPropsFactories, 'mapDispatchToProps');
    var initMergeProps = match(mergeProps, mergePropsFactories, 'mergeProps');
    return connectHOC(selectorFactory, _extends({
      // used in error messages
      methodName: 'connect',
      // used to compute Connect's displayName from the wrapped component's displayName.
      getDisplayName: function getDisplayName(name) {
        return "Connect(" + name + ")";
      },
      // if mapStateToProps is falsy, the Connect component doesn't subscribe to store state changes
      shouldHandleStateChanges: Boolean(mapStateToProps),
      // passed through to selectorFactory
      initMapStateToProps: initMapStateToProps,
      initMapDispatchToProps: initMapDispatchToProps,
      initMergeProps: initMergeProps,
      pure: pure,
      areStatesEqual: areStatesEqual,
      areOwnPropsEqual: areOwnPropsEqual,
      areStatePropsEqual: areStatePropsEqual,
      areMergedPropsEqual: areMergedPropsEqual
    }, extraOptions));
  };
}
```

我们看到 connect 其实就是 `function connect(...)` 函数， connect 实际用法是 `connect()(component)` , 所以 `function connect(...)` 也是返回的一个函数 ， 也就是 `connectHOC(selectorFactory, _extends({...}))`所返回的函数 。 此处的 connectHOC 其实就是 connectAdvanced ， 下面看下 connectAdvanced 所返回的函数。
```js
export default function connectAdvanced(
/*
  selectorFactory is a func that is responsible for returning the selector function used to
  compute new props from state, props, and dispatch. For example:
     export default connectAdvanced((dispatch, options) => (state, props) => ({
      thing: state.things[props.thingId],
      saveThing: fields => dispatch(actionCreators.saveThing(props.thingId, fields)),
    }))(YourComponent)
   Access to dispatch is provided to the factory so selectorFactories can bind actionCreators
  outside of their selector as an optimization. Options passed to connectAdvanced are passed to
  the selectorFactory, along with displayName and WrappedComponent, as the second argument.
   Note that selectorFactory is responsible for all caching/memoization of inbound and outbound
  props. Do not use connectAdvanced directly without memoizing results between calls to your
  selector, otherwise the Connect component will re-render on every state or props change.
*/
selectorFactory, // options object:
_ref) {
  var Context = context;
  return function wrapWithConnect(WrappedComponent) {
    var wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
    var displayName = getDisplayName(wrappedComponentName);

    var selectorFactoryOptions = _extends({}, connectOptions, {
      getDisplayName: getDisplayName,
      methodName: methodName,
      renderCountProp: renderCountProp,
      shouldHandleStateChanges: shouldHandleStateChanges,
      storeKey: storeKey,
      displayName: displayName,
      wrappedComponentName: wrappedComponentName,
      WrappedComponent: WrappedComponent
    });

    var pure = connectOptions.pure;

    function createChildSelector(store) {
      return selectorFactory(store.dispatch, selectorFactoryOptions);
    } // If we aren't running in "pure" mode, we don't want to memoize values.
    // To avoid conditionally calling hooks, we fall back to a tiny wrapper
    // that just executes the given callback immediately.


    var usePureOnlyMemo = pure ? useMemo : function (callback) {
      return callback();
    };

    function ConnectFunction(props) {
      var _useMemo = useMemo(function () {
        // Distinguish between actual "data" props that were passed to the wrapper component,
        // and values needed to control behavior (forwarded refs, alternate context instances).
        // To maintain the wrapperProps object reference, memoize this destructuring.
        var forwardedRef = props.forwardedRef,
            wrapperProps = _objectWithoutPropertiesLoose(props, ["forwardedRef"]);

        return [props.context, forwardedRef, wrapperProps];
      }, [props]),
          propsContext = _useMemo[0],
          forwardedRef = _useMemo[1],
          wrapperProps = _useMemo[2];

      var ContextToUse = useMemo(function () {
        // Users may optionally pass in a custom context instance to use instead of our ReactReduxContext.
        // Memoize the check that determines which context instance we should use.
        return propsContext && propsContext.Consumer && isContextConsumer(React.createElement(propsContext.Consumer, null)) ? propsContext : Context;
      }, [propsContext, Context]); // Retrieve the store and ancestor subscription via context, if available

      var contextValue = useContext(ContextToUse); // The store _must_ exist as either a prop or in context

      var didStoreComeFromProps = Boolean(props.store);
      var didStoreComeFromContext = Boolean(contextValue) && Boolean(contextValue.store);
      invariant(didStoreComeFromProps || didStoreComeFromContext, "Could not find \"store\" in the context of " + ("\"" + displayName + "\". Either wrap the root component in a <Provider>, ") + "or pass a custom React context provider to <Provider> and the corresponding " + ("React context consumer to " + displayName + " in connect options."));
      var store = props.store || contextValue.store;
      var childPropsSelector = useMemo(function () {
        // The child props selector needs the store reference as an input.
        // Re-create this selector whenever the store changes.
        return createChildSelector(store);
      }, [store]);

      var _useMemo2 = useMemo(function () {
        if (!shouldHandleStateChanges) return NO_SUBSCRIPTION_ARRAY; // This Subscription's source should match where store came from: props vs. context. A component
        // connected to the store via props shouldn't use subscription from context, or vice versa.

        var subscription = new Subscription(store, didStoreComeFromProps ? null : contextValue.subscription); // `notifyNestedSubs` is duplicated to handle the case where the component is unmounted in
        // the middle of the notification loop, where `subscription` will then be null. This can
        // probably be avoided if Subscription's listeners logic is changed to not call listeners
        // that have been unsubscribed in the  middle of the notification loop.

        var notifyNestedSubs = subscription.notifyNestedSubs.bind(subscription);
        return [subscription, notifyNestedSubs];
      }, [store, didStoreComeFromProps, contextValue]),
          subscription = _useMemo2[0],
          notifyNestedSubs = _useMemo2[1]; // Determine what {store, subscription} value should be put into nested context, if necessary,
      // and memoize that value to avoid unnecessary context updates.


      var overriddenContextValue = useMemo(function () {
        if (didStoreComeFromProps) {
          // This component is directly subscribed to a store from props.
          // We don't want descendants reading from this store - pass down whatever
          // the existing context value is from the nearest connected ancestor.
          return contextValue;
        } // Otherwise, put this component's subscription instance into context, so that
        // connected descendants won't update until after this component is done


        return _extends({}, contextValue, {
          subscription: subscription
        });
      }, [didStoreComeFromProps, contextValue, subscription]); // We need to force this wrapper component to re-render whenever a Redux store update
      // causes a change to the calculated child component props (or we caught an error in mapState)

      var _useReducer = useReducer(storeStateUpdatesReducer, EMPTY_ARRAY, initStateUpdates),
          _useReducer$ = _useReducer[0],
          previousStateUpdateResult = _useReducer$[0],
          forceComponentUpdateDispatch = _useReducer[1]; // Propagate any mapState/mapDispatch errors upwards


      if (previousStateUpdateResult && previousStateUpdateResult.error) {
        throw previousStateUpdateResult.error;
      } // Set up refs to coordinate values between the subscription effect and the render logic


      var lastChildProps = useRef();
      var lastWrapperProps = useRef(wrapperProps);
      var childPropsFromStoreUpdate = useRef();
      var renderIsScheduled = useRef(false);
      var actualChildProps = usePureOnlyMemo(function () {
        // Tricky logic here:
        // - This render may have been triggered by a Redux store update that produced new child props
        // - However, we may have gotten new wrapper props after that
        // If we have new child props, and the same wrapper props, we know we should use the new child props as-is.
        // But, if we have new wrapper props, those might change the child props, so we have to recalculate things.
        // So, we'll use the child props from store update only if the wrapper props are the same as last time.
        if (childPropsFromStoreUpdate.current && wrapperProps === lastWrapperProps.current) {
          return childPropsFromStoreUpdate.current;
        } // TODO We're reading the store directly in render() here. Bad idea?
        // This will likely cause Bad Things (TM) to happen in Concurrent Mode.
        // Note that we do this because on renders _not_ caused by store updates, we need the latest store state
        // to determine what the child props should be.


        return childPropsSelector(store.getState(), wrapperProps);
      }, [store, previousStateUpdateResult, wrapperProps]); // We need this to execute synchronously every time we re-render. However, React warns
      // about useLayoutEffect in SSR, so we try to detect environment and fall back to
      // just useEffect instead to avoid the warning, since neither will run anyway.

      useIsomorphicLayoutEffect(function () {
        // We want to capture the wrapper props and child props we used for later comparisons
        lastWrapperProps.current = wrapperProps;
        lastChildProps.current = actualChildProps;
        renderIsScheduled.current = false; // If the render was from a store update, clear out that reference and cascade the subscriber update

        if (childPropsFromStoreUpdate.current) {
          childPropsFromStoreUpdate.current = null;
          notifyNestedSubs();
        }
      }); // Our re-subscribe logic only runs when the store/subscription setup changes

      useIsomorphicLayoutEffect(function () {
        // If we're not subscribed to the store, nothing to do here
        if (!shouldHandleStateChanges) return; // Capture values for checking if and when this component unmounts

        var didUnsubscribe = false;
        var lastThrownError = null; // We'll run this callback every time a store subscription update propagates to this component

        var checkForUpdates = function checkForUpdates() {
          if (didUnsubscribe) {
            // Don't run stale listeners.
            // Redux doesn't guarantee unsubscriptions happen until next dispatch.
            return;
          }

          var latestStoreState = store.getState();
          var newChildProps, error;

          try {
            // Actually run the selector with the most recent store state and wrapper props
            // to determine what the child props should be
            newChildProps = childPropsSelector(latestStoreState, lastWrapperProps.current);
          } catch (e) {
            error = e;
            lastThrownError = e;
          }

          if (!error) {
            lastThrownError = null;
          } // If the child props haven't changed, nothing to do here - cascade the subscription update


          if (newChildProps === lastChildProps.current) {
            if (!renderIsScheduled.current) {
              notifyNestedSubs();
            }
          } else {
            // Save references to the new child props.  Note that we track the "child props from store update"
            // as a ref instead of a useState/useReducer because we need a way to determine if that value has
            // been processed.  If this went into useState/useReducer, we couldn't clear out the value without
            // forcing another re-render, which we don't want.
            lastChildProps.current = newChildProps;
            childPropsFromStoreUpdate.current = newChildProps;
            renderIsScheduled.current = true; // If the child props _did_ change (or we caught an error), this wrapper component needs to re-render

            forceComponentUpdateDispatch({
              type: 'STORE_UPDATED',
              payload: {
                latestStoreState: latestStoreState,
                error: error
              }
            });
          }
        }; // Actually subscribe to the nearest connected ancestor (or store)


        subscription.onStateChange = checkForUpdates;
        subscription.trySubscribe(); // Pull data from the store after first render in case the store has
        // changed since we began.

        checkForUpdates();

        var unsubscribeWrapper = function unsubscribeWrapper() {
          didUnsubscribe = true;
          subscription.tryUnsubscribe();

          if (lastThrownError) {
            // It's possible that we caught an error due to a bad mapState function, but the
            // parent re-rendered without this component and we're about to unmount.
            // This shouldn't happen as long as we do top-down subscriptions correctly, but
            // if we ever do those wrong, this throw will surface the error in our tests.
            // In that case, throw the error from here so it doesn't get lost.
            throw lastThrownError;
          }
        };

        return unsubscribeWrapper;
      }, [store, subscription, childPropsSelector]); // Now that all that's done, we can finally try to actually render the child component.
      // We memoize the elements for the rendered child component as an optimization.

      var renderedWrappedComponent = useMemo(function () {
        return React.createElement(WrappedComponent, _extends({}, actualChildProps, {
          ref: forwardedRef
        }));
      }, [forwardedRef, WrappedComponent, actualChildProps]); // If React sees the exact same element reference as last time, it bails out of re-rendering
      // that child, same as if it was wrapped in React.memo() or returned false from shouldComponentUpdate.

      var renderedChild = useMemo(function () {
        if (shouldHandleStateChanges) {
          // If this component is subscribed to store updates, we need to pass its own
          // subscription instance down to our descendants. That means rendering the same
          // Context instance, and putting a different value into the context.
          return React.createElement(ContextToUse.Provider, {
            value: overriddenContextValue
          }, renderedWrappedComponent);
        }

        return renderedWrappedComponent;
      }, [ContextToUse, renderedWrappedComponent, overriddenContextValue]);
      return renderedChild;
    } // If we're in "pure" mode, ensure our wrapper component only re-renders when incoming props have changed.


    var Connect = pure ? React.memo(ConnectFunction) : ConnectFunction;
    Connect.WrappedComponent = WrappedComponent;
    Connect.displayName = displayName;

    if (forwardRef) {
      var forwarded = React.forwardRef(function forwardConnectRef(props, ref) {
        return React.createElement(Connect, _extends({}, props, {
          forwardedRef: ref
        }));
      });
      forwarded.displayName = displayName;
      forwarded.WrappedComponent = WrappedComponent;
      return hoistStatics(forwarded, WrappedComponent);
    }

    return hoistStatics(Connect, WrappedComponent);
  };
}
```

上面 connectAdvanced 代码比较复杂， 我们来简单过一下里面做了什么事。
`return function wrapWithConnect(WrappedComponent){}` 其返回的是一个函数，接收的参数是 component ， 符合 connect()() 的使用。

wrapWithConnect 需要返回封装后的组件， 所以返回的应该是一个 component , 下面是返回相关的代码。
```js
if (forwardRef) {
  var forwarded = React.forwardRef(function forwardConnectRef(props, ref) {
    return React.createElement(Connect, _extends({}, props, {
      forwardedRef: ref
    }));
  });
  forwarded.displayName = displayName;
  forwarded.WrappedComponent = WrappedComponent;
  return hoistStatics(forwarded, WrappedComponent);
}

return hoistStatics(Connect, WrappedComponent);
```
forwardRef 默认是 false， 我们关注 `hoistStatics(Connect, WrappedComponent)` 即可， hoistStatics 的作用看了下源码会将 WrappedComponent 的某些属性添加到 Connect 的组件中， 但是源码中的判断条件没看懂， 理解其功能即可。

接下来看看 Connect 组件是怎么来的， 相关代码如下
```js
var Connect = pure ? React.memo(ConnectFunction) : ConnectFunction;
Connect.WrappedComponent = WrappedComponent;
Connect.displayName = displayName;
```
pure 默认是 true , React.memo 自己去官网看看什么作用， 主要是用来做性能优化的， 我们直接看 ConnectFunction 里面的代码， 这里也是 connectAdvanced 最主要的代码。
```js
function ConnectFunction(props) {
  var _useMemo = useMemo(function () {
    var forwardedRef = props.forwardedRef,
        wrapperProps = _objectWithoutPropertiesLoose(props, ["forwardedRef"]);

    return [props.context, forwardedRef, wrapperProps];
  }, [props]),
      propsContext = _useMemo[0],
      forwardedRef = _useMemo[1],
      wrapperProps = _useMemo[2];

  var ContextToUse = useMemo(function () {
    return propsContext && propsContext.Consumer && isContextConsumer(React.createElement(propsContext.Consumer, null)) ? propsContext : Context;
  }, [propsContext, Context]); // Retrieve the store and ancestor subscription via context, if available

  var contextValue = useContext(ContextToUse); // The store _must_ exist as either a prop or in context

  var didStoreComeFromProps = Boolean(props.store);
  var didStoreComeFromContext = Boolean(contextValue) && Boolean(contextValue.store);
  var store = props.store || contextValue.store;
  var childPropsSelector = useMemo(function () {
    // The child props selector needs the store reference as an input.
    // Re-create this selector whenever the store changes.
    return createChildSelector(store);
  }, [store]);

  var _useMemo2 = useMemo(function () {
    if (!shouldHandleStateChanges) return NO_SUBSCRIPTION_ARRAY; // This Subscription's source should match where store came from: props vs. context. A component

    var subscription = new Subscription(store, didStoreComeFromProps ? null : contextValue.subscription); 

    var notifyNestedSubs = subscription.notifyNestedSubs.bind(subscription);
    return [subscription, notifyNestedSubs];
  }, [store, didStoreComeFromProps, contextValue]),
      subscription = _useMemo2[0],
      notifyNestedSubs = _useMemo2[1]; // Determine what {store, subscription} value should be put into nested context, if necessary,
  // and memoize that value to avoid unnecessary context updates.


  var overriddenContextValue = useMemo(function () {
    if (didStoreComeFromProps) {
      return contextValue;
    } // Otherwise, put this component's subscription instance into context, so that


    return _extends({}, contextValue, {
      subscription: subscription
    });
  }, [didStoreComeFromProps, contextValue, subscription]); // We need to force this wrapper component to re-render whenever a Redux store update

  var _useReducer = useReducer(storeStateUpdatesReducer, EMPTY_ARRAY, initStateUpdates),
      _useReducer$ = _useReducer[0],
      previousStateUpdateResult = _useReducer$[0],
      forceComponentUpdateDispatch = _useReducer[1]; // Propagate any mapState/mapDispatch errors upwards


  if (previousStateUpdateResult && previousStateUpdateResult.error) {
    throw previousStateUpdateResult.error;
  } // Set up refs to coordinate values between the subscription effect and the render logic


  var lastChildProps = useRef();
  var lastWrapperProps = useRef(wrapperProps);
  var childPropsFromStoreUpdate = useRef();
  var renderIsScheduled = useRef(false);
  var actualChildProps = usePureOnlyMemo(function () {
    if (childPropsFromStoreUpdate.current && wrapperProps === lastWrapperProps.current) {
      return childPropsFromStoreUpdate.current;
    } 
    return childPropsSelector(store.getState(), wrapperProps);
  }, [store, previousStateUpdateResult, wrapperProps]); 
  useIsomorphicLayoutEffect(function () {
    lastWrapperProps.current = wrapperProps;
    lastChildProps.current = actualChildProps;
    renderIsScheduled.current = false; 

    if (childPropsFromStoreUpdate.current) {
      childPropsFromStoreUpdate.current = null;
      notifyNestedSubs();
    }
  }); // Our re-subscribe logic only runs when the store/subscription setup changes

  useIsomorphicLayoutEffect(function () {
    if (!shouldHandleStateChanges) return; // Capture values for checking if and when this component unmounts

    var didUnsubscribe = false;
    var lastThrownError = null; // We'll run this callback every time a store subscription update propagates to this component

    var checkForUpdates = function checkForUpdates() {
      if (didUnsubscribe) {
        return;
      }

      var latestStoreState = store.getState();
      var newChildProps, error;

      try {
        newChildProps = childPropsSelector(latestStoreState, lastWrapperProps.current);
      } catch (e) {
        error = e;
        lastThrownError = e;
      }

      if (!error) {
        lastThrownError = null;
      } // If the child props haven't changed, nothing to do here - cascade the subscription update


      if (newChildProps === lastChildProps.current) {
        if (!renderIsScheduled.current) {
          notifyNestedSubs();
        }
      } else {
        lastChildProps.current = newChildProps;
        childPropsFromStoreUpdate.current = newChildProps;
        renderIsScheduled.current = true; // If the child props _did_ change (or we caught an error), this wrapper component needs to re-render

        forceComponentUpdateDispatch({
          type: 'STORE_UPDATED',
          payload: {
            latestStoreState: latestStoreState,
            error: error
          }
        });
      }
    }; // Actually subscribe to the nearest connected ancestor (or store)


    subscription.onStateChange = checkForUpdates;
    subscription.trySubscribe(); // Pull data from the store after first render in case the store has

    checkForUpdates();

    var unsubscribeWrapper = function unsubscribeWrapper() {
      didUnsubscribe = true;
      subscription.tryUnsubscribe();

      if (lastThrownError) {
        throw lastThrownError;
      }
    };

    return unsubscribeWrapper;
  }, [store, subscription, childPropsSelector]); // Now that all that's done, we can finally try to actually render the child component.

  var renderedWrappedComponent = useMemo(function () {
    return React.createElement(WrappedComponent, _extends({}, actualChildProps, {
      ref: forwardedRef
    }));
  }, [forwardedRef, WrappedComponent, actualChildProps]); // If React sees the exact same element reference as last time, it bails out of re-rendering

  var renderedChild = useMemo(function () {
    if (shouldHandleStateChanges) {
      return React.createElement(ContextToUse.Provider, {
        value: overriddenContextValue
      }, renderedWrappedComponent);
    }

    return renderedWrappedComponent;
  }, [ContextToUse, renderedWrappedComponent, overriddenContextValue]);
  return renderedChild;
} // If we're in "pure" mode, ensure our wrapper component only re-renders when incoming props have changed.
```
从上面看到， react-redux 使用了 useMemo 做了比较多的性能优化， 对于 hooks 不了解的同学需要先学习一下相关知识可能才能看懂。 我们下面拆分解析一下，
首先 connectAdvanced 返回的应该是一个 component, 代码中返回的是 `renderedChild`, 我们看下 renderedChild 中代码
```js
var renderedChild = useMemo(function () {
  if (shouldHandleStateChanges) {
    return React.createElement(ContextToUse.Provider, {
      value: overriddenContextValue
    }, renderedWrappedComponent);
  }

  return renderedWrappedComponent;
}, [ContextToUse, renderedWrappedComponent, overriddenContextValue]);
return renderedChild;
```
renderedChild 对`ContextToUse, renderedWrappedComponent, overriddenContextValue` 这三个变量做了对比 ， 返回的是 Context 组件，children 是 renderedWrappedComponent ， 传入的 value 是 overriddenContextValue(store,subscription) , 这三个变量都很清晰， renderedWrappedComponent 里面现在应该接受了 mapStateToProps, mapDispatchToProps 等传入的 state ， 我们看看 renderedWrappedComponent 的实现。
```js
var renderedWrappedComponent = useMemo(function () {
  return React.createElement(WrappedComponent, _extends({}, actualChildProps, {
    ref: forwardedRef
  }));
}, [forwardedRef, WrappedComponent, actualChildProps]);
```

```js
var actualChildProps = usePureOnlyMemo(function () {
  if (childPropsFromStoreUpdate.current && wrapperProps === lastWrapperProps.current) {
    return childPropsFromStoreUpdate.current;
  } 
  return childPropsSelector(store.getState(), wrapperProps);
}, [store, previousStateUpdateResult, wrapperProps]);


var childPropsSelector = useMemo(function () {
  return createChildSelector(store);
}, [store]);

function createChildSelector(store) {
  return selectorFactory(store.dispatch, selectorFactoryOptions);
} 
```
上面兜兜转转到了 selectorFactory.js 的文件中， 具体分析看 selectorFactory 中的分析。 
不管上面多么绕，我们所需要知道的就是 selectorFactory 中最后应该返回的就是往 wrappedComponent 中注入的 props ， 应该包括 wrapperComponent 本身所传入的 props , mapStateToProps，mapDispatchToProps等 connect 方法中所传入的对象， 还有就是 store.dispatch 。