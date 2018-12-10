'use strict';

import uuidv4 from 'uuid/v4';
import Permission from './permission';

export default class Guard {

  /**
   * Create a new instance of {Guard}.
   *
   * @param {any} id This should be the unique id of the guard
   * @param {string} type This should be the type of the guard
  */
  constructor({ id, type }) {
    this._id = id;
    this._type = type;
    this._guards = [];

    if (!this.id) {
      this.id = uuidv4();
    }

    if (!this.context) {
      throw new Error('Unable to create a guard without specifying it\'s type');
    }
  }

  /**
   * Retrieve all of the permissions.
   *
   * @returns {Array}
   */
  guards() {
    return _.clone(this._guards);
  }

  /**
   * Add a guard to inherit from.
   *
   * @param {Guard} guard
   * @returns {boolean} true if the guard was added successfully
   */
  addGuard(value) {
    if (!this.doesInherit(guard)) {
      if (!(guard instanceof Guard)) {
        throw new Error('The Object must be an instance of {Guard}');
      }

      this._guards.push(guard);

      return true;
    } else {
      throw new Error('The instance is already part of the inheritance tree');
    }
  }

  /**
   * Remove a guard that's being inherited.
   *
   * @param {Guard} guard
   * @returns {boolean} true if the role was removed successfully
   */
  removeGuard(guard) {
    if (this.containsGuard(guard)) {
      for (let i = 0; i < this._guards.length; i++) {
        if (this._guards[i].equals(guard)) {
          this._guards.splice(this._guards.indexOf(guard), 1);
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Contains a inherited guard.
   *
   * @param {Guard} guard
   * @returns {boolean} true if the instance contains the role
   * @throws {Error} if the parameter is not an instance of {Guard}
   */
  containsGuard(guard) {
    for (let i = 0; i < this._guards.length; i++) {
      if (this._guards[i].equals(guard)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if the specified guard is already inherited.
   *
   * @param {Guard} guard
   * @returns {boolean} true if the guard is already inherited
   */
  doesInherit(guard) {
    let hasChild = this.containsGuard(guard);
    if (!hasChild) {
      this._guards.forEach(function(r) {
        if (r.doesInherit(guard)) {
          hasChild = true;
          return;
        }
      });
    }
    return hasChild || (this === guard);
  }

  /**
   * Check if the guard has a permission.
   *
   * @param {Permission|string|number} value
   * @returns {boolean} true if permission is granted
   */
  hasPermission(value) {
    let hasPermission = super.hasPermission(value);
    if (!hasPermission) {
      this._guards.forEach(function(r) {
        if (r.hasPermission(value)) {
          hasPermission = true;
          return;
        }
      });
    }
    return hasPermission;
  }

  /**
   * Check if a value is equal to the role.
   *
   * @param {Role} value
   * @returns {boolean} true if they are the same
   */
  equals(value) {
    if (value instanceof Guard) {
      return (this.id === value.id || this.name === value.name);
    } else {
      return ((typeof value === 'string' || typeof value === 'number') && (this.id === value || this.name === value))
    }
  }

}
