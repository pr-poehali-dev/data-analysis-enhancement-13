import json
import os
import psycopg2

HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
}

def handler(event: dict, context) -> dict:
    """Возвращает список email из waitlist для админ-панели clodev.ru"""
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute("SELECT id, email, created_at FROM waitlist ORDER BY created_at DESC")
    rows = cur.fetchall()
    cur.close()
    conn.close()

    data = [
        {'id': r[0], 'email': r[1], 'created_at': r[2].isoformat()}
        for r in rows
    ]

    return {
        'statusCode': 200,
        'headers': HEADERS,
        'body': json.dumps({'emails': data, 'total': len(data)})
    }
