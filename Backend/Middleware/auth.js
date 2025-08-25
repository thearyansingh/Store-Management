
import jwt from 'jsonwebtoken'

export const authenticate = (req, res, next) => {

   const token = req.cookies.token;
   if (!token) return res.status(401).json({ message: 'Token missing' });


  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, role }
    // console.log(req.user)
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
