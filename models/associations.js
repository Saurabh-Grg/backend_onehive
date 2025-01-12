const User = require('./userModel');
const Message = require('./messageModel');

const setupAssociations = () => {
  // Setting up associations
  Message.belongsTo(User, { as: 'Sender', foreignKey: 'senderId', onDelete: 'CASCADE' });
  Message.belongsTo(User, { as: 'Receiver', foreignKey: 'receiverId', onDelete: 'CASCADE' });
};

module.exports = setupAssociations;
