exports.up = async function up(knex) {
    return knex.schema.table("notas_fiscais", function (table) {
      table.integer("sku");
      table.integer("pecas");
    });
  };
  
  exports.down = async function (knex) {};
  