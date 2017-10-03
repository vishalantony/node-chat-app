// addUser(sid, name, room)
// removeUser(sid)
// getUser(id)
// getUserList(room)

class Users {
  constructor() {
    this.users = new Array();
  }

  addUser(id, name, room) {
    var user = {
      id, room, name
    }
    this.users.push(user);
    return user;
  }

  isUsernameTaken(username) {
    if(this.users.find(user => user.name === username)) {
      return true;
    }
    return false;
  }

  removeUser(id) {
    let user = this.getUser(id);
    if(user) {
      this.users = this.users.filter(u => u.id !== user.id);
    }
    return user;
  }

  getUser(id) {
    return this.users.find((user) => user.id === id);
  }

  getUserList(room) {
    var users = this.users.filter((user) => user.room === room);
    return users.map((user) => user.name);
  }
}

module.exports = {
  Users
};

// class User {
//   constructor(name, age) {
//     this.name = name;
//     this.age = age;
//   }
//
//   getUserDescription() {
//     return `${this.name} is ${this.age} year(s) old`;
//   }
// }
//
// var me = new User('Vishal', 22);
// console.log(me.name, me.age);
// console.log(me.getUserDescription());
