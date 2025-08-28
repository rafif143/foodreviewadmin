/**
 * Utility functions untuk parsing content artikel
 */

/**
 * Parse content artikel dengan safety check
 * @param {any} content - Content dari database (bisa string, array, atau object)
 * @returns {Array} Array of content blocks
 */
export function parseArticleContent(content) {
  if (!content) {
    return [];
  }

  try {
    // Jika content sudah berupa array, gunakan langsung
    if (Array.isArray(content)) {
      return content;
    }
    
    // Jika content berupa string, coba parse sebagai JSON
    if (typeof content === 'string') {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
    
    // Jika content berupa object tapi bukan array, buat content block baru
    if (typeof content === 'object' && content !== null) {
      return [{
        id: Date.now(),
        type: 'rich_text',
        content: content,
        order: 0,
        config: {}
      }];
    }
    
    // Fallback: buat content block dengan content as-is
    return [{
      id: Date.now(),
      type: 'rich_text',
      content: content,
      order: 0,
      config: {}
    }];
    
  } catch (parseError) {
    console.warn('Error parsing article content:', parseError);
    
    // Jika gagal parse, buat content block baru dengan content lama
    return [{
      id: Date.now(),
      type: 'rich_text',
      content: content,
      order: 0,
      config: {}
    }];
  }
}

/**
 * Convert content blocks ke JSON string untuk database
 * @param {Array} contentBlocks - Array of content blocks
 * @returns {string} JSON string
 */
export function stringifyContentBlocks(contentBlocks) {
  if (!Array.isArray(contentBlocks) || contentBlocks.length === 0) {
    return '';
  }
  
  try {
    return JSON.stringify(contentBlocks);
  } catch (error) {
    console.error('Error stringifying content blocks:', error);
    return '';
  }
}

/**
 * Validate content blocks structure
 * @param {Array} contentBlocks - Array of content blocks
 * @returns {boolean} True if valid
 */
export function validateContentBlocks(contentBlocks) {
  if (!Array.isArray(contentBlocks)) {
    return false;
  }
  
  return contentBlocks.every(block => {
    return block && 
           typeof block === 'object' && 
           typeof block.id !== 'undefined' &&
           typeof block.type === 'string' &&
           typeof block.content !== 'undefined' &&
           typeof block.order === 'number';
  });
}

/**
 * Migrate old content format to new content blocks format
 * @param {any} oldContent - Content dalam format lama
 * @returns {Array} Array of content blocks
 */
export function migrateOldContent(oldContent) {
  if (!oldContent) {
    return [];
  }
  
  // Jika sudah dalam format content blocks, return as-is
  if (Array.isArray(oldContent) && oldContent.length > 0 && oldContent[0].type) {
    return oldContent;
  }
  
  // Jika berupa HTML string, buat content block baru
  if (typeof oldContent === 'string' && oldContent.trim()) {
    return [{
      id: Date.now(),
      type: 'rich_text',
      content: oldContent,
      order: 0,
      config: {}
    }];
  }
  
  // Fallback
  return [];
}
