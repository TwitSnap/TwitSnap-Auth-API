# Installs Node.js image
FROM node:22-alpine3.19

# sets the working directory
WORKDIR /usr/src/app

# Copy package.json and lock file first to leverage caching
COPY ["package.json", "package-lock.json", "./"]

# Install dependencies before copying the source code to improve caching
RUN npm install --production

# Copy tsconfig and other necessary files
COPY tsconfig.json .env ./

# Build the TypeScript code
RUN npm run build

# Use a better ENTRYPOINT or CMD for production-ready environment
CMD ["npm", "run", "start"]
