import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles';
import { withStyles } from 'thenativeweb-ux';
import { ActivePage, Metadata } from '../../content';
import { Breadcrumbs, Head, PageFooter } from '..';

class PageContent extends React.Component {
  constructor (props) {
    super(props);

    this.saveContainerRef = this.saveContainerRef.bind(this);
  }

  //
  // componentDidMount () {
  //   const anchor = global.location.hash;
  //
  //   if (anchor) {
  //     const anchorElement = global.document.querySelector(anchor);
  //
  //     if (anchorElement && this.container) {
  //       this.container.scrollTop = anchorElement.offsetTop;
  //     }
  //   }
  // }

  // componentDidUpdate (prevProps) {
  //   const { container } = this;
  //   const { content } = this.props;
  //
  //   if (prevProps.content !== content && container) {
  //     container.scrollTop = 0;
  //   }
  // }
  //

  saveContainerRef (ref) {
    this.container = ref;
  }

  render () {
    const {
      activePage,
      children,
      classes,
      metadata
    } = this.props;

    let pageTitle = `${activePage.version} | ${metadata.title}`;

    const breadcrumbsForTitle = activePage.breadcrumbs.slice().reverse().join(' | ');

    pageTitle = `${breadcrumbsForTitle} | ${pageTitle}`;

    return (
      <div ref={ this.saveContainerRef } className={ classes.PageContent }>
        <Head>
          <title>{ pageTitle }</title>
        </Head>

        <Breadcrumbs breadcrumbs={ activePage.breadcrumbs } />

        <article
          className={ classes.Article }
        >
          { children }
        </article>

        <PageFooter
          activePage={ activePage }
        />
      </div>
    );
  }
}

PageContent.propTypes = {
  activePage: PropTypes.instanceOf(ActivePage).isRequired,
  metadata: PropTypes.instanceOf(Metadata).isRequired
};

export default withStyles(styles)(PageContent);
