docker build --rm --no-cache -t $DREPO .
echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
docker push $DREPO