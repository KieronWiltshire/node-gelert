'use strict';

export default class Permission {

  /**
   * Create a new instance of {Permission}.
   *
   * @param {string} value
   */
  constructor(value) {
    if (typeof value === 'string') {
      this._value = value;

      if (this.isNegated()) {
        while (value.charAt(0) === '-') {
          value = value.substr(1);
        }

        this._value = '-' + value;
      }
    } else {
      throw new Error('The specified value must be of type string');
    }

    if (!this._value) {
      throw new Error('Unable to create a permission without a value');
    }
  }

  /**
   * Retrieve the permission value.
   *
   * @returns {string}
   */
  getValue() {
    return this._value;
  }

  /**
   * Check if the permission value of the class is negated.
   *
   * @returns {boolean} true if the specified value if negated
   */
  isNegated() {
    return (this.getValue().charAt(0) === '-');
  }

  /**
   * Retrieve the permission value.
   *
   * @returns {string}
   */
  getPositiveValue() {
    return (this.isNegated() ? this.getValue().substr(1) : this.getValue());
  }

  /**
   * Retrieve the negated value.
   *
   * @returns {string}
   */
  getNegatedValue() {
    return (this.isNegated() ? this.getValue() : ('-' + this.getValue()))
  }

  /**
   * Check if a value is a super of the specified permission.
   *
   * @param {Permission} permission
   * @returns {boolean} true if the specified value if greater than the permission instance value
   */
  isSuper(permission) {
    if (typeof permission !== 'string') {
      if (permission instanceof Permission) {
        permission = permission.getValue();
      } else {
        throw new Error('The specified value must be an instance of {Permission}');
      }
    }

    if (typeof permission === 'string') {
      let a = this.getValue().split('.');
      let b = permission.split('.');

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
   * Check if a value is equal to the permission.
   *
   * @param {Permission} permission
   * @returns {boolean} true if they are the same
   */
  equals(permission) {
    if (permission instanceof Permission) {
      return (this.getValue() === permission.getValue());
    } else {
      return (typeof permission === 'string' && this.getValue() === permission)
    }
  }

}
