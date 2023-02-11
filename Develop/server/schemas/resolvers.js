const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    user: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).populate("books");
        return userData;
      }
      // throw new AuthenticationError("You must be logged in!");
    },
  },
  Mutation: {
    saveBook: async (parent, { bookData }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: bookData } },
          { new: true }
        ).populate("books");
        return updatedUser;
      }
      throw new AuthenticationError("You must be logged in to save books!");
    },
    removeBook: async (parent, { bookData }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: bookData } },
          { new: true }
        ).populate("books");
        return updatedUser;
      }
      throw new AuthenticationError("You must be logged in to delete books!");
    },
  },
};

module.exports = resolvers;
