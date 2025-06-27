const { Model, DataTypes } = require("sequelize");
const denormalizeUser = require("../../services/denormalizeUser");

module.exports = (sequelize) => {
  class Article extends Model {
    static addHooks(models) {
      Article.addHook("afterCreate", (article) => {
        denormalizeUser({ id: article.UserId }, { dbModels: models }).catch(
          (error) => console.error("Error denormalizing user:", error)
        );
      });

      Article.addHook("afterUpdate", (article) => {
        denormalizeUser({ id: article.UserId }, { dbModels: models }).catch(
          (error) => console.error("Error denormalizing user:", error)
        );
      });

      Article.addHook("afterDestroy", (article) => {
        denormalizeUser({ id: article.UserId }, { dbModels: models }).catch(
          (error) => console.error("Error denormalizing user:", error)
        );
      });
    }

    static associate(models) {
      Article.belongsTo(models.User);
      models.User.hasMany(Article);
    }
  }

  Article.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      publicationDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize: sequelize,
    }
  );

  return Article;
};
