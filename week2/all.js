console.clear();
const app = {
  data:{
    apiUrl: "https://vue3-course-api.hexschool.io",
    apiPath: "pet",
    products:[],
  },
  clearAddProductForm () {
    const allInput = document.querySelectorAll("#productForm input")
    allInput.forEach((el)=> el.type !== 'checkbox' ? el.value = '' : el.checked = false)
    const allTextArea = document.querySelectorAll('#productForm textarea')
    allTextArea.forEach((el)=> el.value = '')
  },
  renderData (products) {
    const productList = document.querySelector(".productList");
    const leftProduct = document.querySelector(".leftProduct");

    const productsLen = products.length;
    let str = "";
    // 產 table
    if (productsLen > 0) {
      str = products.reduce((prev, next) => {
        prev += `
             <tr>
              <td>${next.title}</td>
              <td>${next.price}</td>
              <td>${next.salePrice ? next.salePrice : next.price}</td>
              <td>
                <div class="custom-control custom-switch">
                  <input type="checkbox" ${
                    next.is_enabled ? "checked" : ""
                  } class="custom-control-input" data-id="${
          next.id
        }" id="customSwitch-${next.id}">
                  <label class="activeProduct custom-control-label" for="customSwitch-${
                    next.id
                  }">${next.is_enabled ? "啟用" : "未啟用"}</label>
                </div>
              </td>
              <td>
                <button data-id="${
                  next.id
                }" class="deleteProduct btn btn-danger btn-sm">刪除</button>
              </td>
            </tr>
  
          `;
  
        return prev;
      }, "");
    } else {
      str = `
        <tr>
          <td class="text-center" colspan="100">目前沒有產品唷!!!</td>
        </tr>
      `;
    }
    productList.innerHTML = str;
  
    // 給目前商品有幾項
    leftProduct.innerHTML = productsLen;

  },
  getProducts(){

    const token = document.cookie.replace(/(?:(?:^|.*;\s*)shop\s*=\s*([^;]*).*$)|^.*$/, '$1');
    
    axios.defaults.headers.common['Authorization'] = token;
    axios.get(`${this.data.apiUrl}/api/${this.data.apiPath}/admin/products`)
      .then((res)=>{
        if(res.data.success){
          this.data.products = res.data.products
          this.renderData(this.data.products)
        }else{
          alert(res.data.message)
        }
      })

  },
  checkLogin (){
    // 取得寫入 cookie 
    if(document.cookie !== ''){
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)shop\s*=\s*([^;]*).*$)|^.*$/, '$1');
      axios.defaults.headers.common['Authorization'] = token;
      axios.post(`${this.data.apiUrl}/api/user/check`)
      .then((res)=>{
        if(!res.data.success){
          alert('沒有登入狀態 將導回登入頁面')
          location.replace('./login.html')
        }
        // 有權限 取得產品列表
        this.getProducts()
      })
    }else{
      alert('沒有登入狀態 將導回登入頁面')
      location.replace('./login.html')
      return false;
    }
  },
  addProduct (e) {
    e.preventDefault();
    //  title(String)、category(String)、unit(String)、origin_price(Number)、price(Number) 為必填欄位 

    const inputMap = [
      {name:'title',columnName:'標題',type:'String'},
      {name:'category',columnName:'分類',type:'String'},
      {name:'unit',columnName:'單位',type:'String'},
      {name:'origin_price',columnName:'原價',type:'Number'},
      {name:'price',columnName:'售價',type:'Number'}];
    
    // 未輸入數值都是空字串
    // 空值返回
    const checkEmptyArr =  inputMap.filter(el => "" === (e.target[el.name].value) )
    if(checkEmptyArr.length > 0){
      const emptyMsg = checkEmptyArr.reduce((p,n)=>{
        p += `${n.columnName} `
        return p 
      },'以下欄位必填: ')
      alert(emptyMsg)
      return false;
    }
    const imgUrlList = document.querySelectorAll('.imgUrl');
    // 直接寫上去綁定

    let product = {
      data:{
        "title":              e.target["title"].value, 
        "category":           e.target["category"].value,
        // input 過來都是 string
        "origin_price":       parseInt(e.target["origin_price"].value),
        "price":              parseInt(e.target["price"].value),
        "unit":               e.target["unit"].value,
        "description":        e.target["description"].value,
        "content":            e.target["content"].value,
        // 要用 checked 才可以
        "is_enabled":         e.target["is_enabled"].checked ,
        "imageUrl" :          imgUrlList[0].getAttribute('src'),
        "imagesUrl": [
          imgUrlList[1].getAttribute('src'),
          imgUrlList[2].getAttribute('src'),
          imgUrlList[3].getAttribute('src'),
          imgUrlList[4].getAttribute('src'),
          imgUrlList[5].getAttribute('src')
        ]
      }
    }
    // imgUrlList.forEach((el,i)=> {
    //   if(i>0){
    //     product.data.imagesUrl.push(el.getAttribute('src'))
    //   }else{
    //     product.data.imageUrl = el.getAttribute('src')
    //   }
    // })

    // {
    //   "data": {
    //     "title": "[賣]動物園造型衣服3", 
    //     "category": "衣服2",
    //     "origin_price": 100,
    //     "price": 300,
    //     "unit": "個",
    //     "description": "Sit down please 名設計師設計",
    //     "content": "這是內容",
    //     "is_enabled": 1,
    //     "imageUrl" : "主圖網址",
    //     "imagesUrl": [
    //       "圖片網址一",
    //       "圖片網址二",
    //       "圖片網址三",
    //       "圖片網址四",
    //       "圖片網址五"
    //     ]
    //   }
    // }

    axios.post(`${this.data.apiUrl}/api/${this.data.apiPath}/admin/product/`,product)
    .then((res)=>{
      if(res.data.success){
        alert(res.data.message)
        this.clearAddProductForm();
        this.getProducts()
      }else{
        alert(res.data.message)
      }
    })


  },
  // deleteProducts () {
  //   if (this.data.products.length <= 0) {
  //     alert("產品列表無產品可清空, 請新增喔~~~~");
  //     return false;
  //   } else {

  //     alert("已經清空產品囉~~~~~");
  //     this.getProducts();
  //   }
  //   renderData(data);
  // },
  productHandler (e) {
    const nodeName = e.target.nodeName;
 
    // 啟用
    if (nodeName === "INPUT") {
      // 還沒有接 api
      const selectId = e.target.dataset.id;
      const index = this.data.products.findIndex((el) => el.id === selectId);
      this.data.products[index].is_enabled = !this.data.products[index].is_enabled;
      // 刪除
    } else if (nodeName === "BUTTON") {
      const selectId = e.target.dataset.id;
      axios.delete(`${this.data.apiUrl}/api/${this.data.apiPath}/admin/product/${selectId}`)
      .then((res)=>{
        if(res.data.success){
          alert(res.data.message)
          this.getProducts()
        }else{
          alert(res.data.message)
        }
      })
    } else {
      // 不是的返回
      return false;
    }
  
    // this.renderData(data);
  },
  init(){
    this.checkLogin()
    // this.getProducts()
    
    // 初始化綁定
    // const deleteProductsBtn = document.querySelector(".deleteProducts");
    const productForm = document.querySelector("#productForm");
    const productList = document.querySelector(".productList");
    
    productForm.addEventListener("submit", this.addProduct.bind(this));
    // deleteProductsBtn.addEventListener("click", this.deleteProducts.bind(this));
    productList.addEventListener("click", this.productHandler.bind(this));

  },
  mounted(){
    this.init()
  }
}

app.mounted();

