// src/controllers/authController.js
import { User } from '../models/index.js';


import bcrypt from 'bcryptjs'

import jwt from 'jsonwebtoken'
import  {passwordRegex} from '../utils/validators.js'
import { emailRegex } from '../utils/validators.js';

const register = async (req, res, next) => {
  try {
    const { name, email, password, address } = req.body;

    if (!name || name.length < 10 || name.length > 60) return res.status(400).json({ message: 'Name must be 10-60 characters.'});
    if (!email || !emailRegex.test(email)) return res.status(400).json({ message: 'Invalid email' });
    if (!password || !passwordRegex.test(password)) return res.status(400).json({ message: 'Password must be 8-16 chars, include uppercase and special char.'});
    if (address && address.length>400) return res.status(400).json({ message: 'Address too long' });

    const existing = await User.findOne({ where: { email }});
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, address, role: 'user' });

    return res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ where: { email }});
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
     return res.cookie('token', token, {
  httpOnly: true,   // prevents JS access
  secure:true,
  sameSite: 'none', 
  maxAge: 3600000   // 1 hour
}).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role }});
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json({ message: 'Passwords required' });
    if (!passwordRegex.test(newPassword)) return res.status(400).json({ message: 'Password must be 8-16 chars, include uppercase and special char.'});

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return res.status(401).json({ message: 'Old password incorrect' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({ message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
};

const logout=async(req,res)=>{
res.clearCookie('token'); 
  res.json({ message: 'Logged out successfully' });
}
const me=async(req,res)=>{
 try {
    const user = await User.findByPk(req.user.id, { attributes: ['id', 'name', 'email', 'role'] });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}

export {register,login,changePassword,logout,me}