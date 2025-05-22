import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const users = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Doe" },
];

const posts = [
  { id: "1", title: "Post 1", content: "Content 1", authorId: "1" },
  { id: "2", title: "Post 2", content: "Content 2", authorId: "1" },
  { id: "3", title: "Post 3", content: "Content 3", authorId: "2" },
];

const server = new ApolloServer({
  typeDefs: `#graphql
        type Query {
            users: [User!]!
            posts: [Post!]!
        }
        type User {
            id: ID!
            name: String!
            posts: [Post!]!
        }
        type Post {
            id: ID!
            title: String!
            content: String!
            author: User!
        }
        type Mutation {
            createUser(name: String!): User!
            createPost(title: String!, content: String!, authorId: ID!): Post!
            updateUser(id: ID!, name: String!): User!
            deleteUser(id: ID!): User!
            updatePost(id: ID!, title: String!, content: String!): Post!
            deletePost(id: ID!): Post!
        }
    `,
  resolvers: {
    Query: {
      users: () => users,
      posts: () => posts,
    },
    User: {
      posts: (parent) => posts.filter((post) => post.authorId === parent.id),
    },
    Post: {
      author: (parent) => users.find((user) => user.id === parent.authorId),
    },
    Mutation: {
      createUser: (parent, args) => {
        const user = { id: users.length + 1, name: args.name };
        users.push(user);
        return user;
      },
      createPost: (parent, args) => {
        const post = { id: posts.length + 1, ...args };
        posts.push(post);
        return post;
      },
      updateUser: (parent, args) => {
        const user = users.find((user) => user.id === args.id);
        if (!user) {
          throw new Error("User not found");
        }
        user.name = args.name;
        return user;
      },
      deleteUser: (parent, args) => {
        const user = users.find((user) => user.id === args.id);
        if (!user) {
          throw new Error("User not found");
        }
        users.splice(users.indexOf(user), 1);
        return user;
      },
      updatePost: (parent, args) => {
        const post = posts.find((post) => post.id === args.id);
        if (!post) {
          throw new Error("Post not found");
        }
        post.title = args.title;
        post.content = args.content;
        return post;
      },
      deletePost: (parent, args) => {
        const post = posts.find((post) => post.id === args.id);
        if (!post) {
          throw new Error("Post not found");
        }
        posts.splice(posts.indexOf(post), 1);
        return post;
      },  
    },
  },
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀 Server ready at: ${url}`);
