const fs = require('fs');
const path = require('path');
const util = require('util');

// Promisify the fs.writeFile function
const writeFileAsync = util.promisify(fs.writeFile);

// Reading data from data-files
let toursData = fs.readFileSync(path.join(__dirname, '..', 'dev-data', 'data', 'tours-simple.json'));
toursData = JSON.parse(toursData);

const findTourById = (id, data) => {
  const tourData = data.find((element) => element.id === +id);
  if (!tourData) {
    throw new Error('Invalid ID');
  }
  return tourData;
};

const sendErrorResponse = (res, err, code) =>
  res.status(code).json({
    status: 'fail',
    error: err.message,
  });

exports.checkID = (req, res, next, val) => {
  try {
    const tourData = toursData.find((element) => element.id === +val);
    if (!tourData) {
      throw new Error('Invalid ID');
    }
    next();
  } catch (err) {
    return sendErrorResponse(res, err, 404);
  }
};

exports.getAllTours = (req, res) => {
  try {
    if (!toursData) {
      throw new Error('Tours data not available');
    }
    res.status(200).json({
      status: 'success',
      results: toursData.length,
      data: { toursData },
    });
  } catch (err) {
    return sendErrorResponse(res, err, 500);
  }
};

exports.getTour = (req, res) => {
  try {
    const tourData = findTourById(req.params.id, toursData);
    res.status(200).json({
      status: 'success',
      data: { tour: tourData },
    });
  } catch (err) {
    sendErrorResponse(res, err, 404);
  }
};

exports.checkBody = async (req, res, next) => {
  console.log(req.body);
  try {
    if (!req.body.name || !req.body.price) {
      throw new Error('Missing name or price information for new tour');
    }
    next();
  } catch (err) {
    sendErrorResponse(res, err, 400);
  }
};

exports.createTour = async (req, res) => {
  try {
    const newId = toursData.at(-1).id + 1;
    const newTour = Object.assign({ id: newId }, req.body);
    toursData.push(newTour);
    await writeFileAsync(path.join(__dirname, '..', 'dev-data', 'data', 'tours-simple.json'), JSON.stringify(toursData));
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    sendErrorResponse(res, err, 500);
  }
};

exports.updateTour = async (req, res) => {
  try {
    console.log('PATCH requests functionalitgy yet to be implemented...');
    const tourData = findTourById(req.params.id, toursData);
    res.status(500).json({
      status: 'error',
      data: 'This route is not yet defined',
    });
  } catch (err) {
    sendErrorResponse(res, err, 500);
  }
};

exports.deleteTour = async (req, res) => {
  try {
    console.log('DELETE requests functionalitgy yet to be implemented...');
    console.log(req.params);
    const tourData = findTourById(req.params.id, toursData);
    res.status(500).json({
      status: 'error',
      data: 'This route is not yet defined',
    });
  } catch (err) {
    sendErrorResponse(res, err, 500);
  }
};
