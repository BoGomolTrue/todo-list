(function($) {
    loadPage()
    $('body').on('click', '.navbar-brand', function() {
        route(this, 0)
    })
    $('body').on('click', '.menu__button__login', function() {
        route(this, 1)
    })
    $('body').on('click', '.menu__button__main', function() {
        route(this, 2)
    })

    function route(this_page, result_page) {
        let p = result_page
        Object.entries(sessionStorage).forEach(([key]) => {
            console.log(key)
            if(key !== 'pAuth' && key !== 'pUserName') {
                sessionStorage.removeItem(key)
            }
        })
        for (let index = 0; index < $('.wrapper').children().length; index++) {
            let pNumber = "#page" + index
            if(index !== p) {
                $(pNumber).fadeOut(0)
                $(pNumber).removeClass('active')
            }else {
                sessionStorage.pActive = index
                switch (index) {
                    case 0:
                        sessionStorage.pStartPage = true
                        break
                    case 1:
                        sessionStorage.pLoginPage = true
                        break
                    case 2:
                        sessionStorage.pTodoPage = true
                        break
                }
                $(pNumber).fadeIn(100)
                $(pNumber).addClass('active')
            }
        }
    }
    function loadPage() {
        if(sessionStorage.length == 0) {
            sessionStorage.pActive = 0
            sessionStorage.pStartPage = true
        }
        for (let index = 0; index < $('.wrapper').children().length; index++) {
            let pNumber = "#page" + index
            if (index !== sessionStorage.pActive) {
                $(pNumber).fadeOut()
            }
            $("#page" + sessionStorage.pActive).fadeIn(10)
        }
    }
})(jQuery);