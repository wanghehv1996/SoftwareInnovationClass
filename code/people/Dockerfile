FROM golang:1.12-alpine
RUN mkdir /app
COPY main.go /app/main.go
COPY img /app/img
COPY people.json /app/people.json

WORKDIR /app/
EXPOSE 8082
CMD ["go", "run", "main.go"]