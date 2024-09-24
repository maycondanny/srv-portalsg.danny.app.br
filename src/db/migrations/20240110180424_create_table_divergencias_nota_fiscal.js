exports.up = async function (knex) {
  return knex.schema.createTable("divergencias_nota_fiscal", function (table) {
    table.increments("id").primary();
    table.bigInteger("fornecedor_id").notNullable();
    table.bigInteger("usuario_id").notNullable();
    table.text("descricao").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.tinyint("ativo", 1).defaultTo(1);

    table.index(["fornecedor_id", "usuario_id"]);
  });
};

exports.down = async function (knex) {}