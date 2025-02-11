import jwt from 'jsonwebtoken'

export const authUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if(!token){
    return res.status(401).json({ message: "Unauthorized" })
  }

  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded;
    next();
  } 
  catch(error){
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const authAdmin = (req, res, next) =>{
  const token = req.headers.authorization?.split(' ')[1]

  if(!token){
    return res.status(401).json({ message: "Unauthorized" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded.isAdmin){
      return res.status(403).json({ message: "Unauthorized" })
    }
    req.admin = decoded
    next()
  } 
  catch(error){
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
};
