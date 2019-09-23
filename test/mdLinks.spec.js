import {
  existsPath, validateConvertPath, validateFilePath, validateDirectoryPath,
  searchPathFiles, isFileMd, readFileMd, searchLinks, linksValidate,
} from '../src/index.js';
import { mdLinks } from '../src/mdLinks.js';

const pathNode = require('path');

const relativePath = 'test-folder\\';
const absolutePath = '\\test-folder\\aaaa.md';
const noPath = 'hola';
const directoryPath = '\\test-folder\\';


describe('existsPath', () => {
  it('It should be a function', () => {
    expect(typeof existsPath).toEqual('function');
  });

  it('It should true if the path exists', () => {
    expect(existsPath(pathNode.join(process.cwd(), '\\test-folder\\aaaa.md'))).toBe(true);
  });

  it(' It should return false if the path exists', () => {
    expect(existsPath(noPath)).toBe(false);
  });
});

describe('validateConvertPath', () => {
  it('It should be a function', () => {
    expect(typeof validateConvertPath).toEqual('function');
  });

  it('It should return absolute path', () => {
    expect(validateConvertPath(pathNode.join(process.cwd(), absolutePath)))
      .toBe(pathNode.join(process.cwd(), absolutePath));
  });

  it('It should return absolute path of relative path', () => {
    expect(validateConvertPath(relativePath)).toBe(pathNode.join(process.cwd(), '\\test-folder'));
  });
});

describe('validateFilePath', () => {
  it('It should be a function', () => {
    expect(typeof validateFilePath).toEqual('function');
  });

  it('It should true if the file exists', () => {
    expect(validateFilePath(pathNode.join(process.cwd(), absolutePath))).toBe(true);
  });

  it('It should return false if the file does not exists', () => {
    expect(validateFilePath(pathNode.join(process.cwd(), directoryPath))).toBe(false);
  });
});

describe('validateDirectoryPath', () => {
  it('It should be a function', () => {
    expect(typeof validateDirectoryPath).toEqual('function');
  });

  it('It should true if the directory exists', () => {
    expect(validateDirectoryPath(pathNode.join(process.cwd(), directoryPath))).toBe(true);
  });

  it('It should return false if the directory does not exists', () => {
    expect(validateDirectoryPath(pathNode.join(process.cwd(), absolutePath))).toBe(false);
  });
});

describe('isFileMd', () => {
  it('It should be a function', () => {
    expect(typeof isFileMd).toEqual('function');
  });

  it('It should .md  if is file.md', () => {
    expect(isFileMd(pathNode.join(process.cwd(), absolutePath))).toBe('.md');
  });
});

describe('searchPathFiles', () => {
  it('It should be a function', () => {
    expect(typeof searchPathFiles).toEqual('function');
  });

  it('should return an array with the file name of directory', () => {
    expect(searchPathFiles(relativePath)).toEqual([pathNode.join(process.cwd(), '\\test-folder\\aaaa.md'),
      pathNode.join(process.cwd(), '\\test-folder\\bbbb.md'),
      pathNode.join(process.cwd(), '\\test-folder\\cccc.md'),
      pathNode.join(process.cwd(), '\\test-folder\\test-folder-1\\abab.md'),
      pathNode.join(process.cwd(), '\\test-folder\\test-folder-1\\bcbc.md')]);
  });
});

describe('readFileMd', () => {
  it('It should be a function', () => {
    expect(typeof readFileMd).toEqual('function');
  });
  it('It should read the file', () => {
    expect(readFileMd(pathNode.join(process.cwd(), '\\test-folder\\bbbb.md'))).toEqual('[Markdown](https://es.wikipedia.org/wiki/Markdown)');
  });
});

describe('searchLinks', () => {
  it('It should be a function', () => {
    expect(typeof searchLinks).toEqual('function');
  });

  it('It Should return an array of links from a file', () => {
    expect(searchLinks(relativePath)).toEqual([
      {
        href: 'https://es.wikipedia.org/wiki/Markdown',
        text: 'Markdown',
        file: pathNode.join(process.cwd(), '\\test-folder\\aaaa.md'),
      },
      {
        href: 'https://nodejs.org/api/x',
        text: 'node.js',
        file: pathNode.join(process.cwd(), '\\test-folder\\aaaa.md'),
      },
      {
        href: 'https://es.wikipedia.org/wiki/Markdown',
        text: 'Markdown',
        file: pathNode.join(process.cwd(), '\\test-folder\\bbbb.md'),
      },
      {
        href: 'https://es.wikipedia.org/wiki/Markdown',
        text: 'Markdown',
        file: pathNode.join(process.cwd(), '\\test-folder\\cccc.md'),
      },
    ]);
  });
});

