const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UsersDAO = require("../dao/usersDAO");

const hashPassword = async (password) => await bcrypt.hash(password, 10);

class User {
  constructor({ name, email, password } = {}) {
    this.name = name;
    this.email = email;
    this.password = password;
  }
  toJson() {
    return {
      name: this.name,
      email: this.email,
    };
  }
  async comparePassword(plainText) {
    return await bcrypt.compare(plainText, this.password);
  }
  encoded() {
    console.log(this.toJson());
    return jwt.sign(
      {
        data: this.toJson(),
      },
      process.env.SECRET_KEY,
      { expiresIn: Math.floor(Date.now() / 1000) + 60 * 60 * 4 }
    );
  }
  static async decoded(userJwt) {
    return jwt.verify(userJwt, process.env.SECRET_KEY, (error, res) => {
      if (error) {
        return { error };
      }
      return new User(res);
    });
  }
}

class UserController {
  static async register(req, res) {
    try {
      const userFromBody = req.body;
      let errors = {};
      if (userFromBody && userFromBody.password.length < 8) {
        errors.password = "Your password must be at least 8 characters.";
      }
      if (userFromBody && userFromBody.name.length < 3) {
        errors.name = "You must specify a name of at least 3 characters.";
      }

      if (Object.keys(errors).length > 0) {
        res.status(400).json(errors);
        return;
      }

      const userInfo = {
        ...userFromBody,
        password: await hashPassword(userFromBody.password),
      };
      let checkUserExistence = await UsersDAO.getUserByEmail(
        userFromBody.email
      );
      if (checkUserExistence && checkUserExistence.email) {
        errors.email = "email already exists";
        return res.status(400).json(errors);
      }

      const insertResult = await UsersDAO.addUser(userInfo);
      if (!insertResult.success) {
        errors.email = insertResult.error;
      }
      const userFromDB = await UsersDAO.getUserByEmail(userFromBody.email);
      if (!userFromDB) {
        errors.general = "Internal error, please try again later";
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
      }

      const user = new User(userFromDB);

      return res.json({
        auth_token: user.encoded(),
        info: user.toJson(),
      });
    } catch (e) {
      return res.status(500).json({ error: e.toString() });
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || typeof email !== "string") {
        res.status(400).json({ error: "Bad email format, expected string." });
        return;
      }
      if (!password || typeof password !== "string") {
        res
          .status(400)
          .json({ error: "Bad password format, expected string." });
        return;
      }

      let userData = await UsersDAO.getUserByEmail(email);
      if (!userData) {
        res.status(401).json({ error: "Make sure your email is correct." });
        return;
      }

      const user = new User(userData);

      if (!(await user.comparePassword(password))) {
        res.status(401).json({ error: "Make sure your password is correct." });
        return;
      }

      let hashedPassword = await hashPassword(password);
      const loginResponse = await UsersDAO.loginUser(
        user.email,
        hashedPassword
      );
      if (!loginResponse.success) {
        res.status(500).json({ error: loginResponse.error });
        return;
      }

      res.status(200).json({ auth_token: user.encoded(), info: user.toJson() });
    } catch (e) {
      res.status(400).json({ error: e.toString() });
      return;
    }
  }
}

module.exports = UserController;
