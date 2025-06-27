const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const denormalizeUser = require("../../services/denormalizeUser");

module.exports = (sequelize) => {
  class User extends Model {
    static addHooks(models) {
      User.addHook("beforeCreate", async function (user) {
        user.password = await bcrypt.hash(
          user.password,
          await bcrypt.genSalt()
        );
      });
      User.addHook("beforeUpdate", async function (user, { fields }) {
        if (fields.includes("password")) {
          user.password = await bcrypt.hash(
            user.password,
            await bcrypt.genSalt()
          );
        }
      });

      User.addHook("afterCreate", (user) => {
        denormalizeUser(user, { dbModels: models }).catch((error) =>
          console.error("Error denormalizing user:", error)
        );
      });

      User.addHook("afterUpdate", (user) => {
        denormalizeUser(user, { dbModels: models }).catch((error) =>
          console.error("Error denormalizing user:", error)
        );
      });

      User.addHook("afterDestroy", (user) => {
        denormalizeUser(user, { needDelete: true, dbModels: models }).catch(
          (error) => console.error("Error denormalizing user:", error)
        );
      });
    }
  }

  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,32}/,
        },
      },
      role: {
        type: DataTypes.ENUM("ROLE_ADMIN", "ROLE_USER"),
        allowNull: false,
        defaultValue: "ROLE_USER",
      },
      birthDate: DataTypes.DATEONLY,
      isActivated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize: sequelize,
    }
  );

  return User;
};
