exports.up = async function (knex) {
    return knex.schema.createTable('sigla_estados', function (table) {
        table.increments('id').primary();
        table.string('sigla', 255).notNullable().unique();
    })
};

exports.down = async function (knex) {}