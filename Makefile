.PHONY: test

define run_docker
	docker run -it -v '$(shell pwd):/app:delegated' -w /app -p "8080:8080" node:12-alpine sh -c $1
endef

run:
	$(call run_docker,"yarn && yarn start")

