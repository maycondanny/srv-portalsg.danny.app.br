exports.up = async function up(knex) {
    return knex.schema.createTable("notas_fiscais", function (table) {
      table.increments("id").primary();
      table.string("caminho", 255).notNullable();
      table.string("arquivo", 255).notNullable();
      table.bigInteger("usuario_id").notNullable();
      table.bigInteger("agendamento_id").notNullable();
  
      table.index(["usuario_id", "agendamento_id"]);
    });
  };
  
  exports.down = async function (knex) {};
  