const mongoose = require("mongoose");
const { Subscriber } = require("../model/subscribers");


async function addSubscribers() {
  // Connect to the database
  await mongoose.connect("mongodb://127.0.0.1:27017/nyala", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }); // Update with your MongoDB connection string

  // Create an array of promises for adding subscribers
  const subscriberPromises = Array.from({ length: 500 }, (_, index) => {
    const subscriber = new Subscriber({
      email: `subscriber${index + 1}@example.com`,
      name: `Subscriber ${index + 1}`,
      subscription: ["ICT", "CMD", "Leden"],
    });

    return subscriber.save();
  });

  // Wait for all promises to resolve
  await Promise.all(subscriberPromises);

  // Disconnect from the database
  await mongoose.disconnect();
}

addSubscribers().catch(console.error);

exports.addSubscribers = addSubscribers;


