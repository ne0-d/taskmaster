import mongoose from "mongoose"

const tasksSchema = mongoose.Schema(
    {
        title:{
            type:String
        },  
        status:{
            type: String,
            enum: ["Inbox", "Completed"],
            default: "Inbox",
        },
        desc:{
            type:String
        },
        dueDate:{
            type:String
        }
    },
    {
        timestamps:true
    }
)

const UserSchema = mongoose.Schema(
    {
        name:{
            type: String,
            required: true
        },
        username:{
            type: String,
            required: true,
            unique:true,
            trim: true
        },
        password:{
            type: String,
            required: true,
            trim: true,
        },
        tasks:{
            type: [tasksSchema]
        }
    },
    {timestamps: true}
)

const UserModel = mongoose.model("Users", UserSchema);
export default UserModel;