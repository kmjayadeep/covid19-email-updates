
cron:
	podman build -t docker.io/kmjayadeep/covid19-mailer-cron:latest --format docker cron/

cron-push:
	podman push docker.io/kmjayadeep/covid19-mailer-cron:latest

deploy:
	kubectl create configmap covid19-mailer-config --from-env-file=.env --dry-run=client -o yaml | kubectl apply -f -
	kubectl apply -f deploy/cronjob.yaml

.PHONY: cron cron-push deploy

