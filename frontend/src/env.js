let IS_PROD = true;

const server = IS_PROD
  ?"http://ec2-13-49-80-235.eu-north-1.compute.amazonaws.com:8080":"http://localhost:8080";
  

export default server;