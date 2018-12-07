package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

// Message contains user data
type Message struct {
	Username string `json:"username"`
	Message  string `json:"message"`
}

// Count contains count of connected users
type Count struct {
	UsersCount int `json:"users_count"`
}

const port = ":80"

var clients = make(map[*websocket.Conn]bool)
var broadcast = make(chan Message)
var m sync.Mutex
var c Count

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func (c *Count) countUsers() {
	for k, v := range clients {
		fmt.Println(k, v)
	}
	c.UsersCount = len(clients)
}

func handleCount(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(c)
}

func handleConnections(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal(err)
	}
	defer ws.Close()
	m.Lock()
	clients[ws] = true
	c.countUsers()
	m.Unlock()
	for {
		var msg Message
		err := ws.ReadJSON(&msg)
		if err != nil {
			log.Println(err)
			m.Lock()
			delete(clients, ws)
			c.countUsers()
			m.Unlock()
			break
		}
		broadcast <- msg
	}

}

func handleMessages() {
	for {
		msg := <-broadcast
		for client := range clients {
			err := client.WriteJSON(msg)
			if err != nil {
				log.Println(err)
				client.Close()
				m.Lock()
				delete(clients, client)
				c.countUsers()
				m.Unlock()
			}

		}
	}
}

func main() {
	http.Handle("/", http.FileServer(http.Dir("./views/")))
	http.HandleFunc("/ws", handleConnections)
	http.HandleFunc("/count", handleCount)
	go handleMessages()
	log.Println("Server started on ", port)
	log.Fatal(http.ListenAndServe(port, nil))
}
