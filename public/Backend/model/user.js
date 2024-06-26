import mongoose from "mongoose";
import bcrypt from "bcrypt";

const user = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },

    chips: {
        type: int,
        default: 1000
    }
});

function correctPassword (enteredPassword){
    return bcrypt.compare(enteredPassword, this.password)
}
