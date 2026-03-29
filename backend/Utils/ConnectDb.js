import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"

let dbConnectionMode = "unknown";
let inMemoryServer = null;

export const getDbConnectionMode = () => dbConnectionMode;

const ConnectToDb = async () => {
  if (process.env.MONGO_URI) {
    try {
      const status = await mongoose.connect(process.env.MONGO_URI)
      if (status) {
        dbConnectionMode = "uri";
        console.log("Connected to Database (MongoDB URI)")
        return
      }
    } catch (error) {
      console.warn("Failed to connect using MONGO_URI, will attempt in-memory MongoDB:", error.message)
    }
  } else {
    console.warn("MONGO_URI not set, starting in-memory MongoDB")
  }

  try {
    inMemoryServer = await MongoMemoryServer.create()
    const uri = inMemoryServer.getUri()

    await mongoose.connect(uri)
    dbConnectionMode = "memory";
    console.log("Connected to in-memory MongoDB (fallback)")
    process.once("SIGINT", async () => {
      await mongoose.disconnect()
      if (inMemoryServer) {
        await inMemoryServer.stop()
      }
      process.exit(0)
    })
  } catch (error) {
    console.error("Failed to connect to fallback in-memory MongoDB:", error)
    process.exit(1)
  }
}

export default ConnectToDb