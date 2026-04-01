import urllib.request
import json

req = urllib.request.Request(
    'http://localhost:8000/adminapi/login',
    data=b'{"account":"admin","pwd":"123456"}',
    headers={'Content-Type': 'application/json'}
)
try:
    with urllib.request.urlopen(req) as response:
        body = response.read()
        print("HTTP Status:", response.status)
        print("Raw response (str):", body.decode('utf-8'))
        print("Raw response (repr):", repr(body))
except Exception as e:
    import urllib.error
    if isinstance(e, urllib.error.HTTPError):
        body = e.read()
        print("HTTP Error:", e.code)
        print("Raw Error Body (repr):", repr(body))
    else:
        print("Error:", e)
