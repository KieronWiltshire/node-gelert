'use strict';

import Chai from 'chai';
import ChaiUUID from 'chai-uuid';
import { Guard, Permission } from '../src/gelert';

Chai.use(ChaiUUID);

/**
 * Gelert.
 * Permissions done simply.
 */
describe('gelert', function() {

  it('should not create a new instance of {Permission} without a value', function(done) {
    try {
      new Permission();
      done(new Error('An instance of {Permission} was created without specifying a type'));
    } catch (error) {
      done();
    }
  });

  it('should not create a new instance of {Permission} specifying a value as anything other than a string', function(done) {
    try {
      new Permission(1);
      done(new Error('An instance of {Permission} was created without specifying a valid value'));
    } catch (error) {
      done();
    }
  });

  it('should create a new instance of {Permission}', async function() {
    let permission = new Permission('my.test.permission');

    Chai.expect(permission.getValue()).to.be.a('string');
    Chai.expect(permission.getValue()).to.equal('my.test.permission');
    Chai.expect(permission.getPositiveValue()).to.be.a('string');
    Chai.expect(permission.getPositiveValue()).to.equal('my.test.permission');
    Chai.expect(permission.getNegativeValue()).to.be.a('string');
    Chai.expect(permission.getNegativeValue()).to.equal('-my.test.permission');
  });

  it('should create a new instance of {Permission} specifying a "negative" value', async function() {
    let permission = new Permission('-my.test.permission');

    Chai.expect(permission.getValue()).to.be.a('string');
    Chai.expect(permission.getValue()).to.equal('-my.test.permission');
    Chai.expect(permission.getPositiveValue()).to.be.a('string');
    Chai.expect(permission.getPositiveValue()).to.equal('my.test.permission');
    Chai.expect(permission.getNegativeValue()).to.be.a('string');
    Chai.expect(permission.getNegativeValue()).to.equal('-my.test.permission');
  });

  it('should create a new instance of {Permission} and check against it\'s super values', async function() {
    let permission = new Permission('my.test.permission');

    let superPermission = new Permission('my.test.*');
    let superPermission2 = new Permission('my.*');
    let superPermission3 = new Permission('*');

    Chai.expect(permission.getValue()).to.be.a('string');
    Chai.expect(permission.getValue()).to.equal('my.test.permission');
    Chai.expect(permission.getPositiveValue()).to.be.a('string');
    Chai.expect(permission.getPositiveValue()).to.equal('my.test.permission');
    Chai.expect(permission.getNegativeValue()).to.be.a('string');
    Chai.expect(permission.getNegativeValue()).to.equal('-my.test.permission');

    Chai.expect(superPermission.getValue()).to.be.a('string');
    Chai.expect(superPermission.getValue()).to.equal('my.test.*');
    Chai.expect(superPermission.getPositiveValue()).to.be.a('string');
    Chai.expect(superPermission.getPositiveValue()).to.equal('my.test.*');
    Chai.expect(superPermission.getNegativeValue()).to.be.a('string');
    Chai.expect(superPermission.getNegativeValue()).to.equal('-my.test.*');

    Chai.expect(superPermission2.getValue()).to.be.a('string');
    Chai.expect(superPermission2.getValue()).to.equal('my.*');
    Chai.expect(superPermission2.getPositiveValue()).to.be.a('string');
    Chai.expect(superPermission2.getPositiveValue()).to.equal('my.*');
    Chai.expect(superPermission2.getNegativeValue()).to.be.a('string');
    Chai.expect(superPermission2.getNegativeValue()).to.equal('-my.*');

    Chai.expect(superPermission3.getValue()).to.be.a('string');
    Chai.expect(superPermission3.getValue()).to.equal('*');
    Chai.expect(superPermission3.getPositiveValue()).to.be.a('string');
    Chai.expect(superPermission3.getPositiveValue()).to.equal('*');
    Chai.expect(superPermission3.getNegativeValue()).to.be.a('string');
    Chai.expect(superPermission3.getNegativeValue()).to.equal('-*');

    Chai.expect(superPermission3.isSuper(superPermission2)).to.be.true;
    Chai.expect(superPermission3.isSuper(superPermission)).to.be.true;
    Chai.expect(superPermission3.isSuper(permission)).to.be.true;

    Chai.expect(superPermission2.isSuper(superPermission3)).to.be.false;
    Chai.expect(superPermission2.isSuper(superPermission)).to.be.true;
    Chai.expect(superPermission2.isSuper(permission)).to.be.true;

    Chai.expect(superPermission.isSuper(superPermission3)).to.be.false;
    Chai.expect(superPermission.isSuper(superPermission)).to.be.false;
    Chai.expect(superPermission.isSuper(permission)).to.be.true;
  });

  it('should not create a new instance of {Guard} without specifying a type', function(done) {
    try {
      new Guard();
      done(new Error('An instance of {Guard} was created without specifying a type'));
    } catch (error) {
      done();
    }
  });

  it('should not create a new instance of {Guard} specifying a type as anything other than a string', function(done) {
    try {
      new Guard({ id: 1, type: 1 });
      done(new Error('An instance of {Guard} was created without specifying a valid type'));
    } catch (error) {
      done();
    }
  });

  it('should create a new instance of {Guard} with the type being specified as "role"', async function() {
    let role = new Guard({ id: 1, type: 'role' });

    Chai.expect(role.getId()).to.be.a('number');
    Chai.expect(role.getId()).to.equal(1);
    Chai.expect(role.getType()).to.be.a('string');
    Chai.expect(role.getType()).to.equal('role');
  });

  it('should create a new instance of {Guard} and create an identifier if one isn\'t specified', async function() {
    let role = new Guard({ type: 'role' });

    Chai.expect(role.getId()).to.not.be.null;
    Chai.expect(role.getId()).to.be.a.uuid('v4');
  });

  it('should fail attempting to add a permission to a {Guard} that is anything other than an instance of {Permission}', function(done) {
    let role = new Guard({ type: 'role' });

    try {
      role.addPermission('my.test.permission');
      done(new Error('An instance of {Guard} accepted a permission that was not of a {Permission} instance'));
    } catch (error) {
      done();
    }
  });

  it('should add a permission to {Guard} if it\'s an instance of {Permission}', async function() {
    let role = new Guard({ type: 'role' });
    let permission = new Permission('my.test.permission');

    Chai.expect(role.containsPermission(permission)).to.be.false;
    Chai.expect(role.permissions()).to.have.lengthOf(0);
    Chai.expect(role.addPermission(permission)).to.be.true;
    Chai.expect(role.containsPermission(permission)).to.be.true;
    Chai.expect(role.permissions()).to.have.lengthOf(1);
  });

  it('should fail attempting to remove a permission from a {Guard} that doesn\'t exist using a {Permission} instance', async function() {
    let role = new Guard({ type: 'role' });
    let permission = new Permission('my.test.permission');

    Chai.expect(role.containsPermission(permission)).to.be.false;
    Chai.expect(role.permissions()).to.have.lengthOf(0);
    Chai.expect(role.removePermission(permission)).to.be.false;
    Chai.expect(role.containsPermission(permission)).to.be.false;
    Chai.expect(role.permissions()).to.have.lengthOf(0);
  });

  it('should remove a permission from a {Guard} using an equal {Permission} instance', async function() {
    let role = new Guard({ type: 'role' });
    let permission = new Permission('my.test.permission');

    Chai.expect(role.containsPermission(permission)).to.be.false;
    Chai.expect(role.permissions()).to.have.lengthOf(0);
    Chai.expect(role.addPermission(permission)).to.be.true;
    Chai.expect(role.containsPermission(permission)).to.be.true;
    Chai.expect(role.permissions()).to.have.lengthOf(1);
    Chai.expect(role.removePermission(permission)).to.be.true;
    Chai.expect(role.containsPermission(permission)).to.be.false;
    Chai.expect(role.permissions()).to.have.lengthOf(0);
  });

  it('should fail attempting to remove a permission from a {Guard} that doesn\'t exist using a string representation of a {Permission}', async function() {
    let role = new Guard({ type: 'role' });

    Chai.expect(role.containsPermission('my.test.permission')).to.be.false;
    Chai.expect(role.permissions()).to.have.lengthOf(0);
    Chai.expect(role.removePermission('my.test.permission')).to.be.false;
    Chai.expect(role.containsPermission('my.test.permission')).to.be.false;
    Chai.expect(role.permissions()).to.have.lengthOf(0);
  });

  it('should remove a permission from a {Guard} that using a string representation of a {Permission}', async function() {
    let role = new Guard({ type: 'role' });
    let permission = new Permission('my.test.permission');

    Chai.expect(role.containsPermission('my.test.permission')).to.be.false;
    Chai.expect(role.permissions()).to.have.lengthOf(0);
    Chai.expect(role.addPermission(permission)).to.be.true;
    Chai.expect(role.containsPermission('my.test.permission')).to.be.true;
    Chai.expect(role.permissions()).to.have.lengthOf(1);
    Chai.expect(role.removePermission('my.test.permission')).to.be.true;
    Chai.expect(role.containsPermission('my.test.permission')).to.be.false;

  });

  it('should add a permission to a {Guard} and check if it has access to the specified permission', async function() {
    let role = new Guard({ type: 'role' });
    let permission = new Permission('my.test.permission');

    Chai.expect(role.containsPermission(permission)).to.be.false;
    Chai.expect(role.permissions()).to.have.lengthOf(0);
    Chai.expect(role.addPermission(permission)).to.be.true;
    Chai.expect(role.containsPermission(permission)).to.be.true;
    Chai.expect(role.permissions()).to.have.lengthOf(1);
    Chai.expect(role.hasPermission(permission)).to.be.true;
  });

  it('should remove a permission from a {Guard} and check if it has access to the specified permission', async function() {
    let role = new Guard({ type: 'role' });
    let permission = new Permission('my.test.permission');

    Chai.expect(role.containsPermission(permission)).to.be.false;
    Chai.expect(role.permissions()).to.have.lengthOf(0);
    Chai.expect(role.addPermission(permission)).to.be.true;
    Chai.expect(role.containsPermission(permission)).to.be.true;
    Chai.expect(role.permissions()).to.have.lengthOf(1);
    Chai.expect(role.hasPermission(permission)).to.be.true;
    Chai.expect(role.removePermission(permission)).to.be.true;
    Chai.expect(role.containsPermission(permission)).to.be.false;
    Chai.expect(role.permissions()).to.have.lengthOf(0);
    Chai.expect(role.hasPermission(permission)).to.be.false;
  });

  it('should add a permission to a {Guard} and check if it has access to the specified permission using a string representation of a {Permission}', async function() {
    let role = new Guard({ type: 'role' });
    let permission = new Permission('my.test.permission');

    Chai.expect(role.containsPermission('my.test.permission')).to.be.false;
    Chai.expect(role.permissions()).to.have.lengthOf(0);
    Chai.expect(role.addPermission(permission)).to.be.true;
    Chai.expect(role.containsPermission('my.test.permission')).to.be.true;
    Chai.expect(role.permissions()).to.have.lengthOf(1);
    Chai.expect(role.hasPermission('my.test.permission')).to.be.true;
  });

  it('should remove a permission from a {Guard} and check if it has access to the specifed permission', async function() {
    let role = new Guard({ type: 'role' });
    let permission = new Permission('my.test.permission');

    Chai.expect(role.containsPermission(permission)).to.be.false;
    Chai.expect(role.permissions()).to.have.lengthOf(0);
    Chai.expect(role.addPermission(permission)).to.be.true;
    Chai.expect(role.containsPermission(permission)).to.be.true;
    Chai.expect(role.permissions()).to.have.lengthOf(1);
    Chai.expect(role.hasPermission(permission)).to.be.true;
    Chai.expect(role.removePermission(permission)).to.be.true;
    Chai.expect(role.containsPermission(permission)).to.be.false;
    Chai.expect(role.permissions()).to.have.lengthOf(0);
    Chai.expect(role.hasPermission(permission)).to.be.false;
  });

  it('should create a new instance of {Guard} and remove a permission and check if the guard has access to the permission it\'s string representation', async function() {
    let role = new Guard({ type: 'role' });
    let permission = new Permission('my.test.permission');

    Chai.expect(role.containsPermission('my.test.permission')).to.be.false;
    Chai.expect(role.permissions()).to.have.lengthOf(0);
    Chai.expect(role.addPermission(permission)).to.be.true;
    Chai.expect(role.containsPermission('my.test.permission')).to.be.true;
    Chai.expect(role.permissions()).to.have.lengthOf(1);
    Chai.expect(role.hasPermission('my.test.permission')).to.be.true;
    Chai.expect(role.removePermission('my.test.permission')).to.be.true;
    Chai.expect(role.containsPermission('my.test.permission')).to.be.false;
    Chai.expect(role.permissions()).to.have.lengthOf(0);
    Chai.expect(role.hasPermission('my.test.permission')).to.be.false;
  });

  it('should add a super permission to a {Guard} and check if it has access to the permission subset', async function() {
    let role = new Guard({ type: 'role' });
    let permission = new Permission('my.test.*');
    let subPermission = new Permission('my.test.permission');

    Chai.expect(role.containsPermission(permission)).to.be.false;
    Chai.expect(role.containsPermission(subPermission)).to.be.false;
    Chai.expect(role.permissions()).to.have.lengthOf(0);
    Chai.expect(role.addPermission(permission)).to.be.true;
    Chai.expect(role.containsPermission(permission)).to.be.true;
    Chai.expect(role.containsPermission(subPermission)).to.be.false;
    Chai.expect(role.permissions()).to.have.lengthOf(1);
    Chai.expect(role.hasPermission(permission)).to.be.true;
    Chai.expect(role.hasPermission(subPermission)).to.be.true;
  });

  it('should add a top level super permission and check if the guard has access to any subset permission', async function() {
    let role = new Guard({ type: 'role' });
    let permission = new Permission('*');
    let subPermission = new Permission('my.test.permission');
    let subPermission2 = new Permission('test');

    Chai.expect(role.containsPermission(permission)).to.be.false;
    Chai.expect(role.containsPermission(subPermission)).to.be.false;
    Chai.expect(role.containsPermission(subPermission2)).to.be.false;
    Chai.expect(role.permissions()).to.have.lengthOf(0);
    Chai.expect(role.addPermission(permission)).to.be.true;
    Chai.expect(role.containsPermission(permission)).to.be.true;
    Chai.expect(role.containsPermission(subPermission)).to.be.false;
    Chai.expect(role.containsPermission(subPermission2)).to.be.false;
    Chai.expect(role.permissions()).to.have.lengthOf(1);
    Chai.expect(role.hasPermission(permission)).to.be.true;
    Chai.expect(role.hasPermission(subPermission)).to.be.true;
    Chai.expect(role.hasPermission(subPermission2)).to.be.true;
  });

  it('should add both a negative and positive permission to a {Guard} and fail if it has access to the permission as negative permissions are valued higher', async function() {
    let role = new Guard({ type: 'role' });
    let permission = new Permission('my.test.permission');
    let negativePermission = new Permission('-my.test.permission');

    Chai.expect(role.containsPermission(permission)).to.be.false;
    Chai.expect(role.permissions()).to.have.lengthOf(0);
    Chai.expect(role.addPermission(permission)).to.be.true;
    Chai.expect(role.containsPermission(permission)).to.be.true;
    Chai.expect(role.permissions()).to.have.lengthOf(1);

    Chai.expect(role.containsPermission(negativePermission)).to.be.false;
    Chai.expect(role.addPermission(negativePermission)).to.be.true;
    Chai.expect(role.containsPermission(negativePermission)).to.be.true;
    Chai.expect(role.permissions()).to.have.lengthOf(2);

    Chai.expect(role.hasPermission(permission)).to.be.false;
  });

  it('should add a super negative permission and a positive permission to a {Guard} and it should still have access to the permission as negative super permissions should not be allowed', async function() {
    let role = new Guard({ type: 'role' });
    let permission = new Permission('my.test.permission');
    let negativePermission = new Permission('-my.test.*');

    Chai.expect(role.containsPermission(permission)).to.be.false;
    Chai.expect(role.permissions()).to.have.lengthOf(0);
    Chai.expect(role.addPermission(permission)).to.be.true;
    Chai.expect(role.containsPermission(permission)).to.be.true;
    Chai.expect(role.permissions()).to.have.lengthOf(1);

    Chai.expect(role.containsPermission(negativePermission)).to.be.false;
    Chai.expect(role.addPermission(negativePermission)).to.be.true;
    Chai.expect(role.containsPermission(negativePermission)).to.be.true;
    Chai.expect(role.permissions()).to.have.lengthOf(2);

    Chai.expect(role.hasPermission(permission)).to.be.true;
  });

  it('should add super positive permission and a negative permission to a {Guard} and it should not have access to the permission as negative permissions are valued higher', async function() {
    let role = new Guard({ type: 'role' });
    let permission = new Permission('my.*');
    let negativePermission = new Permission('-my.test.permission');
    let subPermission = new Permission('my.test.permission');
    let subPermission2 = new Permission('my.other.permission');

    Chai.expect(role.containsPermission(permission)).to.be.false;
    Chai.expect(role.permissions()).to.have.lengthOf(0);
    Chai.expect(role.addPermission(permission)).to.be.true;
    Chai.expect(role.containsPermission(permission)).to.be.true;
    Chai.expect(role.permissions()).to.have.lengthOf(1);

    Chai.expect(role.containsPermission(negativePermission)).to.be.false;
    Chai.expect(role.addPermission(negativePermission)).to.be.true;
    Chai.expect(role.containsPermission(negativePermission)).to.be.true;
    Chai.expect(role.permissions()).to.have.lengthOf(2);

    Chai.expect(role.containsPermission(subPermission)).to.be.false;

    Chai.expect(role.hasPermission(permission)).to.be.true;
    Chai.expect(role.hasPermission(subPermission)).to.be.false;
    Chai.expect(role.hasPermission(subPermission2)).to.be.true;
  });

  it('should not allow a guard to inherit anything other than an instance of {Guard}', function(done) {
    let adminRole = new Guard({ type: 'role' });

    try {
      adminRole.addGuard('test');
      done(new Error('A {Guard} is inherited a value that isn\'t an instance of {Guard}'));
    } catch (error) {
      done();
    }
  });

  it('should allow a guard to inherit another guard', async function() {
    let adminRole = new Guard({ type: 'role' });
    let userRole = new Guard({ type: 'role' });

    Chai.expect(adminRole.containsGuard(userRole)).to.be.false;
    Chai.expect(adminRole.guards()).to.have.lengthOf(0);
    Chai.expect(adminRole.addGuard(userRole)).to.be.true;
    Chai.expect(adminRole.containsGuard(userRole)).to.be.true;
    Chai.expect(adminRole.guards()).to.have.lengthOf(1);
  });

  it('should not allow the removal of a guard that isn\'t inherited', async function() {
    let adminRole = new Guard({ type: 'role' });
    let userRole = new Guard({ type: 'role' });

    Chai.expect(adminRole.containsGuard(userRole)).to.be.false;
    Chai.expect(adminRole.guards()).to.have.lengthOf(0);
    Chai.expect(adminRole.removeGuard(userRole)).to.be.false;
    Chai.expect(adminRole.containsGuard(userRole)).to.be.false;
    Chai.expect(adminRole.guards()).to.have.lengthOf(0);
  });

  it('should allow the removal of an inherited guard', async function() {
    let adminRole = new Guard({ type: 'role' });
    let userRole = new Guard({ type: 'role' });

    Chai.expect(adminRole.containsGuard(userRole)).to.be.false;
    Chai.expect(adminRole.guards()).to.have.lengthOf(0);
    Chai.expect(adminRole.addGuard(userRole)).to.be.true;
    Chai.expect(adminRole.containsGuard(userRole)).to.be.true;
    Chai.expect(adminRole.guards()).to.have.lengthOf(1);

    Chai.expect(adminRole.removeGuard(userRole)).to.be.true;
    Chai.expect(adminRole.containsGuard(userRole)).to.be.false;
    Chai.expect(adminRole.guards()).to.have.lengthOf(0);
  });

  it('should allow access to a permission given to an inherited guard', async function() {
    let adminRole = new Guard({ type: 'role' });
    let userRole = new Guard({ type: 'role' });

    let userPermission = new Permission('user.*');
    let adminPermission = new Permission('admin.*');

    Chai.expect(userRole.containsPermission(userPermission)).to.be.false;
    Chai.expect(userRole.permissions()).to.have.lengthOf(0);
    Chai.expect(userRole.addPermission(userPermission)).to.be.true;
    Chai.expect(userRole.containsPermission(userPermission)).to.be.true;
    Chai.expect(userRole.permissions()).to.have.lengthOf(1);

    Chai.expect(adminRole.containsPermission(adminPermission)).to.be.false;
    Chai.expect(adminRole.permissions()).to.have.lengthOf(0);
    Chai.expect(adminRole.addPermission(adminPermission)).to.be.true;
    Chai.expect(adminRole.containsPermission(adminPermission)).to.be.true;
    Chai.expect(adminRole.permissions()).to.have.lengthOf(1);

    Chai.expect(userRole.hasPermission(userPermission)).to.be.true;
    Chai.expect(userRole.hasPermission(adminPermission)).to.be.false;

    Chai.expect(adminRole.hasPermission(userPermission)).to.be.false;
    Chai.expect(adminRole.hasPermission(adminPermission)).to.be.true;

    Chai.expect(adminRole.containsGuard(userRole)).to.be.false;
    Chai.expect(adminRole.guards()).to.have.lengthOf(0);
    Chai.expect(adminRole.addGuard(userRole)).to.be.true;
    Chai.expect(adminRole.containsGuard(userRole)).to.be.true;
    Chai.expect(adminRole.guards()).to.have.lengthOf(1);

    Chai.expect(userRole.hasPermission(userPermission)).to.be.true;
    Chai.expect(userRole.hasPermission(adminPermission)).to.be.false;

    Chai.expect(adminRole.hasPermission(userPermission)).to.be.true;
    Chai.expect(adminRole.hasPermission(adminPermission)).to.be.true;
  });

  it('should not give access to a permission that is negated from a child guard', async function() {
    let adminRole = new Guard({ type: 'role' });
    let userRole = new Guard({ type: 'role' });
    let guestRole = new Guard({ type: 'role' });

    let guestPermission = new Permission('guest.view');
    let userPermission = new Permission('user.*');
    let userPermission2 = new Permission('-guest.view');
    let adminPermission = new Permission('admin.*');

    Chai.expect(guestRole.containsPermission(guestPermission)).to.be.false;
    Chai.expect(guestRole.permissions()).to.have.lengthOf(0);
    Chai.expect(guestRole.addPermission(guestPermission)).to.be.true;
    Chai.expect(guestRole.containsPermission(guestPermission)).to.be.true;
    Chai.expect(guestRole.permissions()).to.have.lengthOf(1);

    Chai.expect(userRole.containsPermission(userPermission)).to.be.false;
    Chai.expect(userRole.permissions()).to.have.lengthOf(0);
    Chai.expect(userRole.addPermission(userPermission)).to.be.true;
    Chai.expect(userRole.containsPermission(userPermission)).to.be.true;
    Chai.expect(userRole.permissions()).to.have.lengthOf(1);

    Chai.expect(userRole.containsPermission(userPermission2)).to.be.false;
    Chai.expect(userRole.permissions()).to.have.lengthOf(1);
    Chai.expect(userRole.addPermission(userPermission2)).to.be.true;
    Chai.expect(userRole.containsPermission(userPermission2)).to.be.true;
    Chai.expect(userRole.permissions()).to.have.lengthOf(2);

    Chai.expect(adminRole.containsPermission(adminPermission)).to.be.false;
    Chai.expect(adminRole.permissions()).to.have.lengthOf(0);
    Chai.expect(adminRole.addPermission(adminPermission)).to.be.true;
    Chai.expect(adminRole.containsPermission(adminPermission)).to.be.true;
    Chai.expect(adminRole.permissions()).to.have.lengthOf(1);

    Chai.expect(guestRole.hasPermission(guestPermission)).to.be.true;
    Chai.expect(guestRole.hasPermission(userPermission)).to.be.false;
    Chai.expect(guestRole.hasPermission(userPermission2)).to.be.false;
    Chai.expect(guestRole.hasPermission(adminPermission)).to.be.false;

    Chai.expect(userRole.hasPermission(guestPermission)).to.be.false;
    Chai.expect(userRole.hasPermission(userPermission)).to.be.true;
    Chai.expect(userRole.hasPermission(userPermission2)).to.be.true;
    Chai.expect(userRole.hasPermission(adminPermission)).to.be.false;

    Chai.expect(adminRole.hasPermission(guestPermission)).to.be.false;
    Chai.expect(adminRole.hasPermission(userPermission)).to.be.false;
    Chai.expect(adminRole.hasPermission(userPermission2)).to.be.false;
    Chai.expect(adminRole.hasPermission(adminPermission)).to.be.true;

    Chai.expect(userRole.containsGuard(guestRole)).to.be.false;
    Chai.expect(userRole.guards()).to.have.lengthOf(0);
    Chai.expect(userRole.addGuard(guestRole)).to.be.true;
    Chai.expect(userRole.containsGuard(guestRole)).to.be.true;
    Chai.expect(userRole.guards()).to.have.lengthOf(1);

    Chai.expect(adminRole.containsGuard(userRole)).to.be.false;
    Chai.expect(adminRole.guards()).to.have.lengthOf(0);
    Chai.expect(adminRole.addGuard(userRole)).to.be.true;
    Chai.expect(adminRole.containsGuard(userRole)).to.be.true;
    Chai.expect(adminRole.guards()).to.have.lengthOf(1);

    Chai.expect(guestRole.hasPermission(guestPermission)).to.be.true;
    Chai.expect(guestRole.hasPermission(userPermission)).to.be.false;
    Chai.expect(guestRole.hasPermission(userPermission2)).to.be.false;
    Chai.expect(guestRole.hasPermission(adminPermission)).to.be.false;

    Chai.expect(userRole.hasPermission(guestPermission)).to.be.false;
    Chai.expect(userRole.hasPermission(userPermission)).to.be.true;
    Chai.expect(userRole.hasPermission(userPermission2)).to.be.true;
    Chai.expect(userRole.hasPermission(adminPermission)).to.be.false;

    Chai.expect(adminRole.hasPermission(guestPermission)).to.be.false;
    Chai.expect(adminRole.hasPermission(userPermission)).to.be.true;
    Chai.expect(adminRole.hasPermission(userPermission2)).to.be.true;
    Chai.expect(adminRole.hasPermission(adminPermission)).to.be.true;
  });
});
