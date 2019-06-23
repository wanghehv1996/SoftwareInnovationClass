package main

// ref https://medium.com/google-cloud/building-a-go-web-app-from-scratch-to-deploying-on-google-cloud-part-1-building-a-simple-go-aee452a2e654
// ref https://gowebexamples.com/http-server/
// resources 
    // https://www.huweihuang.com/golang-notes/web/beego/beego-introduction.html
    // https://github.com/gin-gonic/gin
    // https://beego.me/docs/install/bee.md
    // https://echo.labstack.com/guide
    // https://github.com/kataras/iris

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

    fmt.Println(http.ListenAndServe(":8081", nil));
}