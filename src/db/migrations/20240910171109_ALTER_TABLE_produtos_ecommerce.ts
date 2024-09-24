import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // return knex.schema.table('produtos_ecommerce', function (table) {
  //   table.bigInteger('produto_id');

  //   table.foreign('produto_id').references('id').inTable('produtos');
  //   table.unique('produto_id');
  // });
}

export async function down(knex: Knex): Promise<void> {
  // return knex.schema.table('produtos_ecommerce', function (table) {
  //   table.dropColumn('produto_id');
  // });
}
