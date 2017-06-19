import React from 'react';

import TransmuteFramework from '../TransmuteConfig'

let obj = { cool: 'story...bro' }

TransmuteFramework.TransmuteIpfs.writeObject(obj)
    .then((path) => {
      console.log('path: ', path)
      TransmuteFramework.TransmuteIpfs.readObject(path)
      .then((dataObj) => {
        console.log('read object: ', dataObj)
      })
    })


export default class Block extends React.Component {
  render() {
    return (
      <div style={{textAlign: 'center'}}>
        <h1>IPLD Block</h1>
      </div>);
  }
}
