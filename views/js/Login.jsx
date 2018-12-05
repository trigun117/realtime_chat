class Login extends React.Component {
    render() {
        return (
            <div className='row'>
                <div className="input-field col s8">
                    <input onChange={e => this.props.updateUsername(e)} value={this.props.userName} type="text" id='inp' />
                    <label htmlFor='inp'>Username</label>
                </div>
                <div className='input-field col s4'>
                    <button className="waves-effect waves-light btn" onClick={this.props.handleLogin}>Join</button>
                </div>
            </div>
        )
    }
}