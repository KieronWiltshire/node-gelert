'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

exports.default = executeUnitTests;

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.should();

/**
 * Gelert.
 * Permissions done simply.
 *
 * @author Kieron Wiltshire <kieron.wiltshire@outlook.com>
 */
function executeUnitTests(Gelert, Options) {
  return function () {
    describe('gelert', function () {
      it('should create a new gelert instance', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        var instance;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                instance = new Gelert(Options);

                if (!instance) {
                  _context.next = 5;
                  break;
                }

                return _context.abrupt('return', _promise2.default.resolve());

              case 5:
                return _context.abrupt('return', _promise2.default.reject('Gelert is null'));

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      })));

      it('should create a new permission instance', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
        var instance, permission, exists;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                instance = new Gelert(Options);
                _context2.next = 3;
                return instance.createPermission({ name: 'test-permission' });

              case 3:
                permission = _context2.sent;
                _context2.next = 6;
                return instance.getPermissionByName('test-permission');

              case 6:
                exists = _context2.sent;

                if (!exists) {
                  _context2.next = 11;
                  break;
                }

                return _context2.abrupt('return', _promise2.default.resolve());

              case 11:
                return _context2.abrupt('return', _promise2.default.reject('Permission doesn\'t exist'));

              case 12:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      })));

      it('should create a new role instance', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
        var instance, role, exists;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                instance = new Gelert(Options);
                _context3.next = 3;
                return instance.createRole({ name: 'test-role' });

              case 3:
                role = _context3.sent;
                _context3.next = 6;
                return instance.getRoleByName('test-role');

              case 6:
                exists = _context3.sent;

                if (!exists) {
                  _context3.next = 11;
                  break;
                }

                return _context3.abrupt('return', _promise2.default.resolve());

              case 11:
                return _context3.abrupt('return', _promise2.default.reject('Role doesn\'t exist'));

              case 12:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      })));

      it('should give permission to a role', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
        var instance, permission, role;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                instance = new Gelert(Options);
                _context4.next = 3;
                return instance.createPermission({ name: 'test-permission' });

              case 3:
                permission = _context4.sent;
                _context4.next = 6;
                return instance.createRole({ name: 'test-role' });

              case 6:
                role = _context4.sent;


                role.addPermission(permission);

                if (!role.hasPermission('test-permission')) {
                  _context4.next = 12;
                  break;
                }

                return _context4.abrupt('return', _promise2.default.resolve());

              case 12:
                return _context4.abrupt('return', _promise2.default.reject('Role doesn\'t have permission'));

              case 13:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      })));

      it('should revoke permission from a role', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5() {
        var instance, permission, role;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                instance = new Gelert(Options);
                _context5.next = 3;
                return instance.createPermission({ name: 'test-permission' });

              case 3:
                permission = _context5.sent;
                _context5.next = 6;
                return instance.createRole({ name: 'test-role' });

              case 6:
                role = _context5.sent;


                role.addPermission(permission);

                if (!role.hasPermission('test-permission')) {
                  _context5.next = 17;
                  break;
                }

                role.removePermission(permission);

                if (!role.hasPermission('test-permission')) {
                  _context5.next = 14;
                  break;
                }

                return _context5.abrupt('return', _promise2.default.reject('Role still has permission'));

              case 14:
                return _context5.abrupt('return', _promise2.default.resolve());

              case 15:
                _context5.next = 18;
                break;

              case 17:
                return _context5.abrupt('return', _promise2.default.reject('Role doesn\'t have permission to begin with'));

              case 18:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      })));

      it('role should not be able to inherit itself', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6() {
        var instance, roleA;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                instance = new Gelert(Options);
                _context6.next = 3;
                return instance.createRole({ name: 'test-role-a' });

              case 3:
                roleA = _context6.sent;
                _context6.prev = 4;

                roleA.addInheritance(roleA);
                return _context6.abrupt('return', _promise2.default.reject('Role should not be able to inherit itself'));

              case 9:
                _context6.prev = 9;
                _context6.t0 = _context6['catch'](4);
                return _context6.abrupt('return', _promise2.default.resolve());

              case 12:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this, [[4, 9]]);
      })));

      it('should have permission from an inherited role', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7() {
        var instance, permission, roleA, roleB;
        return _regenerator2.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                instance = new Gelert(Options);
                _context7.next = 3;
                return instance.createPermission({ name: 'test-permission' });

              case 3:
                permission = _context7.sent;
                _context7.next = 6;
                return instance.createRole({ name: 'test-role-a' });

              case 6:
                roleA = _context7.sent;
                _context7.next = 9;
                return instance.createRole({ name: 'test-role-b' });

              case 9:
                roleB = _context7.sent;


                roleA.addPermission(permission);
                roleB.addInheritance(roleA);

                if (!roleB.hasPermission('test-permission')) {
                  _context7.next = 16;
                  break;
                }

                return _context7.abrupt('return', _promise2.default.resolve());

              case 16:
                return _context7.abrupt('return', _promise2.default.reject('Role doesn\'t have permission'));

              case 17:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      })));

      it('should have permission from a second role in the inheritance tree', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8() {
        var instance, permission, roleA, roleB, roleC;
        return _regenerator2.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                instance = new Gelert(Options);
                _context8.next = 3;
                return instance.createPermission({ name: 'test-permission' });

              case 3:
                permission = _context8.sent;
                _context8.next = 6;
                return instance.createRole({ name: 'test-role-a' });

              case 6:
                roleA = _context8.sent;
                _context8.next = 9;
                return instance.createRole({ name: 'test-role-b' });

              case 9:
                roleB = _context8.sent;
                _context8.next = 12;
                return instance.createRole({ name: 'test-role-b' });

              case 12:
                roleC = _context8.sent;


                roleA.addPermission(permission);
                roleB.addInheritance(roleA);
                roleC.addInheritance(roleB);

                if (!roleC.hasPermission('test-permission')) {
                  _context8.next = 20;
                  break;
                }

                return _context8.abrupt('return', _promise2.default.resolve());

              case 20:
                return _context8.abrupt('return', _promise2.default.reject('Role doesn\'t have permission'));

              case 21:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      })));

      it('should not grant given permission to a role that is inherited', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9() {
        var instance, permission, roleA, roleB;
        return _regenerator2.default.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                instance = new Gelert(Options);
                _context9.next = 3;
                return instance.createPermission({ name: 'test-permission' });

              case 3:
                permission = _context9.sent;
                _context9.next = 6;
                return instance.createRole({ name: 'test-role-a' });

              case 6:
                roleA = _context9.sent;
                _context9.next = 9;
                return instance.createRole({ name: 'test-role-b' });

              case 9:
                roleB = _context9.sent;


                roleB.addPermission(permission);
                roleB.addInheritance(roleA);

                if (!roleA.hasPermission('test-permission')) {
                  _context9.next = 16;
                  break;
                }

                return _context9.abrupt('return', _promise2.default.reject('Role has permission'));

              case 16:
                return _context9.abrupt('return', _promise2.default.resolve());

              case 17:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      })));
    });
  };
}