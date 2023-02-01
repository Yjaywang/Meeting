require("dotenv").config();
const { server, io } = require("./socketIOServer");
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`PORT: ${PORT} listened by server.`);
});
