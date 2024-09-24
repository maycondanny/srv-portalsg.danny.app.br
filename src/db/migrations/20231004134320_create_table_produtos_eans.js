exports.up = async function (knex) {
    return knex.schema.createTable('produtos_eans', function (table) {
        table.increments('id').primary();
        table.string('codigo_ean', 16).notNullable();
        table.bigInteger('produto_id').notNullable();
        table.string('quantidade').notNullable();
        table.string('tipo');
        table.string('ean_principal', 1).defaultTo('F');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());

        // table.foreign('produto_id').references('id').inTable('produtos').onDelete('CASCADE');
    })
};

exports.down = async function (knex) {}