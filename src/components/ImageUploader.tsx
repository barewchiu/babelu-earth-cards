import React, { useState } from 'react';
import { uploadImage, uploadMapImages, STORAGE_BUCKET, supabase } from '../lib/supabase';

interface ImageUploaderProps {
  onUploadComplete?: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUploadComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [uploadResults, setUploadResults] = useState<string[]>([]);

  // 地图图片文件名映射
  const imageFileMapping = {
    'earth-map.png': '地球图片.png',
    'region-africa-north.png': '色块-非洲北部(A.N).png',
    'region-africa-east.png': '色块-非洲东部(A.E).png',
    'region-africa-south.png': '色块-非洲南部(A.S).png',
    'region-africa-west.png': '色块-非洲西部(A.W).png',
    'region-east-asia.png': '色块-东亚(E.A).png',
    'region-southeast-asia.png': '色块-东南亚(S.AS).png',
    'region-south-asia-india.png': '色块-南亚.印度(S.A.I).png',
    'region-west-asia.png': '色块-西亚(W.A).png',
    'region-central-asia.png': '色块-中亚(C.A).png',
    'region-far-east-asia.png': '色块-亚洲大陆极东地区(FE.A).png',
    'region-eurasia-north.png': '色块-欧亚大陆北部(EA.N).png',
    'region-north-europe.png': '色块-欧洲北部(N.E).png',
    'region-east-europe.png': '色块-欧洲东部(E.E).png',
    'region-west-europe.png': '色块-欧洲西部(W.E).png',
    'region-north-america-east.png': '色块-北美东部(NA.E).png',
    'region-north-america-west.png': '色块-北美西部(NA.W).png',
    'region-caribbean-central-america.png': '色块-加勒比.中美(C.CA).png',
    'region-south-america.png': '色块-南美洲(SA).png',
    'region-oceania.png': '色块-澳大利亚(OC).png',
    'region-south-pacific-islands.png': '色块-南太平洋诸岛(S.S.I).png'
  };

  // 运行诊断测试
  const runDiagnostics = async () => {
    setIsUploading(true);
    setUploadResults([]);
    setUploadProgress('正在运行诊断测试...');
    
    try {
      // 1. 测试Supabase连接
      setUploadProgress('测试Supabase连接...');
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        setUploadResults(prev => [...prev, `⚠️ 认证状态: ${authError.message}`]);
      } else {
        setUploadResults(prev => [...prev, `✅ Supabase连接正常 (用户: ${user ? '已登录' : '匿名'})`]);
      }

      // 2. 测试存储桶访问
      setUploadProgress('测试存储桶访问...');
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      if (bucketError) {
        setUploadResults(prev => [...prev, `❌ 存储桶访问失败: ${bucketError.message}`]);
      } else {
        const bucketExists = buckets?.some(bucket => bucket.name === 'map-images');
        setUploadResults(prev => [...prev, `${bucketExists ? '✅' : '⚠️'} 存储桶状态: ${bucketExists ? '已存在' : '不存在'}`]);
      }

      // 3. 测试上传权限
      setUploadProgress('测试上传权限...');
      const testFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      const { error: uploadError } = await supabase.storage
        .from('map-images')
        .upload('test-file.txt', testFile);
      
      if (uploadError) {
        setUploadResults(prev => [...prev, `❌ 上传权限测试失败: ${uploadError.message}`]);
      } else {
        setUploadResults(prev => [...prev, '✅ 上传权限正常']);
        // 清理测试文件
        await supabase.storage.from('map-images').remove(['test-file.txt']);
      }

    } catch (error: any) {
      setUploadResults(prev => [...prev, `❌ 诊断过程出错: ${error.message}`]);
    }
    
