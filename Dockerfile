FROM cheeaun/puppeteer:latest
COPY . /app
RUN cd /app && yarn --production --pure-lockfile
EXPOSE 3000
WORKDIR /app
CMD yarn start
