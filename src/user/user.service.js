// Here is what a service can do

const addUser =
  (User) =>
  ({ name, email, password }) => {
    const user = new User({
      name,
      email,
      password,
    });
    return user.save();
  };

const getUsers = (User) => () => {
  return User.find({});
};

const getUserByEmail =
  (User) =>
  async ({ email }) => {
    return await User.findOne({
      email,
    });
  };

const getUserById =
  (User) =>
  async ({ id }) => {
    return await User.findById(id);
  };

module.exports = (User) => {
  return {
    addGoogleUser: addUser(User),
    getUsers: getUsers(User),
    getUserByEmail: getUserByEmail(User),
    getUserById: getUserById(User),
  };
};
