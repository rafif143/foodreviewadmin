/**
 * Test cases untuk contentParser utility functions
 * Jalankan dengan: node contentParser.test.js
 */

import { parseArticleContent, stringifyContentBlocks, validateContentBlocks, migrateOldContent } from './contentParser.js';

// Test cases untuk parseArticleContent
console.log('=== Testing parseArticleContent ===');

// Test 1: Content kosong
console.log('Test 1 - Empty content:', parseArticleContent(null));
console.log('Test 1 - Empty string:', parseArticleContent(''));

// Test 2: Content berupa array (format baru)
const newFormatContent = [
  {
    id: 1,
    type: 'rich_text',
    content: '<p>Test content</p>',
    order: 0,
    config: {}
  }
];
console.log('Test 2 - New format array:', parseArticleContent(newFormatContent));

// Test 3: Content berupa JSON string
const jsonStringContent = JSON.stringify(newFormatContent);
console.log('Test 3 - JSON string:', parseArticleContent(jsonStringContent));

// Test 4: Content berupa HTML string (format lama)
const oldFormatContent = '<h1>Test Title</h1><p>Test paragraph</p>';
console.log('Test 4 - Old format HTML:', parseArticleContent(oldFormatContent));

// Test 5: Content berupa object (invalid format)
const invalidObjectContent = { title: 'Test', body: 'Content' };
console.log('Test 5 - Invalid object:', parseArticleContent(invalidObjectContent));

// Test 6: Content berupa invalid JSON string
const invalidJsonString = '{ invalid json }';
console.log('Test 6 - Invalid JSON string:', parseArticleContent(invalidJsonString));

console.log('\n=== Testing stringifyContentBlocks ===');

// Test 1: Valid content blocks
console.log('Test 1 - Valid blocks:', stringifyContentBlocks(newFormatContent));

// Test 2: Empty array
console.log('Test 2 - Empty array:', stringifyContentBlocks([]));

// Test 3: Invalid input
console.log('Test 3 - Invalid input:', stringifyContentBlocks(null));
console.log('Test 3 - Invalid input:', stringifyContentBlocks('not an array'));

console.log('\n=== Testing validateContentBlocks ===');

// Test 1: Valid content blocks
console.log('Test 1 - Valid blocks:', validateContentBlocks(newFormatContent));

// Test 2: Invalid content blocks
const invalidBlocks = [
  { id: 1, type: 'rich_text' }, // Missing content and order
  { type: 'image', content: 'test.jpg', order: 1 } // Missing id
];
console.log('Test 2 - Invalid blocks:', validateContentBlocks(invalidBlocks));

// Test 3: Empty array
console.log('Test 3 - Empty array:', validateContentBlocks([]));

// Test 4: Non-array input
console.log('Test 4 - Non-array input:', validateContentBlocks('not an array'));

console.log('\n=== Testing migrateOldContent ===');

// Test 1: Old HTML format
console.log('Test 1 - Old HTML format:', migrateOldContent(oldFormatContent));

// Test 2: New format (should return as-is)
console.log('Test 2 - New format (should return as-is):', migrateOldContent(newFormatContent));

// Test 3: Empty content
console.log('Test 3 - Empty content:', migrateOldContent(''));

console.log('\n=== Test Summary ===');
console.log('Semua test cases telah dijalankan. Periksa output di atas untuk memastikan fungsi berjalan dengan benar.');
