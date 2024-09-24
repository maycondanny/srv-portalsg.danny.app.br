exports.up = async function (knex) {
    return knex.schema.createTable("produtos_ecommerce", function (table) {
      table.increments("id").primary();
      table.bigInteger("produto_id");
      table.string("nome", 128);
      table.integer("marca").defaultTo(0);
      table.integer("depto").defaultTo(0);
      table.integer("secao").defaultTo(0);
      table.text("modo_uso");
      table.text("descricao");
      table.text("caracteristica");
      table.boolean("destaque").defaultTo(false);
      table.boolean("lancamento").defaultTo(false);
      table.boolean("ativo").defaultTo(false);
      table.integer("status").defaultTo(1);
      table.bigInteger("fornecedor_id").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
  
      table.index(["produto_id", "fornecedor_id"]);
    });
  };
  
  exports.down = async function (knex) {
    return knex.schema.dropTable("produtos_ecommerce");
  };
  