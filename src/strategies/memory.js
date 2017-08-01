'use strict';

import Permission from '../types/permission';
import Role from '../types/role';

/**
 * Gelert.
 * Permissions done simply.
 *
 * @author Kieron Wiltshire <kieron.wiltshire@outlook.com>
 */
export default class MemoryStorageStrategy {

  /**
   * Create a new {MemoryStorageStrategy} instance.
   */
  constructor() {
    this._roles = [];
    this._permissions = [];
  }

  /**
   * Create and persist a new role.
   *
   * @param {object} params
   * @returns {Role}
   */
  async createRole(params) {
    let r = new Role(params, this);
    r.save();
    return Promise.resolve(r);
  }

  /**
   * Retrieve all of the permission roles.
   *
   * @returns {Array}
   */
  async getRoles() {
    return Promise.resolve(cache.roles);
  }

  /**
   * Retrieve a role by it's identifier.
   *
   * @param {string|number} id
   * @returns {Role}
   */
  async getRoleById(id) {
    let role = null;
    for (let i = 0; i < cache.roles.length; i++) {
      if (cache.roles[i].id === id) {
        role = cache.roles[i];
        break;
      }
    }
    return Promise.resolve(role);
  }

  /**
   * Retrieve a role by it's name.
   *
   * @param {string} name
   * @returns {Role}
   */
  async getRoleByName(name) {
    let role = null;
    for (let i = 0; i < cache.roles.length; i++) {
      if (cache.roles[i].name === name) {
        role = cache.roles[i];
        break;
      }
    }
    return Promise.resolve(role);
  }

  /**
   * Save the role.
   *
   * @returns {boolean} true if the role was saved successfully
   */
  async saveRole(role) {
    for (let i = 0; i < cache.roles.length; i++) {
      if (cache.roles[i].equals(role)) {
        cache.roles.splice(i, 1);
        break;
      }
    }
    cache.roles.push(role);
    return Promise.resolve();
  }

  /**
   * Delete the role.
   *
   * @returns {boolean} true if the permission was saved successfully
   */
  async deleteRole(role) {
    for (let i = 0; i < cache.roles.length; i++) {
      if (cache.roles[i] === role) {
        cache.roles.splice(i, 1);
        break;
      }
    }
    return Promise.resolve();
  }

  /**
   * Create and persist a new permission.
   *
   * @param {object} params
   * @returns {Permission}
   */
  async createPermission(params) {
    let p = new Permission(params, this);
    p.save();
    return Promise.resolve(p);
  }

  /**
   * Retrieve all of the permissions.
   *
   * @returns {Array}
   */
  async getPermissions() {
    return Promise.resolve(cache.permissions);
  }

  /**
   * Retrieve a permission by it's identifier.
   *
   * @param {string|number} id
   * @returns {Role}
   */
  async getPermissionById(id) {
    let permission = null;
    for (let i = 0; i < cache.permissions.length; i++) {
      if (cache.permissions[i].id === id) {
        permission = cache.permissions[i];
        break;
      }
    }
    return Promise.resolve(permission);
  }

  /**
   * Retrieve a permission by it's name.
   *
   * @param {string} name
   * @returns {Role}
   */
  async getPermissionByName(name) {
    let permission = null;
    for (let i = 0; i < cache.permissions.length; i++) {
      if (cache.permissions[i].name == name) {
        permission = cache.permissions[i];
        break;
      }
    }
    return Promise.resolve(permission);
  }

  /**
   * Save the permission.
   *
   * @returns {boolean} true if the permission was saved successfully
   */
  async savePermission(permission) {
    for (let i = 0; i < cache.permissions.length; i++) {
      if (cache.permissions[i].equals(permission)) {
        cache.permissions.splice(i, 1);
        break;
      }
    }
    cache.permissions.push(permission);
    return Promise.resolve();
  }

  /**
   * Delete the permission.
   *
   * @returns {boolean} true if the permission was saved successfully
   */
  async deletePermission(permission) {
    for (let i = 0; i < cache.permissions.length; i++) {
      if (cache.permissions[i].equals(permission)) {
        cache.permissions.splice(i, 1);
        break;
      }
    }
    return Promise.resolve();
  }

}
