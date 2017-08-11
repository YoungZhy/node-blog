$(function () {
	var $login = $(".login")
	var $register = $(".register")
	var $userInfo = $('.user-info')

	$login.find("a").on("click", function () {
		$login.hide()
		$register.show()
	});
	$register.find("a").on("click", function () {
		$register.hide()
		$login.show()
	});

	$register.find("button").on("click", function () {
		//通过ajax请求，把form改为div
		$.ajax({
			type: 'post',
			url: '/api/user/register',
			data: {
				username: $register.find('[name="username"]').val(),
				password: $register.find('[name="password"]').val(),
				repassword: $register.find('[name="repassword"]').val()
			},
			dataType: 'json',
			success: function (result) {
				$register.find(".register-tip").html(result.message).css({'color': 'red'})
				if (!result.code) {
          console.log('register')
					setTimeout(function () {
						$register.hide()
						$login.show()
					}, 1000)
				}
			}
		})
  })
  
  $login.find("button").on("click", function () {
		//通过ajax请求，把form改为div
		$.ajax({
			type: 'post',
			url: '/api/user/login',
			data: {
				username: $login.find('[name="username"]').val(),
				password: $login.find('[name="password"]').val()
			},
			dataType: 'json',
			success: function (result) {
				$login.find(".register-tip").html(result.message).css({'color': 'red'})
				if (!result.code) {
					window.location.reload()
          console.log('login')
					// setTimeout(function () {
					// 	$userInfo.show()
					// 	$userInfo.find('.name').html(result.userInfo.username)
					// }, 1000)
				}
			}
		})
	})
	$('.logout').on('click', function(){
		$.ajax({
			url: '/api/user/logout',
			success: function(result){
				if(!result.code){
					window.location.reload()
				}
			}
		})
	})

})