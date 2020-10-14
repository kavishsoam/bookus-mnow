# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM tiangolo/node-frontend:10 as build-stage
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
# Copy app source code
COPY ./ ./
RUN npm run build-prod

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html
# Copy the default nginx.conf provided by tiangolo/node-frontend
# COPY --from=build-stage /nginx.conf /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/nginx.conf