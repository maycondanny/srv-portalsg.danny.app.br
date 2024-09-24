exports.up = async function (knex) {
    return knex.schema.createTable("usuarios_acessos_log", function (table) {
      table.increments("id").primary();
      table.bigInteger("usuario_id");
      table.timestamp("datahora_login").defaultTo(knex.fn.now());
  
      table.index("usuario_id");
      table.unique("usuario_id");
    });
  };
  
  exports.down = async function (knex) {
    return knex.schema.dropTable("usuarios_acessos_log");
  };
  