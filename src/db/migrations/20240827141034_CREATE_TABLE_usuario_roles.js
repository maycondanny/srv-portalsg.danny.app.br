exports.up = async function (knex) {
    await knex.schema.createTable("usuario_roles", function (table) {
      table.increments("id").primary();
      table.string("nome", 100);
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    });

    await knex('usuario_roles').insert([
      {
        id: 1,
        nome: 'Danny',
      },
      {
        id: 2,
        nome: 'Fornecedor',
      },
      {
        id: 3,
        nome: 'Transportadora',
      }
    ]);
  };
  
  exports.down = async function (knex) {
    return knex.schema.dropTable("usuario_roles");
  };
  