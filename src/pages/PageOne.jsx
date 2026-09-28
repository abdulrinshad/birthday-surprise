import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import CinematicIntro from '../components/CinematicIntro';
import Envelope from '../components/Envelope';
import Letter from '../components/Letter';
import { trackEvent, AnalyticsEvents } from '../analytics/analytics';

/**
 * PageOne:
 * Encapsulates all 3 sequential stages of Page 1:
 * "intro" → "envelope" → "letter"
 * and passes onContinue to transition to Page 2.
 */
export default function PageOne({ onContinueToPageTwo }) {
  const [stage, setStage] = useState('intro');

  return (
    <AnimatePresence mode="wait">
      {stage === 'intro' && (
        <CinematicIntro
          key="stage-intro"
          onStart={() => setStage('envelope')}
        />
      )}

      {stage === 'envelope' && (
        <Envelope
          key="stage-envelope"
          onOpenComplete={() => {
            trackEvent(AnalyticsEvents.ENVELOPE_OPENED, 'page1');
            setStage('letter');
          }}
        />
      )}

      {stage === 'letter' && (
        <Letter
          key="stage-letter"
          onContinue={onContinueToPageTwo}
        />
      )}
    </AnimatePresence>
  );
}
