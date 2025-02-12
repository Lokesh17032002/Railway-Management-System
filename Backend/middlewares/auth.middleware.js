import jwt from 'jsonwebtoken'

export const authUser = (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
  if(!token){
    return res.status(401).json({ message: "Unauthorized" })
  }

  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded;
    console.log('User authenticated:', decoded);
    next();
  } 
  catch(error){
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const authAdmin = (req, res, next) =>{
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
  console.log('Token:', token);

  if(!token){
    return res.status(401).json({ message: "Unauthorized: No token provided" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded);
    if(!decoded.isAdmin){
      return res.status(403).json({ message: "Unauthorized: Not an admin" })
    }

    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
      return res.status(403).json({ message: 'Invalid API key.' });
    }

    req.admin = decoded
    next()
  } 
  catch(error){
    return res.status(401).json({ message: "Unauthorized" })
  }
};
