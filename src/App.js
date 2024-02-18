import React, {useState} from 'react';

import Auth from './pages/Auth';
import Viewer from './pages/Viewer';
import FlashCard from './pages/FlashCard';
import setupAlarm from './setupAlarm';
import { signInWithGithub } from './api/supabase-api';

const App = () => {

  const isInStandaloneMode = () => window.matchMedia('(display-mode: standalone)').matches;

  if (isInStandaloneMode()) {
    setupAlarm();
  }

  //const [isLoginSuccess, setIsLoginSuccess] = useState(false);
  //const isLoginSuccess = signInWithGithub();

  return (
    <main>
      <FlashCard />
      {/*isLoginSuccess ? <Viewer /> : <Auth setIsLoginSuccess={setIsLoginSuccess}/> */}
    </main>
  );
}

export default App;