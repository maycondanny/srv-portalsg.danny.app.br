exports.up = async function up(knex) {
    return knex.schema.table('produtos', function(table) {
        table.integer('departamento');
        table.integer('grupo');
        table.integer('sub_grupo');
    });
  }
  
exports.down = async function (knex) {}