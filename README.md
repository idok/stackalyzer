# stackalyzer


the stack analyzer

run with a minified stack trace to get the source mapped trace

e.g.

```bash
node src/main.js https://static.parastorage.com/services/wix-thunderbolt-ds/dist/thunderboltViewerManager.d32d5e49.chunk.min.js:1:4366034
```

Or via yarn dlx

```bash
yarn dlx stackalyzer https://static.parastorage.com/services/wix-thunderbolt-ds/dist/thunderboltViewerManager.d32d5e49.chunk.min.js:1:4366034
```
