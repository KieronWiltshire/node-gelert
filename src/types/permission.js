'use strict';

import uuidv4 from 'uuid/v4';
import {
  GelertError,
  ErrorCode
} from '../errors';

/**
 * Error codes.
 */
export const nameMustExist = new ErrorCode('name_must_exist', { message: 'A permission value must have a name' });
export const nameMustBeString = new ErrorCode('name_must_be_string', { message: 'The specified name is not of type string' });
export const parametersMustBeObject = new ErrorCode('parameters_must_be_object', { message: 'Parameters must be specified and wrapped in an object' });

export default class Permission {

  /**
   * Create a new permission instance.
   *
   * @param {object} params
   */
  constructor(params, storage) {
    const self = this;
    const valid = Permission.permission_ValidateParameters(params);

    this._storageStrategy = storage;

    Object.keys(valid).forEach(function(p) {
      self[p] = valid[p];
    });

    if (!this.id) {
      this.id = uuidv4();
    }
  }

  /**
   * Validate the parameters supplied.
   *
   * @param {object} params
   * @returns {object} params if valid
   * @throws {GelertError} if params are invalid
   */
  static permission_ValidateParameters(params) {
    if (typeof params === 'object') {
      if (params.name) {
        if (typeof params.name !== 'string') {
          throw new GelertError().push(nameMustBeString);
        }
      } else {
        throw new GelertError().push(nameMustExist);
      }

      return params;
    } else {
      throw new GelertError().push(parametersMustBeObject);
    }
  }

  /**
   * Save the permission.
   *
   * @returns {boolean} true if the permission was saved successfully
   */
  async save() {
    try {
      let result = await this._storageStrategy.savePermission(this);

      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Delete the permission.
   *
   * @returns {boolean} true if the permission was saved successfully
   */
  async delete() {
    try {          
      let result = await this._storageStrategy.deletePermission(this);

      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
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
      return (this.id === value.id || this.name === value.name);
    } else {
      return ((typeof value === 'string' || typeof value === 'number') && (this.id === value || this.name === value))
    }
  }
 
}
