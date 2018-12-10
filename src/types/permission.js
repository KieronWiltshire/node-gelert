'use strict';

import uuidv4 from 'uuid/v4';

export default class Permission {

  /**
   * Create a new instance of {Permission}.
   *
   * @param {any} id
   * @param {any} context
   */
  constructor({ id, context }) {
    this.id = id;
    this.context = context;

    if (!this.id) {
      this.id = uuidv4();
    }

    if (!this.context) {
      throw new Error('Unable to create a permission without a context');
    }
  }

  /**
   * Check if a value is equal to the permission.
   *
   * @param {Permission} value
   * @returns {boolean} true if they are the same
   */
  equals(value) {
    if (value instanceof Permission) {
      return (this.id === value.id || this.context === value.context);
    } else {
      return ((typeof value === 'string' || typeof value === 'number') && (this.id === value || this.context === value))
    }
  }

}
