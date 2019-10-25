module.exports = (sequelize, DataTypes) => sequelize.define('AREA', {
  uuid: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  userUUID: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'uuid',
    },
  },
  actionUUID: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Actions',
      key: 'uuid',
    },
  },
  reactionUUID: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Reactions',
      key: 'uuid',
    },
  },
  actionConfig: {
    type: DataTypes.JSON,
  },
  reactionConfig: {
    type: DataTypes.JSON,
  },
  lastState: {
    type: DataTypes.JSON,
  },
});
