FROM node:latest
RUN mkdir -p /dockerdir
# Create app directory
WORKDIR /dockerdir
# Install app dependencies
COPY package*.json /dockerdir/

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . /dockerdir

EXPOSE 5555

CMD npx webpack --config webpack.config.js && node server-node/server.js