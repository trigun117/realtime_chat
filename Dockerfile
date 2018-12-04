# Stage I
FROM golang:alpine as builder
RUN apk update && apk add --no-cache git ca-certificates
COPY . $GOPATH/src/realtime_chat/chat
WORKDIR $GOPATH/src/realtime_chat/chat
RUN go get github.com/gorilla/websocket
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -installsuffix cgo -ldflags="-w -s" -o /go/bin/chat
# Stage II
FROM scratch
COPY ./views views
COPY --from=builder /go/bin/chat .
EXPOSE 80
ENTRYPOINT [ "./chat" ]