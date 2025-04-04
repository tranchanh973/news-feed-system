import mongoose from "mongoose";

const connectionString = process.env.MONGO_DB_URI;

if (!connectionString) {
  throw new Error(
    "Please provide a valid MongoDB Atlas connection string in MONGO_DB_URI"
  );
}

mongoose.set("debug", true);

const connectdb = async () => {
  if (mongoose.connection?.readyState >= 1) {
    console.log("---- Already connected to MongoDB ----");
    return;
  }
  try {
    const connectionInstance = await mongoose.connect(connectionString);

    console.log(
      `\nMongoDB connected successfully! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (err) {
    console.error("MongoDB connection error: ", err);
    process.exit(1);
  }
};

export { connectdb };
