const UserMongo = require("../models/mongo/user");

/**
 *
 * @param {User} user
 */
module.exports = async function denormalizeUserProfile(
  user,
  { needDelete = false, dbModels: { User, Article } } = {}
) {
  await UserMongo.deleteOne({ _id: user.id });
  if (needDelete) return;
  const dbUser = await User.findByPk(user.id, {
    attributes: ["id", "email"],
    include: [
      {
        model: Article,
        attributes: ["id", "title", "publicationDate"],
        order: [["publicationDate", "DESC"]],
        limit: 5,
      },
    ],
  });
  await UserMongo.create({
    _id: dbUser.id,
    ...JSON.parse(JSON.stringify(dbUser.dataValues)),
  });
};
