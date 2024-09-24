exports.up = async function up(knex) {
    return knex.schema.table('divergencias_nota_fiscal', function(table) {
      table.bigInteger('agendamento_id');
    });
  }
  
exports.down = async function (knex) {}