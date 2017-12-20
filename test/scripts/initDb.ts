import * as fs from 'fs'
import { promisify } from 'util'

import * as mysql from 'mysql2/promise'
import testConfig from '../testConfig'

const readFile = promisify(fs.readFile)

beforeAll(async () => {
    // setup the database

    const conn = await mysql.createConnection({
        ...testConfig,
        multipleStatements: true,
    })

    const schema = await readFile(`${__dirname}/../fixtures/schema.sql`, 'utf8')
    const triggers = (await import('../fixtures/triggers')).default as string[]
    const data = await readFile(`${__dirname}/../fixtures/data.sql`, 'utf8')

    await conn.query(schema)
    await Promise.all(triggers.map(t => conn.query(t)))
    await conn.query(data)

    await conn.end()
})
