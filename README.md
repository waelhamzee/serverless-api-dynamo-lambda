# 🛠️ Serverless TODO API

This project is a **serverless backend** built using the **AWS SAM (Serverless Application Model)** framework. It utilizes:

-   **Amazon API Gateway** for routing
-   **AWS Lambda Functions** for compute
-   **Amazon DynamoDB** for persistent data storage

---

## 📦 Tech Stack

-   **Language:** TypeScript
-   **Runtime:** Node.js 22.x (Lambda)
-   **Framework:** AWS SAM
-   **Database:** DynamoDB (with local testing support)
-   **Infrastructure as Code:** `template.yaml` with SAM

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/waelhamzee/serverless-api-dynamo-lambda.git
cd serverless-api-dynamo-lambda
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Run DynamoDB Locally via Docker

```bash
docker run -p 8000:8000 amazon/dynamodb-local
```

This starts a local DynamoDB instance accessible at `http://localhost:8000`.

---

### 4. Create the `Todos` Table Locally

Using AWS CLI:

```bash
aws dynamodb create-table \
  --table-name Todos \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAYPERREQUEST \
  --endpoint-url http://localhost:8000 \
  --region local
```

---

### 5. (Optional) Use DynamoDB Admin GUI

To view and manage DynamoDB visually, run:

```bash
docker run -p 8001:8001 -e DYNAMO_ENDPOINT=http://host.docker.internal:8000 aaronshaf/dynamodb-admin
```

Then visit [http://localhost:8001](http://localhost:8001) in your browser.

---

### 6. Start the Local API with SAM

```bash
sam build
sam local start-api
```

You can now test your API locally on:

```
GET    http://localhost:3000/todos
POST   http://localhost:3000/todos
DELETE http://localhost:3000/todos
```

---

### 7. Test the API

Example:

```bash
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Test todo"}'
```

---

## ☁️ Deployment to AWS

To deploy the app to AWS:

```bash
sam deploy --guided
```

Follow the prompts to specify:

-   Stack name
-   AWS region
-   Deployment stage name (e.g. `dev`, `prod`)
-   Whether to save the config for future use

After deployment, your endpoint will be something like:

```
https://<your-api-id>.execute-api.<region>.amazonaws.com/<stage>/todos
```

---

## 📁 Project Structure

```
.
├── src/
│   └── functions/
│       ├── createTodo/
│       ├── getTodos/
│       └── deleteTodo/
├── db/
│   └── dynamoClient.ts
├── template.yaml
└── README.md
```

---

## 🧪 Local vs. Production

To make the app environment-aware, set the `endpoint` for DynamoDB conditionally in your code like:

```ts
const client = new DynamoDBClient({
    region: 'us-east-1',
    ...(process.env.IS_OFFLINE && {
        endpoint: 'http://localhost:8000',
        credentials: {
            accessKeyId: 'fake',
            secretAccessKey: 'fake',
        },
    }),
});
```

And run with:

```bash
IS_OFFLINE=true sam local start-api
```

---

## 🔒 Authentication (Optional)

You can secure your API using **Cognito User Pools** with `AWS::Serverless::Api` + `Authorizers`. This requires configuring an authorizer and attaching it to your API routes.

---

## 🧑‍💻 Author

Wael Hamze – Software Engineer

---

## 📄 License

MIT
