FROM node
COPY app /app
WORKDIR /app
RUN yarn install && yarn build
CMD yarn start
