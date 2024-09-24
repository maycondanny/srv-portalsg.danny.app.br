exports.up = async function up(knex) {
    return knex.schema.table('produtos', function(table) {
        table.decimal('preco_custo');
        table.string('situacao_tributaria', 5);
        table.decimal('icms_tabela');
        table.decimal('ipi_tabela');
        table.decimal('desconto_p');
    });
  }
  
exports.down = async function (knex) {}