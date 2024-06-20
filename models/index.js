//index.js contiene las relaciones entre los distintos modelos ORM (imitando las claves foráneas entre tablas).

const usuariosORM = require('./usuarios'); //Importo el modelo "usuarios".
const prestamosORM = require('./prestamos'); //Importo el modelo "prestamos".
const transaccionesORM = require('./transacciones'); //Importo el modelo "transacciones".

/**
 * @function definirRelaciones: define las relaciones entre tablas usando ORM.
 * @param {*} orm_pk: Este ORM representa la tabla con la primary key.
 * @param {*} orm_fk: Este ORM representa la tabla con la foreign key.
 * @param {string} fk: Foreign key.
 * @param {null} [sk=null] Ej.: Si quieres hacer una FK de uno a mucho de "usuarios" debería llamarse usuarios_id, pero en caso de no poder hacerlo Sequelize necesitará que le especifiques a qué referencia exactamente la FK, usando la SK (source key).
 * @param {null} [tk=null] EJ.: Si quieres hacer una FK de uno a uno de "usuarios" debería llamarse usuarios_id, sino, usar la TK (target key).
 */
function definirRelaciones(orm_pk,orm_fk,fk,sk=null,tk=null) { //"=null" es igual a "?" de TypeScript.
    //Si SK no es nulo, significa que no se pudo seguir el estándar Sequilize.
    if(sk) {
        //Ej.: usuariosORM.hasMany(transaccionesORM, {foreignKey: 'emisor_id', sourceKey: 'id' });
        orm_pk.hasMany(orm_fk, { foreignKey: fk, sourceKey: sk });
    }
    else {
        //Ej.: usuariosORM.hasMany(transaccionesORM, { foreignKey:'emisor_id' });
        orm_pk.hasMany(orm_fk, { foreignKey: fk });
    }

    //Si TK no es nulo, significa que no se pudo seguir el estándar Sequilize.
    if(tk) {
        //Ej.: transaccionesORM.belongsTo(usuariosORM, { foreignKey:'emisor_id', targetKey: 'id' });
        orm_fk.belongsTo(orm_pk, { foreignKey: fk, targetKey: tk });
    }
    else {
        //Ej.: transaccionesORM.belongsTo(usuariosORM, {foreignKey:'emisor_id'});
        orm_fk.belongsTo(orm_pk, {foreignKey: fk});
    }
}

//Un usuario puede tener muchos préstamos | un préstamo tiene solo un usuario:
definirRelaciones(usuariosORM,prestamosORM,'usuario_id');
//Un usuario emisor puede tener muchas transacciones | una transacción tiene solo un usuario emisor.
definirRelaciones(usuariosORM,transaccionesORM,'emisor_id','id','id');
//Un usuario receptor puede tener muchas transacciones | una transacción hecha tiene solo un usuario receptor.
definirRelaciones(usuariosORM,transaccionesORM,'receptor_id','id','id');

module.exports = definirRelaciones;
