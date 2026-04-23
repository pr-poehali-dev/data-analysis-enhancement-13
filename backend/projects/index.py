import json
import os
import psycopg2

HEADERS = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}

def get_user(cur, session_id):
    cur.execute("""
        SELECT u.id FROM sessions s JOIN users u ON s.user_id = u.id
        WHERE s.id = %s AND s.expires_at > NOW()
    """, (session_id,))
    row = cur.fetchone()
    return row[0] if row else None

def handler(event: dict, context) -> dict:
    """CRUD проектов пользователя"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {**HEADERS, 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id'}, 'body': ''}

    session_id = (event.get('headers') or {}).get('X-Session-Id', '')
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    user_id = get_user(cur, session_id)
    if not user_id:
        cur.close(); conn.close()
        return {'statusCode': 401, 'headers': HEADERS, 'body': json.dumps({'error': 'Не авторизован'})}

    method = event.get('httpMethod')

    if method == 'GET':
        cur.execute("""
            SELECT p.id, p.name, p.repo_url, p.framework, p.domain, p.status, p.created_at,
                   (SELECT status FROM deployments WHERE project_id = p.id ORDER BY created_at DESC LIMIT 1) as last_deploy_status,
                   (SELECT created_at FROM deployments WHERE project_id = p.id ORDER BY created_at DESC LIMIT 1) as last_deploy_at
            FROM projects p WHERE p.user_id = %s ORDER BY p.created_at DESC
        """, (user_id,))
        rows = cur.fetchall()
        cur.close(); conn.close()
        projects = [{'id': r[0], 'name': r[1], 'repo_url': r[2], 'framework': r[3], 'domain': r[4],
                     'status': r[5], 'created_at': r[6].isoformat(),
                     'last_deploy_status': r[7], 'last_deploy_at': r[8].isoformat() if r[8] else None} for r in rows]
        return {'statusCode': 200, 'headers': HEADERS, 'body': json.dumps({'projects': projects})}

    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        name = (body.get('name') or '').strip()
        repo_url = (body.get('repo_url') or '').strip()
        framework = body.get('framework') or 'other'
        if not name:
            cur.close(); conn.close()
            return {'statusCode': 400, 'headers': HEADERS, 'body': json.dumps({'error': 'Укажите название проекта'})}
        cur.execute(
            "INSERT INTO projects (user_id, name, repo_url, framework) VALUES (%s, %s, %s, %s) RETURNING id",
            (user_id, name, repo_url, framework)
        )
        project_id = cur.fetchone()[0]
        cur.execute(
            "INSERT INTO deployments (project_id, status, commit_message) VALUES (%s, %s, %s)",
            (project_id, 'success', 'Initial deployment')
        )
        conn.commit()
        cur.close(); conn.close()
        return {'statusCode': 200, 'headers': HEADERS, 'body': json.dumps({'ok': True, 'id': project_id})}

    cur.close(); conn.close()
    return {'statusCode': 405, 'headers': HEADERS, 'body': json.dumps({'error': 'Method not allowed'})}
