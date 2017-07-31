'use strict';

export default class ErrorCode {

  /**
   * Create an ErrorCode instance.
   *
   * @param {string|number} code
   * @param {string} message
   */
  constructor(code, meta) {
    if (typeof code === 'string' || typeof code === 'number') {
      this.code = code;

      if (meta) {
        if (typeof meta === 'object') {
          this.meta = meta;
        } else {
          throw new Error('{meta} must be of type object');
        }
      }
    } else {
      throw new Error('{code} must be of type string or number');
    }
  }

};
