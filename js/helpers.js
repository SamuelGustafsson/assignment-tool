$(document).ready(function () {


    // $("#test-result-section").remove();
    //Fetching the Admin usersers from admins.json and loads them to local storage as users.
    loadAdmins = function () {
        $.ajax({
            url: "./data/admins.json",
        }).done(function (response) {
            var users = JSON.parse(response);
            if (users.Admins) {
                $(users.Admins).each(function () {
                    Admin = this;
                    User = {
                        FirstName: Admin.FirstName,
                        LastName: Admin.LastName,
                        Email: Admin.Email,
                        Password: Admin.Password,
                        UserType: Admin.UserType
                    };

                    if (userExist(User.Email) == false) {

                        var allUsersTemp = new Array();
                        var allUsers = JSON.parse(localStorage.getItem("users"));

                        // Add all saved users to temp array
                        $(allUsers).each(function () {
                            allUsersTemp.push(this);
                        });

                        // Add new user to temp array
                        allUsersTemp.push(User);

                        // Save users
                        localStorage.setItem("users", JSON.stringify(allUsersTemp)); // Resave tests
                    }
                });
            }
        });
    }

    userExist = function (email) {
        var userExist = false;
        var allUsers = JSON.parse(localStorage.getItem("users"));
        $(allUsers).each(function () {
            if (this.Email.toLowerCase() == email.toLowerCase()) {
                userExist = true; // Found user with this email
                return false; // Break each loop
            }
        });
        return userExist;
    }

    getUser = function (email) {
        var user = false;
        var allUsers = JSON.parse(localStorage.getItem("users"));
        $(allUsers).each(function () {
            if (this.Email.toLowerCase() == email.toLowerCase()) {
                user = this; // Found user with this email
                return false; // Break each loop
            }
        });
        return user;
    }

    createUser = function () {
        loadAdmins(); // Stores admins from json to localStorage
        User = {
            FirstName: $("#form-firstname").val(),
            LastName: $("#form-lastname").val(),
            Email: $("#form-email").val(),
            Password: $("#form-password").val(),
            UserType: 'student'
        };

        if (userExist(User.Email) == false) {

            var allUsersTemp = new Array();
            var allUsers = JSON.parse(localStorage.getItem("users"));

            // Add all saved users to temp array
            $(allUsers).each(function () {
                allUsersTemp.push(this);
            });

            // Add new user to temp array
            allUsersTemp.push(User);

            // Save users
            localStorage.setItem("users", JSON.stringify(allUsersTemp)); // Resave tests

            $.alert({
                title: 'Welcome',
                content: 'Your account is created, login at the upper right corner!',
                confirmButtonClass: 'btn-success',
                animation: 'top',
                animationBounce: 2
            });

        } else {
            $.alert({
                title: 'Error',
                content: 'The email are already registered to another account!',
                confirmButtonClass: 'btn-danger',
                animation: 'top',
                animationBounce: 2
            });
        }
        $("#form-firstname").val('');
        $("#form-lastname").val('');
        $("#form-email").val('');
        $("#form-password").val('');

    }

    updateUser = function (student) {
        loadAdmins(); // Stores admins from json to localStorage
        User = {
            FirstName: $("#form-firstname").val(),
            LastName: $("#form-lastname").val(),
            Email: $("#form-email").val(),
            Password: $("#form-password").val(),
            UserType: 'student'
        };

        if (userExist(User.Email) == false || student.Email == User.Email) {

            var allUsersTemp = new Array();
            var allUsers = JSON.parse(localStorage.getItem("users"));
            var newUser;

            // Add all saved users to temp array
            $(allUsers).each(function () {
                newUser = this;
                if (this.Email == student.Email) {
                    newUser = User; // Found the student ... lets replace it
                }
                allUsersTemp.push(newUser);
            });

            // Save users
            localStorage.setItem("users", JSON.stringify(allUsersTemp)); // Resave user

            $.alert({
                title: 'User update',
                content: 'User is now updated!',
                confirmButtonClass: 'btn-success',
                animation: 'top',
                animationBounce: 2
            });
        } else {
            $.alert({
                title: 'Error',
                content: 'User already exist!',
                confirmButtonClass: 'btn-danger',
                animation: 'top',
                animationBounce: 2
            });
        }

    }

    userLogin = function (email, password) {
        loadAdmins(); // Stores admins from json to localStorage
        if (User = getUser(email)) {
            if (User.Password == password) {
                localStorage.setItem("currentUser", JSON.stringify(User));
                return User;
            } else {
                $.alert({
                    title: 'Error',
                    content: 'Login failed - Wrong password',
                    confirmButtonClass: 'btn-success',
                    animation: 'top',
                    animationBounce: 2
                });
            }
        } else {
            $.alert({
                title: 'Error',
                content: 'Login failed - Email not found',
                confirmButtonClass: 'btn-success',
                animation: 'top',
                animationBounce: 2
            });
        }
    }

    // Load default question html state
    defaultQuestionHTML = $("#questions").find('.question').clone();
    defaultAlternativeHTML = $("#questions").find('.question-alternative').clone();

    createQuestion = function () {

        // Remove click events
        $(".btn-add-question").unbind("click");
        $(".btn-add-alternative").unbind("click");

        // Append new question using default html state
        $(defaultQuestionHTML.clone()).appendTo("#questions");

        // Toggle classes to show minus / plus icon
        $(".btn-add-question").addClass("btn-danger");
        $(".btn-add-question").find('.glyphicon').removeClass("glyphicon-plus").addClass("glyphicon-minus").attr({ "title": "Delete this question from test" });
        $(".btn-add-question:last").removeClass("btn-danger")
            .find('.glyphicon').removeClass("glyphicon-minus").addClass("glyphicon-plus");

        // Set new click event handlers

        // Remove question
        $(".btn-add-question .glyphicon-minus").parents("button").click(function () {
            $(this).parents('.question').remove();
        });
        // Add question
        $(".btn-add-question:last").click(function () {
            createQuestion(); // Make last add button create new question
        });
        // Add alternative
        $(".question").each(function () {
            $(this).find(".btn-add-alternative:last").click(function () {
                createQuestionAlternative($(this)); // Make last add button create new question
            });
        });
    }

    createQuestionAlternative = function (clickedAltButton) {

        var parentQuestion = clickedAltButton.parents('.question');

        // Remove click events
        $(".btn-add-alternative").unbind("click");

        // Append new question alternative using default html state
        $(defaultAlternativeHTML.clone()).insertAfter($(parentQuestion).find('.question-alternative:last'));

        // Toggle classes to show minus / plus icon
        $(".btn-add-alternative").addClass("btn-danger").attr({ "title": "Delete this alternative from test" });
        $(".btn-add-alternative").find('.glyphicon').removeClass("glyphicon-plus").addClass("glyphicon-minus").attr({ "title": "Delete this alternative from test" });
        $(".question").each(function () {
            $(this).find('.btn-add-alternative:last').removeClass("btn-danger").removeAttr("title")
                .find('.glyphicon').removeClass("glyphicon-minus").addClass("glyphicon-plus").attr({ "title": "Add new alternative to test" });
        });

        // Set new click event handlers

        // Remove alternative
        $(".btn-add-alternative .glyphicon-minus").parents("button").click(function () {
            $(this).parents('.question-alternative').remove();
        });
        // Add alternative
        $(".question").each(function () {
            $(this).find(".btn-add-alternative:last").click(function () {
                createQuestionAlternative($(this)); // Make last add button create new question
            }).attr({ "title": "Add new alternative to test" });
        });

    }

    generateUniqueID = function () {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    UpdateTestsEmail = function (newEmail, previousEmail) {

        var allTests = JSON.parse(localStorage.getItem("allSavedTests"));
        for (var i = 0; i < allTests.length; i++) {
            if (allTests[i].re) {

            }
        }

        console.log(allTests);

    }

    createTest = function () {

        var newTest = {};
        var questionsArray = new Array();
        var alternativesArray = new Array();
        var savedTestsArray = new Array();

        newTest.TestName = $("#form-test-name").val();
        newTest.SelfCorrecting = $("input[name=form-self-correcting]:checked").val();
        newTest.TimeLimit = $("#form-timer").val();
        newTest.ID = generateUniqueID();

        // Loop through all questions
        $(".question").each(function () {
            alternativesArray = new Array();
            // Loop through all question alternatives
            $(this).find('.question-alternative').each(function () {
                alternativeID = generateUniqueID();
                alternativesArray.push({
                    'alternative': $(this).find('.form-question-alternative').val(),
                    'state': $(this).find('.form-question-alternative-state').val(),
                    'ID': alternativeID
                })
            });
            // Push question to questions array
            questionsArray.push({
                'Question': $(this).find('.form-question').val(),
                'Alternatives': alternativesArray,
            });
        });

        newTest.Questions = questionsArray;

        // Load current tests
        if (savedTests = JSON.parse(localStorage.getItem("allSavedTests"))) {
            // Add already saved tests into temporary array
            $(savedTests).each(function () {
                savedTestsArray.push(this);
            });
            // Add the new test into tests array
            savedTestsArray.push(newTest);
            localStorage.setItem("allSavedTests", JSON.stringify(savedTestsArray)); // Resave tests
        } else {
            savedTestsArray.push(newTest);
            // Save first test into tests array
            localStorage.setItem("allSavedTests", JSON.stringify(savedTestsArray));
        }

    }

    updateTest = function (test) {
        if (savedTests = JSON.parse(localStorage.getItem("allSavedTests"))) {
            // Loop through all saved tests and look for matching to update
            $(savedTests).each(function (index) {
                if (test.ID == this.ID) {
                    savedTests[index] = test; // Replace saved test with updated.
                    return false; // break each loop
                }
            });
            // Update saved tests in localStorage.
            localStorage.setItem("allSavedTests", JSON.stringify(savedTests));
        }
    }

    deleteTest = function (testID) {
        var savedTestsArray = new Array();
        if (savedTests = JSON.parse(localStorage.getItem("allSavedTests"))) {
            // Add already saved tests into temporary array
            $(savedTests).each(function () {
                if (testID != this.ID) {
                    savedTestsArray.push(this);
                }
            });
            // Resave tests without the removed test.
            if (savedTestsArray.length > 0) {
                // Save only remaining tests
                localStorage.setItem("allSavedTests", JSON.stringify(savedTestsArray));
            } else {
                // No tests left .. lets remove everything from localStorage.
                localStorage.removeItem("allSavedTests");
            }
        }
    }

    timeLimitReached = function () {
        $(".modal-next-question-btn").addClass("hidden");
        $(".modal-close-test-btn").removeClass("hidden");
        $(".modal-body").text("Test timelimit reached. Please try again.");
    }

    loadTestByID = function (testID) {
        if (savedTests = JSON.parse(localStorage.getItem("allSavedTests"))) {
            var foundTest = false;
            $(savedTests).each(function () {
                if (testID == this.ID) {
                    foundTest = this;
                }
            });
            if (foundTest) {
                return foundTest;
            } else {
                alert('Test not found.');
                return false;
            }
        }
    }

    renderModalQuestion = function (test, questionNumber) {

        var chosenAnswer = 0;
        var body = "";
        var numberOfQuestions = test.Questions.length;
        var testResultTable;
        var testResultTableRow;

        $(".modal-close-test-btn").addClass("hidden");
        $(".modal-next-question-btn").removeClass("hidden");
        $(".modal-next-question-btn").data("testid", test.ID);
        $(".modal-next-question-btn").data("nextquestion", questionNumber + 1);
        $(".modal-next-question-btn").data("currentquestion", questionNumber);

        if (questionNumber + 1 <= numberOfQuestions) {
            // Render question and alternatives
            body += '<div class="pull-right"><strong>Question ' + (questionNumber + 1) + '/' + numberOfQuestions + '</strong></div>';
            body += '<div><b>' + test.Questions[questionNumber].Question + '</b></div>';
            body += renderAlternatives(test.Questions[questionNumber].Alternatives);
            body += '</div>';
            $("#test-question-modal .modal-body").html(body);
        } else {
            // Remove timer
            $('#timer').countdown('destroy');
            $("#timer-wrapper").remove();
            // Render finished test text
            $(".modal-close-test-btn").removeClass("hidden");
            $(".modal-next-question-btn").addClass("hidden");
            $("#test-question-modal .modal-body").html("Test finished.");

            // Displays test results for student
            if (test.SelfCorrecting == 'true') {

                numberOfCorrectAnswers = correctAnswers();
                $("#test-question-modal .modal-body").html("");
                // $("#test-question-modal .modal-body").append(" Test result:" + numberOfCorrectAnswers + '/' + test.Questions.length);

                $("#modal-test-result-table-row-emty").remove();
                $("#test-question-modal .modal-body").append($("#test-result-table"));
                testResultTableRow = '<tr><td>' + currentTest.TestName + '</td ><td>' + numberOfCorrectAnswers + '/' + test.Questions.length + '</td><td>' + getTestGrade(numberOfCorrectAnswers, test.Questions.length) + '</td></tr>';
                $("#test-question-modal .modal-body #test-result-table").append(testResultTableRow);
            }
            // Save users test result
            saveTestResults(test);
        }

        $("#test-question-modal .modal-title").text(test.TestName);
        $("#test-question-modal").modal();

        // Toggle next question button enabled or disabled if user choses an answer.
        $(".question-alternatives").change(function () {
            chosenAnswers = 0;
            // Check all alternatives if user has selected an answer.
            $(".question-alternatives").each(function () {
                if ($(this).is(':checked') == true) {
                    chosenAnswers++; // Chosen answer counter
                }
            });
            if (chosenAnswers > 0) {
                $(".modal-next-question-btn").removeClass("disabled");
            } else {
                $(".modal-next-question-btn").addClass("disabled");
            }
        });
        $(".modal-close-test-btn").click(function(){
            location.reload();
        });

    }

    correctAnswers = function () {
        var correctAnswers = 0;
        currentTestResults = JSON.parse(localStorage.getItem("currentTestResult"));
        $(currentTestResults).each(function () {
            if (this.correctAnswer == true) {
                correctAnswers++;
            }
        });
        return correctAnswers;
    }

    renderAlternatives = function (alternatives) {
        var output = "";
        var correctAnswers = 0;
        var inputType = "radio";
        // Loop through all alternatives for this questions and count how many corrects answers.
        $(alternatives).each(function () {
            if (this.state == 'true') {
                correctAnswers++; // Correct answer counter
            }
        });
        // If there is more than 1 correct answer lets make checkboxes
        if (correctAnswers > 1) inputType = "checkbox";
        // Loop through all alternatives and render input & alternative
        $(alternatives).each(function () {
            output += "<div>";
            output += "<input value='" + this.ID + "' class='question-alternatives' name='alternative' type='" + inputType + "' required> ";
            output += this.alternative;
            output += "</div>";
        });

        return '<div class="question-alternatives-container">' + output + '</div>';
    }

    getAlterantiveByID = function (alternatives, alternativeID) {
        var matchingAlternative = false;
        $(alternatives).each(function () {
            if (this.ID == alternativeID) {
                matchingAlternative = this;
                return false; // break each
            }
        });
        return matchingAlternative;
    }

    saveQuestionResult = function (test, questionNumber) {

        var userAnswers = new Array();
        var savedResultsArray = new Array();
        var correctAnswer = true;

        // Loop through and look for user selected question alternatives
        $(".question-alternatives").each(function () {
            // Load this alternatives json object
            alternativeJSON = getAlterantiveByID(test.Questions[questionNumber].Alternatives, $(this).val());
            // Check if this alternative is correct but not chosen by user
            if (alternativeJSON.state == 'true' && !$(this).is(':checked')) {
                correctAnswer = false;
            }
            // Check if this alternative is false but chosen by user
            if (alternativeJSON.state == 'false' && $(this).is(':checked')) {
                correctAnswer = false;
            }
            if ($(this).is(':checked') == true) {
                userAnswers.push($(this).val()); // Found user answer, push to temporary array.
            }
        });

        // Create object with questionNumber and the users given answers.
        currentResult = {
            questionNumber: questionNumber,
            userAnswers: userAnswers,
            correctAnswer: correctAnswer
        };

        // Get all current test results from user
        currentTestResults = JSON.parse(localStorage.getItem("currentTestResult"));

        // Loop through previous question answers
        $(currentTestResults).each(function () {
            // Add previous question answers to temporary array
            savedResultsArray.push(this);
        });

        // Push current question answer to temporary array
        savedResultsArray.push(currentResult);

        // Save current test results
        localStorage.setItem("currentTestResult", JSON.stringify(savedResultsArray));

    }

    saveTestResults = function (test) {
        currentUser = JSON.parse(localStorage.getItem("currentUser"));
        // If results exist for this test 
        if (test.Results) {
            // Add this users results
            test.Results[currentUser.Email] = JSON.parse(localStorage.getItem("currentTestResult"));
        } else {
            // Add first results to this test
            test.Results = {
                [currentUser.Email]: JSON.parse(localStorage.getItem("currentTestResult")),
            }
        }
        updateTest(test);
    }

    renderAllTestsAdmin = function () {

        // Empty table from existing tests (used for re-render)
        $("#admin-overview-table tr.test").remove();

        // Print all available tests
        if (allTests = JSON.parse(localStorage.getItem("allSavedTests"))) {
            $("#admin-overview-table-empty").remove(); // Remove table default row
            var newTableRow;
            var index = 0;
            $(allTests).each(function () {
                currentTest = this;
                newTableRow = "";
                newTableRow += '<tr class="test">';
                newTableRow += '<td>' + currentTest.TestName + '</td>';
                newTableRow += '<td><a data-testid="' + currentTest.ID + '" class="modal-results-btn btn btn-success" href="#" title="Show all students test results for: ' + currentTest.TestName + '"><i class="icon-margin-right fa fa-pencil-square-o fa-lg" aria-hidden="true"></i>Show results </a></td>';
                newTableRow += '<td><a href="#" data-testid="' + currentTest.ID + '" class="btn btn-danger delete-test-btn" title="Delete test: ' + currentTest.TestName + '"><i class="icon-margin-right fa fa-trash-o fa-lg"></i> Delete</a></td>';
                newTableRow += '</tr>';
                $("#admin-overview-table").append(newTableRow);
                index++;
            });

            // Set delete test buttons
            $(".delete-test-btn").click(function () {

                deleteTest($(this).data("testid")); // Delete test with index
                renderAllTestsAdmin(); // Rerender all tests
            });

            // Set show results btn
            $(".modal-results-btn").click(function () {
                var test = loadTestByID($(this).data("testid"));
                var body = false;
                $("#test-results-modal tr.result").remove();
                $("#test-results-modal .modal-title").text(test.TestName + " results");
                if (test.Results) {
                    for (Email in test.Results) {
                        user = getUser(Email);
                        userResult = getUserResultsFromTest(test, Email);
                        body += '<tr class="result"><td>' + user.FirstName + ' ' + user.LastName + "</td><td>" + userResult + '/' + test.Questions.length + '</td><td>' + getTestGrade(userResult, test.Questions.length) + '</td></tr>';
                    }
                }
                if (body) {
                    $("#modal-results-table-empty").remove();
                    $("#modal-results-table").append(body);
                }
                $("#test-results-modal").modal();
            });
        }
    }

    getTestGrade = function (userResult, numerOfQuestions) {
        var testResult = userResult;
        var textMaxPoint = numerOfQuestions;

        if (testResult >= (textMaxPoint * 0.8)) {
            return "VG"
        }
        else if (testResult >= (textMaxPoint * 0.6)) {
            return "G"
        }
        else {
            return "IG"
        }
    }

    getAllUsersByUserType = function (userType) {
        allUsers = JSON.parse(localStorage.getItem("users"));
    };

    //  show all students in modal btn
    $(".modal-show-all-students-btn").click(function () {
        var allStudents = new Array();
        var allUsers = "";
        var newTableRow;
        allUsers = JSON.parse(localStorage.getItem("users"));

        $("#modal-all-students-table-emty").remove(); // Remove emty table default row
        $("#modal-all-students-table tr.student").remove(); // Remove students from table
        $(allUsers).each(function (index, value) {
            if (value.UserType == "student") {
                var currentStudent = this;
                newTableRow = "";
                newTableRow += '<tr class="student">';
                newTableRow += '<td>' + currentStudent.FirstName + ' ' + currentStudent.LastName + '</td>';
                newTableRow += '<td>' + currentStudent.Email + '</td>';
                newTableRow += '<td><a data-studentId="' + currentStudent.Email + '" class="btn btn-success delete-test-btn btn-sm edit-student-btn" href="#"><i class="fa fa-pencil-square-o fa-lg"></i></a></td>';
                newTableRow += '</tr>';
                $("#modal-all-students-table").append(newTableRow);
                allStudents.push(this);
            };
            $(".all-students-modal").modal();
        });
        //Edit student
        $(".edit-student-btn").click(function () {
            $("#all-students-modal").modal('hide');
            var studentEmail = $(this).attr("data-studentId"); // Get email from clicked student we want to edit.

            var student = getUser(studentEmail);
            $("#edit-user-form #form-firstname").val(student.FirstName);
            $("#edit-user-form #form-lastname").val(student.LastName);
            $("#edit-user-form #form-email").val(student.Email);
            $("#edit-user-form #form-password").val(student.Password);
            $("#edit-user-btn").attr('data-studentId', $(this).attr("data-studentId"));

            $("#edit-student-modal").modal();
        });
        $("#edit-user-btn").click(function () {
            var studentEmail = $(this).attr("data-studentId"); // Get email from clicked student we want to edit.
            var student = getUser(studentEmail);
            updateUser(student);
        });
    });

    //Edit student

    renderAllTests = function () {

        // Empty table from existing tests (used for re-render)
        $("#admin-overview-table tr.test").remove();

        // Print all available tests
        if (allTests = JSON.parse(localStorage.getItem("allSavedTests"))) {
            $("#admin-overview-table-empty").remove(); // Remove table default row
            var newTableRow;
            var index = 0;
            var currentUser = JSON.parse(localStorage.getItem("currentUser"));

            $(allTests).each(function () {
                currentTest = this;
                newTableRow = "";
                newTableRow += '<tr class="test">';
                newTableRow += '<td>' + currentTest.TestName + '</td>';

                userResults = getUserResultsFromTest(currentTest, currentUser.Email);
                if (userResults > 0 && currentTest.SelfCorrecting == 'true') {
                    newTableRow += '<td>' + userResults + '/' + currentTest.Questions.length + '</td>';
                    newTableRow += '<td>' + getTestGrade(userResults, currentTest.Questions.length) + '</td>';
                } else {
                    newTableRow += '<td>-</td>';
                    newTableRow += '<td>-</td>';
                }

                newTableRow += '<td><a data-testid="' + currentTest.ID + '" class="btn start-test-btn btn-success run-test-btn" href="#"> Start test</a></td>';
                newTableRow += '</tr>';
                $("#admin-overview-table").append(newTableRow);
                index++;
            });

            // Set start test buttons
            $(".start-test-btn").click(function () {
                runTest($(this).data("testid"));
            });
        }
    }

    getUserResultsFromTest = function (test, userEmail) {
        var correctAnswers = 0;
        if (test.Results && test.Results[userEmail]) {
            $(test.Results[userEmail]).each(function () {
                if (this.correctAnswer == true) {
                    correctAnswers++;
                }
            });
        }
        return correctAnswers;
    }

    runTest = function (testID) {
        // Reset timer
        $('#timer').countdown('destroy');
        // Reset any temporary test results
        localStorage.removeItem("currentTestResult");
        var test = loadTestByID(testID);
        var questionNumber = 0;
        if (test) {
            // Render first question from test
            renderModalQuestion(test, questionNumber);
            // Set test timer
            if (test.TimeLimit) {
                // Get current date & time
                now = new Date();
                // Add test timelimit to date & time
                finish = new Date(now.getTime() + test.TimeLimit * 60000);
                // finish = new Date(now.getTime() + 6000);
                // Create countown
                $("#timer").countdown({
                    until: finish,
                    format: 'MS',
                    onExpiry: timeLimitReached
                });
            }
        }
    }

    // console.log(JSON.parse(localStorage.getItem("allSavedTests")));
    // console.log(JSON.parse(localStorage.getItem("users")));
});