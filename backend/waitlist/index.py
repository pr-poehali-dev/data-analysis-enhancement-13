import json
import os
import psycopg2

HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
}

def handler(event: dict, context) -> dict:
    """Сохраняет email в список ожидания clodev.ru"""
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    body = json.loads(event.get('body') or '{}')
    email = (body.get('email') or '').strip().lower()

    if not email or '@' not in email:
        return {
            'statusCode': 400,
            'headers': HEADERS,
            'body': json.dumps({'error': 'Некорректный email'})
        }

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    cur.execute(
        "INSERT INTO waitlist (email) VALUES (%s) ON CONFLICT (email) DO NOTHING RETURNING id",
        (email,)
    )
    row = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    if row:
        return {
            'statusCode': 200,
            'headers': HEADERS,
            'body': json.dumps({'ok': True, 'message': 'Email добавлен в список'})
        }
    else:
        return {
            'statusCode': 200,
            'headers': HEADERS,
            'body': json.dumps({'ok': True, 'message': 'Email уже в списке'})
        }
