var React = require('react');
var PropTypes = require('prop-types');
var api = require('../utils/api');

//SelectLanguage component (stateless functional component)
function SelectLanguage (props) {
  var languages = ['All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Python'];
  return (
    <ul className='languages'>
      {languages.map(function(lang) {
        return (
          <li
            style={lang === props.selectedLanguage ? {color: '#d0021b'} : null}
            onClick={props.onSelect.bind(null, lang)}
            key={lang}>
              {lang}
          </li>
        )
      })}
    </ul>
  )
}
//RepoGrid component (stateless functional component)
function RepoGrid (props) {
  return (
    <ul className='popular-list'>
      {props.repos.map(function(repo, index){
        return (
          <li key={repo.name} className='popular-item'>
            <div className='popular-rank'>#{index + 1}</div>
            <ul className='space-list-items'>
              <li>
                <img
                  className='avatar'
                  src={repo.owner.avatar_url}
                  alt={'Avatar for ' + repo.owner.login}
                />
              </li>
              <li><a href={repo.html_url}>{repo.name}</a></li>
              <li>@{repo.owner.login}</li>
              <li>{repo.stargazers_count} stars</li>
            </ul>
          </li>
        )
      })}
    </ul>
  )
}

//PropTypes, checks the type for each prop in a given component
RepoGrid.propTypes = {
  repos: PropTypes.array.isRequired
}
SelectLanguage.propTypes = {
  selectedLanguage: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
}

//Popular component
class Popular extends React.Component {
  //Initial state
  constructor (props) {
    super(props);
    this.state = {
      selectedLanguage: 'All',
      repos: null
    };
    //The 'this' binder
    this.updateLanguage = this.updateLanguage.bind(this);
  }
  //Lifecycle events
  componentDidMount() {
    this.updateLanguage(this.state.selectedLanguage);
  }
  //'Update Language' method
  updateLanguage(lang) {
    this.setState(function() {
      return {
        selectedLanguage: lang,
        repos: null
      }
    });
    //API request every time a new language is selected
    api.fetchPopularRepos(lang)
      .then(function(repos) {
        this.setState(function() {
          return {
            repos: repos
          }
        })
      }.bind(this));
  }
  //Renders Popular component
  render() {
    return (
      //Pass in SelectLanguage and RepoGrid components
      //Each of these "HTML attributes" are actually props of the component
      <div>
        <SelectLanguage
          selectedLanguage={this.state.selectedLanguage}
          onSelect={this.updateLanguage}
        />
        {!this.state.repos
          ? <p>LOADING</p>
          : <RepoGrid repos={this.state.repos} />}
      </div>
      /*
      If the state of repos is falsey, returns 'LOADING'
      If the state of repos is truthy, returns RepoGrid component
      This is because repos starts as null until the API request is made
      */
    )
  }
}

module.exports = Popular;
