/**
 * Creates an organizer of interactors
 *
 * @param {interactors...} interactors
 * @return {Function}
 */
module.exports = function() {
  // get all arguments as an array of interactors
  var interactors = Array.prototype.slice.call(arguments);

  // validate that all arguments are only interactors
  interactors.forEach(function(caller) {
    if (!caller.isInteractor) {
      throw 'use only interactors';
    }
  });

  /**
   * organizerCaller is the funciton returned by
   * the organizer that will receive a context and
   * pass it to the interactors defined, one by one
   *
   * @param {Object} context
   * @return {Object}
   */
  return function organizerCaller(context) {
    return interactors.reduce(function(new_context, caller) {
      return caller(new_context);
    }, context);
  };
};
