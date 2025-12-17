import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import VictorySlideshow from '../src/components/VictorySlideshow';

// Mock Fetch
global.fetch = vi.fn();

describe('VictorySlideshow Component', () => {
  let slideshow;
  let mockScene;

  beforeEach(() => {
    mockScene = {
      scene: { start: vi.fn(), resume: vi.fn() },
      sound: { play: vi.fn(), stopAll: vi.fn() }
    };
    slideshow = new VictorySlideshow(mockScene);
    document.body.innerHTML = ''; // Clear DOM
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create overlay elements when show() is called', async () => {
    // Mock successful API response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ url: 'test.jpg' }]
    });

    await slideshow.show('TestCity');

    const overlay = document.querySelector('.victory-overlay');
    expect(overlay).not.toBeNull();
    
    const smoke = document.querySelector('.smoke-border');
    expect(smoke).not.toBeNull();
    
    const img = document.querySelector('.victory-image');
    expect(img).not.toBeNull();
  });

  it('should use fallback if API returns no photos', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    await slideshow.show('EmptyCity');

    const overlay = document.querySelector('.victory-overlay');
    expect(overlay).not.toBeNull();
    // Should verify fallback text or image is present
    // Implementation detail: we might show a "Victory" text if no images
    const title = document.querySelector('.victory-title');
    expect(title).not.toBeNull();
  });

  it('should remove overlay and navigate on exit', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ url: 'test.jpg' }]
    });

    await slideshow.show('TestCity');

    const exitBtn = document.querySelector('.victory-close');
    expect(exitBtn).not.toBeNull();

    exitBtn.click();

    const overlay = document.querySelector('.victory-overlay');
    expect(overlay).toBeNull(); // Should be removed
    expect(mockScene.scene.start).toHaveBeenCalledWith('ArenaSelectScene');
  });
});
