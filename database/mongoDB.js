import mongoose from "mongoose";

export const mongoDbConnection = async () => {
  let MONG0_URI =
    "mongodb+srv://Rishikesh:SAlqTmipGc0OiM4F@cluster0.t44b2ur.mongodb.net/social-media-app?retryWrites=true&w=majority";
  try {
    const conn = await mongoose.connect(
      //SAlqTmipGc0OiM4F
      MONG0_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log(`DATABASE CONNECTED ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error occured : ${error}`);
  }
};

//0v3Cf4xXxO2Nk6J2
