package main

import (
	"fmt"
	"log"
	"net/http"
	"time"
)

func handler(w http.ResponseWriter, r *http.Request) {
	if _, err := fmt.Fprintf(w, "Hello from Bunderlog Forge Go server!"); err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}

func main() {
	http.HandleFunc("/api/", handler)

	// Serve static files from web for non-API requests
	fs := http.FileServer(http.Dir("web"))
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// If path starts with /api/, let the API handler handle it
		if len(r.URL.Path) >= 5 && r.URL.Path[:5] == "/api/" {
			handler(w, r)
			return
		}

		// Try to serve the static file
		f, err := http.Dir("web").Open(r.URL.Path)
		if err == nil {
			stat, statErr := f.Stat()
			if err := f.Close(); err != nil {
				log.Printf("error closing file: %v", err)
			}
			if statErr == nil && !stat.IsDir() {
				fs.ServeHTTP(w, r)
				return
			}
		}

		// If file not found, serve index.html (SPA fallback)
		index, err := http.Dir("web").Open("index.html")
		if err != nil {
			http.NotFound(w, r)
			return
		}
		defer func() {
			if err := index.Close(); err != nil {
				log.Printf("error closing index.html: %v", err)
			}
		}()
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		http.ServeContent(w, r, "index.html", indexModTime(index), index)
	})

	fmt.Println("Server running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

// indexModTime returns the ModTime of the file or zero time if error
func indexModTime(f http.File) (t time.Time) {
	if stat, err := f.Stat(); err == nil {
		return stat.ModTime()
	}
	return time.Time{}
}
