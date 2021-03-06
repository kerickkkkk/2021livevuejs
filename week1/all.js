console.clear();
// DOM

const productForm = document.querySelector("#productForm");

const productList = document.querySelector(".productList");
const deleteProductsBtn = document.querySelector(".deleteProducts");
const deleteProductBtn = document.querySelector(".deleteProduct");
const leftProduct = document.querySelector(".leftProduct");

// M
let data = [
  // {
  //   id: new Date().getTime(),
  //   title: "好用產品",
  //   price: 100,
  //   salePrice: 10,
  //   active: false
  // },
  // {
  //   id: new Date().getTime() + 1,
  //   title: "好用產品1",
  //   price: 100,
  //   salePrice: 10,
  //   active: false
  // }
];
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
                  next.active ? "checked" : ""
                } class="custom-control-input" data-id="${
        next.id
      }" id="customSwitch-${next.id}">
                <label class="activeProduct custom-control-label" for="customSwitch-${
                  next.id
                }">${next.active ? "啟用" : "未啟用"}</label>
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
  res.active = false;
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
    const selectId = parseInt(e.target.dataset.id);
    const index = data.findIndex((el) => el.id === selectId);
    data[index].active = !data[index].active;
    // 刪除
  } else if (nodeName === "BUTTON") {
    const selectId = parseInt(e.target.dataset.id);
    const index = data.findIndex((el) => el.id === selectId);
    data.splice(index, 1);
  } else {
    // 不是的返回
    return false;
  }

  renderData(data);
};
const init = function () {
  renderData(data);
};

// Listener 區
productForm.addEventListener("submit", addProuct);
deleteProductsBtn.addEventListener("click", deleteProducts);
// 因為動態新增看不到
// deleteProductBtn.addEventListener("click", deleteProduct);
// 改作 delegate
productList.addEventListener("click", productHandler);

// ///////
init();
