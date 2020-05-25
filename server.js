const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const cors = require('cors');
require('dotenv').config({path: 'variables.env'});
const { ApolloServer, gql } = require('apollo-server-express');
const { typeDefs } = require('./schema');
const { resolvers } = require('./resolvers');
const jwt = require("jsonwebtoken");

// here we connect to the MongoAtlas DB
mongoose
    .connect(process.env.MONGO_URI)
    .then(()=> console.log('DB connected'))
    .catch( err => console.log(err));

// Initializes the express aplication.
const app = express();

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
}

// use Cors, optional with ApolloServer
app.use(cors(corsOptions));

// setup JWT authentication middleware
//Called everytime a request is sent to the server, at least in this case.
app.use(async (req, res, next) =>{
    console.log({requestHeaders: req.headers})
    const token = req.headers['authorization'];
    console.log("SECRET ", process.env.SECRET, "\n", {token})
    console.log("NEXT FUNCTION", next)
    if (token !== "null"){
        try {
           const currentUser = await jwt.verify(token, process.env.SECRET) 
            req.currentUser = currentUser;
        } catch (error) {
            console.log(error)
        }
    }
    // call the next middleware function in the stack...
    next();
});

// this variable is an instance of the ApolloServer
// it takes our Typedefs, resolvers, and the context 
// also we can give it the playground specs
const server = new ApolloServer({ 
    typeDefs, 
    resolvers, 
    context: ({req, res}) => ({
        User,
        currentUser: req.currentUser
    }),
    playground: {
        endpoint: "/graphql"
    }
});

// apply middleware  from our Express .app to the APolloServer
server.applyMiddleware({ app });

//expose the app on this port...
const PORT = process.env.PORT || 4444;

app.listen(PORT, () => {
    console.log(`Server Listening on ${PORT}`);
})