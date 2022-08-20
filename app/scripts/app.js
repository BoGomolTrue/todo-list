(function($) {
    let debug = true
    let settings = []
    let tasks = []
    let userHash = ''
    if(sessionStorage.pEmail) {
        loadData()
    }
    if(sessionStorage.pUserName == 'admin') {
        $('.add-todo-wrapper').append('<button type="checked" class="btn btn-danger reset-task">Reset ALL tasks</button>')
    }
    
    /* CLICKS */
    $('body').on('click', '.btn__auth', function() {
        event.preventDefault()
        let userEmail = $('input[name="email"]').val()
        let userPassword = $('input[name="password"]').val()
        if(userEmail.length == 0 || userPassword.length == 0){
            $('.error').html('Поле Email Address или Password не может быть пустым')
            $('.error').fadeIn(100)
            setTimeout(() => {
                $('.error').fadeOut(0)
            }, 5000)
            return
        }
        $.ajax({
            url: 'http://localhost:5000/api/auth',
            method: "POST",
            data: {
                _EMail: userEmail,
                _Password: userPassword,
            },
        }).done(function (response) {
            if(!response.errorMessage) {
                sessionStorage.pAuth = true
                sessionStorage.pEmail = response._EMail
                sessionStorage.pUserName = response._Name
                sessionStorage.pHash = response._Token
                sessionStorage.pPosition = response._Position
                userHash = sessionStorage.pHash
                sessionStorage.removeItem('pLoginPage')
                sessionStorage.pActive = 2
                sessionStorage.pTodoPage = true
                location.reload()
                loadData()
            }else {
                if(response.errorMessage == 'Invalid password or login') {
                    $('.error').html('Логин или пароль не найдены в системе')
                    $('.error').fadeIn(100)
                    setTimeout(() => {
                        $('.error').fadeOut(0)
                    }, 5000)
                }
            }
        })

    })
    $('body').on('click', '.menu__button__logout', function() {
        Object.entries(sessionStorage).forEach(([key]) => {
            sessionStorage.removeItem(key)
        })
        sessionStorage.pStartPage = true
        sessionStorage.pActive = 0
        location.reload()

    })
    $('body').on('click', '.add-new-task', function() {
        if($('.add-todo-input').val() == '') return
        if(userHash != sessionStorage.pHash) {
            alert("Попытка взлома системы!");
            clearStorage()
            return
        }
       if(verifyDescription($('.add-todo-input').val())) {
            $('.error').html('Данная задача уже есть в списке.')
            $('.error').fadeIn(100)
            setTimeout(() => {
                $('.error').fadeOut(0)
            }, 800);
            return
        }
        $.ajax({
            url: 'http://localhost:5000/api/addiction',
            method: "POST",
            data: {
                _Token: userHash, 
                _Task: $('.add-todo-input').val()
            },
        }).done(function (response) {
            if(response.trim() != 'Err') {
                if($('.task-list').is(':hidden')) {
                    $('.task-list').fadeIn(100)
                }
                if(!$('.message-todo').is(':hidden')) {
                    $('.message-todo').fadeOut(0)
                }
                tasks.push(new Task ($('.add-todo-input').val()))
        
        
                $('.add-todo-input').val('')
                getTaskList()
            }
        })
    })
    $('body').on('click', '.complete-task', function() {
        if(userHash != sessionStorage.pHash) {
            alert("Попытка взлома системы!");
            clearStorage()
            return
        }
        $('.todo-wrapper[data-id = "'+$(this).attr('data-id')+'"]').css('text-decoration', 'line-through')
        tasks.splice($(this).attr('data-id'), 1)
        $.ajax({
            url: 'http://localhost:5000/api/complete',
            method: "POST",
            data: {
                _Token: userHash,
                _Task: $('.todo-wrapper[data-id = "'+$(this).attr('data-id')+'"] input').val()
            },
        }).done(function (response) {
        })
        setTimeout(() => {
            getTaskList()
            if(!tasks.length) {
                $('.task-list').fadeOut(0)
                $('.message-todo').html('Ура! Все сделано!')
                $('.message-todo').css('font-size', '24px')
                $('.message-todo').fadeIn(100)
            }
        }, 100);

        
    })
    $('body').on('click', '.reset-task', function() {
        if(userHash != sessionStorage.pHash) {
            alert("Попытка взлома системы!");
            clearStorage()
            return
        }
        $.get(
            `http://localhost:5000/api/reset`, {_Token: sessionStorage.pHash},
            function onAjaxSuccess(data) {
                if(debug == true) console.log('[RESET-TASK]: Список задач был полностью очищен')
                $('.error').html('Список задач был полностью очищен')
                $('.error').fadeIn(100)
                setTimeout(() => {
                    location.reload()
                }, 100);
            }
        );
    })
    /* FUNCTIONS */
     function loadData() {
        $.get(
            `http://localhost:5000/api/gettoken`, {_EMail: sessionStorage.pEmail},
            function onAjaxSuccess(data) {
                if(debug == true) console.log('[LOAD-DATA: gettoken]', data)
                if(sessionStorage.pHash != data._Token) {
                    sessionStorage.pHash = data._Token
                }
                userHash = sessionStorage.pHash
                $.get(
                    `http://localhost:5000/api/gettasks`, {_Token: userHash},
                    function onAjaxSuccess(data) {
                        if(debug == true) console.log('[LOAD-DATA]: gettasks', data)
                        data.forEach(element => {
                            tasks.push(new Task (element._Task))
                        });
                        getTaskList()
                    }
                );
            }
        );
    }
    function Task(description) {
        this.description = description
    }
    function newTask(task, index) {
        return `
            <div data-id="`+index+`" class="row rounded shadow-sm p-2 todo-wrapper align-items-center justify-content-center">
                <div class="col">
                    <input class="form-control form-control-lg border-0 rounded" disabled value="`+task.description+`" type="text">
                </div>
                <div class="col-auto px-0 mx-0 mr-2">
                    <button data-id="`+index+`"  type="button" class="btn btn-success complete-task">✓</button>
                </div>
            </div> 
        `
    }
    function getTaskList() {
        if($('.task-list').children().length) {
            $('.task-list').children().remove()
        }
        if(tasks) {
            tasks.forEach((item, index) => {
                $('.task-list').prepend(newTask(item, index))
            })
            if(!$('.task-list').children().length) {
                $('.task-list').fadeOut(0)
                $('.message-todo').html('Список пуст')
                $('.message-todo').fadeIn(0)
            }
        }
    }
    function verifyDescription(description) {
        const found = tasks.some(item => item.description == description);
        if(found) return true
    }
    function clearStorage() {
        Object.entries(sessionStorage).forEach(([key]) => {
            sessionStorage.removeItem(key)
        })
        sessionStorage.pStartPage = true
        sessionStorage.pActive = 0
        location.reload()
    }

    /*OTHER SETTINGS*/
    if(sessionStorage.pAuth) {
        $('.menu__button__login').css('display', 'none')
        $('.menu__button__logout').css('display', 'inline')
        $('.menu__button__main').css('display', 'inline')
    }else {
        $('.menu__button__login').css('display', 'block')
        $('.menu__button__logout').css('display', 'none')
        $('.menu__button__main').css('display', 'none')
    }
    if (debug === true) {
        console.log('[SESSION-STORAGE]: ', sessionStorage)
        console.log('[TASKS]: ', JSON.stringify(tasks))
    } 
})(jQuery);