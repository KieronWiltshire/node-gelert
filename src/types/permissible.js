'use strict';

import _ from 'lodash';
import Permission from './permission';
import EventEmitter from 'events';
import {
  unsupportedInstance,
  operationNotAllowed
} from '../gelert';
import {
  GelertError,
  ErrorCode
} from '../errors';

/**
 * Error codes.
 */
export const permissionsMustBeArray = new ErrorCode('permissions_must_be_array', { message: 'The constructor was passed a `permission` value that wasn\'t an instance of Array' });
export const arrayContainsNonPermissions = new ErrorCode('contains_non_permission_instances', { message: 'The specified array contains elements which are not instances of Permission' });
export const nameMustExist = new ErrorCode('name_must_exist', { message: 'A permissible must have a name' });
export const nameMustBeString = new ErrorCode('name_must_be_string', { message: 'The specified name is not of type string' });

export default class Permissible extends EventEmitter {

  /**
   * Create a new permissible instance.
   *
   * @param {object} params
   */
  constructor(params) {
    const self = this;
    const valid = Permissible.permissible_ValidateParameters(params);

    this.permissions = [];

    valid.permissions.forEach(function(p) {
      self.addPermission(p);
    });

    EventEmitter.call(this);
  }

  /**
   * Validate the parameters supplied.
   *
   * @param {object} params
   * @returns {object} params if valid
   * @throws {GelertError} if params are invalid
   */
  static permissible_ValidateParameters(params) {
    if (typeof params === 'object') {
      if (params.name) {
        if (typeof params.name !== 'string') {
          throw new GelertError().push(nameMustBeString);
        }
      } else {
        throw new GelertError().push(nameMustExist);
      }

      if (params.permissions) {
        if (!(params.permissions instanceof Array)) {
          throw new GelertError().push(permissionsMustBeArray);
        }
      } else {
        return _.extend(params, { permissions: [] });
      }

    } else {
      return { permissions: [] };
    }
  }

  /**
   * Retrieve all of the permissions.
   *
   * @returns {Array}
   */
  get permissions() {
    return _.clone(this._permissions);
  }

  /**
   * Set the permissions.
   *
   * @throws {GelertError} if the permissions specified is not an instance of {Array}
   * @throws {InvalidArgumentException} if the specified array contains non {Permission} instances
   */
  set permissions(value) {
    if (!(value instanceof Array)) {
      throw new GelertError().push(operationNotAllowed);
    } else {
      for (let i = 0; i < value.length; i++) {
        if (!(value[i] instanceof Permission)) {
          throw new InvalidArgumentException().push(arrayContainsNonPermissions);
        }
      }
      this._permissions = value;
    }
  }

  /**
   * Add a permission.
   *
   * @param {Permission} value
   * @returns {boolean} true if the permission was added successfully
   */
  addPermission(value) {
    if (value instanceof Permission) {
      let self = this;
      value.on('delete', function() {
        self.removePermission(value);
      });
    }

    if (!this.containsPermission(value)) {
      if (!(value instanceof Permission)) {
        throw new InvalidArgumentException().push(unsupportedInstance);
      }
      this._permissions.push(value);
      return true;
    }
    return false;
  }

  /**
   * Removes a permission.
   *
   * @param {Permission} value
   * @returns {boolean} true if the permission was removed successfully
   */
  removePermission(value) {
    if (this.containsPermission(value)) {
      for (let i = 0; i < this._permissions.length; i++) {
        if (this._permissions[i].equals(value)) {
          this._permissions.splice(this._permissions.indexOf(value), 1);
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Contains a permission.
   *
   * @param {Permission} value
   * @returns {boolean} true if the instance contains the permission.
   */
  containsPermission(value) {
    for (let i = 0; i < this._permissions.length; i++) {
      if (this._permissions[i].equals(value)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if the permissible has permission.
   *
   * @param {Permission|string|number} value
   * @returns {boolean} true if permission is granted
   */
  hasPermission(value) {
    return this.containsPermission(value);
  }

}
