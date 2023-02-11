const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Book {
    _id: ID!
    authors: String!
    description: String!
    image: String!
    bookId: String!
    link: String!
    title: String!
  }

  type User {
    _id: ID!
    username: String!
    password: String!
    email: String!
    savedBooks: [Book]
  }

  type Query {
    user: User
  }

  input BookInput {
    authors: String!
    description: String!
    image: String!
    bookId: String!
    link: String!
    title: String!
  }

  type Mutation {
    saveBook(bookData: BookInput!): User
    removeBook(bookId: ID!): User
  }
`;

module.exports = typeDefs;
