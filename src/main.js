#!/usr/bin/env node
import {locate, parseLoc} from './index.js'

const files = process.argv.slice(2)
const {file, line, column} = parseLoc(files[0])

locate(file, line, column).catch(e => {
    console.log(e)
})