package main

import (
    "net/http"
    "fmt"
    "html/template"
    "path/filepath"
)

func main() {
    http.Handle("/static/",
        http.StripPrefix("/static/", http.FileServer(http.Dir("build/static"))))

    http.HandleFunc("/" , func(w http.ResponseWriter, r *http.Request) {
        fp := filepath.Join("build", filepath.Clean(r.URL.Path))
        tmpl, _ := template.ParseFiles(fp)
        tmpl.Execute(w, nil)
    })

    fmt.Println(http.ListenAndServe(":8082", nil));
}