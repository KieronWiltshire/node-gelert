'use strict';

import {default as createDebugger} from 'debug';
import MemoryStorageStrategy from './strategies/memory';
import Role from './types/role';
import Permission from './types/permission';
import {
  GelertError,
  ErrorCode
} from './errors';

const debug = createDebugger('gelert');

/**
 * Error codes.
 */
export const invalidStorageStrategy = new ErrorCode('invalid_storage_strategy', { message: 'The storage strategy specified does not meet the required criteria' });
export const invalidDataStructure = new ErrorCode('invalid_data_structure', { message: 'The storage strategy does not provide a known instance' });
export const unsupportedInstance = new ErrorCode('unsupported_instance', { message: 'Object instance is not supported' });
export const operationNotAllowed = new ErrorCode('operation_not_allowed', { message: 'The operation you are trying to execute is strictly not allowed' });

/**
 * Gelert.
 * Permissions done simply.
 *
 * @author Kieron Wiltshire <kieron.wiltshire@outlook.com>
 */
export default class Gelert {

  /**
   * Create a new gelert instance.
   *
   * @param {object} options
   */
  constructor(options) {
    this.options = Gelert.gelert_ValidateOptions(options);
  }

  /**
   * Validate the options supplied.
   *
   * @param {object} options
   * @returns {object} options if valid
   * @throws {GelertError} if options are invalid
   */
  static gelert_ValidateOptions(options) {
    options = (typeof options === 'object') ? options : {};

    if (!options.storage) {
      options.storage = new MemoryStorageStrategy();
    }

    // Storage strategy validation
    if (typeof options.storage !== 'object') {
      throw new GelertError().push(invalidStorageStrategy);
    }

    return options;
  }

  /**
   * Create a new Role.
   *
   * @param {object} params
   * @return {Role}
   */
  async createRole(params) {
    let r = await this.options.storage.createRole(params);
    if (r instanceof Role) {
      return r;
    } else {
      throw new GelertError().push(invalidDataStructure);
    }
  }

  /**
   * Create a new Permission.
   *
   * @param {object} params
   * @return {Role}
   */
  async createPermission(params) {
    let p = await this.options.storage.createPermission(params);
    if (p instanceof Permission) {
      return p;
    } else {
      throw new GelertError().push(invalidDataStructure);
    }
  }

  /**
   * Retrieve all of the permission roles.
   *
   * @returns {Array}
   */
  async getRoles() {
    try {
      let collection = await this.options.storage.getRoles();
      if (collection) {
        if (!(collection instanceof Array)) {
          throw new GelertError().push(invalidDataStructure);
        }

        for (let i = 0; i < collection.length; i++) {
          let x = collection[i];
          if (x instanceof Role) {
            continue;
          } else {
            throw new GelertError().push(invalidDataStructure);
          }
        }
      }
      return Promise.resolve(collection);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Retrieve a role by it's identifier.
   *
   * @param {string|number} id
   * @returns {Role}
   */
  async getRoleById(id) {
    try {
      let role = await this.options.storage.getRoleById(id);
      if (role) {
        if (role instanceof Role) {
          return role;
        } else {
          throw new GelertError().push(invalidDataStructure);
        }
      }
      return Promise.resolve(role);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Retrieve a role by it's name.
   *
   * @param {string} name
   * @returns {Role}
   */
  async getRoleByName(name) {
    try {
      let role = await this.options.storage.getRoleByName(name);
      if (role) {
        if (role instanceof Role) {
          return role;
        } else {
          throw new GelertError().push(invalidDataStructure);
        }
      }
      return Promise.resolve(role);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Retrieve all of the permissions.
   *
   * @returns {object}
   */
  async getPermissions() {
    try {
      let collection = await this.options.storage.getPermissions();
      if (collection) {
        if (!(collection instanceof Array)) {
          throw new GelertError().push(invalidDataStructure);
        }

        for (let i = 0; i < collection.length; i++) {
          let x = collection[i];
          if (x instanceof Permission) {
            continue;
          } else {
            throw new GelertError().push(invalidDataStructure);
          }
        }
      }
      return Promise.resolve(collection);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Retrieve a permission by it's identifier.
   *
   * @param {string|number} id
   * @returns {Role}
   */
  async getPermissionById(id) {
    try {
      let permission = await this.options.storage.getPermissionById(id);
      if (permission) {
        if (permission instanceof Permission) {
          return permission;
        } else {
          throw new GelertError().push(invalidDataStructure);
        }
      }
      return Promise.resolve(permission);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Retrieve a permission by it's name.
   *
   * @param {string} name
   * @returns {Permission}
   */
  async getPermissionByName(name) {
    try {
      let permission = await this.options.storage.getPermissionByName(name);
      if (permission) {
        if (permission instanceof Permission) {
          return permission;
        } else {
          throw new GelertError().push(invalidDataStructure);
        }
      }
      return Promise.resolve(permission);
    } catch (error) {
      return Promise.reject(error);
    }
  }

}
