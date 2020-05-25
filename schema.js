
// In this file we define and export the Types (as graphQL is strongly typed) we need for our GraphQl Schema
//    username: String! @unique
exports.typeDefs = `
type User {
    _id: ID
    username: String!
    password: String!
    email: String!
    joinDate: String
}
type Query {
    getCurrentUser: User
}
type Token {
    token: String!
}
type Mutation{
    signInUser(
        username: String!,
        password: String!
    ): Token
    signUpUser(
        username: String!,
        email: String!,
        password: String!
    ): Token
}
`; 