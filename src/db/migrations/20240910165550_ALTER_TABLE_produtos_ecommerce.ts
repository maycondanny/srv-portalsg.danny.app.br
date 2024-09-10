import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('produtos_ecommerce', function (table) {
    table.renameColumn('produto_id', 'produto_arius');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('produtos_ecommerce', function (table) {
    table.renameColumn('produto_arius', 'produto_id');
  });
}
