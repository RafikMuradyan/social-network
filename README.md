# Social Network API

## Setup

1. Install dependencies:

```bash
yarn
```

2. Create .env file from .env.example
   copy .env.example to .env and fill in the values

3. Create database social_network
   in psql console run:

```sql
CREATE DATABASE social_network;
```

4. Run migrations to create initial tables:

```bash
yarn db:migrate
```

5. Run the server:

```bash
yarn start
```
