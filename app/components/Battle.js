var React = require('react');
var PropTypes = require('prop-types');
var Link = require('react-router-dom').Link;

//PlayerPreview component
function PlayerPreview (props) {
  return (
    <div>
      <div className='column'>
        <img
          className='avatar'
          src={props.avatar}
          alt={'Avatar for ' + props.username}
        />
        <h2 className='username'>@{props.username}</h2>
      </div>
      <button
        className='reset'
        onClick={props.onReset.bind(null, props.id)}>
          Reset
      </button>
    </div>
  )
}

//PropTypes for PlayerPreview component
PlayerPreview.propTypes = {
  avatar: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onReset: PropTypes.func.isRequired
}

//PlayerInput component
class PlayerInput extends React.Component {
  //Define initial state
  constructor(props) {
    super(props);

    this.state = {
      username: ''
    };
    //Binds the 'this' keyword for the methods
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
    //Handle Change method
  handleChange(event) {
    var value = event.target.value;

    this.setState(function() {
      return {
        username: value
      }
    });
  }
  //Handle Submit method (for PlayerInput component)
  handleSubmit(event) {
    //Makes sure it isn't submitted to a server
    event.preventDefault();

    this.props.onSubmit(
      this.props.id,
      this.state.username
    );
  }
  render() {
    return (
      //When something is typed in the input, the Handle Change method runs
      //The Handle Change method updates the value of the input (i.e. types it in the box)
      //When the submit button is pressed, the Handle Submit method runs (for PlayerInput)
      //Handle Submit Method gets the id and username
      //It passes the id and username down to Battle component's Handle Submit method
      <form className='column' onSubmit={this.handleSubmit}>
        <label className='header' htmlFor='username'>
          {this.props.label}
        </label>
        <input
          id='username'
          placeholder='github username'
          type='text'
          autoComplete='off'
          value={this.state.username}
          onChange={this.handleChange}
        />
        <button
          className='button'
          type='submit'
          disabled={!this.state.username}>
            Submit
        </button>
      </form>
    )
  }
}

//PropTypes, checks the type for each prop in a given component
PlayerInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired
}

//Default props
PlayerInput.defaultProps = {
  label: 'Username'
}

//Battle component
class Battle extends React.Component {
  //Define initial state
  constructor(props) {
    super(props);

    this.state = {
      playerOneName: '',
      playerTwoName: '',
      playerOneImage: null,
      playerTwoImage: null
    };
    //Binds the 'this' keyword for the Handle Submit and Handle Reset methods
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }
  //Handle Submit method (for Battle component)
  //When input is submitted, it creates a new state
  //Gets id and username once onSubmit is triggered from PlayerInput component
  //The id and username come from the Handle Submit method in PlayerInput
  handleSubmit(id, username) {
    this.setState(function () {
      var newState = {};
      newState[id + 'Name'] = username;
      newState[id + 'Image'] = 'https://github.com/' + username + '.png?size=200';
      return newState;
    });
  }
  //Handle Reset method (for Battle component)
  //Resets state when triggered by onReset prop of 'Reset' button
  handleReset(id) {
    this.setState(function () {
      var newState = {};
      newState[id + 'Name'] = '';
      newState[id + 'Image'] = null;
      return newState;
    });
  }
  render() {
    var match = this.props.match;
    var playerOneName = this.state.playerOneName;
    var playerTwoName = this.state.playerTwoName;
    var playerOneImage = this.state.playerOneImage;
    var playerTwoImage = this.state.playerTwoImage;

    return (
      //If player name is true, then render PlayerInput component
      //Each of these "HTML attributes" are actually props of the component
      <div>
        <div className='row'>
          {!playerOneName &&
            <PlayerInput
              id='playerOne'
              label='Player One'
              onSubmit={this.handleSubmit}
            />}

          {playerOneImage !== null &&
            <PlayerPreview
              avatar={playerOneImage}
              username={playerOneName}
              onReset={this.handleReset}
              id='playerOne'
            />}

          {!playerTwoName &&
            <PlayerInput
              id='playerTwo'
              label='Player Two'
              onSubmit={this.handleSubmit}
            />}

          {playerTwoImage !== null &&
            <PlayerPreview
              avatar={playerTwoImage}
              username={playerTwoName}
              onReset={this.handleReset}
              id='playerTwo'
            />}
        </div>

        {playerOneImage && playerTwoImage &&
          <Link
            className='button'
            to={{
              pathname: match.url + '/results',
              search: `?playerOneName=` + playerOneName + '&playerTwoName=' + playerTwoName
            }}>
              Battle
          </Link>}
      </div>
    )
  }
}

module.exports = Battle;
