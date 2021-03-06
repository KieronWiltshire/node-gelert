# Gelert

A permission evaluation module for simple permission checking.

---

## Introduction

This package exports methods that can be used to evaluate permissions within your application.

## Basic usage

Gelert exports two classes `Guard` and `Permission`.

The `Permission` class essentially wraps a string and gives it additional methods which are used in weighing the importance of the permission.

The `Guard` class should be considered as a collection of permissions that permits it's associates to perform specific actions.
So for example you could implement a `Guard` to perform as a role or an individual user.

#### example usage

Creating permissions requires one parameter through the constructor, being the permission value itself.

```JavaScript
const { Permission, Guard } = require('gelert');

let viewBlogPosts = new Permission('blog.post.view');
```

Creating guards requires an object to be passed containing 2 properties, one being the identifier of the guard, the second being the type of the guard. If no identifier is passed then a UUID is generated by default. The type is irrelevant in any case but is intended to be used to differentiate
between guards encase you wish to evaluate permissions differently for different guards.
```JavaScript
const { Permission, Guard } = require('gelert');

let adminRole = new Guard({ id: 1, type: 'role' });
```

Adding permissions.
```JavaScript
const { Permission, Guard } = require('gelert');

let adminRole = new Guard({ id: 1, type: 'role' });
let userRole = new Guard({ id: 2, type: 'role' });

let viewBlogPosts = new Permission('blog.post.view');

userRole.addPermission(viewBlogPosts);

userRole.hasPermission(viewBlogPosts); // true
userRole.hasPermission('blog.post.view'); // true

adminRole.hasPermission(viewBlogPosts); // false
adminRole.hasPermission('blog.post.view'); // false

adminRole.addGuard(userRole);

adminRole.hasPermission(viewBlogPosts); // true
adminRole.hasPermission('blog.post.view'); // true
```

Adding negated and super permissions to guards. A permission added to parent guards are considered of higher value and override any child guards with the negative equivalent permission value.
```JavaScript
const { Permission, Guard } = require('gelert');

let adminRole = new Guard({ id: 1, type: 'role' });
let moderatorRole = new Guard({ id: 2, type: 'role' });
let userRole = new Guard({ id: 3, type: 'role' });

let viewSelfBlogPosts = new Permission('blog.post.view.self');
let viewAllBlogPosts = new Permission('blog.post.view.*');
let viewAllBlogPostsExceptAdminPosts = new Permission('-blog.post.view.admin');

userRole.addPermission(viewSelfBlogPosts);
moderatorRole.addPermission(viewAllBlogPostsExceptAdminPosts);
moderatorRole.addPermission(viewAllBlogPosts);
adminRole.addPermission(viewAllBlogPosts);

userRole.hasPermission(viewSelfBlogPosts); // true
userRole.hasPermission(viewAllBlogPosts); // false

moderatorRole.addGuard(userRole);
moderatorRole.hasPermission(viewSelfBlogPosts); // true
moderatorRole.hasPermission(viewAllBlogPosts); // true
moderatorRole.hasPermission(viewAllBlogPostsExceptAdminPosts); // true
moderatorRole.hasPermission('blog.post.view.admin'); // false

adminRole.hasPermission(viewSelfBlogPosts); // true
adminRole.hasPermission(viewAllBlogPosts); // true
adminRole.hasPermission('blog.post.view.admin'); // true
```

#### Permission methods

- Permission#getValue()
    - returns: {string}
    - The permission value.
- Permission#isNegated()
    - returns: {boolean}
    - True if the value of the permission is negative.
- Permission#getPositiveValue()
    - returns: {string}
    - The positive value.
- Permission#getNegativeValue()
    - returns: {string}
    - The negative value.
- Permission#isSuper([Permission] permission)
    - returns: {boolean}
    - True if the permission's dot notated value is a super of the specified permission value.
- Permission#equals([Permission] permission)
    - returns: {boolean}
    - True if the permission value is equal to the specified permission value.

#### Guard methods

- Guard#getId()
  - returns: {any}
  - The guard identifier.
- Guard#getType()
  - returns: {string}
  - The guard type.
- Guard#guards()
  - returns: {Array}
  - An array of all of the guards that are direct children.
- Guard#addGuard([Guard] guard)
  - returns: {boolean}
  - True if the guard already has the specified guard as a direct child or if it was added successfully.
- Guard#removeGuard([Guard] guard)
  - returns: {boolean}
  - True if the guard does not have the specified guard as a direct child or if it was removed successfully.
- Guard#containsGuard([Guard] guard)
  - returns: {boolean}
  - True if the guard contains the specified guard as a direct child.
- Guard#doesInherit([Guard] guard)
  - returns: {boolean}
  - True if the guard inherits the specified guard.
- Guard#permissions()
  - returns: {Array}
  - An array of all of the permissions that are direct children.
- Guard#addPermission([string|Permission] permission)
  - returns: {boolean}
  - True if the guard has the specified permission as a direct child or if it was added successfully.
- Guard#removePermission([string|Permission] permission)
  - returns: {boolean}
  - True if the guard does not have the specified permission as a direct child or if it was removed successfully.
- Guard#containsPermission([string|Permission] permission)
  - returns: {boolean}
  - True if the guard contains the specified permission as a direct child.
- Guard#hasPermission([string|Permission] permission)
  - returns: {boolean}
  - True if the guard has access to the specified permission.
- Guard#equals([Guard] guard)
  - returns: {boolean}
  - True if the guard identifier and type is equal to the specified guard identifier and type.

## Contributing

Gelert makes use of [mocha]() and [chai]() in order to conduct it's unit tests, thus contributions
should be submitted with unit tests relevant to your work.

## License

Copyright (c) 2019 Kieron Wiltshire

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
