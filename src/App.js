import React from 'react';

import Auth from './pages/Auth';
import Viewer from './pages/Viewer';
import setupAlarm from './setupAlarm';

const App = () => {

  const isInStandaloneMode = () => window.matchMedia('(display-mode: standalone)').matches;

  if (isInStandaloneMode()) {
    setupAlarm();
  }

  return (
    <main>
      <Auth/>
    </main>
  );
}

export default App;