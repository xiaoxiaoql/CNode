var $=require('jquery');
// import "weui";
import Vue from 'vue';
require('./css/base.css');
require('./css/style.css');
//vue-router
import VueRouter from "vue-router";
Vue.use(VueRouter);
//vuex
import Vuex from "vuex";
Vue.use(Vuex);
//头部
Vue.component('xhead',{
	template:`
	<div>
		<div class='header clear'>
			<span class='aside' @click="showSidebar()">
				<svg version="1.1" role="presentation" width="13.714285714285714" height="16" viewBox="0 0 1536 1792" class="fa-icon">
					<path d="M1536 1344v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zM1536 832v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zM1536 320v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45z"></path>
				</svg>
			</span>
			<h2><a href='#/index/home/all'>N社区</a></h2>
			<div class='search' @click=';logstatus()'><span>...</span></div>
			
		</div>
		<div class='after'></div>
		
		<div class='curent_login' v-show='logobool'><a href='#' @click='outLogin()'>{{statusLog}}</a></div>

	</div>
	`,
	data:function(){
		return{
			logobool:false,
			statusLog:'登录'
		}
	},
	methods:{
		showSidebar:function(){
			$('.track').animate({left:0},500);
			$('.mask').show();
		},
		logstatus:function(){
			this.logobool?this.logobool=false:this.logobool=true;
		},
		outLogin:function(){
			this.logobool=false;
			//判断是否处于登录状态，
			if(window.localStorage.userInfo){//是登录状态，清除localStorage里的数据退出登录
				
				localStorage.removeItem('userInfo');
				location.reload();
				// this.statusLog='登录';
			}else{//不处于登录状态，弹出登录窗口
				$('.login_win').show();
			}
		}

	},
	mounted:function(){
		if(window.localStorage.userInfo){
			this.statusLog='退出登录'
		}
	}
})
//导航
Vue.component('xheader',{
	template:`<div>
	<div class='heades'>
		<ul class="public_nav">
			<li :class="{'current':iscurrent==0}" @click='nav(0,"")'><a href="#/index/home/all">全部</a></li>
			<li :class="{'current':iscurrent==3}" @click='nav(3,"ask")'><a href="#/index/home/ask">问答</a></li>
			<li :class="{'current':iscurrent==2}" @click='nav(2,"share")'><a href="#/index/home/share">共享</a></li>
			<li :class="{'current':iscurrent==1}" @click='nav(1,"good")'><a href="#/index/home/good">精选</a></li>
			<li :class="{'current':iscurrent==4}" @click='nav(4,"job")'><a href="#/index/home/job">工作</a></li>
		</ul>
	</div>
	<div class='before'></div>
	</div>
	`,
	data:function(){
		return {
			iscurrent:0
		}
	},
	methods:{
		nav:function(n,sort){
			// console.log(sort);
			this.iscurrent=n;
			this.$store.commit('sortschange',sort);
		}
		
	},
	mounted:function(){
		$.ajax({
			url:'https://cnodejs.org/api/v1/user/xiaoxiaoql',
			data:{

			},
			success:function(data){
				console.log(data)

			}
		});
		console.log(this.$route.fullPath.split('/'));
	}
})
//列表
Vue.component('xlist',{
	template:`
		<div class='title_list'>
			<div class="a_list clear" v-for='list in listarr' >
			<div class='name_con'><a href="#" class='name'><img :src="list.author.avatar_url" alt=""></a></div>
			<div class='contain'>
			<p class='title'><a :href="'#/index/detail/'+list.id"><span class='sort'>{{list.tab|abc}}</span>{{list.title}}</a></p>
			<span class='reply'>{{list.reply_count}}</span>/<span class='visit'>{{list.visit_count}}</span><span class='last_time'>{{list.create_at|times}}</span></p>
			</div>
			</div>
			<div class='more'><a href='javascript:void(0);' @click='more()'>查看更多</a></div>
			<div v-show='isshow' class='loadmore'><img src="http://img.zcool.cn/community/013cb15648986a32f87512f6d87dc8.gif" alt=""></div>
		</div>
	`,
	data:function(){
		return{
			page:1,
			listarr:[],
			isshow:false
		}
	},
	methods:{
		more:function(){
			var selft=this;
			this.isshow=true;

			$.ajax({
				url:'https://cnodejs.org/api/v1/topics',
				data:{
				page:this.page++,
				tab:this.sort,
				limit:10,
				mdrender:false
				},
				success:function(data){
					console.log(data.data)
					selft.listarr=selft.listarr.concat(data.data)
					selft.isshow=false;
				}
			})
		}

	},
	mounted:function(){
		this.more();
		console.log(this.$store.state.sorts);
	},
	computed:{
		sort:function(){
			console.log(this.$store.state.sorts);
			return this.$store.state.sorts;
		}
	}
})
//侧边栏
Vue.component('sidebar',{
	template:`<div>
		<div class='track'>
			<span class='head_icon_con'><img :src="msg" alt="" class="head_icon"></span>
			<p><span @click="loginShow()">{{loginStatus}}</span></p>
			<ul>
				<li><a href="#/index/home/all" @click='toall("all")'>首页</a></li>
				<li><a href="#/index/myNews">我的消息</a></li>
				<li><a href="#/index/publicTopic">发布话题</a></li>
				<li @click='joinmy()'>个人中心</li>
				<li>关于</li>
			</ul>
		</div>
		<div class='mask' @click='maskHide()'></div>
		<div class='login_win'>
			<p>Access Token</p>
			<p><input type="text" v-model='user'></p>
			<p><button @click='loginClick()'>登录</button></p>
		</div>
	</div>`,
	data:function(){
		return{
			user:''
		}
	},
	methods:{
		//隐藏侧边栏
		maskHide:function(){
			$('.track').animate({left:-50+'%'},500);
			$('.mask').hide();
		},
		//点击返回主页全部导航项
		toall:function(x){
			this.$store.commit('sortschange',x)
		},
		//弹出登录窗口
		loginShow:function(){
			$('.login_win').show();
		},
		//用户验证
		loginClick:function(){
			var selft=this;
			$.ajax({
				url:'https://cnodejs.org/api/v1/accesstoken',
				type:'POST',
				data:{
					accesstoken:this.user
				},
				success:function(data){
					if(data){
						console.log(data)
						data.accesstoken=selft.user;
						window.localStorage.userInfo=JSON.stringify(data);
						location.reload();
					}
				}
			})
			$('.login_win').hide();
		},
		//个人中心 （先判断用户是否登录）
		joinmy:function(){
			if(window.localStorage.userInfo){
				window.location.href='#/index/my';

			}else{
				this.loginShow();
			}
		}
	},
	computed:{
		msg:function(){
			return window.localStorage.userInfo?JSON.parse(window.localStorage.userInfo).avatar_url:'https://www.ldsun.com/vue-cnode/static/avatar.png';
		},
		loginStatus:function(){
			return window.localStorage.userInfo?JSON.parse(window.localStorage.userInfo).loginname:'未登录'; 
		}
	},
	mounted:function(){

	}

})
var index=Vue.extend({
	template:`<div>
		<xhead></xhead>
		<router-view></router-view>
		<sidebar></sidebar>
	</div>`
})
var home=Vue.extend({
	template:`<div>
		<xheader></xheader>
		<router-view></router-view>
	</div>`
})
//全部
var all=Vue.extend({
	template:`<div>
		<xlist></xlist>
		<router-view></router-view>
	</div>`
})
//分享
var share=Vue.extend({
	template:`<div>
		<xlist></xlist>
	</div>`
})
//精华
var good=Vue.extend({
	template:`<div>
		<xlist></xlist>
	</div>`
})
//问答
var ask=Vue.extend({
	template:`<div>
		<xlist></xlist>
	</div>`
})
//招聘
var job=Vue.extend({
	template:`<div>
		<xlist></xlist>
	</div>`
})
//详情
var detail=Vue.extend({
	template:`
	<div class='detail'>
		<div class="loading" v-show='isloading'>
			<div class='loading_con'>
				<span></span>
			</div>
		</div>
		<div>
			<h2 class='detail_title'>{{arr.title}}</h2>
			<div v-html='arr.content' class='contents'></div>
		</div>
		<div class='replies'> 
			<h4>{{num}}条回复</h4>
			<ul class='repllist'>
				<li v-for='(res,$index) in pageone' class='clear'>
					<div class='headeimg'><a href='#'><img :src='res.author.avatar_url'/></a></div>
					<div class='re_middle'>
						<p class='username'><a href='#'>{{res.author.loginname}}</a><span>{{$index+1}}楼</span></p>
						<div v-html='res.content' class='reply_middle'></div>
						<ul class='only_re'>
						 <li v-for='xone in res.arr' class='clear'><a href='#' class='a_replay'>{{res.author.loginname+':'}}</a><div v-html='xone.content' class='repl_con'></div></li>
						</ul>
					</div>
					<div class='re_time'><span>{{res.create_at|times}}</span><span class='zan' @click='clickzan()' :dataes='res.id'>
						<svg version="1.1" role="presentation" width="13.714285714285714" height="16" viewBox="0 0 1536 1792" class="fa-icon"><path d="M256 1344q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zM1408 768q0-51-39-89.5t-89-38.5h-352q0-58 48-159.5t48-160.5q0-98-32-145t-128-47q-26 26-38 85t-30.5 125.5-59.5 109.5q-22 23-77 91-4 5-23 30t-31.5 41-34.5 42.5-40 44-38.5 35.5-40 27-35.5 9h-32v640h32q13 0 31.5 3t33 6.5 38 11 35 11.5 35.5 12.5 29 10.5q211 73 342 73h121q192 0 192-167 0-26-5-56 30-16 47.5-52.5t17.5-73.5-18-69q53-50 53-119 0-25-10-55.5t-25-47.5q32-1 53.5-47t21.5-81zM1536 767q0 89-49 163 9 33 9 69 0 77-38 144 3 21 3 43 0 101-60 178 1 139-85 219.5t-227 80.5h-36-93q-96 0-189.5-22.5t-216.5-65.5q-116-40-138-40h-288q-53 0-90.5-37.5t-37.5-90.5v-640q0-53 37.5-90.5t90.5-37.5h274q36-24 137-155 58-75 107-128 24-25 35.5-85.5t30.5-126.5 62-108q39-37 90-37 84 0 151 32.5t102 101.5 35 186q0 93-48 192h176q104 0 180 76t76 179z"></path></svg>
					</span><span class='colores'>{{res.ups.length}}</span>
					<p class='reply_one'><span @click='replyfn()'>回复</span></p>
					</div>
					
					<div class='input_reply' :reid='res.id'><textarea v-model='sendrepy'></textarea><button @click='send()'>回复</button></div>
				</li>
			</ul>
			<div @click='allpage()' class='all_replies'>所有评论</div>
		</div>
		<div class='comment'>
			<p>添加评论</p>
			<textarea v-model='commentcon'></textarea>
			<div class='clear clickbtn'><button @click='commentbtn()'>评论</button></div>
		</div>
	</div>
	`,
	data:function(){
		return {
			arr:'',
			num:'',
			repliArr:[],
			commentcon:'',
			isloading:true,
			pageone:'',
			inputBool:false,
			sendrepy:'',
			replValue:[]//对回复进行评论信息，
		}
	},
	methods:{
		//进入页面请求数据
		detailAjax:function(){
			this.isloading=true;
			$.ajax({
				url:'https://cnodejs.org/api/v1/topic/'+this.$route.params.id,
				data:{
					mdrender :true
				},
				success:function(data){
					var selft=this;
					selft.repliArr=[];
					selft.replValue=[];
					console.log(data.data)
					this.arr=data.data;
					this.num=data.data.replies.length;
					data.data.replies.forEach(function(item,idx){
						if(item.reply_id!=null){
							selft.replValue.push(item)
						}else{
							selft.repliArr.push(item)
						}

					})
					selft.repliArr.forEach(function(item){
						item.arr=[];//对该条评论的回复详情
						for(var i=0;i<selft.replValue.length;i++){
							if(item.id==selft.replValue[i].reply_id){
								item.arr.push(selft.replValue[i])

							}
						}

					})
					console.log(selft.repliArr);
					this.pageone=this.repliArr.slice(0,10);//(10,20)
					console.log(this.pageone);
					this.isloading=false;
				}.bind(this)
			})

		},
		//点赞，并更新数据
		clickzan:function(){
			if(window.localStorage.userInfo){
				//从localStorage中获取accesstoken
				var accesstoken=JSON.parse(window.localStorage.userInfo).accesstoken;
				var idx=$(event.target).parent().attr('dataes');
				$.ajax({
					url:' https://cnodejs.org/api/v1/reply/'+idx+'/ups',
					type:'POST',
					dataType:'json',
					data:{
						accesstoken:accesstoken
					},
					success:function(data){
						console.log(data)
						this.detailAjax();
						$('.colores').css('color','red');
						
					}.bind(this)
				})

			}else{//不处于登录状态无法评论和点赞
				alert('登录才能点赞');

			}
			
		},
		//添加评论
		commentbtn:function(){
			if(window.localStorage.userInfo){
				$.ajax({
					url:'https://cnodejs.org/api/v1/topic/'+this.$route.params.id+'/replies',
					type:'POST',
					data:{
						accesstoken:JSON.parse(window.localStorage.userInfo).accesstoken,
						content:this.commentcon
					},
					success:function(data){
						console.log(data)
						this.commentcon=null;
						this.detailAjax();//更新数据

					}.bind(this)
				})

			}else{
				alert('登录状态才能评论');

			}
			

		},
		replyfn:function(){
			$(event.target).closest('li').children('.input_reply').show();
			
		},
		send:function(){
			$(event.target).closest('li').children('.input_reply').hide();
			console.log(this.sendrepy);
			console.log($(event.target).closest('li').children('.input_reply').attr('reid'))
			if(window.localStorage.userInfo){
				$.ajax({
					url:'https://cnodejs.org/api/v1/topic/'+this.$route.params.id+'/replies',
					type:'POST',
					dataType:'json',
					data:{
						accesstoken:JSON.parse(window.localStorage.userInfo).accesstoken,
						content:this.sendrepy,
						reply_id:$(event.target).closest('li').children('.input_reply').attr('reid')
					},
					success:function(data){
						console.log(data)
						this.detailAjax();//更新数据

					}.bind(this)
				})

			}else{
				alert('登录状态才能评论');

			}
		},
		//分页
		allpage:function(){
			this.pageone=this.repliArr;

		}
	},
	mounted:function(){
		this.isloading=true;
		this.detailAjax();
		
		
	},

})
//个人中心
var my=Vue.extend({
	template:`<div style='padding-top:1rem;height:100%;background:#f7f7f7'>
		<div class="user_info">
			<div class="sign"><img :src="information.avatar_url" alt=""></div>
			<div class='info'>
				<p class='username'>{{information.loginname}}</p>
				<p>积分{{information.score}}</p>
				<p>注册时间{{information.create_at|times}}</p>
				<p><a :href="'https://github.com/'+information.githubUsername" target="_blank">
					<svg aria-hidden="true" class="octicon octicon-mark-github" height="32" version="1.1" viewBox="0 0 16 16" width="32"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>
				</a></p>
			</div>
		</div>
		<div class="join_topic">
			<h3>最近创建的话题</h3>
			<ul>
				<li v-for='createT in information.recent_topics'><img :src="createT.author.avatar_url" alt=""><a :href='"#/index/detail/"+createT.id'>{{createT.title}}</a></li>
			</ul>
			<a class='more_reply' href='#/index/jointopic/create'>查看更多</a>
		</div>
		<div class="join_topic">
			<h3>最近参与的话题</h3>
			<ul>
				<li v-for='joinT in information.recent_replies'><img :src="joinT.author.avatar_url" alt=""><a :href='"#/index/detail/"+joinT.id'>{{joinT.title}}</a></li>
			</ul>
			<a class='more_reply' href='#/index/jointopic/join'>查看更多</a>
		</div>
	</div>
	`,
	data:function(){
		return{
			information:''
		}
	},
	methods:{


	},
	mounted:function(){
		var selft=this;
		var userInfos=JSON.parse(window.localStorage.userInfo);
		$.ajax({
			url:` https://cnodejs.org/api/v1/user/`+userInfos.loginname,
			type:'GET',
			success:function(data){
				console.log(data);
				selft.information=data.data;
			}
		})
		$('.join_topic').on('click','ul li',function(){
			console.log(666)

		})
	}
})
//最近参与的话题
var jointopic=Vue.extend({
	template:`<div>
		<ul class='join_detail'>
			<li v-for='one in arrTopic'><a href='#' class='tx'><img :src="one.author.avatar_url" alt="" /></a><p><a :href='"#/index/detail/"+one.id'>{{one.title}}</a></p></li>
		</ul>
	</div>`,
	data:function(){
		return{
			arrTopic:''
		}
	},
	mounted:function(){
		var selft=this;
		var userInfos=JSON.parse(window.localStorage.userInfo);
		$.ajax({
			url:` https://cnodejs.org/api/v1/user/`+userInfos.loginname,
			type:'GET',
			success:function(data){
				console.log(data);
				if(selft.$route.params.dif=='join'){
					selft.arrTopic=data.data.recent_replies;
				}else if(selft.$route.params.dif=='create'){
					selft.arrTopic=data.data.recent_topics;


				}
			}
		})
		

	}
})
//发布话题
var publicTopic=Vue.extend({
	template:`<div  class='topices'>
		<div>选择版块：<select v-model='selectes'>
			<option value="ask">问答</option>
			<option value="goods">精华</option>
			<option value="share">分享</option>
			<option value="job">招聘</option>
			<option value="dev">测试</option>
		</select>
		</div>
		<p><input type="text" v-model='txt'/></p>
		<div><textarea v-model='content'></textarea></div>
		<button @click='putTopic()'>提交</button>
	</div>
	`,
	data:function(){
		return{
			selectes:'ask',
			txt:'', 
			content:''
		}
	},
	methods:{
		putTopic:function(){
			if(window.localStorage.userInfo){
				$.ajax({
					url:'https://cnodejs.org/api/v1/topics',
					type:'post',
					dataType:'json',
					data:{
						accesstoken:JSON.parse(localStorage.userInfo).accesstoken,
						title:this.txt,
						tab:this.selectes,
						content:this.content
					},
					success:function(data){
						console.log(data);
						this.content='';
						this.txt=''; 

					}.bind(this)
				})

			}else{
				$('.login_win').show();
			}
			

		}
	},
	mounted:function(){

	}
})
//我的消息
var myNews=Vue.extend({
	template:`<div  class='my_news'>
		<div class='noread'>
			<h3>未读消息</h3>
			<p  @click='getnoread()'><span>{{count}}</span><span class='down_more'></span></p>
			<div class='replaydatai' v-show='bool'>
				<ul>
					<li v-for='news in notReadmsg'>
						<div><a href='#'><img :src="news.author.avatar_url" alt=""/></a></div>
						<p><a :href='"#/index/detail/"+news.topic.id'>{{news.reply.content}}</a></p>
					</li>
				</ul>
			</div>
		</div>
		<div class='read'>
			<h3>已读消息</h3>
			<p>无消息</p>
		</div>
	</div>
	`,
	data:function(){
		return{
			count:'',
			notReadmsg:'',
			bool:false
		}
	},
	mounted:function(){
		$.ajax({
			url:'https://cnodejs.org/api/v1/message/count',
			data:{
				accesstoken:JSON.parse(window.localStorage.userInfo).accesstoken
			},
			success:function(data){
				console.log(data);
				this.count=data.data+'条消息';

			}.bind(this)
		})
	},
	methods:{
		getnoread:function(){
			$.ajax({
				url:'https://cnodejs.org/api/v1/messages',
				data:{
					accesstoken:JSON.parse(window.localStorage.userInfo).accesstoken,
					mdrender:false
				},
				success:function(data){
					console.log(data.data.has_read_messages)
					if(data.data.has_read_messages.length!=0){
						this.bool?this.bool=false:this.bool=true;
						this.notReadmsg=data.data.hasnot_read_messages;
					}

				}.bind(this)
			})
		}

	}
})
//路由
var router=new VueRouter({
	routes:[{
		path:'/index',
		component:index,
		children:[{
			path:'home',
			component:home,
			children:[{
				path:'all',
				component:all
			}
			,{
			path:'share',
				component:share
			},{
				path:'job',
				component:job
			},{
				path:'good',
				component:good
			},{
				path:'ask',
				component:ask
			}
			]
		},{
			path:'detail/:id',
			component:detail
			},{
			path:'my',
			component:my
	},{
			path:'publicTopic',
			component:publicTopic
	},{
		path:'myNews',
		component:myNews
	},{
		path:'jointopic/:dif',
		component:jointopic
	}]
	},{
		path:'/',
		redirect:'/index/home/all'
	}]
})
//组件与组件之间的通信
var store=new Vuex.Store({
	state:{
		sorts:''
	},
	mutations:{
		sortschange:function(state,data){
			state.sorts=data;
		}
	}
})
//自定义过滤器
Vue.filter('abc',function(input,value){
	switch(input){
		case 'ask': return '问答';break;
		case 'share': return '共享'; break;
		case 'job': return '工作';break;
		case 'good':return '精选';break;
		default:
		return '置顶';
	}
});
//过滤计算时间差
Vue.filter('times',function(input,value){
	var now=new Date().getTime();
	var createTime=new Date(input);
	//时间差 秒
	var offset=Math.floor((now-createTime)/1000);
	//计算相差时 日数
	var minValue=parseInt(offset/60)%60;
	var hoursValue=parseInt(offset/60/60)%24;//时
	var dayValue=parseInt(offset/60/60/24);//日
	var monthValue=parseInt(offset/60/60/24/30);//月
	var yearValue=parseInt(offset/60/60/24/30/12);//年
	var timevalue='';
	if(yearValue==0){
		if(monthValue!=0){
			timevalue=monthValue+'月前';
		}else if(dayValue!=0){
			timevalue=dayValue+'天前';
		}else if(hoursValue!=0){
			timevalue=hoursValue+'小时前';
		}else{
			timevalue=minValue+'分钟前';
		}
	}else{
		timevalue=yearValue+'年前';
	}
	return timevalue;
})

new Vue({
	el:'#demo',
	data:{
	},
	router:router,
	template:
	`<div class='wrap'>
			<router-view></router-view>
	</div>
	`,
	store:store
})