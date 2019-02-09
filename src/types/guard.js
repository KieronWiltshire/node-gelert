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

    if (!this._id) {
      this._id = uuidv4();
    }

    if (!this._type) {
      throw new Error('Unable to create a guard without specifying it\'s type');
    }

    if (typeof this._type !== 'string') {
      throw new Error('The specified type must be a string');
    }
  }

  /**
   * Retrieve the guard identifier.
   *
   * @return {any}
   */
  getId() {
    return this._id;
  }

  /**
   * Retrieve the guard type.
   *
   * @return {string}
   */
  getType() {
    return this._type;
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
          this._guards.splice(i, 1);
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
          this._permissions.splice(i, 1);
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
   * This method trickles down it's inheritence and priorities
   * the higher assigned permission.
   *
   * @param {Permission} permission
   * @returns {boolean} true if permission is granted
   */
  hasPermission(permission) {
    if (!(permission instanceof Permission)) {
      if (typeof permission !== 'string') {
        throw new Error('The specified value must be an instance of {Permission} or of type "string"');
      } else {
        permission = new Permission(permission);
      }
    }

    let can = false;

    for (let i = 0; i < this._guards.length; i++) {
      if (this._guards[i].hasPermission(permission)) {
        can = true;
        break;
      }
    }

    for (let i = 0; i < this._permissions.length; i++) {
      let p = this._permissions[i];

      if (p.isNegated() && permission.getNegativeValue(p)) {
        return false;
      }

      if (p.equals(permission.getValue()) || p.isSuper(permission)) {
        can = true;
      }
    }

    return can;
  }

}
