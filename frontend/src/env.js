let IS_PROD = true;

const server = IS_PROD
  ? "https://linkedin-backend-m636.onrender.com"
  : "http://localhost:8080";

export default server;