module.exports = (sequelize, DataTypes) => sequelize.define('Reaction', {
  uuid: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  function: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  config: {
    type: DataTypes.JSON,
  },
}, {
  scopes: {
    about: {
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    },
  },
});
