exports.up =  async function (knex) {
    return knex.schema.createTable('produtos_status', function (table) {
        table.increments('id').primary();
        table.string('descricao', 255).notNullable().unique();
    })
};

exports.down = async function (knex) {}