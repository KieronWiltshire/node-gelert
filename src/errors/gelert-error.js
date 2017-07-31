'use strict';

import ErrorCode from './error-code';

export default class GelertError extends Error {

  /**
   * Create a base error
   *
   * @returns {object} error
   */
  constructor() {
    super();
    this.type = 'GelertError';
    this.message = super.message;
    this.context = [];

    /**
     * Add some context to the error.
     *
     * @param {Object} e
     */
    this.push = function(e) {
      if (e instanceof ErrorCode) {
        let hasCodeAlready = false;
        for (let i = 0; i < this.context; i++) {
          if (this.context[i].code === e.code) {
            debug('The specified error code has already been supplied');
            debug(e);
            return this;
          }
        }
        this.context.push(e);
      } else {
        throw new Error('You may only pass through {ErrorCode} instances to the error context');
      }
      return this;
    }
  }

}
