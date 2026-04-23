import json
import os
import hashlib
import secrets
import psycopg2

HEADERS = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def handler(event: dict, context) -> dict:
    """Авторизация: POST /register, POST /login, GET /me"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {**HEADERS, 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id'}, 'body': ''}

    params = event.get('queryStringParameters') or {}
    action = params.get('action', '')
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    # ?action=me
    if action == 'me':
        session_id = (event.get('headers') or {}).get('X-Session-Id', '')
        if not session_id:
            cur.close(); conn.close()
            return {'statusCode': 401, 'headers': HEADERS, 'body': json.dumps({'error': 'Нет сессии'})}
        cur.execute("""
            SELECT u.id, u.email, u.name, u.avatar_url, u.created_at
            FROM sessions s JOIN users u ON s.user_id = u.id
            WHERE s.id = %s AND s.expires_at > NOW()
        """, (session_id,))
        row = cur.fetchone()
        cur.close(); conn.close()
        if not row:
            return {'statusCode': 401, 'headers': HEADERS, 'body': json.dumps({'error': 'Сессия истекла'})}
        return {'statusCode': 200, 'headers': HEADERS, 'body': json.dumps({'user': {'id': row[0], 'email': row[1], 'name': row[2], 'avatar_url': row[3], 'created_at': row[4].isoformat()}})}

    body = json.loads(event.get('body') or '{}')

    # ?action=register
    if action == 'register':
        email = (body.get('email') or '').strip().lower()
        password = body.get('password') or ''
        name = (body.get('name') or '').strip()
        if not email or '@' not in email:
            cur.close(); conn.close()
            return {'statusCode': 400, 'headers': HEADERS, 'body': json.dumps({'error': 'Некорректный email'})}
        if len(password) < 6:
            cur.close(); conn.close()
            return {'statusCode': 400, 'headers': HEADERS, 'body': json.dumps({'error': 'Пароль минимум 6 символов'})}
        cur.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cur.fetchone():
            cur.close(); conn.close()
            return {'statusCode': 409, 'headers': HEADERS, 'body': json.dumps({'error': 'Email уже зарегистрирован'})}
        cur.execute("INSERT INTO users (email, password_hash, name) VALUES (%s, %s, %s) RETURNING id",
                    (email, hash_password(password), name or email.split('@')[0]))
        user_id = cur.fetchone()[0]
        session_id = secrets.token_hex(32)
        cur.execute("INSERT INTO sessions (id, user_id) VALUES (%s, %s)", (session_id, user_id))
        conn.commit(); cur.close(); conn.close()
        return {'statusCode': 200, 'headers': HEADERS, 'body': json.dumps({'ok': True, 'session': session_id, 'user': {'id': user_id, 'email': email, 'name': name or email.split('@')[0]}})}

    # ?action=login
    if action == 'login':
        email = (body.get('email') or '').strip().lower()
        password = body.get('password') or ''
        if not email or not password:
            cur.close(); conn.close()
            return {'statusCode': 400, 'headers': HEADERS, 'body': json.dumps({'error': 'Заполните все поля'})}
        cur.execute("SELECT id, name, password_hash FROM users WHERE email = %s", (email,))
        row = cur.fetchone()
        if not row or row[2] != hash_password(password):
            cur.close(); conn.close()
            return {'statusCode': 401, 'headers': HEADERS, 'body': json.dumps({'error': 'Неверный email или пароль'})}
        user_id, name, _ = row
        session_id = secrets.token_hex(32)
        cur.execute("INSERT INTO sessions (id, user_id) VALUES (%s, %s)", (session_id, user_id))
        conn.commit(); cur.close(); conn.close()
        return {'statusCode': 200, 'headers': HEADERS, 'body': json.dumps({'ok': True, 'session': session_id, 'user': {'id': user_id, 'email': email, 'name': name}})}

    cur.close(); conn.close()
    return {'statusCode': 400, 'headers': HEADERS, 'body': json.dumps({'error': 'Укажите action'})}