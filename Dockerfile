# Used strictly during development by docker-compose file in project root
FROM node:13.12.0-alpine

# set working directory
WORKDIR /front-end-dev

# add `/app/node_modules/.bin` to $PATH
ENV PATH /front-end-dev/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install
RUN npm install react-scripts@3.4.1 -g

# copy the actual app
COPY . .

# start app
CMD ["npm", "start"]
