import React from 'react';


import TransmuteFramework from '../TransmuteConfig'

// let { getCachedReadModel } = TransmuteFramework.EventStore.ReadModel
console.log(TransmuteFramework)


export default class Block extends React.Component {
  render() {
    return (
      <div style={{textAlign: 'center'}}>
        <h1>IPLD Block</h1>
      </div>);
  }
}
