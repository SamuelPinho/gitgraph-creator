FROM node:alpine3.22
# Need to be run with --tty docker run option

RUN addgroup -S gitgraph ; adduser -D -h /app -G gitgraph gitgraph 

COPY --chown=gitgraph:gitgraph . /app

USER gitgraph
WORKDIR /app

RUN yarn

ENV NODE_OPTIONS=--openssl-legacy-provider
ENV NODE_VERSION=25.6.0
ENV SHLVL=1
ENV HOME=/app
ENV PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

EXPOSE 3000

CMD ["yarn","start"]