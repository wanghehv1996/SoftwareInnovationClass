FROM golang:1.12

# Create the directory where the application will reside
RUN mkdir /app

# Copy the application files (needed for production)
COPY code/static /app/static
COPY code/templates /app/templates
COPY code/main.go /app/main.go

# Set the working directory to the app directory
WORKDIR /app

EXPOSE 8081

CMD ["go", "run", "main.go"]