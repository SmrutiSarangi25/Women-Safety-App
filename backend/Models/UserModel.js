import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    location: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    review: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const ContactSchema= mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    photo:{
        type: String,
        default: "../Utils/woman.webp"
    },
    name: {
        type: String,
        required: true
    },
    MobileNo: {
        type: String,
        required: true
    },
},{
    timestamps:true
})

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: function () {
            return !this.isGoogleUser;
        }
    },
    profilePhoto: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvFbJHIvlkPWSvsJ1rWRbr64ZPiCCdb1SCLg&s"
    },
    reviews: {
        type: [ReviewSchema],
        default: []
    },
    contacts: {
        type: [ContactSchema],
        default: []
    },
    emergencyContacts: [{
        name: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        email: String,
        notificationMethods: {
            type: [String],
            enum: ['sms', 'email', 'whatsapp'],
            default: ['sms']
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    status: {
        type: String,
        enum: ['active', 'suspended', 'deleted'],
        default: 'active'
    },
    suspensionReason: String,
    googleId: {
        type: String,
        sparse: true
    },
    isGoogleUser: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const User = mongoose.model("User", UserSchema);

export default User;