'use strict';

export default class Permission {

  /**
   * Create a new instance of {Permission}.
   *
   * @param {string} value
   */
  constructor(value) {
    if (typeof value === 'string') {
      this.value = value;
    } else {
      throw new Error('The specified value must be of type string');
    }

    if (!this.value) {
      throw new Error('Unable to create a permission without a value');
    }
  }

  /**
   * Retrieve the permission value.
   *
   * @returns {string}
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
    if (permission instanceof Permission) {
      permission = permission.getValue();
    }

    if (typeof permission === 'string') {
      let a = permission.split('.');
      let b = this.getValue().split('.');

      for (let i = 0; i < a.length; i++) {
        if (i < b.length) {
          if (a[i] !== b[i]) {
            if (a[i] === '*') {
              return true;
            }
          }
        } else {
          break;
        }
      }
    }

    return false;
  }

  /**
   * Check if a value is less than the permission instance value.
   *
   * @param {Permission} permission
   * @returns {boolean} true if the specified value if less than the permission instance value
   */
  lessThan(permission) {
    if (permission instanceof Permission) {
      permission = permission.getValue();
    }

    if (typeof permission === 'string') {
      if (this.equals(permission) || this.greaterThan(permission)) {
        if (permission.charAt(0) === '-') {
          return true;
        }
      }
    }

    return false;
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
      return (typeof permission === 'string' && this.value === permission)
    }
  }

}
