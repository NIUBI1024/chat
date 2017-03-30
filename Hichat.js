window.onload = function() {
	var hichat = new HiChat();
	hichat.init();  //初始化
};

var HiChat = function() {
	this.socket = null;
};

	HiChat.prototype = {
		init:function() {
			var that = this;

			this.socket = io.connect();

				this.socket.on('connect',function(){
				document.getElementById('info').textContent = 'get yourself nickname:)';
				document.getElementById('nickWrapper').style.display = 'block';

				document.getElementById('nicknameInput').focus();
				});
				//昵称设置的确定按钮
				document.getElementById('loginBtn').addEventListener('click', function(){
					var nickname = document.getElementById('nicknameInput').value;
					if(nickname.trim().length!=0) {
						that.socket.emit('login',nickname);
					} else{
						 document.getElementById('nicknameInput').focus();
					}
				},false);

				this.socket.on('nickExisted',function(){
					document.getElementById('info').textContent='nickname is taken,please choose another nickname';
				});
				this.socket.on('loginSuccess',function(){
					document.title = 'hichat |'+document.getElementById('nicknameInput').value;
					document.getElementById("loginWrapper").style.display = 'none';
					document.getElementById('messageInput').focus();
				});
				this.socket.on('system',function(nickname,userCount,type) {
					var msg = nickname + (type == 'login'?'joined':'left');
				that._displayNewMsg('system',msg,'red');
					document.getElementById('status').textContent = userCount+(userCount > 1 ? 'users':'user')+'online';
				});
				document.getElementById('sendBtn').addEventListener('click',function() {
					var messageInput = document.getElementById('messageInput'),
					msg = messageInput.value,
					//获取颜色值
					color = document.getElementById('colorStyle').value;

					messageInput.value = '';
					messageInput.focus();
					if(msg.trim().length!=0) {

						that.socket.emit('posMsg',msg,color);
						that._displayNewMsg('me',msg,color);
					}
				},false);
				this.socket.on('newMsg',function(user,msg) {
					that._displayNewMsg(user,msg,color);
				});
				document.getElementById('sendImage').addEventListener('change',function() {
					if(this.files.length!= 0) {
						var file = this.files[0],
							reader = new FileReader();
						if(!reader) {
							that._displayNewMsg('system','!your browser dosen\'t support fileReader','red');
							this.value = '';
							return ;
						}
						reader.onload = function(e) {

							this.value = '';
							that.socket.emit('img',e.target.result);
							that.__displayImage('me',e.target.result);
						};
						reader.readAsDataURL(file);
					}
				},false);
				//接收发来的图片
				this.socket.on('newImg',function(user,img){
						that.__displayImage(user,img);
				});
				//按键处理
				document.getElementById('nicknameInput').addEventListener('keyup',function(e){
					if(e.keyCode == 13) {
						var nickname = document.getElementById('nickname').value;
						if(nickname.trim().length!=0) {
							that.socket.emit('login',nickname);
						}
					}	
				},false);
				//按键处理2
				document.getElementById('messageInput').addEventListener('keyup',function(e) {
					var messageInput = document.getElementById('messageInput'),
					msg = messageInput.value,
					color = document.getElementById('colorStyle').value;
					if(e.keyCode == 13 && msg.trim().length!=0) {
						messageInput.value = '';
						that.socket.emit('posMsg',msg,color);
						that._displayNewMsg('me',msg,color);
					}
				});
			
		},
		_displayNewMsg:function(user,msg,color) {
			var container = document.getElementById('historyMsg'),
			msgToDisplay = document.createElement('p'),
			date = new Date().toString().substr(0,8);
			msgToDisplay.style.color = color|| '#000';
			msgToDisplay.innerHTML = user + '<span class ="timespan">('+date+'):</span>'+msg;
			container.appendChild(msgToDisplay);
			container.scrollTop = container.scrollHeight;
		},
		//图片可查看原始大小
		__displayImage:function(user,imgData,color){
			var container = document.getElementById('historyMsg'),
			msgToDisplay = document.createElement('p'),
			date = new Date().toTimeString().substr(0,8);
			msgToDisplay.style.color = color || '#000';
			msgToDisplay.innerHTML = user +'<span class = "timespan">('+date+'):</span></br>'+'<a href ="' +imgData+'"target="_blank"><img src ="'+imgData+'"/></a>';
			container.appendChild(msgToDisplay);
			container.scrollTop = container.scrollHeight;
		}
	};
	