<<<<<<< HEAD
# Store-App
=======
# Store App

Store App is a Rails 8 inventory management application with:

- A web dashboard to manage products, stock-in records, and stock-out records.
- A JSON API under `/api/*` for CRUD operations.
- PostgreSQL as the primary database.

## Features

- Manage products (`name`, `price`)
- Register store-in transactions (`product_id`, `quantity`, `date`)
- Register store-out transactions (`product_id`, `quantity`, `date`)
- Use either:
	- Browser UI at `/`
	- JSON API endpoints at `/api/products`, `/api/store_ins`, `/api/store_outs`

## Tech Stack

- Ruby `3.4.8` (Dockerfile default)
- Rails `8.1.x`
- PostgreSQL
- Importmap + Turbo + Stimulus (frontend)

## Prerequisites

Install the following:

- Ruby (version compatible with Rails 8.1)
- Bundler
- PostgreSQL (running locally or remotely)

## Environment Variables

Database configuration is read from environment variables with these defaults:

- `POSTGRES_USER=postgres`
- `POSTGRES_PASSWORD=1234`
- `POSTGRES_HOST=127.0.0.1`
- `POSTGRES_PORT=5432`
- `POSTGRES_SSLMODE=disable`

You can set them in your shell before starting the app.

PowerShell example:

```powershell
$env:POSTGRES_USER="postgres"
$env:POSTGRES_PASSWORD="1234"
$env:POSTGRES_HOST="127.0.0.1"
$env:POSTGRES_PORT="5432"
$env:POSTGRES_SSLMODE="disable"
```

## Getting Started (Local)

1. Install gems:

```bash
bundle install
```

2. Create and migrate the database:

```bash
bin/rails db:create db:migrate
```

3. Start the Rails server:

```bash
bin/rails server
```

4. Open the app:

- Dashboard: `http://localhost:3000/`
- Health check: `http://localhost:3000/up`

## Database Structure

Tables:

- `product` (primary key: `product_id`)
- `store_in` (FK: `product_id -> product.product_id`)
- `store_out` (FK: `product_id -> product.product_id`)

Notes:

- Table names are singular by design (`product`, `store_in`, `store_out`).
- API controllers map correctly to these tables via explicit model configuration.

## API Reference

Base URL (local):

```text
http://localhost:3000/api
```

All endpoints return JSON.

### Products

- `GET /products`
- `GET /products/:product_id`
- `POST /products`
- `PUT /products/:product_id`
- `DELETE /products/:product_id`

Create/Update payload:

```json
{
	"product": {
		"name": "Notebook",
		"price": 2.5
	}
}
```

### Store Ins

- `GET /store_ins`
- `GET /store_ins/:id`
- `POST /store_ins`
- `PUT /store_ins/:id`
- `DELETE /store_ins/:id`

Create/Update payload:

```json
{
	"store_in": {
		"product_id": 1,
		"quantity": 20,
		"date": "2026-03-11"
	}
}
```

### Store Outs

- `GET /store_outs`
- `GET /store_outs/:id`
- `POST /store_outs`
- `PUT /store_outs/:id`
- `DELETE /store_outs/:id`

Create/Update payload:

```json
{
	"store_out": {
		"product_id": 1,
		"quantity": 5,
		"date": "2026-03-11"
	}
}
```

### Error Responses

- `404 Not Found`:

```json
{ "error": "Couldn't find ..." }
```

- `422 Unprocessable Entity`:

```json
{ "errors": ["..."] }
```

## Quick cURL Examples

Create a product:

```bash
curl -X POST http://localhost:3000/api/products \
	-H "Content-Type: application/json" \
	-d '{"product":{"name":"Pen","price":1.25}}'
```

Create a stock-in record:

```bash
curl -X POST http://localhost:3000/api/store_ins \
	-H "Content-Type: application/json" \
	-d '{"store_in":{"product_id":1,"quantity":10,"date":"2026-03-11"}}'
```

Create a stock-out record:

```bash
curl -X POST http://localhost:3000/api/store_outs \
	-H "Content-Type: application/json" \
	-d '{"store_out":{"product_id":1,"quantity":3,"date":"2026-03-11"}}'
```

## Testing

Run the test suite with:

```bash
bin/rails test
```

## Docker (Production-Oriented)

This repository includes a production Dockerfile.

Build image:

```bash
docker build -t store_app .
```

Run container:

```bash
docker run -d -p 80:80 -e RAILS_MASTER_KEY=<your-master-key> --name store_app store_app
```

## Common Issues

- Database connection failed:
	- Verify PostgreSQL is running.
	- Verify `POSTGRES_*` environment variables.
- Migration issues:
	- Run `bin/rails db:drop db:create db:migrate` in development if you need a clean reset.

## License

Add your preferred license here (MIT, Apache-2.0, etc.).
>>>>>>> master
