import * as knex from 'knex';

export const up = function (knex: knex.Knex, Promise: any) {
	return knex.schema.createTable('ItemCategory', function (t) {
		t.increments('itemCatID').notNullable().primary();
		t.string('category', 60).notNullable();
		t.string('branch', 100);
		t.string('unit', 20);		
		t.float("price");
		t.date('createDate').notNullable().defaultTo(knex.fn.now());
		t.string('createUser', 20);
		t.date('modDate').notNullable().defaultTo(knex.fn.now());
		t.string('modUser', 20);
		t.boolean('active').notNullable().defaultTo(true);
	});
};

export const down = function (knex: knex.Knex, Promise: any) {
	return knex.schema.dropTable('ItemCategory');
};
