//#3 setup DB models
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");

const db = new Sequelize("postgres://larrygoodman@localhost:5432/blog", {
    logging: false,
});
const User = require("./User")(db);
const Post = require("./Post")(db);

//#10 seeding the database
const createFirstUser = async () => {
    const users = await User.findAll();
    if (users.length === 0) {
        User.create({
            username: "max",
            password: bcrypt.hashSync("supersecret", 10),
        });
    }
};

const createSecondUser = async () => {
    const secondUser = await User.findOne({
        where: { username: "mr_discipline" },
    });
    if (!secondUser) {
        User.create({
            username: "mr_discipline",
            password: bcrypt.hashSync("discipline", 10),
        });
    }
};

//#5 connect and sync to DB
const connectToDB = async () => {
    try {
        await db.authenticate();
        console.log("Connected successfully");
        await db.sync(); //#6 sync by creating the tables based off our models if they don't exist already
        await createFirstUser();
        await createSecondUser();
    } catch (error) {
        console.error(error);
        console.error("PANIC! DB PROBLEMS!");
    }

    Post.belongsTo(User, { foreignKey: "authorID" });
};

connectToDB();

module.exports = { db, User, Post }; //#7 export out the DB & Model so we can use it else where in our code
