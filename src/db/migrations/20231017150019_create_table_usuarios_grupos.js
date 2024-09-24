exports.up = async function (knex) {
    return knex.schema.createTable('usuarios_grupos', function (table) {
        table.bigInteger('grupo_id').notNullable();
        table.bigInteger('usuario_id').notNullable();

        table.index('usuario_id');
    })
};

exports.down = async function (knex) {}