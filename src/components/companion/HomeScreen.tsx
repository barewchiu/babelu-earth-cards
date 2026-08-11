import React from 'react';
import { TOTAL_CARDS } from '../../data/catalog';
import { assetUrl } from '../../lib/assetUrl';
import { unlockAudio } from '../../lib/audio';
import AudioControls from './AudioControls';

interface HomeScreenProps {
  collectedCount: number;
  onEnterDraw: () => void;
  onEnterCollection: () => void;
  onEnterBattle: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  collectedCount,
  onEnterDraw,
  onEnterCollection,
  onEnterBattle,
}) => {
  const enter = (fn: () => void) => {
    unlockAudio();
    fn();
  };

  return (
    <div className="screen home-screen">
      <div className="home-topbar">
        <AudioControls />
      </div>
      <div className="home-hero">
        <img className="home-cover" src={assetUrl('/brand/cover.png')} alt="Barew Earth Games" />
        <div className="home-copy">
          <p className="eyebrow">Barew Earth · 数字伴侣</p>
          <h1>贝贝鲁地球百科</h1>
          <p className="lede">
            亲子地理百科的数字伴侣：转动卡通地球选区、抽取百科卡、听 AI 讲解，
            再收入收藏盒，并可练习钻石对战。
          </p>
          <div className="home-stats">
            <div>
              <strong>{TOTAL_CARDS}</strong>
              <span>百科卡牌</span>
            </div>
            <div>
              <strong>{collectedCount}</strong>
              <span>已收藏</span>
            </div>
            <div>
              <strong>V1.1</strong>
              <span>伴侣+对战练习</span>
            </div>
          </div>
          <div className="home-actions">
            <button type="button" className="btn primary" onClick={() => enter(onEnterDraw)}>
              掷地球抽卡
            </button>
            <button type="button" className="btn secondary" onClick={() => enter(onEnterCollection)}>
              打开收藏盒
            </button>
            <button type="button" className="btn secondary" onClick={() => enter(onEnterBattle)}>
              钻石对战练习
            </button>
          </div>
        </div>
      </div>

      <div className="home-kit">
        <figure>
          <img src={assetUrl('/brand/box.png')} alt="实体收纳盒" />
          <figcaption>实体分槽收纳盒</figcaption>
        </figure>
        <figure>
          <img src={assetUrl('/brand/cartoon-earth.png')} alt="卡通地球" />
          <figcaption>卡通地球选区抽卡</figcaption>
        </figure>
      </div>

      <footer className="home-foot">
        <p>路线图：知识链对战 · AI 卡背讲解 · AWS 云端同步与多语言出海</p>
      </footer>
    </div>
  );
};

export default HomeScreen;
