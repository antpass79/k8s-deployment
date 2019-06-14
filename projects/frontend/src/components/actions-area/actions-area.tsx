import React from 'react';

import './actions-area.css'
import { MessageService } from '../../services/message-service';

type props = {
  onMessagesRead: any;
  onMessagesDeleted: any;
}
export class ActionsArea extends React.Component<props> {

  messageService: MessageService = new MessageService();

  handleLoadClick = async () => {
    let response = await this.messageService.getAll();
    if (response.status === 200)
      this.props.onMessagesRead(response.data);
    else
      alert('An error occurred');
  }

  handleClearClick = async () => {
    let response = await this.messageService.deleteAll();
    if (response.status === 200)
      this.props.onMessagesDeleted();
    else
      alert('An error occurred');
  }

  render = () => {
    return (
      <div className="actions-area">
        <div>
          <label>Stored Messages</label>
          <div>
            <button onClick={this.handleLoadClick}>Load</button>
            <button onClick={this.handleClearClick}>Clear</button>
          </div>
        </div>
      </div>
    );
  }
}