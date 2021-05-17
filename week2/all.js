console.clear();
const app = {
  data:{
    apiUrl: "https://vue3-course-api.hexschool.io",
    apiPath: "pet",
    products:[],
  },
  clearAddProductForm () {
    const inputMap = ["title", "price", "salePrice"];
    inputMap.forEach((el) => (productForm[el].value = ""));
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
    this.clearAddProductForm();
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
      console.log('document.cookie', document.cookie !== '','token',document.cookie.replace(/(?:(?:^|.*;\s*)shop\s*=\s*([^;]*).*$)|^.*$/, '$1'));
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
    // this.getProducts()
    
    // 初始化綁定
    // const deleteProductsBtn = document.querySelector(".deleteProducts");
    // const productForm = document.querySelector("#productForm");
    const productList = document.querySelector(".productList");
    
    // productForm.addEventListener("submit", addProuct);
    // deleteProductsBtn.addEventListener("click", this.deleteProducts.bind(this));
    productList.addEventListener("click", this.productHandler.bind(this));

    this.checkLogin()
  },
  mounted(){
    this.init()
  }
}

app.mounted();

