exports.up = async function (knex) {
  return knex.schema.createTable("produtos", function (table) {
    table.increments("id").primary();
    table.string("codigo_produto_fornecedor");
    table.string("descritivo", 128);
    table.text("descritivo_pdv", 30);
    table.integer("marca").defaultTo(0);
    table.integer("depto").defaultTo(80);
    table.integer("secao").defaultTo(1);
    table.integer("grupo").defaultTo(1);
    table.integer("subgrupo").defaultTo(1);
    table.string("classificacao_fiscal", 10);
    table.integer("origem", 1).defaultTo(0);
    table.decimal("pesob").defaultTo(0);
    table.decimal("pesol").defaultTo(0);
    table.integer("validade", 5).defaultTo(0);
    table.decimal("comprimento").defaultTo(0);
    table.decimal("largura").defaultTo(0);
    table.decimal("altura").defaultTo(0);
    table.decimal("comprimento_d").defaultTo(0);
    table.decimal("largura_d").defaultTo(0);
    table.decimal("altura_d").defaultTo(0);
    table.integer("qtde_embalagem").defaultTo(0);
    table.decimal("ipi").defaultTo(0);
    table.string("pis_cofins", 1).defaultTo("M");
    table.decimal("preco").defaultTo(0);
    table.decimal("desconto_p").defaultTo(0);
    table.string("st_compra", 3).defaultTo("000");
    table.decimal("icms_compra").defaultTo(0);
    table.integer("estado").defaultTo(1);
    table.integer("status").defaultTo(1);
    table.bigInteger("fornecedor_id").notNullable();
    table.bigInteger("analista_id");
    table.bigInteger("produto_arius").defaultTo(0);
    table.text("descricao");
    table.text("caracteristica");
    table.text("modo_uso");
    table.text("imagens");
    table.timestamp("cadastro_arius");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table.index("fornecedor_id");
  });
};

exports.down = async function (knex) {};
