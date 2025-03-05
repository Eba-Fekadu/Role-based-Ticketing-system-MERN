import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    profilePicture:{
        type: String,
        default:"https://cropconex.com/wp-content/plugins/buddyboss-platform/bp-core/images/profile-avatar-buddyboss.png",
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    }
},{timestamps: true})

const User = mongoose.model('User', userSchema);
export default User