import json
from openai import OpenAI
from neomodel import db
from config.settings import llm_base_url, llm_secret_key
from .models import Entry

client = OpenAI(
    base_url=llm_base_url,
    api_key=llm_secret_key
)

SYSTEM_PROMPT = """
You are an intent parser for a Neo4j Knowledge Base.
Extract intent into a strict JSON object with keys:
{
    "entry_type": "decision" | "task" | "risk" | "fact" | null,
    "status": string or null,
    "person_name": string or null,
    "project_name": string or null
}
Return ONLY valid JSON.
"""

def parse_intent_from_prompt(user_prompt: str) -> dict:
    """
    Sends the user prompt to the LLM and parses the response into structured intent parameters.
    """
    completion = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt}
        ],
        response_format={"type": "json_object"}
    )
    return json.loads(completion.choices[0].message.content)


def build_cypher_query(parsed_intent: dict) -> tuple[str, dict]:
    """
    Constructs a dynamic Cypher query string and parameter dictionary based on parsed intent.
    """
    query = "MATCH (e:Entry)"
    params = {}

    if parsed_intent.get("person_name"):
        query += "-[:INVOLVES]->(p:Person)"
        query += " WHERE toLower(p.name) CONTAINS toLower($person_name)"
        params["person_name"] = parsed_intent["person_name"]

    if parsed_intent.get("project_name"):
        query += "-[:BELONGS_TO]->(pr:Project)"
        prefix = " AND " if "WHERE" in query else " WHERE "
        query += f"{prefix}toLower(pr.name) CONTAINS toLower($project_name)"
        params["project_name"] = parsed_intent["project_name"]

    conditions = []
    if parsed_intent.get("entry_type"):
        conditions.append("e.entry_type = $entry_type")
        params["entry_type"] = parsed_intent["entry_type"]

    if parsed_intent.get("status"):
        conditions.append("toLower(e.status) = toLower($status)")
        params["status"] = parsed_intent["status"]

    if conditions:
        prefix = " AND " if "WHERE" in query else " WHERE "
        query += prefix + " AND ".join(conditions)

    query += " RETURN DISTINCT e LIMIT 25"
    return query, params


def execute_entry_query(query: str, params: dict) -> list[Entry]:
    """
    Executes a Cypher query on Neo4j and returns inflated Entry instances.
    """
    results, _ = db.cypher_query(query, params)
    
    entries = []
    for row in results:
        node = row[0]
        # Handle cases where node is wrapped in a list
        if isinstance(node, list) and len(node) > 0:
            node = node[0]
            
        if hasattr(node, "labels"):  # Raw Neo4j Driver Node
            entries.append(Entry.inflate(node))
        else:
            entries.append(node)
            
    return entries