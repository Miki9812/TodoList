;(function() {
	Vue.directive('focus',{
		inserted:function(el){
			el.focus()
		}
	})
	Vue.directive('todo-focus',{
		update(el,binding){
			if (binding.value) {
				el.focus()
			}
		}
	})

	window.app = new Vue({
	  data:{
	  	todos:JSON.parse(window.localStorage.getItem('todos')||'[]'),
	  	currentEditing:null,
	  	filterText: 'all'
	  },
	  computed:{
	  	remainCount:{
	  		get() {
	  			return this.todos.filter(t => !t.completed).length
	  		}
	  	},
	  	toggleAllStat:{
	  		get(){
	  			return this.todos.every(t => t.completed)
	  		},
	  		set(){
	  			const checked = !this.toggleAllStat
	  			// console.log(checked)
	  			this.todos.forEach(item => {
	  			item.completed = checked
	  			})
	  		}
	  	},
	  	filterTodos () {
	  		switch(this.filterText) {
          	  case 'active':
              return this.todos.filter(t => !t.completed)
              break
              case 'completed':
              return this.todos.filter(t => t.completed)
              break
              default:
              return this.todos
              break
	  		}
	  	}
	  },
	  watch:{
	  	todos:{
	  		handler(val,oldVal){
	  			window.localStorage.setItem('todos',JSON.stringify(val))
	  		},
	  		deep:true
	  	}
	  },
	  methods:{
	  	handleNewTodoKeyDown(e){
	  		const target = e.target
	  		const value = target.value.trim()
	  		if (!value.length) {
	  			return
	  		}
	  		const todos = this.todos
	  		todos.push({
	  			id:todos.length?todos[todos.length-1].id+1:1,
	  			title:value,
	  			completed:false
	  		})
	  		target.value = ''
	  	},

	  	handleToggleAllChange(e){
	  		const checked = e.target.checked
	  		this.todos.forEach(item => {
	  			item.completed = checked
	  		})
	  	},
	  	handleRemoveTodoClick(index,$event){
	  		this.todos.splice(index,1)
	  	},
	  	handleGetEditingDblclick(todo){
	  		this.currentEditing = todo
	  	},
	  	handleSaveEditKeydown(todo,index,e){
	  		const target = e.target
	  		const value = target.value.trim()
	  		if (!value.length) {
	  			this.todos.splice(index,1)
	  		}else{
	  			todo.title = value
	  			this.currentEditing = null
	  		}
	  	},
	  	handleCancelEditEsc(){
	  		this.currentEditing = null
	  	},
	  	handleClearAllDoneClick(){
	  		for (let i = 0; i < this.todos.length; i++) {
	  			if (this.todos[i].completed) {
	  				this.todos.splice(i,1)
	  				i--
	  			}
	  		}
	  	}
	  }
	}).$mount('#app')
	
  	window.onhashchange = function() {
    app.filterText = window.location.hash.substr(2)
   }
   window.onhashchange()
})()