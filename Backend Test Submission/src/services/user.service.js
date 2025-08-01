const users = [];

function createUser(user) {
  const newUser = {
    id: (users.length + 1).toString(),
    ...user
  };
  users.push(newUser);
  return newUser;
}

module.exports = { createUser };
