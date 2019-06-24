package main

import (
    "net/http"
    "fmt"
)

func main() {
    http.Handle("/img/",
        http.StripPrefix("/img/", http.FileServer(http.Dir("img"))))

    http.HandleFunc("/" , func(w http.ResponseWriter, r *http.Request) {
        if r.URL.Path == "/people.json" {
            w.Header().Set("Access-Control-Allow-Origin", "*")
            http.ServeFile(w, r, "people.json")
        }
    })

    fmt.Println(http.ListenAndServe(":8082", nil));
}