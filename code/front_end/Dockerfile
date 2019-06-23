FROM node:10.14.2

# cache package install
run mkdir dalab-fe
COPY dalab-fe/package.json /dalab-fe/package.json
COPY dalab-fe/package-lock.json /dalab-fe/package-lock.json
WORKDIR /dalab-fe
RUN npm install

COPY dalab-fe /dalab-fe
# make sure everything dependency installed
RUN npm install
RUN npm run build


FROM golang:1.12-alpine
RUN mkdir /app
COPY --from=0 /dalab-fe/build /app/build
COPY main.go /app/main.go

WORKDIR /app/
EXPOSE 8081
CMD ["go", "run", "main.go"]