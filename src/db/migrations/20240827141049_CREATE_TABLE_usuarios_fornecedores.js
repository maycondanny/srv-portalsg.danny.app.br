exports.up = async function (knex) {
    return knex.schema.createTable("usuarios_fornecedores", function (table) {
      table.bigInteger("usuario_id");
      table.bigInteger("fornecedor_id");

      table.foreign('usuario_id').references('id').inTable('usuarios');
      table.foreign('fornecedor_id').references('id').inTable('fornecedores');

      table.index("usuario_id");
      table.unique(["usuario_id", "fornecedor_id"]);
    });
  };
  
  exports.down = async function (knex) {
    return knex.schema.dropTable("usuarios_fornecedores");
  };
  