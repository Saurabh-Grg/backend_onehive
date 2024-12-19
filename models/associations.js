const User = require('./userModel');
const Message = require('./messageModel');

const setupAssociations = () => {
  // User associations
  User.hasMany(Message, { foreignKey: 'sender_id', as: 'SentMessages' });
  User.hasMany(Message, { foreignKey: 'receiver_id', as: 'ReceivedMessages' });

  // Message associations
  Message.belongsTo(User, { foreignKey: 'sender_id', as: 'Sender' });
  Message.belongsTo(User, { foreignKey: 'receiver_id', as: 'Receiver' });
};

module.exports = setupAssociations;