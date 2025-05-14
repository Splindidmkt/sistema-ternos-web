
# Sistema Web de Gestão de Ternos

Este sistema foi construído com React (frontend) e FastAPI (backend) para controle de estoque, vendas e relatórios de uma confecção de ternos.

## Como executar

### Pré-requisitos
- Node.js
- Python 3.10+
- PostgreSQL
- Conta no Render.com (opcional para deploy gratuito)

### Frontend
```bash
cd frontend
npm install
npm run build
```

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # ou venv\Scripts\activate no Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

### Deploy
1. Suba tudo para um repositório GitHub.
2. Crie 3 serviços no Render:
   - Static Site (pasta frontend/build)
   - Web Service (backend)
   - PostgreSQL Database

3. Configure variáveis de ambiente no backend:
   - SECRET_KEY
   - DATABASE_URL
# sistema-ternos-web
# sistema-ternos-web
