class ChatContent extends React.Component {
    createMarkup(markupString) {
        return {
            __html: markupString,
        }
    }

    render() {
        return (
            <div className="row">
                <div className="col s12">
                    <div className="card horizontal">
                        <div id="chat-messages"
                            className="card-content"
                            dangerouslySetInnerHTML={this.createMarkup(this.props.html)}>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}