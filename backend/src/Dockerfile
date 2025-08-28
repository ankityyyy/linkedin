FROM node:20-alpine

# Set working directory (auto creates folder)
WORKDIR /linkedin/nodeapp

# Copy package files first, then install deps
COPY package*.json ./
RUN npm install --production

# Copy rest of the code
COPY . .

# Set safe defaults (not secrets)
ENV PORT=5000 NODE_ENV=production

EXPOSE 5000

# Start the app
CMD ["node", "src/index.js"]
