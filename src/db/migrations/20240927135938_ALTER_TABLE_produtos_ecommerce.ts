import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('produtos_ecommerce', function (table) {
    table.integer('marca').defaultTo(798).alter();
    table.integer('depto').defaultTo(18).alter();
    table.integer('secao').defaultTo(0).alter();
    table.boolean('destaque').defaultTo(true).alter();
    table.boolean('lancamento').defaultTo(true).alter();
    table.boolean('ativo').defaultTo(true).alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('produtos_ecommerce', function(table) {
    table.string('marca').nullable().alter();
    table.string('depto').nullable().alter();
    table.string('secao').nullable().alter();
    table.boolean('destaque').defaultTo(false).alter();
    table.boolean('lancamento').defaultTo(false).alter();
    table.boolean('ativo').defaultTo(false).alter();
  });
}
