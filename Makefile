PROD_COMPOSE_FILE	=	docker-compose.yml
DEV_COMPOSE_FILE	=	docker-compose.dev.yml

DOCKER		=	docker compose
OPTIONS		=	#-d

_RESET		=	\e[0m
_RED			=	\e[31m
_GREEN		=	\e[32m
_YELLOW		=	\e[33m
_CYAN			=	\e[36m

all: dev

dev:
	$(DOCKER) -f $(DEV_COMPOSE_FILE) up --build $(OPTIONS)

prod:
	$(DOCKER) -f $(PROD_COMPOSE_FILE) up --build $(OPTIONS)

front:
	$(DOCKER) -f $(DEV_COMPOSE_FILE) up --build $(OPTIONS) frontend

back:
	$(DOCKER) -f $(DEV_COMPOSE_FILE) up --build $(OPTIONS) backend db

db:
	$(DOCKER) -f $(DEV_COMPOSE_FILE) up --build $(OPTIONS) db

clean:
	$(DOCKER) -f $(DEV_COMPOSE_FILE) down

fclean: clean
	$(DOCKER) -f $(DEV_COMPOSE_FILE) down --rmi all --volumes --remove-orphans

clean-docker:
	docker system prune
	docker volume prune

mclean: fclean clean-docker

.PHONY: dev prod front back clean fclean clean-docker mclean
