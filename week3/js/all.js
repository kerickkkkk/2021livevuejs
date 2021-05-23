console.clear();

const app = {
  data(){
    return {
      apiUrl: "https://vue3-course-api.hexschool.io",
      apiPath: "pet",
      user :{
        username: '',
        password: ''
      },
      products:[],
      tempProduct:{},
      newTempImageUrl:'',
      modalType:'',
    }
  },
  methods:{
    checkLogin(){
      if(document.cookie !== ''){
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)shop\s*=\s*([^;]*).*$)|^.*$/, '$1');
        axios.defaults.headers.common['Authorization'] = token;
        axios.post(`${this.apiUrl}/api/user/check`)
        .then((res)=>{
          if(!res.data.success){
            alert('沒有登入狀態 將導回登入頁面')
            location.replace('./index.html')
          }
          this.getProducts()
        }).catch((error)=>{
          console.log(error);
        })
      }else{
        return false;
      }
    },
    //　取得產品
    getProducts(){
      // const token = document.cookie.replace(/(?:(?:^|.*;\s*)shop\s*=\s*([^;]*).*$)|^.*$/, '$1');
      // axios.defaults.headers.common['Authorization'] = token;
      axios.get(`${this.apiUrl}/api/${this.apiPath}/admin/products`)
        .then((res)=>{
          if(res.data.success){
            this.products = res.data.products;
            // this.tempProduct = this.products[0];
          }else{
            alert(res.data.message)
          }
        }).catch((error)=>{
          console.log(error);
        })
    },
    deleteProduct(){
      // 因為改用 modal 傳入 id 改從 tempProduct 取得
      const selectId = this.tempProduct.id
      axios.delete(`${this.apiUrl}/api/${this.apiPath}/admin/product/${selectId}`)
      .then((res)=>{
        if(res.data.success){
          alert(res.data.message)
          this.getProducts()
          this.cancelModal()
        }else{
          alert(res.data.message)
        }
      }).catch((error)=>{
        console.log(error);
      })
    },
    enableProduct(selectId){
      const index = this.products.findIndex((product) => product.id === selectId);
      this.products[index].is_enabled = !this.products[index].is_enabled;
      axios.put(`${this.apiUrl}/api/${this.apiPath}/admin/product/${selectId}`,{data:this.products[index]})
      .then((res)=>{
        if(res.data.success){
          alert(res.data.message)
          this.getProducts()
        }else{
          alert(res.data.message)
        }
      }).catch((error)=>{
        console.log(error);
      })
    },
    resetTempProduct(){
      // 控制新增編輯狀態用
      this.modalType = ''
      // 新增編輯暫存
      this.tempProduct={};
      this.newTempImageUrl = '';
    },
    cancelModal(){
      const currentModal = (this.modalType === 'add' || this.modalType === 'edit') 
        ? 'addEdit' : 'delete';
      $(`#${currentModal}Modal`).modal('hide')
      this.resetTempProduct()
    },
    sendProduct(){
      //檢查必填欄位
      // if(!this.checkMustFill()) return false
      const inputMap = [
        {name:'title',columnName:'標題'},
        {name:'category',columnName:'分類'},
        {name:'unit',columnName:'單位'},
        {name:'origin_price',columnName:'原價'},
        {name:'price',columnName:'售價'}
      ];
      
      // 未輸入數值都是空字串
      // 空值返回
      // 因為可能 tempProduct 內為空直接改成濾 falsy 的值
      const checkEmptyArr =  inputMap.filter(el =>  !this.tempProduct[el.name] )
      if(checkEmptyArr.length > 0){
        const emptyMsg = checkEmptyArr.reduce((p,n)=>{
          p += `${n.columnName} `
          return p 
        },'以下欄位必填: ')
        alert(emptyMsg)
        return false;
      }
      const url = {
        add : `${this.apiUrl}/api/${this.apiPath}/admin/product/` ,
        edit : `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}` 
      }
      const appMethod={
        add: 'post',
        edit: 'put'
      }
      // pass
      axios[appMethod[this.modalType]]( url[this.modalType] ,{data: this.tempProduct})
      .then((res)=>{
        if(res.data.success){
          alert(res.data.message)
          this.cancelModal()
          this.getProducts()
        }else{
          alert(res.data.message)
        }
      }).catch((error)=>{
        console.log(error);
      })
    },
    // 新增 編輯調控
    modalHandler(type , product ){
      if(type === 'add' || type === 'edit'){
        $('#addEditModal').modal('show')
        this.modalType = type
        
        if(type === 'edit') {
          this.tempProduct = {...product}
        }
      }else if(type === 'delete'){
        $('#deleteModal').modal('show')
        this.tempProduct = {...product}
        this.modalType = type
      }else{
        console.log('沒有這個type');
      }
    },
    addTempImage(){
      if(this.newTempImageUrl !== '') {
        // 為空要先初始化
        if(!this.tempProduct.imagesUrl){
          this.tempProduct.imagesUrl = []
        }
        this.tempProduct.imagesUrl.push(this.newTempImageUrl)
        this.newTempImageUrl = ''
      }else{
        alert('請輸入新增圖片網址')
      }
      
    },
  },
  created(){
    this.checkLogin()
    // this.getProducts();
  }

}
Vue.createApp(app).mount('#app');