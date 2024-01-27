import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

let addproductModal;
let editModall;
let deleteinfo;

const app = createApp({
    data() {
        return {
            products: [],
            api: {
                key: 'tsurusroute'

            },
            tempProduct: {},
            pagedata: {},
            pages: {},
            temp: {},
            deleteProduct: {},
        


        }
    },
    mounted() {
   
        //登入成功拿剛剛存在cookie的token 用來驗證登入成功了沒
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    
        axios.defaults.headers.common.Authorization = token;

        addproductModal = new bootstrap.Modal(document.getElementById('addMmodelComponent'), {
            keyboard: false
        });
        editModall = new bootstrap.Modal(document.getElementById('editModall'), {
            keyboard: false
        });
        deleteinfo = new bootstrap.Modal(document.getElementById('deleteinfo'), {
            keyboard: false
        });

    
        this.checklogined();



    },
    methods: {

        checklogined() {
            const api = 'https://ec-course-api.hexschool.io/v2/api/user/check';
            axios.post(api).then((response) => {

                //check 成功後叫第一頁產品資料
                this.getpagination();

            }).catch((err) => {
                alert(err.data.message);
                window.location = 'login.html';

            });
        },
        getpagination(page = 1) {
            if (page == 'prev') {
                page = this.pages.current_page - 1;

            } else if (page == 'next') {
                page = this.pages.current_page + 1;
            }
            //打api 送 點到的page 拿取當夜資料
            const apiurl = `https://ec-course-api.hexschool.io/v2/api/tsurusroute/admin/products?page=${page}`;

            axios.get(apiurl).then((response) => {
                this.products = response.data.products;
                this.pages = response.data.pagination;



            }).catch((err) => {
                alert(err.data.message);
            });

        },
        openmodel(type,editData) {
            if (type == 'addMmodelComponent') {
                addproductModal.show();
            } if (type == 'editMmodelComponent') {
                editModall.show();
                this.temp = editData;
            }

        },

        addProduct(data) {
            const api = 'https://ec-course-api.hexschool.io/v2/api/tsurusroute/admin/product';
            axios.post(api, { data: data }).then((response) => {
                if (response.data.success == true) {
                    alert(response.data.message);
                    addproductModal.hide();
                    //重刷新product資料
                    this.getpagination();

                } else {
                    alert(response.data.message)

                }

            }).catch((err) => {
                alert(err.data.message);
            });



        },
        edit(item){

            const api = `https://ec-course-api.hexschool.io/v2/api/tsurusroute/admin/product/${item.id}`;
            axios.put(api, { data: item }).then((response) => {

                //check 成功後叫產品資料
                if (response.data.success == true) {
                    alert(response.data.message);
                    editModall.hide();
                    //重刷新product資料
                    this.getpagination();

                } else {
                    alert(response.data.message);
                }

            }).catch((err) => {
                alert(err.data.message);
            });

        },

        showdeleteAlert(item) {
            this.deleteProduct = item;
            deleteinfo.show();

        },
        deletePorduct(data) {
            const api = `https://ec-course-api.hexschool.io/v2/api/tsurusroute/admin/product/${data.id}`;
            axios.delete(api).then((response) => {

                if (response.data.success == true) {
                    alert(response.data.message);
                    deleteinfo.hide();

                    //重刷新product資料
                    this.getpagination();

                } else {
                    alert(response.data.message)

                }

            }).catch((err) => {
                alert(err.data.message);
            });
        },

    },

}
);
app.component('pagination', {
    data() {
        return {
            page: 0,
        }
    },
    props: ["parent"],
    methods: {
        emit(item) {
            this.$emit('emit-text', item);
        }
    },
    template: `<nav aria-label="...">
    <ul class="pagination">
        <li class="page-item " @click="emit('prev')" :class="{'disabled': parent.has_pre === false}">
            <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a>
        </li>
        <li class="page-item"  v-for="(item, index) in parent.total_pages" :key="index" @click="emit(item)"  :class="{'active': item === parent.current_page}"><a class="page-link" href="#">{{item}}</a></li>
    
        <li class="page-item"  @click="emit('next')" :class="{'disabled': parent.has_next === false}" >
            <a class="page-link" href="#">Next</a>
        </li>
    
        </ul>
    </nav>`

});
app.component('newproduct', {
    data() {
        return {
            test: '',
            addPorduct: {
                title: '',
                category: '',
                origin_price: '',
                price: '',
                unit: '',
                description: '',
                content: '',
                is_enabled: 0,
                imageUrl: '',
                imagesUrl: [],
                id: '',
            },
        }


    },
    methods: {
        emit() {
            this.$emit('pushnewproduct', this.addPorduct);
        },
        addmultiplePic() {

            this.addPorduct.imagesUrl.push('');
        },
        deletemultiplePic() {


            this.addPorduct.imagesUrl.pop();

        },

    },
    template: `
        <div id="addMmodelComponent" ref="productModal" class="modal fade" tabindex="-1" aria-labelledby="productModalLabel"aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content border-0">
            <div class="modal-header bg-dark text-white">
                <h5 id="productModalLabel" class="modal-title">
                <span>fdf</span>
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                <div class="col-sm-4">
                    <div class="mb-2">
                    <div class="mb-3">
                        <label for="imageUrl" class="form-label">輸入圖片網址</label>
                        <input type="text" class="form-control"
                                placeholder="請輸入圖片連結" v-model="addPorduct.imageUrl">
                    </div>
                    <img class="img-fluid" :src="addPorduct.imageUrl" alt="">
                    </div>
                    <div><h4>多圖新增</h4></div>
                    <div v-for="(picArray,key) in addPorduct.imagesUrl" :key="key">
                        <input type="text" class="form-control"
                        placeholder="請輸入圖片連結" :id="addPorduct.imagesUrl[key]" v-model="addPorduct.imagesUrl[key]">
                        <img class="img-fluid"  :src="addPorduct.imagesUrl[key]" alt="">
                    </div>
            
                    <div>
                        <button class="btn btn-outline-primary btn-sm d-block w-100" @click="addmultiplePic()">
                            新增圖片
                        </button>
                        <button class="btn btn-outline-danger btn-sm d-block w-100" @click="deletemultiplePic()">
                            刪除圖片
                        </button>
                    </div>
                </div>
                <div class="col-sm-8">
                    <div class="mb-3">
                    <label for="title" class="form-label">標題</label>
                    <input id="title" type="text" class="form-control" placeholder="請輸入標題" v-model="addPorduct.title">
                    </div>

                    <div class="row">
                    <div class="mb-3 col-md-6">
                        <label for="category" class="form-label">分類</label>
                        <input id="category" type="text" class="form-control"
                                placeholder="請輸入分類" v-model="addPorduct.category">
                    </div>
                    <div class="mb-3 col-md-6">
                        <label for="price" class="form-label">單位</label>
                        <input id="unit" type="text" class="form-control" placeholder="請輸入單位" v-model="addPorduct.unit">
                    </div>
                    </div>

                    <div class="row">
                    <div class="mb-3 col-md-6">
                        <label for="origin_price" class="form-label">原價</label>
                        <input id="origin_price" type="number" min="0" class="form-control" placeholder="請輸入原價" v-model="addPorduct.origin_price">
                    </div>
                    <div class="mb-3 col-md-6">
                        <label for="price" class="form-label">售價</label>
                        <input id="price" type="number" min="0" class="form-control"
                                placeholder="請輸入售價" v-model="addPorduct.price">
                    </div>
                    </div>
                    <hr>

                    <div class="mb-3">
                    <label for="description" class="form-label">產品描述</label>
                    <textarea id="description" type="text" class="form-control"
                                placeholder="請輸入產品描述" v-model="addPorduct.description">
                    </textarea>
                    </div>
                    <div class="mb-3">
                    <label for="content" class="form-label">說明內容</label>
                    <textarea id="description" type="text" class="form-control"
                                placeholder="請輸入說明內容" v-model="addPorduct.content">
                    </textarea>
                    </div>
                    <div class="mb-3">
                    <div class="form-check">
                        <input id="is_enabled" class="form-check-input" type="checkbox"
                                :true-value="1" :false-value="0" v-model="addPorduct.is_enabled">
                        <label class="form-check-label" for="is_enabled">是否啟用</label>
                    </div>
                    </div>
                </div>
                </div>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal" >
                取消
                </button>
                <button type="button" class="btn btn-primary" @click="emit()">
                確認
                </button>
            </div>

            </div>
        </div>
    </div>


    `
});
app.component('editmodelcomponent', {
    data() {
        return {
            test: '',
            addPorduct: {
                title: '',
                category: '',
                origin_price: '',
                price: '',
                unit: '',
                description: '',
                content: '',
                is_enabled: 0,
                imageUrl: '',
                imagesUrl: [],
                id: '',
            },
        }

    },
    methods: {
        addmultiplePic() {
            this.theproduct.imagesUrl.push('');
        },
        deletemultiplePic() {
            this.theproduct.imagesUrl.pop();
        },
        emit(item){
            this.$emit('pusheditproduct', item);
            
        }

    },
    props: ['theproduct'],
    template: `

            <div id="editModall" ref="productModal" class="modal fade" tabindex="-1" aria-labelledby="productModalLabel"aria-hidden="true">
            <div class="modal-dialog modal-xl">
                <div class="modal-content border-0">
                <div class="modal-header bg-dark text-white">
                    <h5 id="productModalLabel" class="modal-title">
                    <span>我是編輯商品</span>
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                    <div class="col-sm-4">
                        <div class="mb-2">
                        <div class="mb-3">
                            <label for="imageUrl" class="form-label">輸入圖片網址</label>
                            <input type="text" class="form-control"
                                    placeholder="請輸入圖片連結" v-model="theproduct.imageUrl">
                        </div>
                        <img class="img-fluid" :src="theproduct.imageUrl" alt="">
                        </div>
                        <div><h4>多圖新增</h4></div>
                        <div v-for="(picArray,key) in theproduct.imagesUrl" :key="key">
                            <input type="text" class="form-control"
                            placeholder="請輸入圖片連結" :id="theproduct.imagesUrl[key]" v-model="theproduct.imagesUrl[key]">
                            <img class="img-fluid"  :src="theproduct.imagesUrl[key]" alt="">
                        </div>
                
                        <div>
                            <button class="btn btn-outline-primary btn-sm d-block w-100" @click="addmultiplePic()">
                                新增圖片
                            </button>
                            <button class="btn btn-outline-danger btn-sm d-block w-100" @click="deletemultiplePic()">
                                刪除圖片
                            </button>
                        </div>
                    </div>
                    <div class="col-sm-8">
                        <div class="mb-3">
                        <label for="title" class="form-label">標題</label>
                        <input id="title" type="text" class="form-control" placeholder="請輸入標題" v-model="theproduct.title">
                        </div>

                        <div class="row">
                        <div class="mb-3 col-md-6">
                            <label for="category" class="form-label">分類</label>
                            <input id="category" type="text" class="form-control"
                                    placeholder="請輸入分類" v-model="theproduct.category">
                        </div>
                        <div class="mb-3 col-md-6">
                            <label for="price" class="form-label">單位</label>
                            <input id="unit" type="text" class="form-control" placeholder="請輸入單位" v-model="theproduct.unit">
                        </div>
                        </div>

                        <div class="row">
                        <div class="mb-3 col-md-6">
                            <label for="origin_price" class="form-label">原價</label>
                            <input id="origin_price" type="number" min="0" class="form-control" placeholder="請輸入原價" v-model="theproduct.origin_price">
                        </div>
                        <div class="mb-3 col-md-6">
                            <label for="price" class="form-label">售價</label>
                            <input id="price" type="number" min="0" class="form-control"
                                    placeholder="請輸入售價" v-model="theproduct.price">
                        </div>
                        </div>
                        <hr>

                        <div class="mb-3">
                        <label for="description" class="form-label">產品描述</label>
                        <textarea id="description" type="text" class="form-control"
                                    placeholder="請輸入產品描述" v-model="theproduct.description">
                        </textarea>
                        </div>
                        <div class="mb-3">
                        <label for="content" class="form-label">說明內容</label>
                        <textarea id="description" type="text" class="form-control"
                                    placeholder="請輸入說明內容" v-model="theproduct.content">
                        </textarea>
                        </div>
                        <div class="mb-3">
                        <div class="form-check">
                            <input id="is_enabled" class="form-check-input" type="checkbox"
                                    :true-value="1" :false-value="0" v-model="theproduct.is_enabled">
                            <label class="form-check-label" for="is_enabled">是否啟用</label>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal" >
                    取消
                    </button>
                    <button type="button" class="btn btn-primary" @click="emit(theproduct)">
                    確認
                    </button>
                </div>

                </div>
            </div>
        </div>


    `


});
app.component('deletecomponent',{
    data(){
        return{
            test:'',
        }

    },
    methods:{
        emit(item){
            this.$emit('pushdeleteproduct', item);

        }
    },
    
    props:['deleteproduct'],
    template:`
            <div id="deleteinfo" ref="delProductModal" class="modal fade" tabindex="-1"
            aria-labelledby="delProductModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content border-0">
                <div class="modal-header bg-danger text-white">
                    <h5 id="delProductModalLabel" class="modal-title">
                    <span>刪除產品</span>
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    是否刪除
                    <strong class="text-danger">{{deleteproduct.title}}</strong> 商品(刪除後將無法恢復)。
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                    取消
                    </button>
                    <button type="button" class="btn btn-danger" @click="emit(deleteproduct)">
                    確認刪除
                    </button>
                </div>
                </div>
            </div>
        </div>
    `
})



app.mount('#app');