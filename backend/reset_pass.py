import os
import psycopg2
import bcrypt
from dotenv import load_dotenv

load_dotenv()
try:
    print("Resetting password for darioquintas@yahoo.com...")
    conn = psycopg2.connect(os.environ['DATABASE_URL'].split('?')[0])
    cur = conn.cursor()
    
    password = b"Admin1234!"
    salt = bcrypt.gensalt(10)
    hashed = bcrypt.hashpw(password, salt).decode('utf-8')
    
    cur.execute("UPDATE app_users SET password_hash = %s WHERE email = 'darioquintas@yahoo.com'", (hashed,))
    conn.commit()
    print("Password reset successful to 'Admin1234!'")
except Exception as e:
    print("Error:", e)
