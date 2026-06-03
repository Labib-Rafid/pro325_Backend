const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async(req, res)=>{
    const {name, email, password, role, department_id, registration_number} = req.body;

    if(!name || !email || !password || !department_id || !registration_number){
        return res.status(400).json({
            message: "All Fields are required"
        });
    }
    try{
        const checkUserSql = `SELECT * FROM users WHERE email = ? OR registration_number = ?`;
        
        db.query(checkUserSql, [email, registration_number], async (err, result)=>{
            if(err){
                return res.status(500).json({
                    message: "Database Error!",
                    error: err.message
                });
            }

            if(result.length > 0){
                return res.status(400).json({
                    message: "Email Or Registration Number Already Registered!"
                });
            }

            const hashedPass = await bcrypt.hash(password, 10);

            const innerSql = `
                INSERT INTO users 
                    (name, email, password_hash, department_id, registration_number)
                    VALUES (?, ?, ?, ?, ?)
            `;

            db.query(innerSql,[
                        name,
                        email,
                        hashedPass,
                        department_id,
                        registration_number || null
                    ], (err, result)=>{
                if(err){
                    return res.status(500).json({
                        message: "Registration Failed!",
                        error: err.message
                    });
                }
                else{
                    res.status(201).json({
                        message: "User Registered Successfully!"
                    });
                }
            })

        });
    }
    catch(error){
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};


const loginUser = async(req, res)=>{
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({
            message: "Email & Password Fields are required"
        });
    }
    try{
        const Usersql = `SELECT * FROM users WHERE email = ?`;

        db.query(Usersql, [email], async (err, result)=>{
            if(err){
                return res.status(500).json({
                    message: "Database Error!",
                    error: err.message
                });
            }

            if(result.length === 0){
                return res.status(401).json({
                    message: "Invalid Email Or Password!"
                });
            }

            const user = result[0];

            const isMatch = await bcrypt.compare(
                password, user.password_hash
            );

            if(!isMatch){
                return res.status(401).json({
                    message: "Invalid Email Or Password!"
                });
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    department_id: user.department_id,
                    registration_number: user.registration_number
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "7d"
                }
            );
            
            res.status(200).json({
                message: "Log-In Successful",
                token: token,
                user:{
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    department_id: user.department_id,
                    registration_number: user.registration_number
                }
            });


        });

    }
    catch(error){
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};

module.exports = {registerUser, loginUser};