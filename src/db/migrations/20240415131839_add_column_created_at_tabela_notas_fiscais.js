exports.up = async function up(knex) {
    return knex.schema.table('notas_fiscais', function(table) {
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }
  
exports.down = async function (knex) {}
