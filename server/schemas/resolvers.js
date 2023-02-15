const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).populate("books");
        return userData;
      }
      throw new AuthenticationError("You must be logged in!");
    },
  },
  Mutation: {
    saveBook: async (parent, { bookData }, context) => {
      console.log(bookData);
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: bookData } },
          { new: true }
        );
        console.log(updatedUser)
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

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Incorrect login credentials!");
      }

      const correctPW = await user.isCorrectPassword(password);
      if (!correctPW) {
        throw new AuthenticationError("Incorrect login credentials!");
      }

      const token = signToken(user);
      return { token, user };
    },

    addUser: async (parent, args) => {
      // console.log('arg',args)
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
  },
};

module.exports = resolvers;
