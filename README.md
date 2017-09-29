JsInteractor
============

A small library that provides creators for interactors and organizers (small business logic block of code)

## Installation

```
npm install jsinteractor --save
```

## Usage

```javascript
import { interactor, organizer } from 'jsinteractor';

// single authenticate_user interactor
const authenticateUser = interactor(() => {
  const { email, password, UserModel } = this.context;

  if (user = UserModel.authorize(email, password)) {
    this.context.user = user;
    this.context.token = user.secret_token;
  } else {
    this.context.fail({ message: "Auth failed" });
  }
});
.
.
.
context = authenticateUser(context);

/**
success context:
{
  UserModel: [Object],
  email: 'test@test.com',
  password: '******',
  success: true,
  user: [Object],
  token: "super-secret-token",
}

failed context:
{
  UserModel: [Object],
  email: 'fail@test.com',
  password: '*', 
  failure: true,
  message: 'Auth failed'
}
**/

// get user permission interactor
const getUserPermissions = interactor(() => {
  if (this.context.user) {
    const { user, UserModel } = this.context;
    this.context.permissions = UserModel.permissions(user);
  }
});

const userLogin = organizer(
  authenticateUser,
  getUserPermissions
);
.
.
.
context = userLogin(context);

/**
success context:
{
  UserModel: [Object],
  email: 'test@test.com',
  password: '******',
  success: true,
  user: [Object],
  token: "super-secret-token",
  permissions: [Object]
}
**/
```

## Tests

  npm test

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

## Release History

* 0.1.0 Initial release
