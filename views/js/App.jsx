class App extends React.Component {
    constructor(props) {
        super(props);
        this.ws = null;
        this.state = {
            newMSG: '',
            chatContent: '',
            userName: '',
            joined: false,
            usersCount: 0,
        }
    }
    componentWillMount() {
        const HOST = window.location.origin.replace(/^http/, 'ws');
        this.ws = new WebSocket(HOST + '/ws');
        this.ws.addEventListener('message', e => {
            let msg = JSON.parse(e.data);
            let el = `<div class='chip'>` + msg.username + `</div>` + msg.message + `<br/>`
            this.setState(prevState => {
                return {
                    chatContent: prevState.chatContent + el
                }
            });
        })
    }
    getUsersCount = () => {
        const HOST = window.location.origin;
        console.log(HOST + '/count');
        fetch(HOST + '/count')
            .then(resp => resp.json())
            .then(data => this.setState({ usersCount: data.users_count }));
    }
    send() {
        if (this.state.newMSG !== '') {
            this.ws.send(
                JSON.stringify({
                    username: this.state.userName,
                    message: this.state.newMSG,
                })
            );
            this.setState({
                newMSG: '',
            });
        } else {
            M.toast({ html: 'Enter Message' });
            return;
        }
    }
    join() {
        if (!this.state.userName) {
            M.toast({ html: 'You must choose a username' });
            return;
        }
        this.setState(prevState => {
            M.toast({ html: 'You have been joined' });
            return {
                userName: prevState.userName,
                joined: true,
            };
        })
    }
    updateUsername(e) {
        this.setState({
            userName: e.target.value,
        })
    }
    updateMessage(e) {
        this.setState({
            newMSG: e.target.value,
        })
    }
    render() {
        this.getUsersCount();
        let userInput;
        if (this.state.joined) {
            userInput =
                <ChatInput
                    value={this.state.newMSG}
                    sendMessage={() => this.send()}
                    updateMessage={e => this.updateMessage(e)}
                />
        } else {
            userInput =
                <Login
                    updateUsername={e => this.updateUsername(e)}
                    handleLogin={() => this.join()}
                    userName={this.state.userName}
                />
        }
        return (
            <div>
                <header>
                    <nav>
                        <a href="/" className="brand-logo right">
                            RealTime Chat
                        </a>
                        <a className="brand-logo left">
                            Users Online: {this.state.usersCount}
                        </a>
                    </nav>
                </header>
                <main id='app'>
                    <ChatContent
                        html={this.state.chatContent}
                    />
                    {userInput}
                </main>
                <footer></footer>
            </div>
        );
    }
}