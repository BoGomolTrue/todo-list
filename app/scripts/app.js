(function($) {
    const debug = true
    let tasks = []

    if(localStorage.tasks) {
        tasks = JSON.parse(localStorage.getItem('tasks'))
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

        if(userEmail == 'admin@mail.ru' && userPassword == '123123') {
            sessionStorage.pAuth = true
            sessionStorage.removeItem('pLoginPage')
            sessionStorage.pActive = 2
            sessionStorage.pTodoPage = true
            location.reload()
        }else {
            $('.error').html('Логин или пароль не найдены в системе')
            $('.error').fadeIn(100)
            setTimeout(() => {
                $('.error').fadeOut(0)
            }, 5000)
        }

    })
    $('body').on('click', '.menu__button__logout', function() {
        Object.entries(sessionStorage).forEach(([key]) => {
            if(key !== 'pAuth') {
                sessionStorage.removeItem(key)
            }
        })
        sessionStorage.removeItem('pAuth')
        sessionStorage.pStartPage = true
        sessionStorage.pActive = 0
        location.reload()

    })
    $('body').on('click', '.add-new-task', function() {
        if($('.add-todo-input').val() == '') return
        if(verifyDescription($('.add-todo-input').val())) {
            $('.error').fadeIn(100)
            setTimeout(() => {
                $('.error').fadeOut(0)
            }, 800);
            return
        }
        if(!$('.message-todo').is(':hidden')) {
            $('.message-todo').fadeOut(0)
        }
        tasks.push(new Task ($('.add-todo-input').val()))
        localStorage.setItem('tasks', JSON.stringify(tasks))
        $('.add-todo-input').val('')
        getTaskList()
    })
    $('body').on('click', '.complete-task', function() {
        $('.todo-wrapper[data-id = "'+$(this).attr('data-id')+'"]').css('text-decoration', 'line-through')
        tasks.splice($(this).attr('data-id'), 1)
        localStorage.removeItem('tasks')
        localStorage.setItem('tasks', JSON.stringify(tasks))
        setTimeout(() => {
            getTaskList()
            if(!tasks.length) {
                $('.message-todo').html('Ура! Все сделано!')
                $('.message-todo').css('font-size', '24px')
                $('.message-todo').fadeIn(100)
            }
        }, 100);

        
    })
    /* FUNCTIONS */
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
        }
    }
    function verifyDescription(description) {
        const found = tasks.some(item => item.description == description);
        if(found) return true
    }
    getTaskList()

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

    if(!$('.task-list').children().length) {
        $('.message-todo').html('Список пуст')
        $('.message-todo').fadeIn(0)
    }

    if (debug === true) {
        console.log(sessionStorage)
        console.log(JSON.stringify(tasks))
    }   
})(jQuery);