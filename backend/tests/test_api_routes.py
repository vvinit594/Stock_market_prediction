def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_dashboard_contract(client):
    response = client.get("/api/dashboard/AAPL")
    assert response.status_code == 200
    payload = response.json()
    assert "current_price" in payload
    assert "daily_change" in payload
    assert "sentiment_score" in payload
    assert "ai_signal" in payload
    assert "confidence" in payload


def test_stock_detail_contract(client):
    response = client.get("/api/stock/AAPL")
    assert response.status_code == 200
    payload = response.json()
    assert "history" in payload
    assert "indicators" in payload
    assert "prediction" in payload
    assert "sentiment_timeline" in payload


def test_news_contract(client):
    response = client.get("/api/news")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_prediction_contract(client):
    response = client.get("/api/predict/AAPL")
    assert response.status_code == 200
    payload = response.json()
    assert set(payload.keys()) >= {"signal", "confidence", "explanation"}


def test_portfolio_crud(client):
    add = client.post("/api/portfolio/add", json={"symbol": "AAPL", "company_name": "Apple Inc."})
    assert add.status_code == 200
    list_response = client.get("/api/portfolio")
    assert list_response.status_code == 200
    assert any(item["symbol"] == "AAPL" for item in list_response.json())
    delete = client.delete("/api/portfolio/AAPL")
    assert delete.status_code == 200
