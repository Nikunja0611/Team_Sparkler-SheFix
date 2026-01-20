// backend/controllers/userController.js

// 1. Define the Register Function
const registerUser = async (req, res) => {
    try {
        // You can add your database logic here later
        // const { name, email, password } = req.body;
        
        console.log("Register API hit with data:", req.body);
        
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// 2. Define the Login Function
const loginUser = async (req, res) => {
    try {
        console.log("Login API hit");
        res.status(200).json({ message: "User logged in successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// 3. EXPORT THEM (Crucial Step)
module.exports = {
    registerUser,
    loginUser
};