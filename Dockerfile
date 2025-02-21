# Dockerfile

# base image with package manager
FROM node:22 AS base 

RUN npm i -g pnpm

# another stage for dependencies using large image
FROM base AS dependencies

# just for declare where the container will work
WORKDIR /usr/src/app

# necessary to run the pnpm install
COPY package.json pnpm-lock.yaml ./

RUN pnpm install

# another stage for build using large image
FROM base AS build

WORKDIR /usr/src/app

# this copy all the code to our container
COPY . .
# this copy from the dependencies image step and bring to this step
COPY --from=dependencies /usr/src/app/node_modules ./node_modules

RUN pnpm build
# prune will remove all the dev dependencies and build with only its necessary
RUN pnpm prune --prod

# final stage using the smallest image as runner, this image from google does not have terminal/bash
FROM gcr.io/distroless/nodejs22 AS runner

# create a non-root user
USER 1000

WORKDIR /usr/src/app

# copy thing from build step
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./package.json

# We can use this way to non sensible variables and when have the same value on all the environments
# the good practice is to put on terminal command like, -e ENV='value': docker run -p 3000:3333 -e CLOUDFLARE_ENV='' -d upload-widget-server:v1 
# ENV DATABASE_URL='postgresql://#'
# ENV CLOUDFLARE_ACCOUNT_ID='#'
# ENV CLOUDFLARE_ACCESS_KEY_ID="#"
# ENV CLOUDFLARE_SECRET_ACCESS_KEY="#"
# ENV CLOUDFLARE_BUCKET="#"
# ENV CLOUDFLARE_PUBLIC_URL="https://pub-localhost.r2.dev"

# this can be used to pass variables in build time
# ARG DATABASE_URL='postgresql://#'

EXPOSE 3333

# CMD ["node", "dist/infra/http/server.mjs"]
# the distroless for default runs node and do not need to specify the node command
CMD ["dist/infra/http/server.mjs"]