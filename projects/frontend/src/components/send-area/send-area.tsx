import React from 'react';

import './send-area.css'
import { MessageService } from '../../services/message-service';

type props = {
  onMessageReady: any;
}
type state = {
  messageToSend: string;
}
export class SendArea extends React.Component<props, state> {

  messageService: MessageService = new MessageService();

  constructor(props: Readonly<props>) {
    super(props);

    this.state = {
      messageToSend: ''
    };
  }

  handleSendClick = async () => {
    let response = await this.messageService.send(this.state.messageToSend);
    if (response.status === 200)
      this.props.onMessageReady(response.data);
    else
      alert('An error occurred');
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      messageToSend: event.currentTarget.value
    });
  }

  render = () => {
    return (
      <div className="send-area">
        <div className="send-area-container">
          <input type="text" placeholder="Message to send" onChange={this.handleChange}></input>
          <button onClick={this.handleSendClick}>Send</button>
        </div>
      </div>
    );
  }
}