
### Commands 

```
$ npm run transmute -- ipfs deploy --env local --target ./cli/mock
$ npm run transmute eventstore create
$ npm run transmute -- eventstore permissions --contractAddress 0x1cc9bbbef5918672997dffe449bd71b0eb44fe37
$ npm run transmute -- eventstore grant --contractAddress 0xe2c2f8a71100dcf98815d66350a269f6b781d832 --g admin,write,create:any,"['*']"
$ npm run transmute -- eventstore can --contractAddress 0xe2c2f8a71100dcf98815d66350a269f6b781d832 --q admin,create:any,event

```
