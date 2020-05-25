import { gql } from 'apollo-boost';

//user queries
export const GET_CURRENT_USER = gql`
  query{
    getCurrentUser{
      username
      joinDate
      email
    }
  }
`;

//user mutations
export const SIGNIN_USER = gql`
mutation(
  $username: String!,
  $password: String!
   ){
  signInUser(
    username: $username,
    password: $password
    ){ token }
}
`;

export const SIGNUP_USER = gql`
mutation(
    $username: String!,
    $email: String!,
    $password: String!
    ) {
    signUpUser(username: $username, email: $email, password: $password) {
      token
    }
  }
`;