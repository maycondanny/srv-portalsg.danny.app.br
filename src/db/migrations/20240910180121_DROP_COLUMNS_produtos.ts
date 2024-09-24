import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // return knex.schema.table('produtos', function (table) {
  //   table.dropColumn('modo_uso');
  //   table.dropColumn('caracteristica');
  //   table.dropColumn('descricao');
  //   table.dropColumn('imagens');
  // });
}

export async function down(knex: Knex): Promise<void> {
  // return knex.schema.table('produtos', function (table) {
  //   table.text('modo_uso');
  //   table.text('caracteristica');
  //   table.text('descricao');
  //   table.text('imagens');
  // });
}
