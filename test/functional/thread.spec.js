'use strict'

const ThreadController = require("../../app/Controllers/Http/ThreadController")
const Thread = require("../../app/Models/Thread")

const Factory = use('Factory')

const { test, trait } = use('Test/Suite')('Thread')
const Tread = use('App/Models/Thread')

trait('Test/ApiClient')
trait('DatabaseTransactions')

test('can create threads', async ({ client }) => {
  const response = await client.post('/threads').send({
    title: 'test title',
    body: 'body'
  }).end()
  response.assertStatus(200)

  const thread = await Thread.firstOrFail()
  response.assertJSON({ thread: thread.toJSON() })
})


test('can delete threads', async ({ assert, client }) => {
  const thread = await Factory.model('App/Models/Thread').create()
  const response = await client.delete(thread.url()).send().end()
  response.assertStatus(204)
  assert.equal(await Thread.getCount(), 0)

})