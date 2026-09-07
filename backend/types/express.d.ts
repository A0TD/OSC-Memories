

declare global {
  namespace Express {
    interface Request {
      // Add the custom images property (can be an array or an object)
      images?: CustomImage[]; 
    }
  }
}
