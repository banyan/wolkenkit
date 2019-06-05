import { themes } from 'thenativeweb-ux';

const theme = themes.extend('wolkenkit', {
  id: 'docs',
  barHeight: 48,
  sidebarWidth: '25vw',
  sidebarWidthMobile: '75vw',
  sidebarFlex: '1 1 25vw',
  sidebarFlexMobile: '1 1 75vw',
  contentWidth: '75vw',
  contentFlex: '3 3 75vw',
  pageContent: {
    maxWidth: 800
  },

  color: {
    panel: {
      dark: '#363D45',
      light: '#f7f7f7'
    }
  },

  zIndices: {
    navigationPattern: 100
  }
});

export default theme;
