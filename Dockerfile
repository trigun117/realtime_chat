FROM alpine
COPY . .
ENTRYPOINT [ "./realtime_chat" ]