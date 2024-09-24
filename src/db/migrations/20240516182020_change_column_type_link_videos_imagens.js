exports.up = async function up(knex) {
  return knex.schema.alterTable('produtos', function (table) {
    table.text('link_videos_imagens').alter();
  });
}

exports.down = async function (knex) { }