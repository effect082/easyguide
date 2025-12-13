/**
 * Image compression utility for optimizing uploaded images
 * Reduces file size while maintaining visual quality for mobile display
 */

export const compressImage = async (file, options = {}) => {
    const {
        maxWidth = 800,
        maxHeight = 800,
        quality = 0.7
    } = options;

    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                // Calculate new dimensions while maintaining aspect ratio
                let width = img.width;
                let height = img.height;

                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width = Math.floor(width * ratio);
                    height = Math.floor(height * ratio);
                }

                // Create canvas for resizing
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');

                // Enable image smoothing for better quality
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';

                // Draw resized image
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to data URL
                const dataUrl = canvas.toDataURL('image/jpeg', quality);

                // Also get blob for size calculation
                canvas.toBlob((blob) => {
                    resolve({
                        dataUrl,
                        originalSize: file.size,
                        compressedSize: blob.size,
                        reduction: Math.round((1 - blob.size / file.size) * 100),
                        width,
                        height
                    });
                }, 'image/jpeg', quality);
            };

            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target.result;
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Compress a base64 data URL
 */
export const compressDataUrl = async (dataUrl, maxWidth = 320, quality = 0.4) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            // Calculate new dimensions
            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
                const ratio = maxWidth / width;
                width = maxWidth;
                height = Math.floor(height * ratio);
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = reject;
        img.src = dataUrl;
    });
};

/**
 * Compress all images in a list of blocks
 */
export const compressProjectBlocks = async (blocks) => {
    const compressedBlocks = JSON.parse(JSON.stringify(blocks)); // Deep copy

    for (const block of compressedBlocks) {
        if (block.type === 'image' && block.content?.src?.startsWith('data:image')) {
            try {
                block.content.src = await compressDataUrl(block.content.src, 320, 0.4);
            } catch (e) {
                console.warn('Failed to compress image:', e);
            }
        } else if (block.type === 'gallery' && block.content?.images) {
            try {
                block.content.images = await Promise.all(
                    block.content.images.map(async (img) => {
                        if (img.startsWith('data:image')) {
                            return await compressDataUrl(img, 320, 0.4);
                        }
                        return img;
                    })
                );
            } catch (e) {
                console.warn('Failed to compress gallery images:', e);
            }
        } else if (block.type === 'slide' && block.content?.images) {
            try {
                block.content.images = await Promise.all(
                    block.content.images.map(async (img) => {
                        if (img.startsWith('data:image')) {
                            return await compressDataUrl(img, 320, 0.4);
                        }
                        return img;
                    })
                );
            } catch (e) {
                console.warn('Failed to compress slide images:', e);
            }
        } else if (block.type === 'share' && block.content?.shareImage?.startsWith('data:image')) {
            try {
                block.content.shareImage = await compressDataUrl(block.content.shareImage, 320, 0.4);
            } catch (e) {
                console.warn('Failed to compress share image:', e);
            }
        }
    }
    return compressedBlocks;
};
