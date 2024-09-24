exports.up = async function (knex) {
    return knex.schema.createTable('acessos_grupos', function (table) {
        table.bigInteger('grupo_id').notNullable();
        table.bigInteger('acesso_id').notNullable();

        table.index(['acesso_id', 'grupo_id'])
    })
};

exports.down = async function (knex) {}