<!-- Test Health -->
sudo docker exec -it kafka kafka-topics \
  --bootstrap-server localhost:9092 \
  --describe \
  --topic flow-events

<!-- Create topic  -->
sudo docker exec -it kafka kafka-topics \
  --bootstrap-server localhost:9092 \
  --create \
  --topic flow-events \
  --partitions 1 \
  --replication-factor 1

<!-- Consume -->
sudo docker exec -it kafka kafka-console-consumer \
  --bootstrap-server localhost:9092 \
  --topic flow-events \
  --from-beginning

<!-- publish -->
sudo docker exec -it kafka kafka-console-producer \
  --broker-list localhost:9092 \
  --topic flow-events


