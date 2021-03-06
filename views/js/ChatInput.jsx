class ChatInput extends React.Component {
    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.props.sendMessage();
        }
    }
    render() {
        return (
            <div className='row'>
                <div className="input-field col s8">
                    <input value={this.props.value} onKeyPress={this.handleKeyPress.bind(this)} onChange={e => this.props.updateMessage(e)} type="text" id='inp1' />
                    <label htmlFor='inp1'>Message</label>
                </div>
                <div className="input-field col s4">
                    <button className="waves-effect waves-light btn" onClick={this.props.sendMessage}>Send</button>
                </div>
            </div>
        );
    }
}