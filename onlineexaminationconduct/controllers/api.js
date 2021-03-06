const mongoose = require('mongoose');
const express = require('express');
const testRouter = express.Router();
var ObjectId = mongoose.Types.ObjectId;
const User = require('../models/User');
const Test = require('../models/test');
const Question = require('../models/question');
const Answer = require('../models/answer');
const totalPerformance = require('../models/performance');


//response generating utility
var resGenerator = require('../utils/resGenerator');

/**
 *All Apis
 */
 testRouter.get('/users',(req, res) => {
   User.find(function(err, users) {
     //console.log(tests);
     if (err) {
       var error = resGenerator.generate(true, "Something is not working, error : " + err, 500, null);
       res.send(error);
     } else if (users === [] || users === undefined || users === null) {
       var error = resGenerator.generate(true, "No result found , empty array", 204, null);
       res.send(error);
     } else {
       var response = resGenerator.generate(false, "All tests fetched successfully", 200, users);
       res.send(response);
     }
   });
 });
 
 // all users get api end

 testRouter.post('/tests/createTest',(req, res) => {
  var test = new Test(req.body);
  test.save((err, test) => {
    if (err) {
      var error = resGenerator.generate(true, "Some Error Ocurred, error : " + err, 500, null);
      res.send(error);
    } else {
      var response = resGenerator.generate(false, "Successfully Created A Test", 200, test);
      res.send(response);
    }
  });
});
  //api to create a new test
  

  //api to get all tests
  testRouter.get('/tests',(req, res) => {
    Test.find(function(err, tests) {
      //console.log(tests);
      if (err) {
        var error = resGenerator.generate(true, "Something is not working, error : " + err, 500, null);
        res.send(error);
      } else if (tests === [] || tests === undefined || tests === null) {
        var error = resGenerator.generate(true, "No result found , empty array", 204, null);
        res.send(error);
      } else {
        var response = resGenerator.generate(false, "All tests fetched successfully", 200, tests);
        res.send(response);
      }
    });
  });
//get all test api end



//apis for to get single test
testRouter.get('/tests/:test_id',(req, res) => {
  console.log("req ",req);
  Test.findById(mongoose.Types.ObjectId( req.params.test_id ), (err, test) => {
    console.log(req.params.test_id);
    console.log(req.user._id);
    if (err) {
      var error = resGenerator.generate(true, "Something is not working, error : " + err, 500, null);
      res.send(error);
    } else if (test === null || test === undefined || test === []) {
      var error = resGenerator.generate(true, "No result found , empty array", 204, null);
      res.send(error);
    } else {
      var response = resGenerator.generate(false, "Test fetched successfully", 200, test);
      res.send(response);
    }
  });
});


  //api to update a test
  testRouter.put('/tests/update/:test_id',(req, res) => {
    Test.findByIdAndUpdate(
      mongoose.Types.ObjectId( req.params.test_id )
      , req.body, {
        new: true
      }, function(err, test) {
        if (err) {
          var error = resGenerator.generate(true, "Some Error Ocurred, error : " + err, 500, null);
          res.send(error);
        } else {
          var response = resGenerator.generate(false, "Successfully Updated The Test", 200, test);
          res.send(response);
        }
      });

  });

  //api to update a test
  testRouter.delete('/tests/delete/:test_id',(req, res) => {
    Test.findByIdAndRemove(req.params.test_id, (err, test) => {
      if (err) {
        var error = resGenerator.generate(true, "Something is not working, error : " + err, 500, null);
        res.send(error);
      } else if (test === null || test === undefined || test === []) {
        var error = resGenerator.generate(true, "No result found , empty array", 204, null);
        res.send(error);
      } else {
        var response = resGenerator.generate(false, "Test deleted successfully", 200, test);
        res.send(response);
      }
    });
  });
//api to get single test end

