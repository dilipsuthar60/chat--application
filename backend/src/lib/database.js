import mongoose from "mongoose";

export const databaseConnection = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`mongodb connected sucessfully ${connection.connection.host}`);
  } catch (error) {
    console.error(error);
  }
};
