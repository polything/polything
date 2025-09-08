/**
 * @jest-environment node
 */

import {
  resolveMediaIds,
  resolveSingleMediaId,
  convertToLocalPath,
  extractMediaIdsFromContent,
  updateContentWithResolvedMedia,
  isValidMediaId,
  generateMediaResolutionReport,
  batchResolveMediaIds,
  MediaData,
  MediaReference
} from './media-resolver';

describe('Media Resolver', () => {
  const sampleMediaData: Record<string, MediaData> = {
    '1234': {
      id: 1234,
      source_url: 'https://polything.co.uk/wp-content/uploads/2024/01/hero.jpg',
      media_type: 'image',
      mime_type: 'image/jpeg',
      alt_text: 'Hero image',
      caption: { rendered: 'Hero image caption' }
    },
    '5678': {
      id: 5678,
      source_url: 'https://polything.co.uk/wp-content/uploads/2024/01/video.mp4',
      media_type: 'video',
      mime_type: 'video/mp4',
      alt_text: 'Hero video',
      caption: { rendered: 'Hero video caption' }
    },
    '9999': {
      id: 9999,
      source_url: 'https://polything.co.uk/wp-content/uploads/2024/01/external-image.jpg',
      media_type: 'image',
      mime_type: 'image/jpeg',
      alt_text: 'External image'
    }
  };

  const sampleContent = {
    hero: {
      title: 'Test Hero',
      subtitle: 'Test subtitle',
      image: '1234',
      video: '5678',
      text_color: '#ffffff',
      background_color: '#000000'
    },
    links: {
      url: 'https://example.com',
      image: '9999',
      video: ''
    },
    seo: {
      schema: {
        type: 'CreativeWork',
        image: '1234'
      }
    }
  };

  describe('resolveMediaIds', () => {
    test('should resolve multiple media IDs successfully', () => {
      const mediaIds = ['1234', '5678', '9999'];
      const result = resolveMediaIds(mediaIds, sampleMediaData);
      
      expect(result.stats.total).toBe(3);
      expect(result.stats.resolved).toBe(3);
      expect(result.stats.failed).toBe(0);
      expect(result.errors).toHaveLength(0);
      
      expect(result.resolved['1234']).toHaveProperty('localPath', '/images/2024/01/hero.jpg');
      expect(result.resolved['5678']).toHaveProperty('localPath', '/images/2024/01/video.mp4');
      expect(result.resolved['9999']).toHaveProperty('localPath', '/images/2024/01/external-image.jpg');
    });

    test('should handle missing media IDs', () => {
      const mediaIds = ['1234', 'missing', '5678'];
      const result = resolveMediaIds(mediaIds, sampleMediaData);
      
      expect(result.stats.total).toBe(3);
      expect(result.stats.resolved).toBe(2);
      expect(result.stats.failed).toBe(1);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].mediaId).toBe('missing');
      expect(result.errors[0].error).toBe('Media not found in media data');
    });

    test('should handle empty media IDs array', () => {
      const result = resolveMediaIds([], sampleMediaData);
      
      expect(result.stats.total).toBe(0);
      expect(result.stats.resolved).toBe(0);
      expect(result.stats.failed).toBe(0);
      expect(result.errors).toHaveLength(0);
    });

    test('should include media metadata in resolved references', () => {
      const mediaIds = ['1234'];
      const result = resolveMediaIds(mediaIds, sampleMediaData);
      
      const resolved = result.resolved['1234'];
      expect(resolved).toHaveProperty('mediaType', 'image');
      expect(resolved).toHaveProperty('altText', 'Hero image');
      expect(resolved).toHaveProperty('caption', 'Hero image caption');
    });
  });

  describe('resolveSingleMediaId', () => {
    test('should resolve single media ID successfully', () => {
      const result = resolveSingleMediaId('1234', sampleMediaData);
      
      expect(result).not.toBeNull();
      expect(result!.id).toBe('1234');
      expect(result!.localPath).toBe('/images/2024/01/hero.jpg');
      expect(result!.mediaType).toBe('image');
    });

    test('should return null for missing media ID', () => {
      const result = resolveSingleMediaId('missing', sampleMediaData);
      
      expect(result).toBeNull();
    });

    test('should return null for empty media ID', () => {
      const result = resolveSingleMediaId('', sampleMediaData);
      
      expect(result).toBeNull();
    });
  });

  describe('convertToLocalPath', () => {
    test('should convert WordPress uploads URL to local path', () => {
      const wpUrl = 'https://polything.co.uk/wp-content/uploads/2024/01/hero.jpg';
      const result = convertToLocalPath(wpUrl);
      
      expect(result).toBe('/images/2024/01/hero.jpg');
    });

    test('should handle nested uploads path', () => {
      const wpUrl = 'https://polything.co.uk/wp-content/uploads/2023/12/deep/nested/image.png';
      const result = convertToLocalPath(wpUrl);
      
      expect(result).toBe('/images/2023/12/deep/nested/image.png');
    });

    test('should return external URLs as-is', () => {
      const externalUrl = 'https://example.com/image.jpg';
      const result = convertToLocalPath(externalUrl);
      
      expect(result).toBe(externalUrl);
    });

    test('should handle empty URL', () => {
      const result = convertToLocalPath('');
      
      expect(result).toBe('');
    });

    test('should handle null/undefined URL', () => {
      expect(convertToLocalPath(null as any)).toBe('');
      expect(convertToLocalPath(undefined as any)).toBe('');
    });
  });

  describe('extractMediaIdsFromContent', () => {
    test('should extract media IDs from all content fields', () => {
      const result = extractMediaIdsFromContent(sampleContent);
      
      expect(result).toContain('1234'); // hero.image and seo.schema.image
      expect(result).toContain('5678'); // hero.video
      expect(result).toContain('9999'); // links.image
      expect(result).toHaveLength(3); // Should be unique
    });

    test('should handle content without media references', () => {
      const contentWithoutMedia = {
        hero: {
          title: 'No media',
          subtitle: 'No media subtitle',
          image: '',
          video: '',
          text_color: '#ffffff',
          background_color: '#000000'
        }
      };
      
      const result = extractMediaIdsFromContent(contentWithoutMedia);
      
      expect(result).toHaveLength(0);
    });

    test('should handle invalid media IDs', () => {
      const contentWithInvalidIds = {
        hero: {
          image: 'not-a-number',
          video: '0',
          title: 'Test',
          subtitle: 'Test',
          text_color: '#ffffff',
          background_color: '#000000'
        }
      };
      
      const result = extractMediaIdsFromContent(contentWithInvalidIds);
      
      expect(result).toHaveLength(0);
    });

    test('should handle missing hero or links sections', () => {
      const minimalContent = {
        title: 'Minimal content'
      };
      
      const result = extractMediaIdsFromContent(minimalContent);
      
      expect(result).toHaveLength(0);
    });
  });

  describe('updateContentWithResolvedMedia', () => {
    test('should update content with resolved media paths', () => {
      const resolvedMedia: Record<string, MediaReference> = {
        '1234': {
          id: '1234',
          originalUrl: 'https://polything.co.uk/wp-content/uploads/2024/01/hero.jpg',
          localPath: '/images/2024/01/hero.jpg',
          mediaType: 'image'
        },
        '5678': {
          id: '5678',
          originalUrl: 'https://polything.co.uk/wp-content/uploads/2024/01/video.mp4',
          localPath: '/images/2024/01/video.mp4',
          mediaType: 'video'
        },
        '9999': {
          id: '9999',
          originalUrl: 'https://polything.co.uk/wp-content/uploads/2024/01/external-image.jpg',
          localPath: '/images/2024/01/external-image.jpg',
          mediaType: 'image'
        }
      };
      
      const result = updateContentWithResolvedMedia(sampleContent, resolvedMedia);
      
      expect(result.hero.image).toBe('/images/2024/01/hero.jpg');
      expect(result.hero.video).toBe('/images/2024/01/video.mp4');
      expect(result.links.image).toBe('/images/2024/01/external-image.jpg');
      expect(result.seo.schema.image).toBe('/images/2024/01/hero.jpg');
    });

    test('should not modify content when media not resolved', () => {
      const emptyResolvedMedia: Record<string, MediaReference> = {};
      
      const result = updateContentWithResolvedMedia(sampleContent, emptyResolvedMedia);
      
      expect(result.hero.image).toBe('1234'); // Should remain unchanged
      expect(result.hero.video).toBe('5678'); // Should remain unchanged
    });

    test('should handle partial resolution', () => {
      const partialResolvedMedia: Record<string, MediaReference> = {
        '1234': {
          id: '1234',
          originalUrl: 'https://polything.co.uk/wp-content/uploads/2024/01/hero.jpg',
          localPath: '/images/2024/01/hero.jpg',
          mediaType: 'image'
        }
      };
      
      const result = updateContentWithResolvedMedia(sampleContent, partialResolvedMedia);
      
      expect(result.hero.image).toBe('/images/2024/01/hero.jpg'); // Resolved
      expect(result.hero.video).toBe('5678'); // Not resolved, remains unchanged
      expect(result.seo.schema.image).toBe('/images/2024/01/hero.jpg'); // Resolved
    });
  });

  describe('isValidMediaId', () => {
    test('should validate numeric media IDs', () => {
      expect(isValidMediaId('1234')).toBe(true);
      expect(isValidMediaId('1')).toBe(true);
      expect(isValidMediaId('999999')).toBe(true);
    });

    test('should reject non-numeric media IDs', () => {
      expect(isValidMediaId('not-a-number')).toBe(false);
      expect(isValidMediaId('abc123')).toBe(false);
      expect(isValidMediaId('123abc')).toBe(false);
    });

    test('should reject zero and negative IDs', () => {
      expect(isValidMediaId('0')).toBe(false);
      expect(isValidMediaId('-1')).toBe(false);
    });

    test('should reject empty or null values', () => {
      expect(isValidMediaId('')).toBe(false);
      expect(isValidMediaId(null as any)).toBe(false);
      expect(isValidMediaId(undefined as any)).toBe(false);
    });
  });

  describe('generateMediaResolutionReport', () => {
    test('should generate report for successful resolution', () => {
      const result = {
        resolved: { '1234': {} as MediaReference, '5678': {} as MediaReference },
        errors: [],
        stats: { total: 2, resolved: 2, failed: 0 }
      };
      
      const report = generateMediaResolutionReport(result);
      
      expect(report).toContain('Total media IDs: 2');
      expect(report).toContain('Successfully resolved: 2');
      expect(report).toContain('Failed: 0');
      expect(report).toContain('Success rate: 100%');
    });

    test('should generate report with errors', () => {
      const result = {
        resolved: { '1234': {} as MediaReference },
        errors: [{ mediaId: '5678', error: 'Media not found' }],
        stats: { total: 2, resolved: 1, failed: 1 }
      };
      
      const report = generateMediaResolutionReport(result);
      
      expect(report).toContain('Total media IDs: 2');
      expect(report).toContain('Successfully resolved: 1');
      expect(report).toContain('Failed: 1');
      expect(report).toContain('Success rate: 50%');
      expect(report).toContain('Errors:');
      expect(report).toContain('Media ID 5678: Media not found');
    });

    test('should handle zero total media IDs', () => {
      const result = {
        resolved: {},
        errors: [],
        stats: { total: 0, resolved: 0, failed: 0 }
      };
      
      const report = generateMediaResolutionReport(result);
      
      expect(report).toContain('Success rate: 0%');
    });
  });

  describe('batchResolveMediaIds', () => {
    test('should resolve media IDs in batch', async () => {
      const mediaIds = ['1234', '5678', '9999'];
      const result = await batchResolveMediaIds(mediaIds, sampleMediaData);
      
      expect(result.stats.total).toBe(3);
      expect(result.stats.resolved).toBe(3);
      expect(result.stats.failed).toBe(0);
    });

    test('should call progress callback', async () => {
      const mediaIds = ['1234', '5678'];
      const progressCalls: Array<[number, number]> = [];
      
      await batchResolveMediaIds(mediaIds, sampleMediaData, (current, total) => {
        progressCalls.push([current, total]);
      });
      
      expect(progressCalls).toHaveLength(2);
      expect(progressCalls[0]).toEqual([1, 2]);
      expect(progressCalls[1]).toEqual([2, 2]);
    });

    test('should handle errors in batch processing', async () => {
      const mediaIds = ['1234', 'missing', '5678'];
      const result = await batchResolveMediaIds(mediaIds, sampleMediaData);
      
      expect(result.stats.total).toBe(3);
      expect(result.stats.resolved).toBe(2);
      expect(result.stats.failed).toBe(1);
      expect(result.errors).toHaveLength(1);
    });
  });
});
