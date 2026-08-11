import React, { useEffect, useState } from 'react';
import HomeScreen from './components/companion/HomeScreen';
import DrawScreen from './components/companion/DrawScreen';
import CollectionBox from './components/companion/CollectionBox';
import BattleScreen from './components/companion/BattleScreen';
import { CollectionMap, loadCollection } from './lib/collection';
import './companion.css';

type View = 'home' | 'draw' | 'collection' | 'battle';

function App() {
  const [view, setView] = useState<View>('home');
  const [collection, setCollection] = useState<CollectionMap>({});

  useEffect(() => {
    setCollection(loadCollection());
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
      <BattleScreen collection={collection} onBack={() => setView('home')} />
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
