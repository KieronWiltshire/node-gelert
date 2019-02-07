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

  it('should not create a new instance of {Guard} without specifying a type', function(done) {
    try {
      new Guard();
      done(new Error('An instance of guard was created without specifying a type'));
    } catch (error) {
      done();
    }
  });

  it('should not create a new instance of {Guard} specifying a type as anything other than a string', function(done) {
    try {
      new Guard({ id: 1, type: 1 });
      done(new Error('An instance of guard was created without specifying a type'));
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
