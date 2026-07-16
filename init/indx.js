const mongoose = require("mongoose");
const initdata = require("./data.js");
const listing = require("../models/listing.js");

main()
.then(()=> console.log(" connected to db") )
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

// const initDB = async ()=>{
//    await listing.deleteMany({});
//    await listing.insertMany(initdata.data);
//    console.log("data was initialized");
// }
const initDB = async () => {
  await listing.deleteMany({});
  const cleanedData = initdata.data.map((obj) => ({
    ...obj,
    owner: "6a49485e1bf21365a0e428e7"
    // no image transform — leave obj.image as {filename, url}
  }));
  await listing.insertMany(cleanedData);
  console.log("data was initialized");
};

initDB();