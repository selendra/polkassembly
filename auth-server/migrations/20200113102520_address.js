// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
exports.up = function(knex) {
	return knex.schema.createTable('address', (table) => {
		table.increments('id').primary().notNullable();
		table.integer('user_id').notNullable();
		table.enu('network', ['selendra', 'kumandra']).notNullable();
		table.string('address');
		table.string('public_key');
		table.uuid('sign_message');
		table.boolean('verified').defaultTo(false);
		table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
		table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE').onUpdate('RESTRICT');
	});
};

exports.down = function(knex) {
	return knex.schema.dropTable('address');
};
