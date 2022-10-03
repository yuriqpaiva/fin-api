const express = require('express');
const { v4: uuidV4 } = require('uuid');

const app = express();

app.use(express.json());

const customers = [];

// Middleware
function verifyIfAccountCPFExists(request, response, next) {
  const { cpf } = request.headers;

  const customer = customers.find((customer) => customer.cpf === cpf);

  if (!customer) {
    return response.status(400).json({ message: 'Customer not found' });
  }

  request.customer = customer;
  return next();
}

app.post('/account', (request, response) => {
  const { cpf, name } = request.body;

  const customerAlreadyExists = customers.some(
    (customer) => customer.cpf === cpf
  );

  if (customerAlreadyExists) {
    return response.status(400).json({ error: 'Customer already exists' });
  }

  customers.push({
    id: uuidV4(),
    cpf,
    name,
    statement: [],
  });

  return response.status(201).send();
});

app.get('/statement', verifyIfAccountCPFExists, (request, response) => {
  const { customer } = request;

  return response.status(200).json(customer.statement);
});

app.listen(3333, () => {
  console.log('Listening...');
});
