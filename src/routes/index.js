const express = require('express');
const router = express.Router();
const sql = require('mssql');

const config = {
    user: '', //Type your SQL Server Authentication User
    password: '',
    database: 'prueba',
    server: 'localhost',
    options: {
        encrypt: true, // for azure
        trustServerCertificate: true // change to true for local dev / self-signed certs
    }
}

async function connectionSQL(){
    try {
        const pool = await sql.connect(config);
        return pool;
    } catch (error) {
        console.log(error);
    }
}

    router

.get('/', async (req, res) => {

    const pool = await connectionSQL();
    const consulta = await pool.request().query(`
        SELECT * FROM Products
    `);
    const format = consulta.recordset;

    req.getConnection( (err, conn) => {
        conn.query(`
            SELECT * FROM people
        `, (err, result) => {
            if(err) console.log(err);

            console.log(result);
            res.render('index', {
                result,
                format
            })
        })
    })
})


//MySQL Actions
.post('/addMySQL', (req, res) => {

    const {nameMySQL, age, job} = req.body;

    req.getConnection( (err, conn) => {
        conn.query(`
            INSERT INTO people
            (name, age, job)
            VALUES
            ('${nameMySQL}', '${age}', '${job}')
        `, (err, result) => {
            if(err) console.log(err);

            console.log(result);
            res.redirect('/');
        })
    })
})

.get('/infoMySQL/:id', (req, res) => {

    req.getConnection( (err, conn) => {
        conn.query(`
            SELECT * FROM people WHERE id = '${req.params.id}'
        `, (err, result) => {
            if(err) console.log(err);

            console.log(result);
            res.render('infoMySQL', {
                result
            })
        })
    })
})

.put('/updateMySQL/:id', (req, res) => {

    const {nameMySQL, age, job} = req.body;

    req.getConnection( (err, conn) => {
        conn.query(`
        UPDATE people SET
            name = '${nameMySQL}',
            age = '${age}',
            job = '${job}'
        WHERE id = '${req.params.id}'
        `, (err, result) => {
            if(err) console.log(err);

            console.log(result);
            res.redirect('/');
        })
    })
})

.delete('/deleteMySQL/:id', (req, res) => {
    req.getConnection( (err, conn) => {
        conn.query(`
            DELETE FROM people WHERE id = '${req.params.id}'
        `, (err, result) => {
            if(err) console.log(err);

            console.log(result);
            res.redirect('/');
        })
    })
})

//SQL actions
.post('/addSQL', async (req, res) => {

    const {nameSQL, description, quantity} = req.body;

    const pool = await connectionSQL();
    const result = await pool.request().query(`
        INSERT INTO Products
            (name, description, quantity)
        VALUES
            ('${nameSQL}', '${description}', '${quantity}')
    `);

    res.redirect('/');
})

.get('/infoSQL/:id', async (req, res) => {
    const pool = await connectionSQL();
    const result = await pool.request().query(`
        SELECT * FROM Products WHERE id = '${req.params.id}'
    `);
    const format = result.recordset;

    res.render('infoSQL', {
        format
    })
})

.put('/updateSQL/:id', async (req, res) => {

    const {nameSQL, description, quantity} = req.body;

    const pool = await connectionSQL();
    const result = await pool.request().query(`
        UPDATE Products SET
            name = '${nameSQL}',
            description = '${description}',
            quantity = '${quantity}'
        WHERE id = '${req.params.id}'
    `);

    console.log(result);
    res.redirect('/');
})

.delete('/deleteSQL/:id', async (req, res) => {
    const pool = await connectionSQL();
    const result = await pool.request().query(`
        DELETE FROM Products WHERE id = '${req.params.id}'
    `);
    
    console.log(result);
    res.redirect('/');
})

module.exports = router;
