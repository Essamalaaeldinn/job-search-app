import mongoose from "mongoose";

const database_connection = async () => {
    try {
        mongoose.connect(process.env.DB_URI)
        console.log(`Database Connected job-search-app ✅`)
    } catch (err) {
        console.log(`Connection Failed ❌`)
    }
}

export default database_connection