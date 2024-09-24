exports.up = async function (knex) {
  return knex.schema.createTable("agendamentos", function (table) {
    table.increments("id").primary();
    table.string("data", 20).notNullable();
    table.string("hora", 10).notNullable();
    table.bigInteger('usuario_id').notNullable();
    table.bigInteger('status').defaultTo(1);

    table.index('usuario_id');
  });
};

exports.down = async function (knex) {}