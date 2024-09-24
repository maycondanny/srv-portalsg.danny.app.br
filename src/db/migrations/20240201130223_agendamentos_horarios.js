exports.up = async function (knex) {
  return knex.schema.createTable("agendamentos_horarios", function (table) {
    table.increments("id").primary();
    table.string("data", 20).notNullable();
    table.string("hora", 10).notNullable();
    table.bigInteger("usuario_id").notNullable();

    table.index(["usuario_id", "data"]);
  });
};

exports.down = async function (knex) {}