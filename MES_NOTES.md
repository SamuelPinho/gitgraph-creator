# Mes notes

## Incus / Lxc

```shell
code
NODE_OPTIONS=--openssl-legacy-provider
incus launch images:alpine/edge gitgraph
incus shell gitgraph
        gitgraph:~# apk add nodejs yarn
        gitgraph:~# apk add openssl
        gitgraph:~# mkdir gitgraph
        gitgraph:~# echo "export NODE_OPTIONS=--openssl-legacy-provider" >> .profile
incus file push ./ gitgraph/root/gitgraph -rp
incus exec gitgraph --cwd /root/gitgraph --env NODE_OPTIONS=--openssl-legacy-provider -- yarn start
```

## Docker

cf [Dockerfile](./Dockerfile)

```shell
docker build -t djayroma/testgitgraph:alpine3.22 .
docker run --tty --port 3000:3000 djayroma/testgitgraph:alpine3.22
# Important le --tty

$ docker run -dt -p 3000:3000 djayroma/testgitgraph:alpine3.22 
d83622bb2d1454238d31f3619ca7f4f810977d011bffa392c0f98924e4a77604
# Le -d pour l'arrière plan
```
