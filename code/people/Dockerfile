FROM golang:1.12
RUN mkdir /app
COPY main.go /app/main.go

WORKDIR /app/
EXPOSE 8082
CMD ["go", "run", "main.go"]