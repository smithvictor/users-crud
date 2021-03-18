var express = require('express');
var router = express.Router();
const { param, body, validationResult } = require('express-validator');
var jsend = require('jsend');
var crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
var User = require('../modules/Schemas/User');

router.get('/',
  body('uuid').isUUID().optional(),
  body('name').isString().optional(),
  body('user_name').isString().optional(),
  function (req, res, next) {
    const errors = validationResult(req);
    var payload = req.body;
    if (!errors.isEmpty()) {
      res.status(500).send(jsend.error({
        code: 1,
        message: 'Invalid Payload',
        data: errors
      }));
      return;
    }
    User.find(payload, function (err, docs) {
      if (err) {
        res.status(500).send(jsend.error({
          code: 2,
          message: 'Could not perform the operation',
          data: err
        }));
        return;
      }
      res.send(jsend.success(docs));
    });
  });

router.post('/',
  body('name').isString().exists(),
  body('user_name').isString().exists(),
  body('password').isString().exists(),
  function (req, res, next) {
    const errors = validationResult(req);
    var payload = req.body;
    if (!errors.isEmpty()) {
      res.status(500).send(jsend.error({
        code: 1,
        message: 'Invalid Payload',
        data: errors
      }));
      return;
    }
    var shasum = crypto.createHash('sha1');
    shasum.update(payload.password);
    var p = shasum.digest('hex');
    var u = new User({
      uuid: uuidv4(),
      name: payload.name,
      user_name: payload.user_name,
      password: p
    });
    u.save(function (err, data) {
      if (err) {
        res.status(500).send(jsend.error({
          code: 2,
          message: 'Could not perform the operation',
          data: err
        }));
        return;
      }
      res.send(jsend.success(data));
    });
  });

router.delete('/',
  body('uuid').isUUID().exists(),
  function (req, res, next) {
    const errors = validationResult(req);
    var payload = req.body;
    if (!errors.isEmpty()) {
      res.status(500).send(jsend.error({
        code: 1,
        message: 'Invalid Payload',
        data: errors
      }));
      return;
    }
    User.findOneAndDelete({ uuid: payload.uuid }, function (err) {
      if (err) {
        res.status(500).send(jsend.error({
          code: 2,
          message: 'Could not perform the operation',
          data: err
        }));
        return;
      }
      res.send(jsend.success("DELETED"));
    });
  });

router.put('/',
  body('uuid').isString().exists(),
  body('name').isString().optional(),
  body('user_name').isString().optional(),
  body('password').isString().optional(),
  function (req, res, next) {
    const errors = validationResult(req);
    var payload = req.body;
    if (!errors.isEmpty()) {
      res.status(500).send(jsend.error({
        code: 1,
        message: 'Invalid Payload',
        data: errors
      }));
      return;
    }
    var uuid = payload.uuid;
    if (payload.password != null) {
      var shasum = crypto.createHash('sha1');
      shasum.update(payload.password);
      payload.password = shasum.digest('hex');
    }
    delete payload.uuid;
    User.findOneAndUpdate({ uuid: uuid }, payload, function (err, doc) {
      if (err) {
        res.status(500).send(jsend.error({
          code: 2,
          message: 'Could not perform the operation',
          data: err
        }));
        return;
      }
      res.send(jsend.success("OK"));
    });
  });

module.exports = router;
