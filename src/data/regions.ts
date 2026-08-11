/** 与卡牌 region 字段对齐的分区（卡通地球选区） */

export interface RegionFace {
  id: string;
  label: string;
  /** 卡牌数据里的 region 名（可能多个别名） */
  aliases: string[];
  color: string;
}

export const REGION_FACES: RegionFace[] = [
  { id: 'east-asia', label: '东亚', aliases: ['东亚'], color: '#c47a3a' },
  { id: 'se-asia', label: '东南亚', aliases: ['东南亚'], color: '#2f9e7b' },
  { id: 'south-asia', label: '南亚', aliases: ['南亚', '南亚印度'], color: '#d4a017' },
  { id: 'west-asia', label: '西亚', aliases: ['西亚'], color: '#b85c38' },
  { id: 'central-asia', label: '中亚', aliases: ['中亚'], color: '#8b6b4a' },
  { id: 'far-east', label: '极东', aliases: ['远东', '亚洲大陆极东地区'], color: '#e8a87c' },
  { id: 'w-europe', label: '西欧', aliases: ['西欧', '欧洲西部'], color: '#4a7ab5' },
  { id: 'e-europe', label: '东欧', aliases: ['东欧', '欧洲东部'], color: '#5b6b9e' },
  { id: 'n-europe', label: '北欧', aliases: ['北欧', '欧洲北部'], color: '#6fa8dc' },
  { id: 'eurasia-n', label: '欧亚北', aliases: ['欧亚北', '欧亚大陆北部'], color: '#7d9aaa' },
  { id: 'africa-n', label: '非洲北', aliases: ['非洲北', '非洲北部'], color: '#c9a227' },
  { id: 'africa-e', label: '非洲东', aliases: ['非洲东', '非洲东部'], color: '#a8b545' },
  { id: 'africa-s', label: '非洲南', aliases: ['非洲南', '非洲南部'], color: '#8fbc5a' },
  { id: 'africa-w', label: '非洲西', aliases: ['非洲西', '非洲西部'], color: '#6b8f3c' },
  { id: 'na-e', label: '北美东', aliases: ['北美东', '北美东部'], color: '#5c8a6e' },
  { id: 'na-w', label: '北美西', aliases: ['北美西', '北美西部'], color: '#3d7a5c' },
  { id: 'caribbean', label: '加勒比', aliases: ['加勒比', '加勒比中美'], color: '#2aa5a5' },
  { id: 's-america', label: '南美', aliases: ['南美', '南美洲'], color: '#3d9b6e' },
  { id: 'australia', label: '澳洲', aliases: ['澳洲', '澳大利亚'], color: '#e07a3d' },
  { id: 'pacific', label: '太平洋岛', aliases: ['太平洋岛', '南太平洋诸岛', '大洋洲'], color: '#3db8c9' },
];

export function findFaceByCardRegion(region: string): RegionFace | undefined {
  return REGION_FACES.find((f) => f.aliases.includes(region) || f.label === region);
}

export function cardMatchesFace(cardRegion: string, face: RegionFace): boolean {
  return face.aliases.includes(cardRegion) || face.label === cardRegion;
}
