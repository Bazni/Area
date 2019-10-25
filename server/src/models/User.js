module.exports = (sequelize, DataTypes) => sequelize.define('User', {
  uuid: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  role: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
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
  },
  phone: {
    type: DataTypes.STRING,
  },
  photoUrl: {
    type: DataTypes.STRING,
  },
  facebookAccessToken: {
    type: DataTypes.STRING,
  },
  googleAccessToken: {
    type: DataTypes.STRING,
  },
  twitterAccessToken: {
    type: DataTypes.STRING,
  },
}, {
  scopes: {
    noPass: {
      attributes: {
        exclude: ['password', 'facebookAccessToken', 'googleAccessToken', 'twitterAccessToken'],
      },
    },
  },
});
