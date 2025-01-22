const mongoose = require("mongoose");

class Database {
    constructor() {
        if (!Database.instance) {
            this.mongoConnection = null;
            Database.instance = this;
        }
        return Database.instance;
    }

    async connect(CONNECTION_STRING) {
        try {
            console.log("DB Connecting...");
            this.mongoConnection = await mongoose.connect(CONNECTION_STRING);
            console.log("DB Connected.");
        } catch (err) {
            console.error("Database connection error:", err);
            process.exit(1);
        }
    }
}

// Singleton tasarım deseniyle dışa aktarma
module.exports = new Database();
