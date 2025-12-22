const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(res => {
    console.log("connection successful")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
};

const initDB = async () => {
    await Listing.deleteMany({});
    // here the map function will not change in the array but it will make a new array and data in it
    initData.data = initData.data.map((obj) => ({...obj, owner:"68e8a3519e715ef9f861f8cd"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();
