let users;

class UsersDAO {
  static async injectDB(conn) {
    if (users) {
      return;
    }
    try {
      users = await conn.db(process.env.DB_NAME).collection("users");
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`);
    }
  }
  static async getUser(id) {
    return await users.findOne({ _id: id });
  }

  static async getUserByEmail(email) {
    let user = await users.findOne({ email: email });
    return user;
  }
  static async addUser({ name, email, password }) {
    try {
      let user = await users.insertOne(
        { name, email, password },
        {
          writeConcern: { w: "majority" },
        }
      );
      return { success: true };
    } catch (e) {
      if (String(e).startsWith("MongoError: E11000 duplicate key error")) {
        return { error: "A user with the given email already exists." };
      }
      console.error(`Error occurred while adding new user, ${e}.`);
      return { error: e };
    }
  }

  static async loginUser(email, password) {
    try {
      let error = {};
      if (!email || !password) {
        error = {
          email: "email do not exist",
          password: " password do not exist",
        };
      }
      console.log("logging in ", email, password);
      const user = await users.findOne({ email: email });
      if (!user) {
        error.email = "email do not exists";
      }
      if (Object.keys(error).length > 0) {
        return { error: error };
      }
      return { success: true };
    } catch (err) {
      console.log(err);
      return { error: "Query Error could not find email" };
    }
  }
}

module.exports = UsersDAO;
