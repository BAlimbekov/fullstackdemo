const e = require('express');
const express = require('express')
const app = express()
const port = 3000

const {Client} = require('pg');
const connectionString = "postgresql://postgres:docker@127.0.0.1:5432/cars_db";
const client = new Client({
    connectionString: connectionString
});

client.connect();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/cars', (req, res) => {
  client.query("SELECT * FROM  cars")
  .then((result) => {
    res.status(200).send(result.rows);
  })
  .catch((err) => console.error(err.stack))
})

app.get('/api/cars/:id', (req, res)=> {
    const id = req.params.id;
    client.query(`SELECT * FROM cars WHERE id=${id}`)
    .then((result) =>{
        res.status(200).send(result.rows)
    })
    .catch((err) => console.error(err.stack))
})

app.post('/api/cars', (req, res) => {
    let car = req.body;
    let make = car.make;
    let model = car.model;
    let odometer = car.odometer;
    let availible = car.availible;
    let queryString ="INSERT INTO cars (make, model, odometer, availible) VALUES($1, $2, $3, $4)"
    console.log(car)
    client.query(queryString, [make, model, odometer, availible])
    .then ((result) => {
        res.status(200).send(result.rows)
    })
    .catch((err) => console.error(err.stack))
});

app.delete('/api/cars/:id', (req, res) => {
    let car = req.body;
    let make = car.make;
    let model = car.model;
    let odometer = car.odometer;
    let availible = car.availible;
    let id = req.params.id;
    client.query(`DELETE FROM cars WHERE id=${id}`)
    .then((result) => {
        res.status(200).send(result.rows)
    })
    .catch((err) => console.error(err.stack))
});

app.patch('/api/cars/:id', (req, res) => {
        let car = req.body;
        let make = car.make;
        let model = car.model;
        let odometer = car.odometer;
        let availible = car.availible;
        let id = req.params.id;
        client.query(`UPDATE cars SET model='${model}', make='${make}', odometer=${odometer}, availible=${availible} WHERE id=${id}`)
        .then ((result) => {
            res.status(200).send(result.rows)
        })
        .catch((err) => console.error(err.stack))
});

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})