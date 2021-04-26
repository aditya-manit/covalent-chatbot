export default () => ({
  port: parseInt(process.env.PORT, 10) || 8008,
  mongoURI: process.env.MONGO_URI,
});