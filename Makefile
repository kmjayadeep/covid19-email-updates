
cron:
	podman build -t docker.io/kmjayadeep/covid19-mailer-cron:latest cron/

cron-push:
	podman push docker.io/kmjayadeep/covid19-mailer-cron:latest

.PHONY: cron cron-push

