import { createClient } from '@supabase/supabase-js'

// Supabase配置
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 存储桶名称
export const STORAGE_BUCKET = 'map-images'

// 获取公开图片URL的辅助函数
export const getPublicImageUrl = (imagePath: string): string => {
  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(imagePath)
  
  return data.publicUrl
}

// 上传图片到Supabase存储
export const uploadImage = async (file: File, path: string) => {
  try {
    console.log(`开始上传文件: ${file.name} -> ${path}`)
    console.log(`文件大小: ${(file.size / 1024 / 1024).toFixed(2)}MB`)
    console.log(`文件类型: ${file.type}`)
    
    // 检查文件大小（限制10MB）
    if (file.size > 10 * 1024 * 1024) {
      const error = { message: '文件大小超过10MB限制' }
      console.error('文件太大:', error)
      return { success: false, error }
    }

    // 检查文件类型
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      const error = { message: `不支持的文件类型: ${file.type}` }
      console.error('文件类型不支持:', error)
      return { success: false, error }
    }

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (error) {
      console.error('图片上传失败:', error)
      console.error('错误详情:', {
        message: error.message,
        name: error.name,
        cause: error.cause
      })
      return { success: false, error }
    }

    console.log('图片上传成功:', data)
    
    // 验证上传的文件是否可以访问
    const publicUrl = getPublicImageUrl(path)
    console.log('图片公开URL:', publicUrl)
    
    return { success: true, data, publicUrl }
  } catch (error) {
    console.error('上传过程中发生错误:', error)
    return { success: false, error }
  }
}

// 批量上传地图图片
export const uploadMapImages = async () => {
  try {
    // 首先检查存储桶是否存在
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('获取存储桶列表失败:', listError)
      return false
    }

    const bucketExists = buckets?.some(bucket => bucket.name === STORAGE_BUCKET)
    
    if (!bucketExists) {
      // 创建存储桶
      const { error: bucketError } = await supabase.storage.createBucket(STORAGE_BUCKET, {
        public: true,
        fileSizeLimit: 1024 * 1024 * 10, // 10MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
      })

      if (bucketError) {
        console.error('创建存储桶失败:', bucketError)
        return false
      }
      
      console.log('存储桶创建成功')
    } else {
      console.log('存储桶已存在')
    }

    // 设置存储桶为公开访问
    const { error: policyError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .createSignedUrl('test.png', 60) // 测试权限

    console.log('存储桶权限测试:', policyError ? '需要手动设置权限' : '权限正常')
    return true
  } catch (error) {
    console.error('初始化存储失败:', error)
    return false
  }
}

// 地图图片路径配置
export const MAP_IMAGES = {
  EARTH: 'earth-map.png',
  REGIONS: {
    'A.N': 'region-africa-north.png',
    'A.E': 'region-africa-east.png', 
    'A.S': 'region-africa-south.png',
    'A.W': 'region-africa-west.png',
    'E.A': 'region-east-asia.png',
    'S.AS': 'region-southeast-asia.png',
    'S.A.I': 'region-south-asia-india.png',
    'W.A': 'region-west-asia.png',
    'C.A': 'region-central-asia.png',
    'FE.A': 'region-far-east-asia.png',
    'EA.N': 'region-eurasia-north.png',
    'N.E': 'region-north-europe.png',
    'E.E': 'region-east-europe.png',
    'W.E': 'region-west-europe.png',
    'NA.E': 'region-north-america-east.png',
    'NA.W': 'region-north-america-west.png',
    'C.CA': 'region-caribbean-central-america.png',
    'SA': 'region-south-america.png',
    'OC': 'region-oceania.png',
    'S.S.I': 'region-south-pacific-islands.png'
  }
}

// 获取地球图片URL
export const getEarthImageUrl = (): string => {
  return getPublicImageUrl(MAP_IMAGES.EARTH)
}

// 获取地区色块图片URL
export const getRegionImageUrl = (regionCode: string): string => {
  const imagePath = MAP_IMAGES.REGIONS[regionCode as keyof typeof MAP_IMAGES.REGIONS]
  if (!imagePath) {
    console.warn(`未找到地区 ${regionCode} 对应的图片路径`)
    return ''
  }
  return getPublicImageUrl(imagePath)
}