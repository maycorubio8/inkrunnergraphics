import { supabase } from './supabase';

// Tipos de archivo permitidos
export const ALLOWED_FILE_TYPES = {
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/svg+xml': ['.svg'],
  'application/pdf': ['.pdf'],
  'application/postscript': ['.ai', '.eps'],
};

export const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.svg', '.pdf', '.ai', '.eps'];
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// Validar archivo
export function validateFile(file) {
  const errors = [];
  
  // Validar tamaño
  if (file.size > MAX_FILE_SIZE) {
    errors.push(`File exceeds maximum size of 50MB`);
  }
  
  // Validar tipo
  const extension = '.' + file.name.split('.').pop().toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    errors.push(`File type not allowed. Accepted: ${ALLOWED_EXTENSIONS.join(', ')}`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Generar nombre único para archivo
function generateFileName(originalName) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop().toLowerCase();
  const safeName = originalName
    .split('.')[0]
    .replace(/[^a-z0-9]/gi, '_')
    .substring(0, 30);
  
  return `${timestamp}_${random}_${safeName}.${extension}`;
}

// Subir archivo a Supabase Storage
export async function uploadDesign(file, orderId = 'temp') {
  const validation = validateFile(file);
  if (!validation.valid) {
    return { error: validation.errors.join(', '), data: null };
  }

  const fileName = generateFileName(file.name);
  const filePath = `${orderId}/${fileName}`;

  const { data, error } = await supabase.storage
    .from('designs')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Upload error:', error);
    return { error: error.message, data: null };
  }

  // Obtener URL pública temporal (signed URL válida por 1 hora)
  const { data: urlData } = await supabase.storage
    .from('designs')
    .createSignedUrl(filePath, 3600);

  return {
    error: null,
    data: {
      path: filePath,
      fileName: fileName,
      originalName: file.name,
      size: file.size,
      type: file.type,
      url: urlData?.signedUrl || null
    }
  };
}

// Eliminar archivo
export async function deleteDesign(filePath) {
  const { error } = await supabase.storage
    .from('designs')
    .remove([filePath]);

  return { error: error?.message || null };
}

// Obtener URL firmada (para previews)
export async function getDesignUrl(filePath, expiresIn = 3600) {
  const { data, error } = await supabase.storage
    .from('designs')
    .createSignedUrl(filePath, expiresIn);

  if (error) {
    return { error: error.message, url: null };
  }

  return { error: null, url: data.signedUrl };
}

// Mover archivos de temp a orden final
export async function moveDesignToOrder(tempPath, orderId) {
  const fileName = tempPath.split('/').pop();
  const newPath = `orders/${orderId}/${fileName}`;

  // Descargar archivo temporal
  const { data: fileData, error: downloadError } = await supabase.storage
    .from('designs')
    .download(tempPath);

  if (downloadError) {
    return { error: downloadError.message, path: null };
  }

  // Subir a nueva ubicación
  const { error: uploadError } = await supabase.storage
    .from('designs')
    .upload(newPath, fileData, { upsert: false });

  if (uploadError) {
    return { error: uploadError.message, path: null };
  }

  // Eliminar archivo temporal
  await deleteDesign(tempPath);

  return { error: null, path: newPath };
}