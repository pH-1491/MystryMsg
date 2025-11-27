import mongoose from "mongoose";


type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {

}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log(" already Connected to db");
        return;
    }

    try{
        const db = await mongoose.connect(process.env.MONGODB_URI || '');
        connection.isConnected = db.connections[0].readyState;
        console.log("Connected to db successfully");
    }catch(error){
        console.log("database connection error:", error);
        process.exit(1);
    }
}

export default dbConnect;