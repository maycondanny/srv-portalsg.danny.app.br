exports.up = async function (knex) {
    return knex.schema.createTable('usuarios_acessos', function (table) {
        table.bigInteger('usuario_id').notNullable();
        table.bigInteger('acesso_id').notNullable();

        table.index('usuario_id');
    })
};

exports.down = async function (knex) {}