/**
 * Creates an interactor unit
 *
 * @param {Function} performer
 * @result {Function}
 */
module.exports = function(performer) {
  // initialize hooks
  var beforeHooks = [];
  var afterHooks = [];
  var aroundHooks = [];

  /**
   * Interactor Caller for context
   *
   * It runs the performer and hooks against a defined context
   * that can be modified by the performer or any hook
   *
   * @param {Object} context
   * @return {Object}
   */
  var interactorCaller = function(context) {
    // if context has failure we dont execute it
    if (context.failure) {
      return context;
    }

    // create a fail method and inject the context with it
    // also delete any success variable that could have
    var fail = function(options) {
      Object.assign(this, options || {}, { failure: true });
    };
    var data = { context: Object.assign(context, { fail: fail }) };
    delete data.context.success;

    // create a runner function for performer and hooks
    // so it actually run the performer only once regarding
    // any number of around hooks applied
    var run = function(hooks) {
      var hook = hooks.pop();
      var runner = null;

      if (hooks.length == 0) {
        // if there is no more around hooks we run
        // any before hooks, the performer and after hooks
        runner = function() {
          beforeHooks.forEach(function(hook) {
            hook.apply(data);
          });
          performer.apply(data);
          afterHooks.reverse().forEach(function(hook) {
            hook.apply(data);
          });
        };
      } else {
        // we run the around hook until there is non
        runner = function() {
          run(hooks);
        };
      }

      // if there is no aroundHook defined we run runner directly
      hook ? hook.call(data, runner) : runner();
    };

    // run the hooks if any and the performer
    run(aroundHooks);

    // if context didn't fail we set success to true
    if (!data.context.failure) {
      data.context.success = true;
    }

    // delete the extra fail method in context before returning
    delete data.context.fail;
    return data.context;
  };

  // set interactor identity (for organizer)
  interactorCaller.isInteractor = true;

  // set hooks methods to add hooks
  interactorCaller.before = function(hook) {
    beforeHooks.push(hook);
  };
  interactorCaller.after = function(hook) {
    afterHooks.push(hook);
  };
  interactorCaller.around = function(hook) {
    aroundHooks.push(hook);
  };

  return interactorCaller;
};
