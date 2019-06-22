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
    "time"
    "html/template"
)

type Welcome struct {
    Name string
    Time string
}

func main() {
    welcome := Welcome{"Anonymous", time.Now().Format(time.Stamp)}

    templates := template.Must(template.ParseFiles("templates/index.html"))

    http.Handle("/static/", //final url can be anything
        http.StripPrefix("/static/",
            http.FileServer(http.Dir("static")))) 

    http.HandleFunc("/" , func(w http.ResponseWriter, r *http.Request) {
        if name := r.FormValue("name"); name != "" {
            welcome.Name = name;
        }
        if err := templates.ExecuteTemplate(w, "index.html", welcome); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
        }
    })

    fmt.Println("Listening");
    fmt.Println(http.ListenAndServe(":8081", nil));
}