'use strict';

import uuidv4 from 'uuid/v4';

export default class Permission {

  /**
   * Create a new instance of {Permission}.
   *
   * @param {any} id
   * @param {any} context
   */
  constructor(value) {
    this.value = value

    if (!this.value) {
      throw new Error('Unable to create a permission without a value');
    }
  }

  /**
   * Retrieve the permission value.
   *
   * @returns {string|number}
   */
  getValue() {
    return this.value;
  }

  /**
   * Check if a value is greater than the permission instance value.
   *
   * @param {Permission} permission
   * @returns {boolean} true if the specified value if greater than the permission instance value
   */
  greaterThan(permission) {
    // TODO:
  }

  /**
   * Check if a value is less than the permission instance value.
   *
   * @param {Permission} permission
   * @returns {boolean} true if the specified value if less than the permission instance value
   */
  lessThan(permission) {
    // TODO:
  }

  /**
   * Check if a value is equal to the permission.
   *
   * @param {Permission} permission
   * @returns {boolean} true if they are the same
   */
  equals(permission) {
    if (permission instanceof Permission) {
      return (this.value === permission.value);
    } else {
      return ((typeof permission === 'string' || typeof permission === 'number') && (this.value === permission))
    }
  }

}
