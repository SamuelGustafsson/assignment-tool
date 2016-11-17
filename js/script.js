$(document).ready(function () {

      // Load current user from localStorage (if logged in)
      var activeUser = JSON.parse(localStorage.getItem("currentUser"));

      // Create user submit
      $("#create-user-form").submit(function () {
            createUser();
            return false;
      });

      // Login form submit
      $("#form-login").submit(function () {
            user = userLogin($("#login-email").val(), $("#login-password").val());
            if (user) {
                  if (user.UserType == 'admin') {
                        document.location = './pages/admin-overview.html';
                  } else {
                        document.location = './pages/student-overview.html';
                  }
            }
            return false;
      });

      // Create test submit

      $("#create-test-form").submit(function () {

            $.confirm({
                  title: 'Create new test',
                  content: 'Are you sure the test is finished?',
                  confirmButton: 'Yes',
                  cancelButton: 'No',
                  confirmButtonClass: 'btn-info',
                  cancelButtonClass: 'btn-danger',
                  confirm: function () {
                        createTest();
                        document.location = 'admin-overview.html';

                  },
                  cancel: function () {
                        $.alert('You are free to continue with the test!');
                  }
            });
            return false;
      });

      // Logout btn
      $(".logout-btn").click(function () {

            $.confirm({
                  title: 'Logout',
                  content: 'Are you sure?',
                  confirmButton: 'Yes',
                  cancelButton: 'No',
                  confirmButtonClass: 'btn-info',
                  cancelButtonClass: 'btn-danger',
                  confirm: function () {

                        localStorage.removeItem("currentUser");
                        document.location = '../index.html';
                  },
                  cancel: function () {
                        $.alert('You are free to Continue!')
                  }
            });
      });

      // Add question btn
      $(".btn-add-question").click(function () {
            createQuestion();
      });

      // Add question alternative btn
      $(".btn-add-alternative").click(function () {
            createQuestionAlternative($(this));
      });

      // Next question btn
      $(".modal-next-question-btn").click(function () {
            if (!$(this).hasClass("disabled")) {
                  testID = $(this).data("testid");
                  nextQuestion = $(this).data("nextquestion");
                  currentQuestion = $(this).data("currentquestion");
                  test = loadTestByID(testID);
                  if (test) {
                        // Save chosen alternatives for current question
                        saveQuestionResult(test, currentQuestion);
                        // Render next question
                        renderModalQuestion(test, nextQuestion);
                  }
            }
      });
})
