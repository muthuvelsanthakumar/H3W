import sys
import os
from jose import jwt

# Add backend to path
sys.path.append(os.path.abspath('e:/Project/backend'))

from app.core.config import settings
from app.core import security

token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NzA2ODk5NDIsInN1YiI6IjEifQ.WJ61kIDi_nIKYjm_pIKyfWBnkNvN1LAVN1--4FrQ"

print(f"Secret Key: {settings.SECRET_KEY}")
print(f"Algorithm: {security.ALGORITHM}")

try:
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[security.ALGORITHM])
    print(f"Payload: {payload}")
except Exception as e:
    print(f"Error: {e}")
