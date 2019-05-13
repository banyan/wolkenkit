'use strict';

const PropTypes = require('prop-types'),
      React = require('react'),
      Router = require('next/router').default,
      { Product } = require('thenativeweb-ux');

const Bar = require('../Bar/index.jsx'),
      Dropdown = require('../Dropdown.jsx'),
      Link = require('../Link.jsx');

class VersionBar extends React.PureComponent {
  constructor (props) {
    super(props);

    this.handleVersionChanged = this.handleVersionChanged.bind(this);
    this.handleLogoClicked = this.handleLogoClicked.bind(this);
  }

  handleLogoClicked (event) {
    event.preventDefault();
    event.stopPropagation();

    const { onLogoClick } = this.props;

    onLogoClick();
  }

  handleVersionChanged (newVersion) {
    Router.push(`/${newVersion}/`);
  }

  renderLogo () {
    const { activeVersion, showLogo } = this.props;

    if (!showLogo) {
      return null;
    }

    return (
      <Link
        href={ `/${activeVersion}/` }
      >
        <Product name='wolkenkit' type='typo-only' size='l' />
      </Link>
    );
  }

  render () {
    const { activeVersion, versions } = this.props;

    return (
      <Bar>
        <Bar.Left>
          {this.renderLogo()}
        </Bar.Left>
        <Bar.Right>
          <Dropdown
            options={ versions }
            selected={ activeVersion }
            onChange={ this.handleVersionChanged }
          />
        </Bar.Right>
      </Bar>
    );
  }
}

VersionBar.propTypes = {
  activeVersion: PropTypes.string.isRequired,
  versions: PropTypes.array.isRequired,
  onLogoClick: PropTypes.func.isRequired,
  onVersionChange: PropTypes.func.isRequired
};

module.exports = VersionBar;
