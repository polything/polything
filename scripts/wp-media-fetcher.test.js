/**
 * Tests for WordPress Media Fetcher
 * Task 1.6: Add media fetcher to download /wp-content/uploads/** and mirror under /public/images/**
 */

const fs = require('fs').promises;
const path = require('path');

// Mock fetch for testing
global.fetch = jest.fn();

describe('WordPress Media Fetcher', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock fs methods
    jest.spyOn(fs, 'mkdir').mockResolvedValue();
    jest.spyOn(fs, 'writeFile').mockResolvedValue();
    jest.spyOn(fs, 'access').mockResolvedValue();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('fetchMediaList', () => {
    test('should fetch media list from WordPress API', async () => {
      const { fetchMediaList } = require('./wp-media-fetcher.js');
      const mockMedia = [
        {
          id: 123,
          source_url: 'https://polything.co.uk/wp-content/uploads/2024/01/image1.jpg',
          media_details: {
            file: '2024/01/image1.jpg',
            width: 800,
            height: 600
          }
        }
      ];

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMedia,
        headers: {
          get: (name) => name === 'x-wp-totalpages' ? '1' : null
        }
      });

      const result = await fetchMediaList('https://polything.co.uk');
      
      expect(result).toEqual(mockMedia);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://polything.co.uk/wp-json/wp/v2/media?per_page=100&page=1',
        expect.objectContaining({
          signal: expect.any(Object)
        })
      );
    });

    test('should handle API errors when fetching media list', async () => {
      const { fetchMediaList } = require('./wp-media-fetcher.js');
      
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      await expect(fetchMediaList('https://polything.co.uk'))
        .rejects.toThrow('Failed to fetch media list: 404 Not Found');
    });

    test('should fetch multiple pages of media', async () => {
      const { fetchMediaList } = require('./wp-media-fetcher.js');
      const mockMediaPage1 = [{ id: 1, source_url: 'https://example.com/image1.jpg' }];
      const mockMediaPage2 = [{ id: 2, source_url: 'https://example.com/image2.jpg' }];

      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockMediaPage1,
          headers: {
            get: (name) => name === 'x-wp-totalpages' ? '2' : null
          }
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockMediaPage2,
          headers: {
            get: (name) => name === 'x-wp-totalpages' ? '2' : null
          }
        });

      const result = await fetchMediaList('https://example.com');
      
      expect(result).toEqual([...mockMediaPage1, ...mockMediaPage2]);
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('downloadMediaFile', () => {
    test('should download media file and save to local directory', async () => {
      const { downloadMediaFile } = require('./wp-media-fetcher.js');
      const mockImageBuffer = Buffer.from('fake-image-data');
      
      // Mock file doesn't exist
      jest.spyOn(fs, 'access').mockRejectedValue(new Error('File not found'));
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        arrayBuffer: async () => mockImageBuffer.buffer
      });

      const result = await downloadMediaFile(
        'https://polything.co.uk/wp-content/uploads/2024/01/image1.jpg',
        './public/images/2024/01/image1.jpg'
      );

      expect(result).toBe('./public/images/2024/01/image1.jpg');
      expect(fs.mkdir).toHaveBeenCalledWith('./public/images/2024/01', { recursive: true });
      expect(fs.writeFile).toHaveBeenCalledWith(
        './public/images/2024/01/image1.jpg',
        expect.any(Buffer)
      );
    });

    test('should handle download errors', async () => {
      const { downloadMediaFile } = require('./wp-media-fetcher.js');
      
      // Mock file doesn't exist
      jest.spyOn(fs, 'access').mockRejectedValue(new Error('File not found'));
      
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      await expect(downloadMediaFile(
        'https://polything.co.uk/wp-content/uploads/2024/01/missing.jpg',
        './public/images/2024/01/missing.jpg'
      )).rejects.toThrow('Failed to download media: 404 Not Found');
    });

    test('should skip download if file already exists', async () => {
      const { downloadMediaFile } = require('./wp-media-fetcher.js');
      
      // Mock file exists
      jest.spyOn(fs, 'access').mockResolvedValue();

      const result = await downloadMediaFile(
        'https://polything.co.uk/wp-content/uploads/2024/01/existing.jpg',
        './public/images/2024/01/existing.jpg'
      );

      expect(result).toBe('./public/images/2024/01/existing.jpg');
      expect(global.fetch).not.toHaveBeenCalled();
      expect(fs.writeFile).not.toHaveBeenCalled();
    });
  });

  describe('processMediaItem', () => {
    test('should process media item and return local path', async () => {
      const { processMediaItem } = require('./wp-media-fetcher.js');
      const mediaItem = {
        id: 123,
        source_url: 'https://polything.co.uk/wp-content/uploads/2024/01/image1.jpg',
        media_details: {
          file: '2024/01/image1.jpg'
        }
      };

      const mockImageBuffer = Buffer.from('fake-image-data');
      global.fetch.mockResolvedValueOnce({
        ok: true,
        arrayBuffer: async () => mockImageBuffer.buffer
      });

      const result = await processMediaItem(mediaItem, {
        outputDir: './public/images',
        skipExisting: true
      });

      expect(result).toEqual({
        id: 123,
        originalUrl: 'https://polything.co.uk/wp-content/uploads/2024/01/image1.jpg',
        localPath: expect.stringContaining('public/images/2024/01/image1.jpg'),
        downloaded: true
      });
    });

    test('should handle processing errors gracefully', async () => {
      const { processMediaItem } = require('./wp-media-fetcher.js');
      const mediaItem = {
        id: 123,
        source_url: 'https://polything.co.uk/wp-content/uploads/2024/01/broken.jpg',
        media_details: {
          file: '2024/01/broken.jpg'
        }
      };

      // Mock file doesn't exist
      jest.spyOn(fs, 'access').mockRejectedValue(new Error('File not found'));
      
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      const result = await processMediaItem(mediaItem, {
        outputDir: './public/images',
        skipExisting: false // Don't skip existing to force download attempt
      });

      expect(result).toEqual({
        id: 123,
        originalUrl: 'https://polything.co.uk/wp-content/uploads/2024/01/broken.jpg',
        localPath: expect.stringContaining('public/images/2024/01/broken.jpg'),
        downloaded: false,
        error: 'Failed to download media: 404 Not Found'
      });
    });
  });

  describe('fetchAndMirrorMedia', () => {
    test('should fetch all media and mirror to local directory', async () => {
      const { fetchAndMirrorMedia } = require('./wp-media-fetcher.js');
      const mockMedia = [
        {
          id: 123,
          source_url: 'https://polything.co.uk/wp-content/uploads/2024/01/image1.jpg',
          media_details: { file: '2024/01/image1.jpg' }
        },
        {
          id: 124,
          source_url: 'https://polything.co.uk/wp-content/uploads/2024/01/image2.jpg',
          media_details: { file: '2024/01/image2.jpg' }
        }
      ];

      // Mock fetchMediaList to return our test data
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockMedia,
        headers: {
          get: (name) => name === 'x-wp-totalpages' ? '1' : null
        }
      });

      // Mock processMediaItem to return successful results
      const wpMediaFetcher = require('./wp-media-fetcher.js');
      jest.spyOn(wpMediaFetcher, 'processMediaItem')
        .mockResolvedValueOnce({
          id: 123,
          originalUrl: 'https://polything.co.uk/wp-content/uploads/2024/01/image1.jpg',
          localPath: './public/images/2024/01/image1.jpg',
          downloaded: true
        })
        .mockResolvedValueOnce({
          id: 124,
          originalUrl: 'https://polything.co.uk/wp-content/uploads/2024/01/image2.jpg',
          localPath: './public/images/2024/01/image2.jpg',
          downloaded: true
        });

      const result = await fetchAndMirrorMedia('https://polything.co.uk', {
        outputDir: './public/images',
        batchSize: 10
      });

      expect(result).toEqual({
        total: 2,
        downloaded: 2,
        skipped: 0,
        errors: 0,
        results: expect.arrayContaining([
          expect.objectContaining({ downloaded: true }),
          expect.objectContaining({ downloaded: true })
        ])
      });
    });

    test('should handle batch processing', async () => {
      const { fetchAndMirrorMedia } = require('./wp-media-fetcher.js');
      const mockMedia = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        source_url: `https://polything.co.uk/wp-content/uploads/2024/01/image${i + 1}.jpg`,
        media_details: { file: `2024/01/image${i + 1}.jpg` }
      }));

      // Mock fetchMediaList to return our test data
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockMedia,
        headers: {
          get: (name) => name === 'x-wp-totalpages' ? '1' : null
        }
      });

      // Mock processMediaItem to return successful results
      const wpMediaFetcher = require('./wp-media-fetcher.js');
      jest.spyOn(wpMediaFetcher, 'processMediaItem')
        .mockResolvedValue({
          id: 1,
          originalUrl: 'https://polything.co.uk/wp-content/uploads/2024/01/image1.jpg',
          localPath: './public/images/2024/01/image1.jpg',
          downloaded: true
        });

      const result = await fetchAndMirrorMedia('https://polything.co.uk', {
        outputDir: './public/images',
        batchSize: 10
      });

      expect(result.total).toBeGreaterThan(0);
      expect(result.results).toBeDefined();
    });
  });

  describe('generateMediaReport', () => {
    test('should generate media fetch report', async () => {
      const { generateMediaReport } = require('./wp-media-fetcher.js');
      const results = {
        total: 5,
        downloaded: 3,
        skipped: 1,
        errors: 1,
        results: [
          { id: 1, downloaded: true, localPath: './public/images/img1.jpg' },
          { id: 2, downloaded: true, localPath: './public/images/img2.jpg' },
          { id: 3, downloaded: true, localPath: './public/images/img3.jpg' },
          { id: 4, downloaded: false, error: 'File exists' },
          { id: 5, downloaded: false, error: 'Download failed' }
        ]
      };

      const report = generateMediaReport(results);
      
      expect(report).toContain('Media Fetch Report');
      expect(report).toContain('**Total**: 5');
      expect(report).toContain('**Downloaded**: 3');
      expect(report).toContain('**Skipped**: 1');
      expect(report).toContain('**Errors**: 1');
    });
  });
});
