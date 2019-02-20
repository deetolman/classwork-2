import React from 'react';
import { render } from 'react-dom';
import MemeApp from './components/meme/MemeApp';

// render allows us to append a child
render(
  <MemeApp />,
  document.getElementById('root')
);
