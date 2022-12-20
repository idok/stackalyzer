import {parseLoc} from '../src'

describe('aaaa', function () {
    it('should ', function () {
        expect(parseLoc('https://static.parastorage.com/services/document-management/1.10777.0/tb-main/dist/tb-main-internal.min.js:2:2101594'))
            .toEqual({
                "column": "2101594",
                "file": "https://static.parastorage.com/services/document-management/1.10777.0/tb-main/dist/tb-main-internal.min.js.map",
                "line": "2"
            })
    })
})