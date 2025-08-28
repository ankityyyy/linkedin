let IS_PROD = true;

const server = IS_PROD
  ?"http://localhost:8080":"https://linkedin-backend-m636.onrender.com"
  

export default server;