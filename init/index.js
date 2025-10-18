const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
.then(() =>{
    console.log("connected to DB");
})
.catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/stayomi');
}

const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "68d646621527195776d0d1e9"}))
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();