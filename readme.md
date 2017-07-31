# Gelert

A permission evaluation module for simple permission checking.

---

## Introduction

The package exposes methods to create and manage roles and permissions within your application.
It allows the providing of a custom storage strategy implementation allowing you to persist your
roles / permissions however you see fit.

## Basic usage

Gelert can be instantiated with or without options. If no options are specified then
the default parameters are used.

```JavaScript
const Gelert = require('gelert');
const GelertSQLStrategy = require('gelert-sql-strategy');

const gelert = new Gelert({
  storage: new GelertSQLStrategy()
});
```

#### options

`options.storage` - Storage Strategy implementation

#### example usage

Basic permission handling

```JavaScript
const Gelert = require('gelert');
const gelert = new Gelert();

let testPermission = gelert.createPermission({ name: 'test-permission' }); // Permissions require a name. These should be unique.
let testRole = gelert.createRole({ name: 'test-role' }); // Permissibles such as roles require a name. These should be unique.

testRole.addPermission(testPermission);

console.log(testRole.hasPermission('test-permission')) // true
console.log(testRole.hasPermission('dummy-permission')) // false

testRole.removePermission(testPermission);

console.log(testRole.hasPermission('test-permission')) // false
```

Basic role inheritance

```JavaScript
const Gelert = require('gelert');
const gelert = new Gelert();

let testPermission = gelert.createPermission({ name: 'test-permission' }); // Permissions require a name. These should be unique.
let testRole = gelert.createRole({ name: 'test-role' }); // Permissibles such as roles require a name. These should be unique.

testRole.addPermission(testPermission);

let testRoleTwo = gelert.createRole({ name: 'test-role2' }); // Permissibles such as roles require a name. These should be unique.

testRoleTwo.addInheritance(testRole);

console.log(testRole.hasPermission('test-permission')) // true
console.log(testRoleTwo.hasPermission('test-permission')) // true

console.log(testRole.hasPermission('dummy-permission')) // false
console.log(testRoleTwo.hasPermission('dummy-permission')) // false

testRole.removePermission(testPermission);

console.log(testRole.hasPermission('test-permission')) // false
console.log(testRoleTwo.hasPermission('test-permission')) // false

testRoleTwo.removeInheritance(testRole);
```

## Contributing

Gelert makes use of [mocha]() and [chai]() in order to conduct it's unit tests, thus contributions
should be submitted with unit tests relevant to your work.

## License

Copyright (c) 2017 Kieron Wiltshire

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
