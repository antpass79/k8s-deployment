import React from 'react';
import { SendArea } from '../send-area/send-area';
import { ListArea } from '../list-area/list-area';
import { ActionsArea } from '../actions-area/actions-area';

import './container.css';
import { Message } from '../../models/message';

type state = {
  messages: Array<string>;
}
export class Container extends React.Component<{}, state> {

  constructor(props: Readonly<{}>) {
    super(props);

    this.state = {
      messages: []
    }

    this.handleMessageReady = this.handleMessageReady.bind(this);
  }

  handleMessageReady = (message: string) => {
    this.setState(state => {
      const messages = [...state.messages, message];
      return {
        messages
      };
    });
  }

  handleMessagesRead = (readMessages: Array<Message>) => {
    this.setState(state => {
      const messages = readMessages.map(message => message.text);
      return {
        messages
      };
    });
  }

  handleMessagesDeleted = () => {
    this.setState(state => {
      const messages = new Array<string>();
      return {
        messages
      };
    });
  }

  render = () => {
    return (
      <div className="container">
        <SendArea onMessageReady={this.handleMessageReady} />
        <ListArea messages={this.state.messages} />
        <ActionsArea onMessagesRead={this.handleMessagesRead} onMessagesDeleted={this.handleMessagesDeleted} />
      </div>
    );
  }
}