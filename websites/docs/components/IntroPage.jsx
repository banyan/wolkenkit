import Feed from './Feed.jsx';
import Metadata from '../services/Metadata';
import PropTypes from 'prop-types';
import React from 'react';
import { classNames, Product, View, withStyles } from 'thenativeweb-ux';

const styles = theme => ({
  IntroPage: {
    flex: theme.contentFlex,
    width: theme.contentWidth,
    overflow: 'hidden',
    transition: 'width 800ms cubic-bezier(0.190, 1.000, 0.220, 1.000)',
    willChange: 'width'
  },

  IsCollapsed: {
    flex: '0 0 auto',
    width: '0px',

    '& $Brand': {
      opacity: 0
    }
  },

  Brand: {
    transition: 'opacity 400ms',
    willChange: 'opacity'
  },

  Title: {
    fontSize: theme.font.size.lg,
    textAlign: 'center',
    color: theme.color.brand.white
  },

  [theme.device.small]: {
    IntroPage: {
      flexDirection: 'column',
      overflow: 'auto',
      '-webkit-overflow-scrolling': 'touch'
    },

    Brand: {
      flex: '0 0 40vh',
      height: '40vh'
    },

    Title: {
      fontSize: theme.font.size.sm,
      textAlign: 'center',
      color: theme.color.brand.white
    }
  }
});

const IntroPage = ({ classes, metadata, isCollapsed }) => {
  const componentClasses = classNames(classes.IntroPage, {
    [classes.IsCollapsed]: isCollapsed
  });

  return (
    <View orientation='horizontal' background='dark' className={ componentClasses }>
      <Feed items={ metadata.news } />

      <View className={ classes.Brand } orientation='vertical' alignItems='center' justifyContent='center' adjust='flex'>
        <Product name='wolkenkit' isAnimated={ !isCollapsed } size='xl' />
        <div className={ classes.Title }>Documentation</div>
      </View>
    </View>
  );
};

IntroPage.propTypes = {
  metadata: PropTypes.instanceOf(Metadata).isRequired
};

export default withStyles(styles)(IntroPage);
