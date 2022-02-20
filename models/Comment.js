const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Comment extends model {}

Comment.init({});

module.exports = Comment;