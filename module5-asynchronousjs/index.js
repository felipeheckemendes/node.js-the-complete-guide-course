const fs = require('fs');
const superagent = require('superagent');

// Callback Hell
/*
fs.readFile(`${__dirname}/dog.txt`, 'utf8', (err, fileData) => {
  superagent
    .get(`https://dog.ceo/api/breed/${fileData}/images/random`)
    .end((err, res) => {
      if (err) return console.log('Error', err.message);
      console.log(res.body.message);
      fs.writeFile(`${__dirname}/dog-img.txt`, res.body.message, (err) => {
        console.log('Image url saved to file');
      });
    });
});

Promises on get method (already  built in the method)
fs.readFile(`${__dirname}/dog.txt`, 'utf8', (err, fileData) => {
  console.log('Breed:', fileData);
  superagent
    .get(`https://dog.ceo/api/breed/${fileData}/images/random`)
    .then((res) => {
      console.log(res.body.message);
      fs.writeFile(`${__dirname}/dog-img.txt`, res.body.message, (err) => {
        console.log('Image url saved to file');
      });
    })
    .catch((err) => {
      console.log('Error', err.message);
    });
});
*/

// Promisifying readFile and writeFile]
const readFilePro = (file, encoding) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, encoding, (err, fileData) => {
      resolve(fileData);
      if (err) reject('I could not fin the file! :(');
    });
  });
};

const writeFilePro = (file, content) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, content, (err) => {
      if (err) reject(err);
      resolve(true);
    });
  });
};

/*
readFilePro(`${__dirname}/dog.txt`, 'utf8')
  .then((fileData) => {
    console.log('Breed:', fileData);
    return superagent.get(
      `https://dog.ceo/api/breed/${fileData}/images/random`
    );
  })
  .then((res) => {
    console.log(res.body.message);
    return writeFilePro(`${__dirname}/dog-img.txt`, res.body.message);
  })
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log('Error', err.message);
  });
*/

// Async await
(async () => {
  try {
    const fileData = await readFilePro(`${__dirname}/dog.txt`, 'utf8');
    console.log('Breed', fileData);

    const response1Promise = superagent.get(`https://dog.ceo/api/breed/${fileData}/images/random`);
    const response2Promise = superagent.get(`https://dog.ceo/api/breed/${fileData}/images/random`);
    const response3Promise = superagent.get(`https://dog.ceo/api/breed/${fileData}/images/random`);

    const response = (await Promise.all([response1Promise, response2Promise, response3Promise]))
      .map((response) => response.body.message)
      .join('\n');
    console.log(response);
    await writeFilePro(`${__dirname}/dog-img.txt`, response);
  } catch (err) {
    console.log(err.message);
    throw err;
  }
})();
