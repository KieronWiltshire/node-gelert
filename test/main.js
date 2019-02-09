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
    Chai.expect(permission.getNegatedValue()).to.be.a('string');
    Chai.expect(permission.getNegatedValue()).to.equal('-my.test.permission');
  });

  it('should create a new instance of {Permission} specifying a "negative" value', async function() {
    let permission = new Permission('-my.test.permission');

    Chai.expect(permission.getValue()).to.be.a('string');
    Chai.expect(permission.getValue()).to.equal('-my.test.permission');
    Chai.expect(permission.getPositiveValue()).to.be.a('string');
    Chai.expect(permission.getPositiveValue()).to.equal('my.test.permission');
    Chai.expect(permission.getNegatedValue()).to.be.a('string');
    Chai.expect(permission.getNegatedValue()).to.equal('-my.test.permission');
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
    Chai.expect(permission.getNegatedValue()).to.be.a('string');
    Chai.expect(permission.getNegatedValue()).to.equal('-my.test.permission');

    Chai.expect(superPermission.getValue()).to.be.a('string');
    Chai.expect(superPermission.getValue()).to.equal('my.test.*');
    Chai.expect(superPermission.getPositiveValue()).to.be.a('string');
    Chai.expect(superPermission.getPositiveValue()).to.equal('my.test.*');
    Chai.expect(superPermission.getNegatedValue()).to.be.a('string');
    Chai.expect(superPermission.getNegatedValue()).to.equal('-my.test.*');

    Chai.expect(superPermission2.getValue()).to.be.a('string');
    Chai.expect(superPermission2.getValue()).to.equal('my.*');
    Chai.expect(superPermission2.getPositiveValue()).to.be.a('string');
    Chai.expect(superPermission2.getPositiveValue()).to.equal('my.*');
    Chai.expect(superPermission2.getNegatedValue()).to.be.a('string');
    Chai.expect(superPermission2.getNegatedValue()).to.equal('-my.*');

    Chai.expect(superPermission3.getValue()).to.be.a('string');
    Chai.expect(superPermission3.getValue()).to.equal('*');
    Chai.expect(superPermission3.getPositiveValue()).to.be.a('string');
    Chai.expect(superPermission3.getPositiveValue()).to.equal('*');
    Chai.expect(superPermission3.getNegatedValue()).to.be.a('string');
    Chai.expect(superPermission3.getNegatedValue()).to.equal('-*');

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

});
