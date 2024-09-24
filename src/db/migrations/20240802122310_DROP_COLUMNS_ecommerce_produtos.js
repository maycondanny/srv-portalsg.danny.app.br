exports.up = async function up(knex) {
  const columnsToDrop = [
    "eco_nome",
    "eco_marca",
    "eco_depto",
    "eco_secao",
    "destaque",
    "lancamento",
    "ativo",
    "modo_uso",
    "descricao",
    "caracteristica",
    "imagens",
  ];

  for (const column of columnsToDrop) {
    const exists = await knex.schema.hasColumn("produtos", column);
    if (exists) {
      await knex.schema.table("produtos", function (table) {
        table.dropColumn(column);
      });
    }
  }
};

exports.down = async function (knex) {};
