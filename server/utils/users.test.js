const expect = require('expect');

const { Users } = require('./users');

describe('Users', () => {
  var users;

  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: 1, name: 'May', room: 'nodejs'
    },{
      id: 2, name: 'June', room: 'emberjs'
    },{
      id: 3, name: 'Julie', room: 'nodejs'
    }];
  });

  it('should add new user', () => {
    var user = {
      id: 123,
      room: 'sample',
      name: 'Vishal'
    };
    var resUser = users.addUser(user.id, user.name, user.room);
    expect(users.users[users.users.length-1]).toEqual(user);
  });

  it('should get users of same room', () => {
    var sameRoomUsers = users.getUserList(users.users[0].room);
    expect(sameRoomUsers).toEqual([users.users[0].name, users.users[2].name]);
  });

  it('should return user with given id', () => {
    let user = users.getUser(users.users[0].id);
    expect(user.id).toEqual(users.users[0].id);
  });

  it('should return undefined if ID doesn\'t exist', () => {
    user = users.getUser(99);
    expect(user).toNotExist();
  });

  it('should remove user with given ID', () => {
    let userId = users.users[0].id;
    let usersCount = users.users.length;
    let user = users.removeUser(userId);
    expect(user.id).toBe(userId);
    expect(users.users.length).toBe(usersCount-1);
  });

  it('should not remove user if ID doesn\'t exist', () => {
    let userId = 99;
    let usersCount = users.users.length;
    let user = users.removeUser(userId);
    expect(user).toNotExist();
    expect(users.users.length).toBe(usersCount);
  });
});
