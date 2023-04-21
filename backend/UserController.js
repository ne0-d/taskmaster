import UserModel from "./UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req, res) =>{
    const {name, username, password} = req.body;

    if(!username || !password || !name){
        return res.status(400).json({ message: "All fields are required" });
    }

    
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    req.body.password = hashedPass;
    try {
        const usernameCheck = await UserModel.find({username: username}) 
      
        if(usernameCheck.length != 0){
            return res.status(409).json("This username is already taken, try a different username.");
        }
        const newUser = new UserModel({name, username, password: hashedPass});
        const user = await newUser.save();
        if(user){
            const token = jwt.sign(
                {
                  name: name,
                  username: username,
                },
                process.env.JWT_KEY,
                { expiresIn: "20h" }
            );

            const userData = {username:user.username, tasks:user.tasks, name:user.name, userId: user._id};
            return res.status(200).json({ userData, token });
        }else{
            return res.status(500).json("Some internal error occured while creating user :(");
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const login = async (req, res) =>{
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    try {
      const user = await UserModel.findOne({ username:username });
  
      if (user) {
        const validity = await bcrypt.compare(password, user.password);
  
        if (!validity) {
          return res.status(400).json("Either username or password is wrong");
        } 
        else {
            const token = jwt.sign(
              {
                username: username, 
              },
              process.env.JWT_KEY,
              { expiresIn: "20h" }
            );
           const userData = {username:user.username, tasks:user.tasks, name:user.name, userId: user._id};
            return res.status(200).json({ userData, token });  
        }
      } else {
        return res.status(403).json("User does not exists");
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}

export const createTask = async (req, res) =>{
    const {userId, taskData} = req.body;

    const user = await UserModel.findById(userId) 
    if(user){
        try {
            await user.updateOne({
                $push: { tasks: taskData },
            });
            res.status(200).json("Task Added Successfully");
            
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    else{
        return res.status(403).json({ message: "Invalid Request, user does not exist!" });

    }
}

export const getTasks = async(req, res) =>{
  const {userId} = req.body;
  const user = await UserModel.findById(userId);
  if(user){
    return res.status(200).json({tasks: user.tasks})
  }else{
    return res.status(403).json("User does not exists!");
  }
}

export const updateTask = async (req, res) =>{
  const {userId, taskData} = req.body;
  
  if(!userId || !taskData)
    return res.status(404).json("Invalid Request!");
  try {
    const updatedData = await UserModel.findOneAndUpdate(
      {_id: userId, "tasks._id":taskData._id},
      {
        $set: {
          "tasks.$.title":taskData.title,
          "tasks.$.desc":taskData.desc,
          "tasks.$.dueDate":taskData.dueDate,
          "tasks.$.status":taskData.status,
        },
      },
      {new:true}
    );
    return res.status(200).json("Task Updated Successfully");
  } catch (error) {
    res.status(500).json(error);
  }
}

export const deleteTask = async (req, res) =>{
  try {
    const {userId, taskId} = req.body;
  
  if(!userId || !taskId)
    return res.status(404).json("Invalid Request!");
  try {
    const updatedData = await UserModel.findOneAndUpdate(
      {_id: userId, "tasks._id":taskId},
      {
        $pull: {
          tasks: {_id:taskId},
        },
      },
      {new:true}
    );
    return res.status(200).json("Task Deleted Successfully");
  } catch (error) {
    res.status(500).json(error);
  }
    
  } catch (error) {
    res.status(500).json(error);
  }
  
}