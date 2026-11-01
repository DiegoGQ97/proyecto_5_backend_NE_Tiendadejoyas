const express = require('express');
const cors = require('cors');
const { obtenerJoyas, obtenerTodasLasJoyas, obtenerJoyasFiltradas } = require('./consultas');

const app = express();

app.listen(3000, console.log("Servidor encendido en el puerto 3000"));
app.use(cors());
app.use(express.json());

const reportarConsulta = async (req, res, next) => {
    const url = req.url;
    const metodo = req.method;
    console.log(`[REPORTE]: Se ha realizado una consulta a la ruta ${url} con el método ${metodo}`);
    next();
};



app.use(reportarConsulta);


const JSON_HATEOAS = (joyas, todasLasJoyas) => {
    const stockTotal = todasLasJoyas.reduce((usr, item) => usr + item.stock, 0);
    const results = joyas.map((j) => {
        return {
            name: j.nombre,
            href: `/joyas/joya/${j.id}`
        };
    });

    return {
        totalJoyas: joyas.length,
        stockTotal,
        results
    };
};

app.get('/joyas', async (req, res) => {
    try {
        const queryStrings = req.query;
        const joyas = await obtenerJoyas(queryStrings);
        const todasLasJoyas = await obtenerTodasLasJoyas();
        const hateoas = JSON_HATEOAS(joyas, todasLasJoyas);
        res.json(hateoas);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/joyas/filtros', async (req, res) => {
    try {
        const queryStrings = req.query;
        const joyas = await obtenerJoyasFiltradas(queryStrings);
        res.json(joyas);
    } catch (error) {
        res.status(500).send(error.message);
    }
});
