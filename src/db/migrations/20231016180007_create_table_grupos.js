exports.up = async function (knex) {
    return knex.schema.createTable('grupos', function (table) {
        table.increments('id').primary();
        table.string('nome', 100).notNullable();
        table.bigInteger('setor_id').notNullable();
        table.tinyint('ativo', 1).defaultTo(1);
    })
};

exports.down = async function (knex) {}