const express = require('express');
const fs = require('fs');
const path = require('path');
const util = require('util');
const morgan = require('morgan');

// Promisify the fs.writeFile function
const writeFileAsync = util.promisify(fs.writeFile);

// Reading data from data-files
let toursData = fs.readFileSync(path.join(__dirname, 'dev-data', 'data', 'tours-simple.json'));
toursData = JSON.parse(toursData);

// Starting App
app = express();

// MIDDLEWARES
// Morgan Login
app.use(morgan('dev'));
// Parse request body
app.use(express.json());
// Add date-time to request
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTE HANDLERS
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: toursData.length,
    data: { toursData },
  });
};

const getTour = (req, res) => {
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

const createTour = async (req, res) => {
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

const updateTour = async (req, res) => {
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

const deleteTour = async (req, res) => {
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

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

// ROUTES
const tourRouter = express.Router();
app.use('/api/v1/tours', tourRouter);
tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

const userRouter = express.Router();
app.use('/api/v1/users', userRouter);
userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/id:').get(getUser).patch(updateUser).delete(deleteUser);

// START SERVER
port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
