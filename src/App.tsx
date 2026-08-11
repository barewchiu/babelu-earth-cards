import React, { useEffect, useState } from 'react';
import HomeScreen from './components/companion/HomeScreen';
import DrawScreen from './components/companion/DrawScreen';
import CollectionBox from './components/companion/CollectionBox';
import BattleScreen from './components/companion/BattleScreen';
import { CollectionMap, loadCollection } from './lib/collection';
import { playClickSfx, unlockAudio } from './lib/audio';
import './companion.css';

type View = 'home' | 'draw' | 'collection' | 'battle';

function App() {
  const [view, setView] = useState<View>('home');
  const [collection, setCollection] = useState<CollectionMap>({});

  useEffect(() => {
    setCollection(loadCollection());
  }, []);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      unlockAudio();
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const btn = target.closest('button.btn') as HTMLButtonElement | null;
      if (!btn || btn.disabled) return;
      playClickSfx();
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, []);

  const collectedCount = Object.keys(collection).length;

  if (view === 'draw') {
    return (
      <DrawScreen
        collection={collection}
        onCollectionChange={setCollection}
        onBack={() => setView('home')}
      />
    );
  }

  if (view === 'collection') {
    return (
      <CollectionBox collection={collection} onBack={() => setView('home')} />
    );
  }

  if (view === 'battle') {
    return (
      <BattleScreen
        collection={collection}
        onCollectionChange={setCollection}
        onBack={() => setView('home')}
      />
    );
  }

  return (
    <HomeScreen
      collectedCount={collectedCount}
      onEnterDraw={() => setView('draw')}
      onEnterCollection={() => setView('collection')}
      onEnterBattle={() => setView('battle')}
    />
  );
}

export default App;