//apis for questions
testRouter.post('/tests/create/:test_id/questions',(req, res) => {
 var question = new Question(req.body);
 question.save((err, test) => {
  if (err) {
    var error = resGenerator.generate(true, "Something is not working, error : " + err, 500, null);
    res.send(error);
  }
})
 .then((question, err) => {
  Test.findById({_id: req.params.test_id}, (err, test) => {
    test.questions.push(question);
    test.save((err, test) => {
      if (err) {
        var error = resGenerator.generate(true, "Something is not working, error : " + err, 500, null);
        res.send(error);
      } else if (question === null || question === undefined || question === []) {
        var error = resGenerator.generate(true, "No result found , empty array", 204, null);
        res.send(error);
      } else {
        var response = resGenerator.generate(false, "Question Created successfully", 200, question);
        res.send(response);
      }
    })
  })
})
});
  //to create a new questions
  

  //to get all questions
  testRouter.get('/tests/:test_id/questions',(req, res) => {
    //console.log("populate question");
    Test.findById(req.params.test_id)
    .populate('questions')
    .then((test, err) =>{
      if (err) {
        var error = resGenerator.generate(true, "Something is not working, error : " + err, 500, null);
        res.send(error);
        return next(err)
      } else if (test === null || test === undefined || test === []) {
        var error = resGenerator.generate(true, "No Questions found , empty array", 204, null);
        res.send(error);
      } else {
        var response = resGenerator.generate(false, "All Questions fetched successfully", 200, test.questions);
        res.send(response);
      }
    })
  });

  testRouter.get('/questions/:question_id',(req, res) => {
    Question.findById(req.params.question_id, (err, question) => {
      if (err) {
        var error = resGenerator.generate(true, "Something is not working, error : " + err, 500, null);
        res.send(error);
      } else if (question === null || question === undefined || question === []) {
        var error = resGenerator.generate(true, "No result found , empty array", 204, null);
        res.send(error);
      } else {
        var response = resGenerator.generate(false, "Question fetched successfully", 200, question);
        res.send(response);
      }
    });
  });
//api to get single questions

  //api to update a questions
  testRouter.put('/questions/update:question_id',(req, res) => {
    Question.findOneAndUpdate({
      _id: req.params.question_id
    }, req.body, {
      new: true
    }, function(err, question) {
      if (err) {
        var error = resGenerator.generate(true, "Some Error Ocurred, error : " + err, 500, null);
        res.send(error);
      } else {
        var response = resGenerator.generate(false, "Successfully Updated The Test", 200, question);
        res.send(response);
      }
    });
  });

//api to delete a question
testRouter.delete('/questions/delete:question_id',(req, res) => {
  Question.findByIdAndRemove(req.params.question_id, (err, question) => {
    if (err) {
      var error = resGenerator.generate(true, "Something is not working, error : " + err, 500, null);
      res.send(error);
    } else if (question === null || question === undefined || question === []) {
      var error = resGenerator.generate(true, "Question Doesn't Exist or Deleted", 204, null);
      res.send(error);
    } else {
      var response = resGenerator.generate(false, "Question deleted successfully", 200, question);
      res.send(response);
    }
  });
});
//question api end

//api to add scores to mongodb
testRouter.post('/tests/:test_id/questions/:question_id/answer',(req, res) => {
  var answerResult;
  var timeTakenEach;
  Question.findById(req.params.question_id,function(err, question) {
    if (err) {
      var error = resGenerator.generate(true, "Something is not working, error : " + err, 500, null);
      res.send(error);
    }  else {
      //console.log(question);
      console.log(req.body);
      var answer = new Answer(req.body);
      answer.user = req.user._id;
      answer.question =  req.params.question_id;
      answer.test = req.params.test_id;
      console.log("user--"+answer.userAnswer);
      console.log("admin--"+answer.correctAnswer);
    }
    answer.save((err, answer) => {
      if (err) {
        var error = resGenerator.generate(true, "Some Error Ocurred, error : " + err, 500, null);
        res.send(error);
      } else {
        var response = resGenerator.generate(false, "Successfully Created A Test", 200, answer);
        res.send(response);
      }
    });
  });
});
//api to add test result in db with all details

