import Annotation from './modules/Annotation';
import MarkdownBlock from './templates/MarkdownBlock';
import setupAlarm from './setupAlarm';

function App() {

  const isInStandaloneMode = () => window.matchMedia('(display-mode: standalone)').matches;

  if (isInStandaloneMode()) {
    setupAlarm();
  }

  return (
    <main>
      <Annotation text={`/* Day 1 */`} />
      <MarkdownBlock target={1} />
      <Annotation text={`/* Day 7 */`} />
      <MarkdownBlock target={7} />
      <Annotation text={`/* Day 30 */`} />
      <MarkdownBlock target={30} />
    </main>
  );
}

export default App;