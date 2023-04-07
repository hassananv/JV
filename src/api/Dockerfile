FROM registry.access.redhat.com/ubi8/nodejs-12:1 

COPY ./package*.json ./


RUN npm ci


COPY . ./

EXPOSE 3000


#RUN npm install --platform=linux --arch=x64 sharp@0.29.1
RUN npm run build
CMD [ "node", "./dist/index.js" ]