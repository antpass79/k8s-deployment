import React from 'react';

import './list-area.css'

type props = {
  messages: Array<string>;
}
export class ListArea extends React.Component<props> {

  render = () => {
    return (
      <div className="list-area">
        <div>
          <label>Messages</label>
          <ul>
            {this.props.messages.map((message, index) => {
              return <li key={index}>{message}</li>;
            })}
          </ul>
        </div>
      </div>
    );
  }
}