import requests

def fetch_data(url, params=None):
    response = requests.get(url, params=params)
    response.raise_for_status()
    return response.json()
