import React, { Component } from 'react';

import TransmuteFramework from '../../../TransmuteConfig'

// let { getCachedReadModel } = TransmuteFramework.EventStore.ReadModel
console.log(TransmuteFramework)

class Block extends Component {
  render() {
    return (
      <div className="Block">
        A BLOCK HERE
      </div>
    );
  }
}

export default Block;
