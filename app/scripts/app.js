(function($) {
    const debug = true
    let tasks = []

    let users = []
    let userHash = ''

    users.push(
        {
            email: 'admin@mail.ru',
            password: '123123',
            name: 'admin'
        },
        {
            email: 'test1@mail.ru',
            password: '123123',
            name: 'test1'
        },
        {
            email: 'test2@mail.ru',
            password: '123123',
            name: 'test2'
        },
        {
            email: 'test3@mail.ru',
            password: '123123',
            name: 'test3'
        },
        {
            email: 'test4@mail.ru',
            password: '123123',
            name: 'test4'
        },
        {
            email: 'test5@mail.ru',
            password: '123123',
            name: 'test5'
        },
        {
            email: 'test6@mail.ru',
            password: '123123',
            name: 'test6'
        },
        {
            email: 'test7@mail.ru',
            password: '123123',
            name: 'test7'
        },
        {
            email: 'test8@mail.ru',
            password: '123123',
            name: 'test8'
        },
        {
            email: 'test9@mail.ru',
            password: '123123',
            name: 'test9'
        },
        {
            email: 'test10@mail.ru',
            password: '123123',
            name: 'test10'
        },
        {
            email: 'test11@mail.ru',
            password: '123123',
            name: 'test11'
        }
        ,{
            email: 'test12@mail.ru',
            password: '123123',
            name: 'test12'
        }
    )

    hash = [
       'PQmot20kBwkh5vqqKurNTc9lcicwvEGfICgjN0rHpdaIIcjC',
        'F6zfpJM5sPhmA6IDjg2dGTbV5m8G3JYG2IZ4haCp0NRNkXgt',
        'zy0zg338gp1h5u3lxG9ElXHxwDHpnWW3llSt4cGldjh1ZGwR',
       'kNjlUcN7uXabfom7gl45xLhLI9d0xwCrgzU6KkoVulIhIvad',
        'F1QpNQEaZMzGSAvJnBgrFScks14VeiHG095vvN9PfV5QC5qu',
        'mMqnSd3vMdM1K5fdmRBqQNXqkIRRUWdTgp4rxPC9Kqfc4wUf',
        'ns8SQc33myvQM1hG8RO8w01etoMzdLb6rdTgzOTPLXmCCtGA',
        '7oaoCWRFp3gYnAG99tmm4OeJVtwYBIC9cCxcniaPP5VjyRfv',
        'FxQr9qFriwGqqQoV8KoAJfsdj2ZkNwYnFBjHB6hKqj79rLEb',
        'aChpH4vLSQTXnt1oBgAYluhBSknMeDsxgxEubfc4RQugmLlu',
        'TummkZvRau3BpMMsJXLTN7ZAr2ZLDFN1N0kcgtv9YB6KbxeD',
        'qEsH9XXJVRoKVw3xRvfu8CQs1yMy4XCEnBM8g2ZEORAuwhy5',
        'oqhOvrU6tP889FJTzd7psHBCdGcicNtBBc8qAsOvAoRR2WNy',
        'eSR1PZk1KWlyqZyLeaWm3a6d8Xo9lKSEOrXH7t0KsbfksjOz',
        'YN1GVI3qG3YYuuUQcXlaFP16LN99SyGLWr1RKP8fKej634LM',
        'FecIemM1vMN1txP432MlKLk8wS9BbKLgu3MONoLd1ZZbkckK',
        'tD9T8PnRrnnuznchLtHAXHT3Gp1DerUULcZC3XlcKtaKaePQ',
        'Ke50NJdZCABduuqKXrOWFtWJHafzYQB4vcf0cilwK32dh335',
        'W2d5bsje83V6LXlxjFuNHffwMQjB1rBPR2D0ssDt2SCgNlTR',
        'dms0l4dVb4PjAsXQs3VYvHeknKz9lJIZrNandd5E46BJkZTu',
        'Ix9CpgBWLEzFXBE5uOZG6WXTSs3IpxDzJWd0Sns8weX9gxDq',
        'uDQ777yl0N0ppUeNg8VOFjQw8K4GgNggFqbvEy6WGptNYGT4',
        '3qXfqHfhuHVvOLvF5PGtSws9HKeSenKnwoC6BiMqXeLlFMBc',
        'Y1y2WZJwxQrC9v3lvrc9o8Jul9pIsBBe3iOETe0h2oqMyhIP',
        'etJuhNjpzjK4v83TEddrD0YKxrtJZ2YRqr7qO0ew6OJSBVKf',
        '6ofjxY6lScU9k78KNkgrpecQYwKGmOAZkwsQzBSubEBpqzxH',
        'PCSp4I03d1fyu1km9RclxBp1mcUl7b8ANpe1TdJmHIPrF8rO',
        'D3ocZ2Unos1dfDI9zlQLCTpV7f3RpAHt1QxFiumj8EkJKxGD',
        'DHGx3D1QMhmkoFbI6iIO86rJpkGda7TQVKQtashW9034zb4C',
        'gpJf1Gg5x0WyTChMIPG1uSPbsC5c8li9hIK5IvBoV5mV56no'
    ]

    if(sessionStorage.pHash) {
         userHash = sessionStorage.pHash
    }

    if((localStorage.getItem('tasks'+sessionStorage.pUserName))) {
        tasks = JSON.parse(localStorage.getItem('tasks'+sessionStorage.pUserName))
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
        let error = false
        users.forEach(element => {
            if(element.email == userEmail && element.password == userPassword) {
                sessionStorage.pAuth = true
                sessionStorage.pUserName = element.name
                sessionStorage.pHash = arrayRandElement(hash)
                userHash = sessionStorage.pHash
                sessionStorage.removeItem('pLoginPage')
                sessionStorage.pActive = 2
                sessionStorage.pTodoPage = true
                location.reload()
            }else {
                error = true
            }
        });
        if(error == true) {
            $('.error').html('Логин или пароль не найдены в системе')
            $('.error').fadeIn(100)
            setTimeout(() => {
                $('.error').fadeOut(0)
            }, 5000)
        }

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
        if($('.task-list').is(':hidden')) {
            $('.task-list').fadeIn(100)
        }
        if(!$('.message-todo').is(':hidden')) {
            $('.message-todo').fadeOut(0)
        }
        tasks.push(new Task ($('.add-todo-input').val()))
        localStorage.setItem('tasks'+sessionStorage.pUserName, JSON.stringify(tasks))
        $('.add-todo-input').val('')
        getTaskList()
    })
    $('body').on('click', '.complete-task', function() {
        if(userHash != sessionStorage.pHash) {
            alert("Попытка взлома системы!");
            clearStorage()
            return
        }
        $('.todo-wrapper[data-id = "'+$(this).attr('data-id')+'"]').css('text-decoration', 'line-through')
        tasks.splice($(this).attr('data-id'), 1)
        localStorage.removeItem('tasks'+sessionStorage.pUserName)
        localStorage.setItem('tasks'+sessionStorage.pUserName, JSON.stringify(tasks))
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
        $('.error').html('Список задач был полностью очищен')
        $('.error').fadeIn(100)
        setTimeout(() => {
            users.forEach(element => {
                if(JSON.parse(localStorage.getItem('tasks'+element.name))) {
                    localStorage.removeItem('tasks'+element.name)   
                }
            });
            location.reload()
        }, 50);
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
    function clearStorage() {
        Object.entries(sessionStorage).forEach(([key]) => {
            sessionStorage.removeItem(key)
        })
        sessionStorage.pStartPage = true
        sessionStorage.pActive = 0
        location.reload()
    }
    function arrayRandElement(arr) {
        var rand = Math.floor(Math.random() * arr.length);
        return arr[rand];
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
        $('.task-list').fadeOut(0)
        $('.message-todo').html('Список пуст')
        $('.message-todo').fadeIn(0)
    }

    if (debug === true) {
        console.log(sessionStorage)
        console.log(localStorage)
        console.log(JSON.stringify(tasks))
    }   
})(jQuery);