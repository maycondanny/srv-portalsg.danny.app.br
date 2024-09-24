exports.up = async function (knex) {
    return knex.schema.createTable('usuarios_setores', function (table) {
        table.bigInteger('setor_id').notNullable();
        table.bigInteger('usuario_id').notNullable();

        table.index('usuario_id');
    })
}

exports.down = async function (knex) {}
