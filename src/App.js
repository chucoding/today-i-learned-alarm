import React, { useEffect, useState } from 'react';

import { initDB, useIndexedDB } from "react-indexed-db-hook";

import { DBConfig } from './DBConfig';
//import setupAlarm from './setupAlarm';
import { chatCompletions } from './api/ncloud-api';
import { getCurrentDate } from './modules/utils';
import FlashCardViewer from './pages/FlashCardViewer';
import { getGithubData } from './services/github-service';

initDB(DBConfig);
const dates = [1, 7, 30]; // days ago list

const App = () => {

  const { add, getByID } = useIndexedDB("data");
  const [loading, setLoading] = useState(true);
/*
  const isInStandaloneMode = () => window.matchMedia('(display-mode: standalone)').matches;
  if (isInStandaloneMode()) {
    setupAlarm();
  }
*/

  useEffect(()=>{
    (async () => {
      const todayData = await getByID(getCurrentDate());
      if (todayData) {
        setLoading(false);
        return;
      }

      let list = [];
      for (const ago of dates) {
        try {
          const githubData = await getGithubData(ago);
          if (githubData) {
            const result = await chatCompletions(githubData);
            const questions = JSON.parse(result.body.result.message.content);
            for (let ncloudData of questions) {
              list.push({question:ncloudData, answer:githubData});
            }
          }
        } catch (error) {
          console.error(`Error fetching data for ${ago}:`, error);
        }
      }
      
      if (list.length > 0) {
        add({date:getCurrentDate(), data:list });
      }
      setLoading(false);
    })();
  }, []);
  
  if(loading) return null;
  return (
    <main>
       <FlashCardViewer />
    </main>
  );
}

export default App;