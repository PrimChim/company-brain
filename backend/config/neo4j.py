from decouple import config
from neo4j import GraphDatabase


driver = GraphDatabase.driver(
    config("NEO4J_URI"),
    auth=(
        config("NEO4J_USERNAME"),
        config("NEO4J_PASSWORD"),
    ),
)


def verify_connection():
    driver.verify_connectivity()
    return "Neo4j connection successful"