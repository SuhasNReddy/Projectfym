const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const businessSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Business Name"],
        maxLength: [30, "Business Name cannot exceed 30 characters"],
        minLength: [4, "Business Name should have more than 5 characters"]
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Business Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a Valid Email"],
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Business Password"],
        minLength: [8, "Password should be greater than 8 characters"],
        select: false
    },
});

businessSchema.pre("save", async function(next) {

    if(!this.isModified("password")) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);

});

// JWT TOKEN
businessSchema.methods.getJWTToken = function () {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// Compare Password
businessSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generating Password Reset Token
businessSchema.methods.getResetPasswordToken = function () {

    // Generatinng Token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hashing and adding resetPasswordToken to businessSchema
    this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
};

module.exports = mongoose.model("Business", businessSchema);
