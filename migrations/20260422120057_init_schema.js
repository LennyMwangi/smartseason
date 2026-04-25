exports.up = function(knex) {
  return knex.schema

    .createTable('users', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email').notNullable().unique();
      table.string('password').notNullable();
      table.enu('role', ['admin', 'agent']).notNullable().defaultTo('agent');
      table.timestamps(true, true);
    })

    .createTable('fields', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('crop_type').notNullable();
      table.date('planting_date').notNullable();
      table.enu('current_stage', ['Planted', 'Growing', 'Ready', 'Harvested'])
        .notNullable()
        .defaultTo('Planted');

      table.integer('assigned_agent_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL');

      table.timestamps(true, true);
    })

    .createTable('field_updates', function(table) {
      table.increments('id').primary();

      table.integer('field_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('fields')
        .onDelete('CASCADE');

      table.integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');

      table.enu('stage', ['Planted', 'Growing', 'Ready', 'Harvested'])
        .notNullable();

      table.text('notes');
      table.timestamps(true, true);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('field_updates')
    .dropTableIfExists('fields')
    .dropTableIfExists('users');
};