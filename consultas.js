const pool = require('./db');

const obtenerJoyas = async ({ limits = 10, page = 1, order_by = 'id_ASC' }) => {
    const [campo, direccion] = order_by.split('_');
    const offset = (page - 1) * limits;

    const query = `
        SELECT * FROM inventario 
        ORDER BY ${campo} ${direccion} 
        LIMIT $1 OFFSET $2
    `;
    
    const { rows } = await pool.query(query, [limits, offset]);
    return rows;
};

const obtenerTodasLasJoyas = async () => {
    const { rows } = await pool.query('SELECT * FROM inventario');
    return rows;
};


const obtenerJoyasFiltradas = async ({ precio_max, precio_min, categoria, metal }) => {
    let filtros = [];
    const values = [];

    if (precio_max) {
        values.push(precio_max);
        filtros.push(`precio <= $${values.length}`);
    }
    if (precio_min) {
        values.push(precio_min);
        filtros.push(`precio >= $${values.length}`);
    }
    if (categoria) {
        values.push(categoria);
        filtros.push(`categoria = $${values.length}`);
    }
    if (metal) {
        values.push(metal);
        filtros.push(`metal = $${values.length}`);
    }

    let query = 'SELECT * FROM inventario';
    if (filtros.length > 0) {
        query += ` WHERE ${filtros.join(' AND ')}`;
    }

    const { rows } = await pool.query(query, values);
    return rows;
};

module.exports = {
    obtenerJoyas,
    obtenerTodasLasJoyas,
    obtenerJoyasFiltradas
};
