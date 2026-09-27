
# Company Brain

Simple project to act as company brain with people, project and entries related to projects.


## Tech Stack

**Client:** NextJs, ShadCN UI, TailwindCSS

**Server:** Django, Django Restframework, PostgreSQL, Neo4j

**LLM API:*** Groq(openai/gpt-oss-20b)


## Run Locally

Note: Run frontend differently while running all other services using docker

To deploy this project using docker

First create `.env.docker` file with these keys

`DEBUG`

`SECRET_KEY`

`POSTGRES_DB`

`POSTGRES_USER`

`POSTGRES_PASSWORD`

`POSTGRES_HOST`

`POSTGRES_PORT`

`NEO4J_URI`=bolt://neo4j:7687

`NEO4J_USERNAME`=neo4j

`NEO4J_PASSWORD`

is docker checks if they are running in same container and connects the images using internal links instead of hosts

`IS_DOCKER`=True

`LLM_BASE_URL`=https://api.groq.com/openai/v1

Generate a free secret key from https://groq.com

`LLM_SECRET_KEY`

`NEXT_PUBLIC_API_URL`=http://127.0.0.1:8000

```bash
  docker compose up -d
```
OR
```bash
  docker compose up
```
OR for backend
```bash
  cd backend
  python manage.py migrate
  python manage.py install_labels
  python manage.py createsuperuser
  python manage.py runserver
```
OR for frontend
```bash
  cd frontend
  npm install
  npm run dev
```

Then go to http://localhost:3000