//api to post answers end

testRouter.get('/tests/:test_id/answers',(req, res) => {
  Answer.find(
    { "$and" : [ { "user" : req.user._id }, { "test" : req.params.test_id } ] })
  .populate('question')
  .then((answers, err) => {
    if (err) {
      var error = resGenerator.generate(true, "Something is not working, error : " + err, 500, null);
      res.send(error);
    }  else {
      var response = resGenerator.generate(false, "All Answers fetched successfully", 200, answers);
      res.send(answers);
    }
  });
});
//api to get  answers test specific


testRouter.get('/tests/:user_id/answers',(req, res) => {
  Answer.find(req.params.user_id,function(err, answers) {
    //console.log(tests);
    if (err) {
      var error = resGenerator.generate(true, "Something is not working, error : " + err, 500, null);
      res.send(error);
    } else if (answers === [] || answers === undefined || answers === null) {
      var error = resGenerator.generate(true, "No result found , empty array", 204, null);
      res.send(error);
    } else {
      var response = resGenerator.generate(false, "All Answers fetched successfully", 200, answers);
      res.send(response);
    }
  });
})
//api to get  answers user specific

//api of  answers end

//api for performance
testRouter.post('/performance',(req, res) => {
  var scorePerformance = new totalPerformance(req.body);
  scorePerformance.user = req.user_id;
  scorePerformance.test = req.test_id;
  scorePerformance.save((err, scorePerformance) => {
    if (err) {
      var error = resGenerator.generate(true, "Some Error Ocurred, error : " + err, 500, null);
      res.send(error);
    } else {
      var response = resGenerator.generate(false, "Successfully Stored totalPerformance", 200, scorePerformance);
      res.send(response);
    }
  });
})
//api to add test result in db with all details


testRouter.get('/performance/:test_id',(req, res) => {
  totalPerformance.find(req.params.test_id, function(err, totalPerformance) {
    if (err) {
      var error = resGenerator.generate(true, "Something is not working, error : " + err, 500, null);
      res.send(error);
    } else if (totalPerformance === [] || totalPerformance === undefined || totalPerformance === null) {
      var error = resGenerator.generate(true, "No result found , empty array", 204, null);
      res.send(error);
    } else {
      var response = resGenerator.generate(false, "All totalPerformance fetched successfully per test", 200, totalPerformance);
      res.send(response);
    }
  });
});
//api to get  performance test specific

testRouter.get('/performance/:user_id/',(req, res) => {
  totalPerformance.find(req.params.user_id,function(err, totalPerformance) {
    //console.log(tests);
    if (err) {
      var error = resGenerator.generate(true, "Something is not working, error : " + err, 500, null);
      res.send(error);
    } else if (totalPerformance === [] || totalPerformance === undefined || totalPerformance === null) {
      var error = resGenerator.generate(true, "No result found , empty array", 204, null);
      res.send(error);
    } else {
      var response = resGenerator.generate(false, "All totalPerformance fetched successfully per user", 200, totalPerformance);
      res.send(response);
    }

  });
});
//api to get  performance user specific

// api to store test attemptedby users start
testRouter.put('/tests/:testid/attemptedby',(req, res) => {
  console.log(req.body.testAttemptedBy);
  Test.findByIdAndUpdate(
    mongoose.Types.ObjectId( req.params.testid )
    , { $push: { testAttemptedBy : ObjectId(req.body.testAttemptedBy) } }
    , function(err, test) {
      if (err) {
        var error = resGenerator.generate(true, "Some Error Ocurred, error : " + err, 500, null);
        res.send(error);
      } else {
        var response = resGenerator.generate(false, "Successfully Updated The Test", 200, test);
        res.send(response);
      }
    });
  // api to store test attemptedby users end
});

//export testRouter
module.exports = testRouter;
