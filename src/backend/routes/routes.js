const express = require('express');
const router = express.Router();
const action = require('../controllers/Action');
const tests = require('../controllers/Tests');
const loc = require('../controllers/LoC');
const utils = require('../helpers/utils');

/**
 * GET request with response
 */
router.get('/', function (req, res) {
  res.json({
    status: 'OK!'
  });
});

/**
 * POST request to gather the information about all actions as stated in the CSV trace file
 */
router.post('/getTestsData', async (req, res) => {
  const path = req.body.path;
  await tests.getAllTestsData(path)
    .then(data => {
      res.json(data)
    })
    .catch(err => {
      if (err.status) {
        res.status(err.status).json({message: err.message})
      } else {
        res.status(500).json({message: err.message})
      }
    });
});

/**
 * POST request to gather the images (source and resulting state), the widgets
 * and the interacted widget of one specific action
 */
router.post('/getActionDataForId/:id', async (req, res) => {
  const id = req.params.id;
  const path = req.body.path;
  await action.getSelectedActionIdData(id, path)
    .then(data => res.json(data))
    .catch(err => {
      if (err.status) {
        res.status(err.status).json({message: err.message})
      } else {
        res.status(500).json({message: err.message})
      }
    })
});

/**
 * POST request to gather the LoC for all actions
 */
router.post('/getLoCDataForIds', async (req, res) => {
  const path = req.body.path;
  const ids = req.body.ids;
  await loc.getActionIdsLoC(ids, path)
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      if (err.status) {
        res.status(err.status).json({message: err.message})
      } else {
        res.status(500).json({message: err.message})
      }
    })
});

module.exports = router;
