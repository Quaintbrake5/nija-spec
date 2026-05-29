import axios from 'axios';
import { LocalModel } from './localModel';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('LocalModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should extract and return parsed JSON on success', async () => {
    const parsed = { key: 'value' };
    mockedAxios.post.mockResolvedValue({ data: { response: JSON.stringify(parsed) } });

    const model = new LocalModel({ endpoint: 'http://localhost:11434/api/generate', model: 'qwen2.5:7b' });
    const result = await model.extract('test prompt', {});

    expect(result).toEqual(parsed);
  });

  it('should store config correctly', () => {
    const config = { endpoint: 'http://localhost:11434/api/generate', model: 'qwen2.5:7b', timeout: 5000 };
    const model = new LocalModel(config);

    expect(model).toBeDefined();
  });

  it('should use custom timeout when provided', async () => {
    mockedAxios.post.mockResolvedValue({ data: { response: '{}' } });

    const model = new LocalModel({ endpoint: 'http://localhost:11434/api/generate', model: 'qwen2.5:7b', timeout: 5000 });
    await model.extract('prompt', {});

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:11434/api/generate',
      expect.any(Object),
      { timeout: 5000 }
    );
  });

  it('should throw on network error', async () => {
    mockedAxios.post.mockRejectedValue(new Error('ECONNREFUSED'));

    const model = new LocalModel({ endpoint: 'http://localhost:11434/api/generate', model: 'qwen2.5:7b' });
    await expect(model.extract('prompt', {})).rejects.toThrow('Local model extraction failed');
  });

  it('should throw on invalid JSON response', async () => {
    mockedAxios.post.mockResolvedValue({ data: { response: 'not-json' } });

    const model = new LocalModel({ endpoint: 'http://localhost:11434/api/generate', model: 'qwen2.5:7b' });
    await expect(model.extract('prompt', {})).rejects.toThrow('Local model extraction failed');
  });

  it('should forward the prompt in the request body', async () => {
    mockedAxios.post.mockResolvedValue({ data: { response: '{}' } });

    const model = new LocalModel({ endpoint: 'http://localhost:11434/api/generate', model: 'qwen2.5:7b' });
    await model.extract('analyze this spec', {});

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ prompt: 'analyze this spec' }),
      expect.any(Object)
    );
  });

  it('should forward the model name in the request body', async () => {
    mockedAxios.post.mockResolvedValue({ data: { response: '{}' } });

    const model = new LocalModel({ endpoint: 'http://localhost:11434/api/generate', model: 'qwen2.5:7b' });
    await model.extract('prompt', {});

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ model: 'qwen2.5:7b' }),
      expect.any(Object)
    );
  });
});
