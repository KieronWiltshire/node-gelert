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
    this._permissions = [];

    if (!this.id) {
      this.id = uuidv4();
    }

    if (!this.type) {
      throw new Error('Unable to create a guard without specifying it\'s type');
    }
  }

  /**
   * Retrieve all of the guards from within the inheritance tree.
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
   * @throws {Error} if the specified object is not an instance of {Guard}
   */
  addGuard(guard) {
    if (this.containsGuard(guard)) {
      return true;
    }

    if (!(guard instanceof Guard)) {
      throw new Error('The specified argument must be an instance of {Guard}');
    }

    this._guards.push(guard);

    return this.containsGuard(guard);
  }

  /**
   * Remove a guard that's being inherited.
   *
   * @param {Guard} guard
   * @returns {boolean} true if the guard was removed successfully
   */
  removeGuard(guard) {
    if (this.containsGuard(guard)) {
      for (let i = 0; i < this._guards.length; i++) {
        if (this._guards[i] === guard) {
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
   * @returns {boolean} true if the Object contains an instance of the specified guard
   */
  containsGuard(guard) {
    for (let i = 0; i < this._guards.length; i++) {
      if (this._guards[i] === guard) {
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
      for (let i = 0; i < this._guards.length; i++) {
        if (this._guards[i].doesInherit(guard)) {
          return true;
        }
      }
    }
    return hasChild || (this === guard);
  }

  /**
   * Retrieve all of the permissions.
   *
   * @returns {Array}
   */
  permissions() {
    return _.clone(this._permissions);
  }

  /**
   * Add a permission to the guard.
   *
   * @param {Permission} permission
   * @returns {boolean} true if the permission was added successfully
   * @throws {Error} if the specified object is not an instance of {Permission}
   */
  addPermission(permission) {
    if (this.containsPermission(permission)) {
      return true;
    }

    if (!(permission instanceof Permission)) {
      throw new Error('The specified argument must be an instance of {Permission}');
    }

    this._permissions.push(permission);

    return this.containsPermission(permission);
  }

  /**
   * Remove a permission from the guard.
   *
   * @param {Permission} permission
   * @returns {boolean} true if the permission was removed successfully
   */
  removePermission(permission) {
    if (this.containsPermission(permission)) {
      for (let i = 0; i < this._permissions.length; i++) {
        if (this._permissions[i].equals(permission)) {
          this._permissions.splice(this._permissions.indexOf(guard), 1);
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Contains a permission.
   *
   * @param {Permission} permission
   * @returns {boolean} true if the Object contains an instance of the specified permission
   */
  containsPermission(permission) {
    for (let i = 0; i < this._permissions.length; i++) {
      if (this._permissions[i].equals(permission)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if the guard has a permission.
   *
   * @param {Permission|string|number} value
   * @returns {boolean} true if permission is granted
   */
  hasPermission(value) {
    for (let i = 0; i < this._permissions.length; i++) {
      // TODO:

      // if (this._permissions[i].equals(value)) {
      //   return true;
      // }
    }

    for (let i = 0; i < this._guards.length; i++) {
      // TODO:

      // if (this._guards[i].hasPermission(value)) {
      //   return true;
      // }
    }

    return false;
  }

}
