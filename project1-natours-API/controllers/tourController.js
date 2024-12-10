const fs = require('fs');
const path = require('path');
const util = require('util');

// Promisify the fs.writeFile function
const writeFileAsync = util.promisify(fs.writeFile);

// Reading data from data-files
let toursData = fs.readFileSync(path.join(__dirname, '..', 'dev-data', 'data', 'tours-simple.json'));
toursData = JSON.parse(toursData);

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: toursData.length,
    data: { toursData },
  });
};

exports.getTour = (req, res) => {
  try {
    const tourData = toursData.find((element) => element.id === +req.params.id);
    if (tourData === undefined) {
      throw new Error('Invalid ID');
    }
    res.status(200).json({
      status: 'success',
      data: { tour: tourData },
    });
  } catch (err) {
    return res.status(404).json({
      status: 'fail',
      error: err.message,
    });
  }
};

exports.createTour = async (req, res) => {
  console.log(req.body);
  const newId = toursData.at(-1).id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  toursData.push(newTour);
  try {
    await writeFileAsync(path.join(__dirname, 'dev-data', 'data', 'tours-simple.json'), JSON.stringify(toursData));
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    console.error('Error writing file:', err);
    res.status(500).send({ error: 'Failed to write file' });
  }
};

exports.updateTour = async (req, res) => {
  console.log('PATCH requests functionalitgy yet to be implemented...');
  try {
    console.log(req.params);
    const tourData = toursData.find((element) => element.id === +req.params.id);
    if (tourData === undefined) {
      throw new Error('Invalid ID, not possible to update');
    }
    res.status(500).json({
      status: 'error',
      data: 'This route is not yet defined',
    });
  } catch (err) {
    return res.status(404).json({
      status: 'fail',
      error: err.message,
    });
  }
};

exports.deleteTour = async (req, res) => {
  console.log('DELETE requests functionalitgy yet to be implemented...');
  try {
    console.log(req.params);
    const tourData = toursData.find((element) => element.id === +req.params.id);
    if (tourData === undefined) {
      throw new Error('Invalid ID, not possible to delete');
    }
    res.status(500).json({
      status: 'error',
      data: 'This route is not yet defined',
    });
  } catch (err) {
    return res.status(404).json({
      status: 'fail',
      error: err.message,
    });
  }
};