describe('linksValidate', () => {
  it('It should be a function', () => {
    expect(typeof linksValidate).toEqual('function');
  });

  it('It should return a promise', () => linksValidate(relativePath)
    .then((result) => {
      expect(result).toEqual([
        {
          href: 'https://es.wikipedia.org/wiki/Markdown',
          text: 'Markdown',
          file: pathNode.join(process.cwd(), '\\test-folder\\aaaa.md'),
          status: 200,
          statusText: 'OK',
        },
        {
          href: 'https://nodejs.org/api/x',
          text: 'node.js',
          file: pathNode.join(process.cwd(), '\\test-folder\\aaaa.md'),
          status: 404,
          statusText: 'FAIL',
        },
        {
          href: 'https://es.wikipedia.org/wiki/Markdown',
          text: 'Markdown',
          file: pathNode.join(process.cwd(), '\\test-folder\\bbbb.md'),
          status: 200,
          statusText: 'OK',
        },
        {
          href: 'https://es.wikipedia.org/wiki/Markdown',
          text: 'Markdown',
          file: pathNode.join(process.cwd(), '\\test-folder\\cccc.md'),
          status: 200,
          statusText: 'OK',
        },
      ]);
    }));
});

describe('mdLinks', () => {
  it('It should be a function', () => {
    expect(typeof mdLinks).toBe('function');
  });

  it('It should return an array of validated links', () => {
    mdLinks(relativePath, { validate: true }).then((result) => {
      expect(result).toEqual([
        {
          href: 'https://es.wikipedia.org/wiki/Markdown',
          text: 'Markdown',
          file: pathNode.join(process.cwd(), '\\test-folder\\aaaa.md'),
          status: 200,
          statusText: 'OK',
        },
        {
          href: 'https://nodejs.org/api/x',
          text: 'node.js',
          file: pathNode.join(process.cwd(), '\\test-folder\\aaaa.md'),
          status: 404,
          statusText: 'FAIL',
        },
        {
          href: 'https://es.wikipedia.org/wiki/Markdown',
          text: 'Markdown',
          file: pathNode.join(process.cwd(), '\\test-folder\\bbbb.md'),
          status: 200,
          statusText: 'OK',
        },
        {
          href: 'https://es.wikipedia.org/wiki/Markdown',
          text: 'Markdown',
          file: pathNode.join(process.cwd(), '\\test-folder\\cccc.md'),
          status: 200,
          statusText: 'OK',
        },
      ]);
    });
  });

  it('It should return an array of links', () => {
    mdLinks(relativePath, { validate: false }).then((result) => {
      expect(result).toEqual([
        {
          href: 'https://es.wikipedia.org/wiki/Markdown',
          text: 'Markdown',
          file: pathNode.join(process.cwd(), '\\test-folder\\aaaa.md'),
        },
        {
          href: 'https://nodejs.org/api/x',
          text: 'node.js',
          file: pathNode.join(process.cwd(), '\\test-folder\\aaaa.md'),
        },
        {
          href: 'https://es.wikipedia.org/wiki/Markdown',
          text: 'Markdown',
          file: pathNode.join(process.cwd(), '\\test-folder\\bbbb.md'),
        },
        {
          href: 'https://es.wikipedia.org/wiki/Markdown',
          text: 'Markdown',
          file: pathNode.join(process.cwd(), '\\test-folder\\cccc.md'),
        },
      ]);
    });
  });
  it('Debería retornar el link del primer elemento del array de links', () => {
    mdLinks(relativePath, { validate: 'dir' }).then((result) => {
      expect(result).toEqual([pathNode.join(process.cwd(), '\\test-folder\\aaaa.md'),
        pathNode.join(process.cwd(), '\\test-folder\\bbbb.md'),
        pathNode.join(process.cwd(), '\\test-folder\\cccc.md'),
        pathNode.join(process.cwd(), '\\test-folder\\test-folder-1\\abab.md'),
        pathNode.join(process.cwd(), '\\test-folder\\test-folder-1\\bcbc.md')]);
    });
  });
});
