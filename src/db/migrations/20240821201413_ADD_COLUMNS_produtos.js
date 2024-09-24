exports.up = async function up(knex) {
  return knex.schema.table("produtos", function (table) {
    table.text("modo_uso");
    table.text("descricao");
    table.text("caracteristica");
    table.text("imagens");
    table.string("tipo_tributacao", 1).defaultTo("F");
  });
};

exports.down = async function (knex) {
  return knex.schema.table("produtos", function (table) {
    table.dropColumn("modo_uso");
    table.dropColumn("descricao");
    table.dropColumn("caracteristica");
    table.dropColumn("imagens");
    table.dropColumn("tipo_tributacao");
  });
};
