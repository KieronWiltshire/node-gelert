'use strict';

import _ from 'lodash';
import Permissible from './permissible';
import uuidv4 from 'uuid/v4';
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
export const inheritanceMustBeArray = new ErrorCode('inheritance_must_be_array', { message: 'The constructor was passed a `inheritance` value that wasn\'t an instance of Array' });
export const arrayContainsNonRoles = new ErrorCode('contains_non_role_instances', { message: 'The specified array contains elements which are not instances of Role' });
export const cannotInheritSelf = new ErrorCode('cannot_inherit_self', { message: 'A role cannot inherit itself' });

export default class Role extends Permissible {

  /**
   * Create a new role instance.
   *
   * @param {object} params
   * @param {object} storage
   * @param {Gelert} gelert
   */
  constructor(params, storage) {
    super(params, gelert);
    const self = this;
    const valid = Role.role_ValidateParameters(params);

    this._storageStrategy = storage;

    Object.keys(valid).forEach(function(p) {
      // Disallow overwritting reserved parameters
      switch (p.toLowerCase()) {
        case 'inheritance':
        case 'permissions':
          return;
        default:
          self[p] = valid[p];
      }
    });

    if (!this.id) {
      this.id = uuidv4();
    }

    this.inheritance = [];

    valid.inheritance.forEach(function(r) {
      self.addInheritance(r);
    });
  }

  /**
   * Validate the parameters supplied.
   *
   * @param {object} params
   * @returns {object} params if valid
   * @throws {GelertError} if params are invalid
   */
  static role_ValidateParameters(params) {  
    if (typeof params === 'object') {
      if (params.inheritance) {
        if (params.inheritance instanceof Array) {
          return params;
        } else {
          throw new GelertError().push(inheritanceMustBeArray);
        }
      } else {
        return _.extend(params, { inheritance: [] });
      }
    } else {
      return { inheritance: [] };
    }
  }

  /**
   * Save the role.
   *
   * @returns {boolean} true if the role was saved successfully
   */
  async save() {
    try {
      let result = await this._storageStrategy.saveRole(this);

      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Delete the role.
   *
   * @returns {boolean} true if the permission was saved successfully
   */
  async delete() {
    try {
      let result = await this._storageStrategy.deleteRole(this);

      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Retrieve all of the permissions.
   *
   * @returns {Array}
   */
  get inheritance() {
    return _.clone(this._inheritance);
  }

  /**
   * Set the inheritance.
   *
   * @throws {GelertError} if the roles specified is not an instance of {Array}
   * @throws {GelertError} if the roles array contains non {Role} instances
   */
  set inheritance(value) {
    if (!(value instanceof Array)) {
      throw new GelertError().push(operationNotAllowed);
    } else {
      for (let i = 0; i < value.length; i++) {
        if (!(value[i] instanceof Role)) {
          throw new GelertError().push(arrayContainsNonRoles);
        }
      }
      this._inheritance = value;
    }
  }

  /**
   * Add a role to inherit from.
   *
   * @param {Role} value
   * @returns {boolean} true if the role was added successfully
   */
  addInheritance(value) {
    if (!this.doesInherit(value)) {
      if (!(value instanceof Role)) {
        throw new GelertError().push(unsupportedInstance);
      }

      this._inheritance.push(value);
      return true;
    } else {
      throw new GelertError().push(cannotInheritSelf);
    }
  }

  /**
   * Removes a role that's being inherited.
   *
   * @param {Role} value
   * @returns {boolean} true if the role was removed successfully
   */
  removeInheritance(value) {
    if (this.containsInheritance(value)) {
      for (let i = 0; i < this._inheritance.length; i++) {
        if (this._inheritance[i].equals(value)) {
          this._inheritance.splice(this._inheritance.indexOf(value), 1);
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Contains a inherited role.
   *
   * @param {Role} value
   * @returns {boolean} true if the instance contains the role
   * @throws {GelertError} if the parameter is not an instance of {Role}
   */
  containsInheritance(value) {
    for (let i = 0; i < this._inheritance.length; i++) {
      if (this._inheritance[i].equals(value)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if the role already inherits a role.
   *
   * @param {Role} value
   * @returns {boolean} true if the role is already inherited
   */
  doesInherit(value) {
    let hasChild = this.containsInheritance(value);
    if (!hasChild) {
      this.inheritance.forEach(function(r) {
        if (r.doesInherit(value)) {
          hasChild = true;
          return;
        }
      });
    }
    return hasChild || (this === value);
  }

  /**
   * Check if the permissible has permission.
   *
   * @param {Permission|string|number} value
   * @returns {boolean} true if permission is granted
   */
  hasPermission(value) {
    let hasPermission = super.hasPermission(value);
    if (!hasPermission) {
      this.inheritance.forEach(function(r) {
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
    if (value instanceof Role) {
      return (this.id === value.id || this.name === value.name);
    } else {
      return ((typeof value === 'string' || typeof value === 'number') && (this.id === value || this.name === value))
    }
  }

}
