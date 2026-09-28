import MysteryPainting from '../components/MysteryPainting';

/**
 * PageTwo:
 * Encapsulates the complete Page 2 (Mystery Painting) experience.
 */
export default function PageTwo({ onBack, onContinue }) {
  return (
    <main
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        overflowX: 'hidden'
      }}
    >
      <MysteryPainting onBack={onBack} onContinue={onContinue} />
    </main>
  );
}
