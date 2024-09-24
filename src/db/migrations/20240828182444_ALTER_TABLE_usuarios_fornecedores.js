exports.up = async function up(knex) {
  return knex.schema.table("usuarios_fornecedores", function (table) {
    table.text("token");
    table.tinyint("ativo", 1).defaultTo(0);
    table.timestamp("datahora_ativacao");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {
  return knex.schema.table("usuarios_fornecedores", function (table) {
    table.dropColumn("token");
    table.dropColumn("ativo");
    table.dropColumn("datahora_ativacao");
    table.dropColumn("created_at");
  });
};
