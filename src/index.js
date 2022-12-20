import sourceMap from 'source-map'
import fetch from 'node-fetch'
import fs from 'fs-extra'
import path from 'path'
import {fileURLToPath} from 'node:url'
import ora from 'ora'


const __dirname = path.dirname(fileURLToPath(import.meta.url))


const {SourceMapConsumer} = sourceMap

export const parseLoc = (r) => {
    const [p, filePart, line, column] = r.split(':')
    const file = `${p}:${filePart}.map`
    return {line: parseInt(line), column: parseInt(column), file}
}

export async function locate(file, line, column) {
    console.log('starting...')
    // console.log(`fetching ${file}...`)

    const spinner = ora(`Fetching source map ${file}...`).start()
    const r = await fetch(file)
    // console.log('Got', r.status, r.statusText)
    if (!r.ok) {
        spinner.fail('Got error response, terminating')
        console.log('Terminating')
        return
    }
    spinner.succeed('Source map downloaded successfully')
    spinner.start(`Parsing source map...`)
    // console.log(`parsing json...`)
    const rawSourceMap = await r.json()
    spinner.succeed('Source map parsed successfully')
    // console.log('-'.repeat(100))
    // console.log('file:', rawSourceMap.file)
    // console.log('version:', rawSourceMap.version)
    // console.log('sourceRoot:', rawSourceMap.sourceRoot)
    // console.log(Object.keys(rawSourceMap))

    fs.outputJsonSync(path.resolve(__dirname, '../tmp/sources.json'), rawSourceMap.sources)
    // fs.outputJsonSync(path.resolve('../tmp/sources.json'), rawSourceMap.sources)

    // SourceMapConsumer.initialize({
    //     'lib/mappings.wasm': 'https://unpkg.com/source-map@0.7.3/lib/mappings.wasm'
    // })
    const whatever = await SourceMapConsumer.with(rawSourceMap, null, consumer => {
        // console.log(consumer.sources)
        // console.log(`searching originalPositionFor ${line} ${column}...`)
        const pos = consumer.originalPositionFor({line, column})
        // console.log(pos)
        console.log('-'.repeat(100))
        console.log(`${pos.source}:${pos.line}:${pos.column}`)
        console.log('-'.repeat(100))

        const src = pos.source.replace('webpack://tb-main-internal/', 'webpack://tb-main-internal/../')
        const i = rawSourceMap.sources.indexOf(src)
        if (i !== -1) {
            const lines = rawSourceMap.sourcesContent[i].split('\n')
            // console.log(rawSourceMap.sourcesContent[i])
            const index = pos.line - 1
            console.log(lines[index - 1])
            console.log(lines[index])
            console.log(lines[index + 1])
            fs.outputFileSync(path.resolve(__dirname, '../tmp/temp.js'), rawSourceMap.sourcesContent[i])
        } else {
            console.log('could not find source')
        }
        return pos
    })
}

// const r = 'https://static.parastorage.com/services/document-management/1.10730.0/tb-main/dist/tb-main-internal.min.js:2:2145006'
// const r = 'https://static.parastorage.com/services/document-management/1.10777.0/tb-main/dist/tb-main-internal.min.js:2:2101594'
// locate('https://static.parastorage.com/services/document-management/1.10777.0/tb-main/dist/tb-main-internal.min.js.map', 2, 2101594)

