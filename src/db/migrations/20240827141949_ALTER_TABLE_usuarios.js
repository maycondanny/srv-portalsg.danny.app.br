exports.up = async function up(knex) {
  return knex.schema.table("usuarios", function (table) {
    table.integer("role").defaultTo(1);
    table.foreign("role").references("id").inTable("usuario_roles");
  });
};

exports.down = async function (knex) {
  return knex.schema.table("usuarios", function (table) {
    table.dropColumn("role");
  });
};
