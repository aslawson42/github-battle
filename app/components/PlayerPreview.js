var React = require('react');
var PropTypes = require('prop-types');

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
      {props.children}
    </div>
    //Uses props.children to use whatever is inside the tags when PlayerPreview is used
    //Battle.js and Results.js have two different things inside their PlayerPreview components
  )
}

PlayerPreview.propTypes = {
  avatar: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired
}

module.exports = PlayerPreview;
