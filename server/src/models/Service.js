module.exports = (sequelize, DataTypes) => sequelize.define('Service', {
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
  photoUrl: {
    type: DataTypes.STRING,
  },
}, {
  scopes: {
    about: {
      attributes: {
        exclude: ['uuid', 'description', 'photoUrl', 'createdAt', 'updatedAt'],
      },
    },
  },
});
