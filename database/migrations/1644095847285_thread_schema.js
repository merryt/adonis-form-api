'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ThreadSchema extends Schema {
  up() {
    this.create('threads', (table) => {
      table.increments()
      table.text('body')
      table.string('title')
      table.integer('user_id').unsigned().notNullable()
      table.foreign('user_id').references('id').inTable('users')
      table.timestamps()
    })
  }

  down() {
    this.drop('threads')
  }
}

module.exports = ThreadSchema
