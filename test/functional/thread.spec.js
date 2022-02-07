'use strict'

const ThreadController = require("../../app/Controllers/Http/ThreadController")
const Thread = require("../../app/Models/Thread")

const Factory = use('Factory')

const { test, trait } = use('Test/Suite')('Thread')
const Tread = use('App/Models/Thread')

trait('Test/ApiClient')
trait('DatabaseTransactions')
trait('Auth/Client')

test('can authorized users create threads', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()

  const attributes = {
    title: 'test title',
    body: 'body',
    user_id: user.id
  }

  const response = await client.post('/threads').loginVia(user).send(attributes).end()
  const thread = await Thread.firstOrFail();
  response.assertJSON({ thread: thread.toJSON() })
  response.assertJSONSubset({ thread: attributes })
})


test('can authorized users delete threads', async ({ assert, client }) => {
  const thread = await Factory.model('App/Models/Thread').create()
  const owner = await thread.user().first()
  const response = await client.delete(thread.url()).send().loginVia(owner).end()
  response.assertStatus(204)
  assert.equal(await Thread.getCount(), 0)

})


test(`unauthenticated users can't create threads`, async ({ client }) => {

  const response = await client.post('/threads').send({
    title: "threads title",
    body: "here is the content of the thread"
  }).end()

  response.assertStatus(401)
})

test('unauthenticated user can not delete threads', async ({ client }) => {
  const thread = await Factory.model('App/Models/Thread').create()
  const response = await client.delete(thread.url()).send().end()
  response.assertStatus(401)
})

test('thread can not be deleted by a user who did not create it', async ({ client }) => {
  const thread = await Factory.model('App/Models/Thread').create()
  const notOwner = await Factory.model('App/Models/User').create()
  const response = await client.delete(thread.url()).send().loginVia(notOwner).end()
  response.assertStatus(403)
})