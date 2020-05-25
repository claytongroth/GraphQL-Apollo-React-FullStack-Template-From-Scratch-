// In this file we define our resolvers
// these tell our Apollo server to get data from our MongoDB based on our GraphQL queries.
// We suplly the query, Apollo hits GraphQL, then it hits our MongoDB
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//This function creates a JWT with jsonwebtoken to pass back and forth. 
const createToken = (user, secret, expiresIn) => {
    console.log("Create token fired ", {user}, {secret}, {expiresIn})
    const {username, email} = user;
    return jwt.sign({username, email}, secret, { expiresIn })
}
// the format is (parent, args, context)
exports.resolvers = {
    Query: {
        getCurrentUser: async (root, args, {currentUser, User}) => {
            console.log({currentUser}, {User})
            if(!currentUser){
                console.log("No current user...")
                return null;
            }
            const user = await User.findOne({ username: currentUser.username})
           
            return user;
        }
    },
    Mutation: {
        signInUser: async (root, {username, password}, {User}) => {
            console.log(" signInUser fired with...", {User}, {username}, {password})
            const user = await User.findOne({username});
            if(!user){
                throw new Error('User not Found');
            }
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword){
                throw new Error('Invalid password');
            }
            return { token: createToken(user, process.env.SECRET, '1hr')}
        },
        signUpUser : async (root, { username, email, password }, { User }) =>{
            console.log(" signUpUser fired with...", {User}, {username}, {password})
            const user = await User.findOne({username});
            if (user){
                throw new Error("User already exists!")
            }
            const newUser = await new User({
                username,
                email,
                password
            }).save();
            return { token: createToken(newUser, process.env.SECRET, '1hr')}
        }
    }

};