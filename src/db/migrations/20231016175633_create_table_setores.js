exports.up = async function (knex) {
    return knex.schema.createTable('setores', function (table) {
        table.increments('id').primary();
        table.string('nome', 50).notNullable();
        table.tinyint('ativo', 1).defaultTo(1);
    })
};

exports.down = async function (knex) {}