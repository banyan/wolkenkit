import formatDate from 'date-fns/format';
import React from 'react';

const Date = React.memo(({ component = 'span', className, year, month, day, format = 'DD.MM.YYYY' }) => {
  const dateToRender = new global.Date(year, month - 1, day);

  return (
    React.createElement(component, { className }, formatDate(dateToRender, format))
  );
});

export default Date;