    setUploadProgress('诊断完成');
    setIsUploading(false);
  };

  // 初始化存储桶
  const handleInitializeStorage = async () => {
    setIsUploading(true);
    setUploadProgress('正在初始化Supabase存储...');
    
    const success = await uploadMapImages();
    
    if (success) {
      setUploadProgress('存储桶初始化成功！');
      setUploadResults(prev => [...prev, '✅ 存储桶初始化成功']);
    } else {
      setUploadProgress('存储桶初始化失败');
      setUploadResults(prev => [...prev, '❌ 存储桶初始化失败']);
    }
    
    setIsUploading(false);
  };

  // 处理文件上传
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadResults([]);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress(`正在上传 ${file.name} (${i + 1}/${files.length})`);
      
      // 根据原始文件名找到对应的存储路径
      let storagePath = file.name;
      
      // 如果是地图相关的图片，使用映射后的英文名称
      for (const [englishName, chineseName] of Object.entries(imageFileMapping)) {
        if (file.name === chineseName) {
          storagePath = englishName;
          break;
        }
      }
      
      const result = await uploadImage(file, storagePath);
      
      if (result.success) {
        setUploadResults(prev => [...prev, `✅ ${file.name} → ${storagePath}`]);
      } else {
        setUploadResults(prev => [...prev, `❌ ${file.name} 上传失败`]);
      }
    }
    
    setUploadProgress('上传完成！');
    setIsUploading(false);
    
    if (onUploadComplete) {
      onUploadComplete();
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'white',
        padding: 'var(--space-6)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        zIndex: 2000,
        maxWidth: '500px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto'
      }}
    >
      <h2 
        style={{
          fontSize: 'var(--text-xl)',
          fontWeight: 'var(--font-bold)',
          marginBottom: 'var(--space-4)',
          textAlign: 'center',
          color: 'var(--gray-900)'
        }}
      >
        🚀 Supabase图片上传工具
      </h2>
      
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-600)', marginBottom: 'var(--space-3)' }}>
          第一步：诊断和初始化Supabase存储桶
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
          <button
            onClick={runDiagnostics}
            disabled={isUploading}
            style={{
              flex: 1,
              background: 'linear-gradient(45deg, #10b981, #059669)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-3) var(--space-4)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-semibold)',
              cursor: isUploading ? 'not-allowed' : 'pointer',
              opacity: isUploading ? 0.6 : 1
            }}
          >
            🔍 运行诊断
          </button>
          <button
            onClick={handleInitializeStorage}
            disabled={isUploading}
            style={{
              flex: 1,
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-3) var(--space-4)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-semibold)',
              cursor: isUploading ? 'not-allowed' : 'pointer',
              opacity: isUploading ? 0.6 : 1
            }}
          >
            {isUploading ? '初始化中...' : '🚀 初始化'}
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 'var(--space-4)' }}>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-600)', marginBottom: 'var(--space-3)' }}>
          第二步：选择地图图片文件上传
        </p>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
          disabled={isUploading}
          style={{
            width: '100%',
            padding: 'var(--space-3)',
            border: '2px dashed var(--gray-300)',
            borderRadius: 'var(--radius-lg)',
            fontSize: 'var(--text-sm)',
            cursor: isUploading ? 'not-allowed' : 'pointer'
          }}
        />
      </div>

      {uploadProgress && (
        <div 
          style={{
            background: 'var(--bg-light)',
            padding: 'var(--space-3)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--space-4)',
            fontSize: 'var(--text-sm)',
            color: 'var(--gray-700)'
          }}
        >
          {uploadProgress}
        </div>
      )}

      {uploadResults.length > 0 && (
        <div 
          style={{
            background: 'var(--gray-50)',
            padding: 'var(--space-3)',
            borderRadius: 'var(--radius-md)',
            maxHeight: '200px',
            overflow: 'auto'
          }}
        >
          <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-2)' }}>
            上传结果：
          </h4>
          {uploadResults.map((result, index) => (
            <div 
              key={index}
              style={{
                fontSize: 'var(--text-xs)',
                marginBottom: 'var(--space-1)',
                color: result.startsWith('✅') ? 'var(--green-600)' : 'var(--red-600)'
              }}
            >
              {result}
            </div>
          ))}
        </div>
      )}

      <div 
        style={{
          marginTop: 'var(--space-4)',
          padding: 'var(--space-3)',
          background: 'var(--blue-50)',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--text-xs)',
          color: 'var(--blue-700)'
        }}
      >
        <p style={{ fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-1)' }}>📝 使用说明：</p>
        <p>1. 请先设置环境变量 REACT_APP_SUPABASE_URL 和 REACT_APP_SUPABASE_ANON_KEY</p>
        <p>2. 选择 "动态地图" 文件夹中的所有图片文件</p>
        <p>3. 上传完成后，地图图片将通过Supabase CDN加载</p>
      </div>
    </div>
  );
};

export default ImageUploader;