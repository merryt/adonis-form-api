'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ThreadSchema extends Schema {
  up() {
    this.create('threads', (table) => {
      table.increments()
      table.text('body')
      table.string('title')
      table.timestamps()
    })
  }

  down() {
    this.drop('threads')
  }
}

module.exports = ThreadSchema
