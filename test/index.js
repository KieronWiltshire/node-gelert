'use strict';

import chai from 'chai';
chai.should();

/**
 * Gelert.
 * Permissions done simply.
 *
 * @author Kieron Wiltshire <kieron.wiltshire@outlook.com>
 */
 export default function UnitTests(Gelert, Options) {
   return function() {
     it('should create a new gelert instance', async function() {
       let instance = new Gelert(Options);
       if (instance) {
         return Promise.resolve();
       } else {
         return Promise.reject('Gelert is null');
       }
     });

     it('should create a new permission instance', async function() {
       let instance = new Gelert(Options);
       let permission = await instance.createPermission({ name: 'test-permission' });
       let exists = await instance.getPermissionByName('test-permission');

       if (exists) {
         return Promise.resolve();
       } else {
         return Promise.reject('Permission doesn\'t exist');
       }
     });

     it('should create a new role instance', async function() {
       let instance = new Gelert(Options);
       let role = await instance.createRole({ name: 'test-role' });
       let exists = await instance.getRoleByName('test-role');

       if (exists) {
         return Promise.resolve();
       } else {
         return Promise.reject('Role doesn\'t exist');
       }
     });

     it('should give permission to a role', async function() {
       let instance = new Gelert(Options);
       let permission = await instance.createPermission({ name: 'test-permission' });
       let role = await instance.createRole({ name: 'test-role' });

       role.addPermission(permission);

       if (role.hasPermission('test-permission')) {
         return Promise.resolve();
       } else {
         return Promise.reject('Role doesn\'t have permission');
       }
     });

     it('should revoke permission from a role', async function() {
       let instance = new Gelert(Options);
       let permission = await instance.createPermission({ name: 'test-permission' });
       let role = await instance.createRole({ name: 'test-role' });

       role.addPermission(permission);

       if (role.hasPermission('test-permission')) {
         role.removePermission(permission);

         if (role.hasPermission('test-permission')) {
           return Promise.reject('Role still has permission');
         } else {
           return Promise.resolve();
         }
       } else {
         return Promise.reject('Role doesn\'t have permission to begin with');
       }
     });

     it('role should not be able to inherit itself', async function() {
       let instance = new Gelert(Options);
       let roleA = await instance.createRole({ name: 'test-role-a' });

       try {
         roleA.addInheritance(roleA);
         return Promise.reject('Role should not be able to inherit itself');
       } catch (error) {
         return Promise.resolve();
       }
     });

     it('should have permission from an inherited role', async function() {
       let instance = new Gelert(Options);
       let permission = await instance.createPermission({ name: 'test-permission' });
       let roleA = await instance.createRole({ name: 'test-role-a' });
       let roleB = await instance.createRole({ name: 'test-role-b' });

       roleA.addPermission(permission);
       roleB.addInheritance(roleA);

       if (roleB.hasPermission('test-permission')) {
         return Promise.resolve();
       } else {
         return Promise.reject('Role doesn\'t have permission');
       }
     });

     it('should have permission from a second role in the inheritance tree', async function() {
       let instance = new Gelert(Options);
       let permission = await instance.createPermission({ name: 'test-permission' });
       let roleA = await instance.createRole({ name: 'test-role-a' });
       let roleB = await instance.createRole({ name: 'test-role-b' });
       let roleC = await instance.createRole({ name: 'test-role-b' });

       roleA.addPermission(permission);
       roleB.addInheritance(roleA);
       roleC.addInheritance(roleB);

       if (roleC.hasPermission('test-permission')) {
         return Promise.resolve();
       } else {
         return Promise.reject('Role doesn\'t have permission');
       }
     });

     it('should not grant given permission to a role that is inherited', async function() {
       let instance = new Gelert(Options);
       let permission = await instance.createPermission({ name: 'test-permission' });
       let roleA = await instance.createRole({ name: 'test-role-a' });
       let roleB = await instance.createRole({ name: 'test-role-b' });

       roleB.addPermission(permission);
       roleB.addInheritance(roleA);

       if (roleA.hasPermission('test-permission')) {
         return Promise.reject('Role has permission');
       } else {
         return Promise.resolve();
       }
     });
   }
 }
