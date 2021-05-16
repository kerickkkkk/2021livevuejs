console.clear();
// DOM

const productForm = document.querySelector("#productForm");

const productList = document.querySelector(".productList");
const deleteProductsBtn = document.querySelector(".deleteProducts");
const deleteProductBtn = document.querySelector(".deleteProduct");
const leftProduct = document.querySelector(".leftProduct");

// config
const url = "https://vue3-course-api.hexschool.io/";
const path = "pet";

// M
let data = [];
// V
const clearAddProductForm = function () {
  const inputMap = ["title", "price", "salePrice"];
  inputMap.forEach((el) => (productForm[el].value = ""));
};

const renderData = function (data) {
  const dataLen = data.length;
  let str = "";
  // 產 table
  if (dataLen > 0) {
    str = data.reduce((prev, next) => {
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
  leftProduct.innerHTML = dataLen;
  clearAddProductForm();
};
// C


// 取得所有產品列表
const getProducts = function(){

  const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('shop='))
        .split('=')[1];
  axios.defaults.headers.common['Authorization'] = token;
  axios.get(`${url}api/${path}/admin/products`)
    .then((res)=>{
      console.log(res);
      if(res.data.success){
        data = res.data.products
        renderData(data)
      }else{
        alert(res.data.message)
      }
    })
}

// 判斷 是否已經有取得登入權限
const checkLogin = function(){
  // 取得寫入 cookie 
  if(document.cookie !== ''){
    const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('shop='))
        .split('=')[1];
    axios.defaults.headers.common['Authorization'] = token;
    axios.post(`${url}api/user/check`)
    .then((res)=>{
      if(!res.data.success){
        alert('沒有登入狀態 將導回登入頁面')
        location.replace('./login.html')
      }
      // 有權限 取得產品列表
      getProducts()
    })
  }else{
    alert('沒有登入狀態 將導回登入頁面')
    location.replace('./login.html')
    return false;
  }
}
const addProuct = function (e) {
  e.preventDefault();
  const inputMap = ["title", "price", "salePrice"];
  // 空值返回
  if (this.title.value.trim() === "" || this.price.value === "") {
    alert("產品名稱，產品原價為必填");
    return false;
  }
  const res = inputMap.reduce((p, n) => {
    p[n] = this[n].value;
    return p;
  }, {});
  res.id = new Date().getTime();
  res.is_enabled = false;
  data.push(res);
  renderData(data);
};
const deleteProducts = function () {
  if (data.length <= 0) {
    alert("產品列表無產品可清空, 請新增喔~~~~");
    return false;
  } else {
    data = [];
    alert("已經清空產品囉~~~~~");
  }
  renderData(data);
};

// 單一產品 處理啟用 予刪除
const productHandler = function (e) {
  // 阻擋不了 swith 同時選到 input label e.stopPropagation()
  // 分流 處理 input 和 button
  const nodeName = e.target.nodeName;
  // console.log(e.target.nodeName)
  // 啟用
  if (nodeName === "INPUT") {
    const selectId = e.target.dataset.id;
    const index = data.findIndex((el) => el.id === selectId);
    data[index].is_enabled = !data[index].is_enabled;
    // 刪除
  } else if (nodeName === "BUTTON") {
    // 注意: parseInt 因為是轉數字 而這裡回的ID是字串就變 NaN了
    // const selectId = parseInt(e.target.dataset.id);
    const selectId = e.target.dataset.id;
    
    // const index = data.findIndex((el) => el.id === selectId);
    // data.splice(index, 1);
    // call delete api
    // /api/:api_path/admin/product/:product_id
    const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('shop='))
        .split('=')[1];
    axios.defaults.headers.common['Authorization'] = token;
    axios.delete(`${url}api/${path}/admin/product/${selectId}`)
    .then((res)=>{
      if(res.data.success){
        alert(res.data.message)
        getProducts()
      }else{
        alert(res.data.message)
      }
    })
  } else {
    // 不是的返回
    return false;
  }

  renderData(data);
};
const init = function () {
  // 確認是否有權限
  checkLogin();
};

// Listener 區
productForm.addEventListener("submit", addProuct);
deleteProductsBtn.addEventListener("click", deleteProducts);
// 因為動態新增看不到
// deleteProductBtn.addEventListener("click", deleteProduct);
// 改作 delegate
productList.addEventListener("click", productHandler);

// ///////
// init();
getProducts()

