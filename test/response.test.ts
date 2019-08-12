import test from 'ava'
import bagger from '../lib/bagger'

test('Creating a bagger response will return isBagger = true', t => {
    const response = bagger.response(200)
    t.is(response.isBagger, true)
})

test('Simple response can be compiled', t => {
    const response = bagger.response(200).description('Successfully fetched request')

    t.deepEqual(response.compile(), {
        200: {
            description: 'Successfully fetched request'
        }
    })
})