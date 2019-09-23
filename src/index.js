// Importando módulos de node.js
// path (Módulo que proporciona utilidades para trabajar con rutas de archivos y directorios.
// fs (Módulo que proporciona una API para interactuar con el sistema de archivos)
// fileHoudmlibrería - interfaz para buscar en el sistema de archivos
const pathNode = require('path');
const fs = require('fs');
const marked = require('marked'); // permite analizar Markdown en HTML
const fetch = require('node-fetch'); // módulo liviano que trae WINDOWS.FETCH API a Node.js
// const fileHound = require('filehound');

// Validar si la ruta existe--retorna true o false
const existsPath = ((route) => fs.existsSync(route));

// Validar si la ruta es absoluta o Relativa y convertir
const validateConvertPath = ((route) => {
  if (!pathNode.isAbsolute(route)) {
    const newAbsolute = pathNode.resolve(route);
    return newAbsolute;
  }
  return route;
});

// Validar si es archivo --retorna true o false
// fs.stat objeto que proporciona información de un archivo
const validateFilePath = ((route) => fs.statSync(route).isFile());

// Validar si es un directorio --retorna true o false
const validateDirectoryPath = ((route) => fs.statSync(route).isDirectory());

// validar si es un archivo md
const isFileMd = ((route) => pathNode.extname(route));

// retornar un array de los archivos md
// fs.readdirSync lee el contenido de un directorio - síncrono
const searchPathFiles = ((route) => {
  let arrayFilesMd = [];
  const filePath = validateConvertPath(route);
  if (validateFilePath(filePath)) {
    if (isFileMd(filePath) === '.md') {
      arrayFilesMd.push(filePath);
    }
  } else {
    const filesOfDirectory = fs.readdirSync(filePath);
    for (let i = 0; i < filesOfDirectory.length; i += 1) {
      const newFileOfDirectory = searchPathFiles(pathNode.join(filePath, filesOfDirectory[i]));
      arrayFilesMd = arrayFilesMd.concat(newFileOfDirectory);
    }
  }
  return arrayFilesMd;
});

// Leer archivos MD
const readFileMd = ((route) => fs.readFileSync(route, 'utf8'));

// Lee los archivos y extrae links, el texto y ruta del archivo en un array
const searchLinks = (route) => {
  const arrayLinks = [];
  const renderer = new marked.Renderer();
  const arrayFiles = searchPathFiles(route);
  arrayFiles.forEach((filePath) => { // forEach que recorrera el array de as rutas de archivos .md
    const files = readFileMd(filePath); // almacenar en una constante  la funcionde leer el archivo
    // buscar los link del archivo y solicitar los argumentos
    renderer.link = (hrefFile, titleFile, textFile) => {
      arrayLinks.push({
        href: hrefFile, // URL encontrada
        text: textFile, // Texto que aparece en el link
        file: filePath, // Ruta del archivo donde se encontró el link
      });
    };
    marked(files, {
      renderer,
    });
  });
  return arrayLinks;
};

// Validar si la url es válido o está rota
const linksValidate = (route) => {
  const links = searchLinks(route);
  const urlFileMd = links.map((link) => new Promise((resolve, reject) => {
    const linkobj = link;
    fetch(link.href)
      .then((result) => {
        if (result.status > 399) {
          linkobj.status = result.status;
          linkobj.statusText = 'FAIL';
        } else {
          linkobj.status = result.status;
          linkobj.statusText = 'OK';
        }
        resolve(linkobj);
      })
      .catch((error) => {
        reject(linkobj.status = error.code);
      });
  }));
  return Promise.all(urlFileMd);
};


module.exports = {
  existsPath,
  validateConvertPath,
  validateFilePath,
  validateDirectoryPath,
  isFileMd,
  searchPathFiles,
  readFileMd,
  searchLinks,
  linksValidate,
};
