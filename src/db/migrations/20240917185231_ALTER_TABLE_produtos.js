exports.up = async function up(knex) {
  return knex.schema.table("produtos", function (table) {
    table.integer("comprador").defaultTo(118);
    table.string("categoria_fiscal", 2).defaultTo("00");
  });
};

exports.down = async function (knex) {
  return knex.schema.table("produtos", function (table) {
    table.dropColumn("comprador");
    table.dropColumn("categoria_fiscal");
  });
};
