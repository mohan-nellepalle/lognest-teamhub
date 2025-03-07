
import jwt from 'jsonwebtoken';

const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-default-jwt-secret', {
    expiresIn: '30d',
  });
};

export default generateToken;
